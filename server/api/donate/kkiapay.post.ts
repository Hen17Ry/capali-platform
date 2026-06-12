import { db } from '~~/server/db'
import { donations } from '~~/server/db/schema'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  const { firstName, lastName, email, amount, amountXOF } = body

  if (!firstName || !lastName || !email || !amount || amount <= 0 || !amountXOF) {
    throw createError({
      statusCode: 400,
      message: 'Paramètres invalides.'
    })
  }

  try {
    // Enregistrer le don en statut "pending" dans la base de données
    const [newDonation] = await db.insert(donations).values({
      firstName,
      lastName,
      email,
      amount,
      method: 'kkiapay',
      status: 'pending'
    }).returning()

    if (!newDonation) {
      throw createError({ statusCode: 500, message: "Erreur lors de l'enregistrement en base" })
    }

    // Retourner l'ID pour le widget Kkiapay (passé dans "data" ou "custom_data")
    return { id: newDonation.id }
  } catch (error: any) {
    console.error('Erreur DB Kkiapay:', error)
    throw createError({
      statusCode: 500,
      message: 'Erreur lors de la préparation du paiement Kkiapay'
    })
  }
})
