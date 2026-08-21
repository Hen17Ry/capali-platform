import { db } from '~~/server/db'
import { eventAttendees, events } from '~~/server/db/schema'
import { eq } from 'drizzle-orm'
import Stripe from 'stripe'
import { emailService } from '~~/server/utils/email'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16' as any,
})

export default defineEventHandler(async (event) => {
  const eventId = getRouterParam(event, 'id')
  if (!eventId) throw createError({ statusCode: 400, message: 'ID événement manquant' })

  const body = await readBody(event)
  const { attendeeId, provider, transactionId, sessionId } = body

  if (!attendeeId || !provider) {
    throw createError({ statusCode: 400, message: 'Paramètres manquants' })
  }

  // 1. Récupérer l'inscription
  const [attendee] = await db.select().from(eventAttendees).where(eq(eventAttendees.id, attendeeId))
  if (!attendee) throw createError({ statusCode: 404, message: 'Inscription introuvable' })

  if (attendee.paymentStatus === 'paid' || attendee.paymentStatus === 'free') {
    return { success: true, message: 'Déjà payé/inscrit' }
  }

  const [evt] = await db.select().from(events).where(eq(events.id, eventId))
  if (!evt) throw createError({ statusCode: 404, message: 'Événement introuvable' })

  let isPaid = false
  let trxId = null

  try {
    if (provider === 'stripe') {
      if (!sessionId) throw createError({ statusCode: 400, message: 'Session ID Stripe manquant' })
      const session = await stripe.checkout.sessions.retrieve(sessionId)
      if (session.payment_status === 'paid') {
        isPaid = true
        trxId = session.payment_intent as string || sessionId
      }
    } else if (provider === 'kkiapay') {
      if (!transactionId) throw createError({ statusCode: 400, message: 'Transaction ID Kkiapay manquant' })
      
      const config = useRuntimeConfig()
      const publicKey = config.public.kkiapayPublicKey
      const secretKey = config.kkiapaySecretKey
      const privateKey = config.kkiapayPrivateKey
      
      if (!publicKey || !secretKey || !privateKey) {
        if (process.env.NODE_ENV === 'development') {
           isPaid = true
           trxId = transactionId
        } else {
           throw createError({ statusCode: 500, message: 'Configuration Kkiapay incomplète' })
        }
      } else {
        const isSandbox = secretKey.startsWith('tsk_')
        const kkiapayApiUrl = isSandbox 
          ? 'https://api-sandbox.kkiapay.me/api/v1/transactions/status'
          : 'https://api.kkiapay.me/api/v1/transactions/status'

        const response = await $fetch<any>(kkiapayApiUrl, {
          method: 'POST',
          headers: {
            'x-api-key': publicKey,
            'x-secret-key': secretKey,
            'x-private-key': privateKey,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: { transactionId }
        })

        // Kkiapay renvoie un status 'SUCCESS' si payé
        if (response?.status === 'SUCCESS') {
          isPaid = true
          trxId = transactionId
        }
      }
    }

    if (isPaid) {
      await db.update(eventAttendees)
        .set({ paymentStatus: 'paid', transactionId: trxId })
        .where(eq(eventAttendees.id, attendeeId))
        
      // Envoi de l'email de confirmation d'inscription avec quittance de paiement si applicable
      emailService.sendEventRegistrationConfirmation(
        attendee.email, 
        evt.title, 
        new Date(evt.eventDate).toLocaleString('fr-FR'), 
        evt.type === 'online' ? (evt.registrationUrl || 'Lien à venir') : (evt.city || 'Lieu à venir'),
        evt.isPaid || false,
        evt.priceEur || 0,
        trxId || ''
      ).catch(err => console.error("Erreur email confirmation:", err))

      // Alerte Admin
      if (evt.isPaid) {
        emailService.sendAdminAlert('Nouvelle inscription payante', `Une nouvelle inscription payée (${evt.priceEur} €) a été effectuée par ${attendee.name} pour l'événement "${evt.title}".`)
          .catch(err => console.error('Erreur email alerte inscription:', err))
      } else {
        emailService.sendAdminAlert('Nouvelle inscription', `Une nouvelle inscription gratuite a été effectuée par ${attendee.name} pour l'événement "${evt.title}".`)
          .catch(err => console.error('Erreur email alerte inscription:', err))
      }

      return { success: true, message: 'Paiement validé avec succès' }
    }

    return { success: false, message: 'Paiement non validé' }
  } catch (error: any) {
    console.error('Erreur vérification paiement event:', error)
    throw createError({ statusCode: 500, message: 'Erreur serveur lors de la vérification' })
  }
})
