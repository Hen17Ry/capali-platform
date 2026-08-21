import { db } from '~~/server/db'
import { mentorshipRequests, mentorProfiles } from '~~/server/db/schema'
import { eq, and, sql } from 'drizzle-orm'
import { getSessionFromEvent } from '~~/server/utils/session'

export default defineEventHandler(async (event) => {
  const session = await getSessionFromEvent(event)
  if (!session || session.status !== 'mentor') {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, message: 'ID missing' })

  const body = await readBody(event)
  const { status, mentorNote } = body

  if (!['accepted', 'refused'].includes(status)) {
    throw createError({ statusCode: 400, message: 'Invalid status' })
  }

  // Ensure the request belongs to the current mentor
  const [existingRequest] = await db
    .select()
    .from(mentorshipRequests)
    .where(
      and(
        eq(mentorshipRequests.id, id),
        eq(mentorshipRequests.mentorId, session.userId)
      )
    )

  if (!existingRequest) {
    throw createError({ statusCode: 404, message: 'Request not found' })
  }

  if (existingRequest.status !== 'pending') {
    throw createError({ statusCode: 400, message: 'Request is no longer pending' })
  }

  // If accepting, check max mentees
  if (status === 'accepted') {
    const [mentorProfile] = await db.select({ maxMentees: mentorProfiles.maxMentees })
      .from(mentorProfiles).where(eq(mentorProfiles.userId, session.userId))
      
    if (mentorProfile) {
      const result = await db.select({ count: sql<number>`count(*)::int` })
        .from(mentorshipRequests)
        .where(and(eq(mentorshipRequests.mentorId, session.userId), eq(mentorshipRequests.status, 'accepted')))
      
      const count = result[0]?.count || 0
      if (count >= mentorProfile.maxMentees) {
        throw createError({ statusCode: 400, message: 'Vous avez atteint votre limite maximum de mentorés.' })
      }
    }
  }

  // Update status
  await db
    .update(mentorshipRequests)
    .set({
      status,
      mentorNote: mentorNote || null,
      updatedAt: new Date(),
    })
    .where(eq(mentorshipRequests.id, id))

  // ── Send notification email to the mentee (student) ──
  try {
    const { users } = await import('~~/server/db/schema')
    const [mentee] = await db
      .select({ email: users.email })
      .from(users)
      .where(eq(users.id, existingRequest.menteeId))
      .limit(1)

    if (mentee) {
      const { emailService } = await import('~~/server/utils/email')
      emailService.sendMentorshipResponse(mentee.email, session.name, status === 'accepted')
        .catch(err => console.error("Erreur email réponse mentorat:", err))
    }
  } catch (err) {
    console.error("Erreur lors de la préparation de l'email de réponse mentor:", err)
  }

  return { success: true }
})
