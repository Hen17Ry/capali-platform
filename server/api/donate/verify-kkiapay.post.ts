import { db } from '~~/server/db'
import { donations } from '~~/server/db/schema'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { transactionId, donationId } = body

  if (!transactionId || !donationId) {
    throw createError({ statusCode: 400, message: 'Paramètres manquants' })
  }

  const config = useRuntimeConfig()
  const publicKey = config.public.kkiapayPublicKey
  const secretKey = config.kkiapaySecretKey
  const privateKey = config.kkiapayPrivateKey

  if (!publicKey || !secretKey || !privateKey) {
    console.error('Clés Kkiapay manquantes dans les variables d\'environnement.')
    // En mode développement sans clé, on simule un succès pour faciliter les tests
    if (process.env.NODE_ENV === 'development') {
      console.warn('Simulation de succès Kkiapay (Clés manquantes en dev)')
      await db.update(donations)
        .set({ status: 'completed', transactionId, updatedAt: new Date() })
        .where(eq(donations.id, donationId))
      return { success: true, simulated: true }
    }
    throw createError({ statusCode: 500, message: 'Configuration Kkiapay incomplète' })
  }

  try {
    // Vérification auprès de l'API Kkiapay
    const response = await $fetch<any>('https://api.kkiapay.me/api/v1/transactions/status', {
      method: 'POST',
      headers: {
        'x-api-key': publicKey,
        'x-secret-key': secretKey,
        'x-private-key': privateKey,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: {
        transactionId
      }
    })

    if (response && response.status === 'SUCCESS') {
      // Mettre à jour la base de données
      await db.update(donations)
        .set({ 
          status: 'completed',
          transactionId,
          updatedAt: new Date()
        })
        .where(eq(donations.id, donationId))

      return { success: true, message: 'Don validé avec succès' }
    }

    return { success: false, message: 'Paiement non validé ou en attente' }
  } catch (error: any) {
    console.error('Erreur lors de la vérification de la transaction Kkiapay:', error)
    
    // Si la vérification échoue, on peut passer le statut en failed (ou laisser en pending)
    await db.update(donations)
      .set({ status: 'failed', transactionId, updatedAt: new Date() })
      .where(eq(donations.id, donationId))

    throw createError({
      statusCode: 500,
      message: 'Erreur lors de la vérification du paiement Kkiapay'
    })
  }
})
