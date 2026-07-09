import { db } from '~~/server/db'
import { newsletterSubscribers } from '~~/server/db/schema'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { firstName, lastName, email, source } = body

  if (!email) {
    throw createError({ statusCode: 400, message: 'Email est requis' })
  }

  try {
    await db.insert(newsletterSubscribers).values({
      firstName,
      lastName,
      email,
      source: source || 'orientation_test',
    }).onConflictDoNothing() // Prevent crashing if email already exists

    return { success: true, message: 'Inscrit avec succès' }
  } catch (error) {
    console.error('Erreur inscription newsletter:', error)
    throw createError({ statusCode: 500, message: 'Erreur lors de l\'inscription' })
  }
})
