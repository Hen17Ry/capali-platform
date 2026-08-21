import { db } from '~~/server/db'
import { newsletterSubscribers } from '~~/server/db/schema'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { firstName, lastName, email, source } = body

  if (!email) {
    throw createError({ statusCode: 400, message: 'Email est requis' })
  }

  try {
    const [inserted] = await db.insert(newsletterSubscribers).values({
      firstName,
      lastName,
      email,
      source: source || 'orientation_test',
    })
      .onConflictDoNothing()
      .returning() // Prevent crashing if email already exists

    // Send opt-in / confirmation email if actually inserted
    if (inserted) {
      const { emailService } = await import('~~/server/utils/email')
      // Normally we would have an opt-in link, but here we can just send a welcome
      const config = useRuntimeConfig()
      const confirmLink = `${config.public.appUrl || 'https://capali.org'}` // Fallback link
      emailService.sendNewsletterOptIn(email, confirmLink)
        // eslint-disable-next-line no-console
        .catch(err => console.error("Erreur email newsletter:", err))
    }

    return { success: true, message: 'Inscrit avec succès' }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Erreur inscription newsletter:', error)
    throw createError({ statusCode: 500, message: 'Erreur lors de l\'inscription' })
  }
})
