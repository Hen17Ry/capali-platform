import Stripe from 'stripe'
import { db } from '~~/server/db'
import { donations } from '~~/server/db/schema'
import { eq } from 'drizzle-orm'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16' as any,
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { sessionId } = body

  if (!sessionId) {
    throw createError({ statusCode: 400, message: 'Session ID manquant' })
  }

  try {
    // Récupérer la session depuis Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (session.payment_status === 'paid') {
      const donationId = session.client_reference_id

      if (donationId) {
        // Mettre à jour la base de données
        await db.update(donations)
          .set({ 
            status: 'completed',
            updatedAt: new Date()
          })
          .where(eq(donations.id, donationId))

        return { success: true, message: 'Don validé avec succès' }
      }
    }

    return { success: false, message: 'Paiement non validé ou en attente' }
  } catch (error: any) {
    console.error('Erreur lors de la vérification de la session Stripe:', error)
    throw createError({
      statusCode: 500,
      message: 'Erreur lors de la vérification du paiement'
    })
  }
})
