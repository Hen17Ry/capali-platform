import { db } from '~~/server/db'
import { events, eventAttendees } from '~~/server/db/schema'
import { eq, sql, and } from 'drizzle-orm'
import { getSessionFromEvent } from '~~/server/utils/session'
import Stripe from 'stripe'
import { emailService } from '~~/server/utils/email'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2023-10-16' as any,
})

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, message: 'ID événement manquant' })

  const body = await readBody(event)
  const { name, email, paymentProvider, phone, profession } = body
  if (!name || !email) throw createError({ statusCode: 400, message: 'Nom et email requis' })

  const session = await getSessionFromEvent(event)
  const userId = session?.userId || null

  const config = useRuntimeConfig()
  const baseUrl = config.public.siteUrl || 'http://localhost:3000'

  // Utilisation d'une transaction pour garantir l'atomicité
  return await db.transaction(async (tx) => {
    const [evt] = await tx.select().from(events).where(eq(events.id, id))
    if (!evt) throw createError({ statusCode: 404, message: 'Événement introuvable' })

    // 1. Vérification des places limitées
    if (evt.isLimited && evt.maxAttendees) {
      const countResult = await tx
        .select({ count: sql<number>`count(*)::int` })
        .from(eventAttendees)
        .where(
          and(
            eq(eventAttendees.eventId, id),
            sql`${eventAttendees.paymentStatus} IN ('paid', 'free')` // Ne compter que les paiements validés/gratuits
          )
        )
      
      const attendeesCount = countResult[0]?.count || 0
      if (attendeesCount >= evt.maxAttendees) {
        throw createError({ statusCode: 400, message: 'Cet événement est complet.' })
      }
    }
    
    // 2. Vérification de doublon (idempotence)
    const [alreadyRegistered] = await tx.select().from(eventAttendees)
      .where(sql`${eventAttendees.eventId} = ${id} AND (${eventAttendees.email} = ${email} OR ${userId ? sql`${eventAttendees.userId} = ${userId}` : sql`FALSE`})`)
    
    if (alreadyRegistered && ['paid', 'free'].includes(alreadyRegistered.paymentStatus)) {
      throw createError({ statusCode: 400, message: 'Vous êtes déjà inscrit à cet événement.' })
    }

    const isFree = !evt.isPaid || !evt.priceEur || evt.priceEur <= 0

    if (isFree) {
      // 3a. Inscription Gratuite
      let attendeeId = alreadyRegistered?.id
      if (alreadyRegistered) {
         await tx.update(eventAttendees).set({ paymentStatus: 'free' }).where(eq(eventAttendees.id, attendeeId!))
      } else {
         const [inserted] = await tx.insert(eventAttendees).values({
           eventId: id,
           userId,
           name,
           email,
           phone,
           profession,
           paymentStatus: 'free'
         }).returning()
         attendeeId = inserted!.id
      }
      
      // Envoi de la confirmation d'inscription en asynchrone
      emailService.sendEventRegistrationConfirmation(
        email, 
        evt.title, 
        new Date(evt.eventDate).toLocaleString('fr-FR'), 
        evt.type === 'online' ? (evt.registrationUrl || 'Lien à venir') : (evt.city || 'Lieu à venir'),
        false
      ).catch(err => console.error("Erreur email confirmation événement:", err))

      return { success: true, status: 'free', attendeeId }
    } else {
      // 3b. Inscription Payante
      if (!paymentProvider || !['stripe', 'kkiapay'].includes(paymentProvider)) {
        throw createError({ statusCode: 400, message: 'Mode de paiement requis (stripe ou kkiapay)' })
      }

      let attendeeId = alreadyRegistered?.id
      if (alreadyRegistered) {
        await tx.update(eventAttendees).set({ 
          paymentStatus: 'pending', 
          paymentProvider,
          userId,
          name,
          phone,
          profession
        }).where(eq(eventAttendees.id, attendeeId!))
      } else {
        const [inserted] = await tx.insert(eventAttendees).values({
          eventId: id,
          userId,
          name,
          email,
          phone,
          profession,
          paymentStatus: 'pending',
          paymentProvider
        }).returning()
        attendeeId = inserted!.id
      }

      if (paymentProvider === 'stripe') {
        const checkoutSession = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          customer_email: email,
          client_reference_id: attendeeId, // Utilisé pour valider dans le Webhook
          metadata: {
            eventId: id,
            type: 'event_registration'
          },
          line_items: [
            {
              price_data: {
                currency: 'eur',
                product_data: {
                  name: `Billet : ${evt.title}`,
                  description: `Inscription à l'événement du ${new Date(evt.eventDate).toLocaleDateString('fr-FR')}`,
                },
                unit_amount: Math.round((evt.priceEur || 0) * 100), // En centimes
              },
              quantity: 1,
            },
          ],
          mode: 'payment',
          success_url: `${baseUrl}/events/${id}?payment=success&session_id={CHECKOUT_SESSION_ID}&attendeeId=${attendeeId}`,
          cancel_url: `${baseUrl}/events/${id}?payment=canceled`,
        })

        return { success: true, status: 'pending', provider: 'stripe', checkoutUrl: checkoutSession.url }
      } else if (paymentProvider === 'kkiapay') {
        return { 
          success: true, 
          status: 'pending', 
          provider: 'kkiapay', 
          attendeeId, 
          amountEur: evt.priceEur || 0 // Déjà en euros
        }
      }
    }
  })
})
