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
    // Determine which API endpoint to use based on the secret key prefix
    const isSandbox = secretKey.startsWith('tsk_')
    const kkiapayApiUrl = isSandbox 
      ? 'https://api-sandbox.kkiapay.me/api/v1/transactions/status'
      : 'https://api.kkiapay.me/api/v1/transactions/status'

    // 1. Récupérer le don en attente depuis la base de données
    const [donationRecord] = await db.select().from(donations).where(eq(donations.id, donationId))
    
    if (!donationRecord) {
      throw createError({ statusCode: 404, message: 'Don introuvable' })
    }

    // Calculer le montant exact attendu en XOF
    const expectedAmountXOF = Math.round(donationRecord.amount * 655.957)

    // Vérification auprès de l'API Kkiapay
    const response = await $fetch<any>(kkiapayApiUrl, {
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

    // 2. Vérifier que le statut est SUCCESS ET que le montant payé correspond au montant attendu
    // (Cela empêche un attaquant de valider un don de 1000€ en payant 1€)
    const isAmountValid = response?.amount === expectedAmountXOF

    if (response && response.status === 'SUCCESS' && isAmountValid) {
      // Mettre à jour la base de données
      const [updatedDonation] = await db.update(donations)
        .set({ 
          status: 'completed',
          transactionId,
          updatedAt: new Date()
        })
        .where(eq(donations.id, donationId))
        .returning()

      if (updatedDonation) {
        const { emailService } = await import('~~/server/utils/email')
        emailService.sendDonationConfirmation(
          updatedDonation.email,
          `${updatedDonation.amount} €`, 
          new Date().toLocaleDateString('fr-FR')
        ).catch(err => console.error('Erreur email don:', err))
        
        emailService.sendAdminAlert('Nouveau Don reçu (Kkiapay)', `Un don de ${updatedDonation.amount} € a été effectué par ${updatedDonation.firstName} ${updatedDonation.lastName}.`)
          .catch(err => console.error('Erreur email alerte don:', err))
      }

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
