import Stripe from 'stripe'
import { db } from '~~/server/db'
import { donations } from '~~/server/db/schema'
import { eq } from 'drizzle-orm'

// Initialize Stripe with secret key from environment variables
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2023-10-16' as any, // Use the latest API version or your account's default
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  const { firstName, lastName, email, amount } = body

  if (!firstName || !lastName || !email || !amount || amount <= 0) {
    throw createError({
      statusCode: 400,
      message: 'Paramètres invalides. Veuillez fournir un nom, prénom, email et un montant valide.'
    })
  }

  // Obtenir l'URL de base du site pour la redirection après paiement
  const config = useRuntimeConfig()
  const baseUrl = config.public.siteUrl || 'http://localhost:3000'

  try {
    // 1. Enregistrer le don en statut "pending" dans la base de données
    const [newDonation] = await db.insert(donations).values({
      firstName,
      lastName,
      email,
      amount,
      method: 'stripe',
      status: 'pending'
    }).returning()

    if (!newDonation) {
      throw createError({ statusCode: 500, message: 'Failed to create donation record' })
    }

    // 2. Créer une session de paiement Stripe Checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: email,
      client_reference_id: newDonation.id, // On passe l'ID de la DB pour le Webhook
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: 'Donation CAP ALI',
              description: 'Soutien à la communauté CAP ALI',
              images: [`${baseUrl}/logo.png`],
            },
            unit_amount: amount * 100, // Le montant en centimes
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${baseUrl}/donate/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/?donate_cancelled=true`,
      metadata: {
        donationId: newDonation.id,
        firstName,
        lastName,
        type: 'donation'
      }
    })

    // 3. Mettre à jour l'enregistrement avec le transactionId (l'ID de la session Stripe)
    await db.update(donations)
      .set({ transactionId: session.id })
      .where(eq(donations.id, newDonation.id))

    return { url: session.url }
  } catch (error: any) {
    console.error('Stripe error:', error)
    throw createError({
      statusCode: 500,
      message: 'Erreur lors de la création de la session Stripe'
    })
  }
})
