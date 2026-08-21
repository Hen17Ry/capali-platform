import { db } from '~~/server/db'
import { events, users } from '~~/server/db/schema'
import { emailService } from '~~/server/utils/email'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body.title || !body.type || !body.eventDate) {
    throw createError({ statusCode: 400, statusMessage: 'Titre, type et date sont obligatoires.' })
  }

  const createdEvent = await db.transaction(async (tx) => {
    const [created] = await tx
      .insert(events)
      .values({
        title: body.title,
        description: body.description || null,
        coverImage: body.coverImage || null,
        type: body.type,
        city: body.city || null,
        eventDate: new Date(body.eventDate),
        registrationDeadline: body.registrationDeadline ? new Date(body.registrationDeadline) : null,
        registrationUrl: body.registrationUrl || null,
        isPaid: !!body.isPaid,
        priceEur: body.isPaid ? Number(body.priceEur) : 0,
        isLimited: !!body.isLimited,
        maxAttendees: body.isLimited ? Number(body.maxAttendees) : null,
        createdBy: event.context.adminUser?.id || null,
      })
      .returning()

    if (created) {
      // Récupérer tous les emails des utilisateurs (sauf les admins) pour les notifier
      const allUsers = await tx.select({ email: users.email }).from(users).where(eq(users.isAdmin, false))
      const emails = allUsers.map(u => u.email).filter(Boolean) as string[]

      if (emails.length > 0) {
        const config = useRuntimeConfig()
        const eventLink = `${config.public.appUrl || 'https://capali.org'}/events/${created.id}`

        // Envoi de l'email en tâche de fond
        // Note: L'idéal est de ne pas bloquer la transaction sur l'envoi d'email lent
        emailService.sendNewEventAlert(emails, created.title, eventLink)
          .catch(err => console.error("Erreur lors de l'envoi de l'alerte événement:", err))
      }
    }

    return created
  })

  return { data: createdEvent }
})
