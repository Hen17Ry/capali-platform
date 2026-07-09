import Stripe from 'stripe'
import { db } from '~~/server/db'
import { donations } from '~~/server/db/schema'
import { eq } from 'drizzle-orm'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2023-10-16' as any,
})

// Webhook endpoint to receive events from Stripe
export default defineEventHandler(async (event) => {
  const body = await readRawBody(event)
  const signature = getHeader(event, 'stripe-signature')

  if (!body || !signature) {
    throw createError({ statusCode: 400, message: 'Missing body or signature' })
  }

  let stripeEvent: Stripe.Event

  try {
    stripeEvent = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || 'whsec_placeholder'
    )
  } catch (err: any) {
    console.error('Webhook signature verification failed.', err.message)
    throw createError({ statusCode: 400, message: `Webhook Error: ${err.message}` })
  }

  // Handle the event
  switch (stripeEvent.type) {
    case 'checkout.session.completed': {
      const session = stripeEvent.data.object as Stripe.Checkout.Session
      
      const donationId = session.client_reference_id
      
      if (donationId) {
        // Update the donation status to completed
        await db.update(donations)
          .set({ 
            status: 'completed',
            updatedAt: new Date()
          })
          .where(eq(donations.id, donationId))
          
        console.log(`Donation ${donationId} marked as completed.`)
      }
      break
    }
    // Handle other events as needed
    default:
      console.log(`Unhandled event type ${stripeEvent.type}`)
  }

  // Return a 200 response to acknowledge receipt of the event
  return { received: true }
})
