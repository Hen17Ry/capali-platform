import { db } from '~~/server/db'
import { mentorshipRequests } from '~~/server/db/schema'
import { eq, and, inArray } from 'drizzle-orm'
import { getSessionFromEvent } from '~~/server/utils/session'

export default defineEventHandler(async (event) => {
  const session = await getSessionFromEvent(event)
  if (!session) throw createError({ statusCode: 401, message: 'Unauthorized' })

  const body = await readBody(event)
  const { mentorId, message } = body

  if (!mentorId) {
    throw createError({ statusCode: 400, message: 'Mentor ID is required' })
  }

  await db.transaction(async (tx) => {
    // Check if they already have an active request with this mentor
    const existingRequest = await tx
      .select()
      .from(mentorshipRequests)
      .where(
        and(
          eq(mentorshipRequests.menteeId, session.userId),
          eq(mentorshipRequests.mentorId, mentorId),
          inArray(mentorshipRequests.status, ['pending', 'accepted'])
        )
      )

    if (existingRequest.length > 0) {
      throw createError({ statusCode: 400, message: 'Vous avez déjà une demande en cours ou acceptée avec ce mentor.' })
    }

    // Check if they already have 2 active mentors (pending or accepted)
    const activeRequests = await tx
      .select()
      .from(mentorshipRequests)
      .where(
        and(
          eq(mentorshipRequests.menteeId, session.userId),
          inArray(mentorshipRequests.status, ['pending', 'accepted'])
        )
      )

    if (activeRequests.length >= 2) {
      throw createError({ statusCode: 400, message: 'Vous ne pouvez pas avoir plus de 2 mentors simultanément.' })
    }

    // Expires in 7 days
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7)

    // Insert request
    await tx.insert(mentorshipRequests).values({
      menteeId: session.userId,
      mentorId,
      message: message || 'Bonjour, je souhaiterais bénéficier de votre accompagnement !',
      expiresAt,
    })
  })

  // ── Send notification email to the mentor ──
  try {
    const { users } = await import('~~/server/db/schema')
    const [mentor] = await db
      .select({ email: users.email })
      .from(users)
      .where(eq(users.id, mentorId))
      .limit(1)

    if (mentor) {
      const { emailService } = await import('~~/server/utils/email')
      emailService.sendNewMentorshipRequest(mentor.email, session.name)
        .catch(err => console.error("Erreur email nouvelle demande mentorat:", err))
    }
  } catch (err) {
    console.error("Erreur lors de la préparation de l'email de demande:", err)
  }

  return { success: true }
})
