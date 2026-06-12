import { db } from '~~/server/db'
import { mentorshipRequests, users } from '~~/server/db/schema'
import { inArray, eq } from 'drizzle-orm'
import { getSessionFromEvent } from '~~/server/utils/session'

export default defineEventHandler(async (event) => {
  const session = await getSessionFromEvent(event)
  if (!session || !session.isAdmin) throw createError({ statusCode: 403, message: 'Accès refusé' })

  // Admin gets all active and closed conversations
  const mentorships = await db.select({
    id: mentorshipRequests.id,
    menteeId: mentorshipRequests.menteeId,
    mentorId: mentorshipRequests.mentorId,
    status: mentorshipRequests.status,
    updatedAt: mentorshipRequests.updatedAt,
    menteeName: users.name,
    menteeEmail: users.email,
  }).from(mentorshipRequests)
    .innerJoin(users, eq(mentorshipRequests.menteeId, users.id))
    .where(inArray(mentorshipRequests.status, ['accepted', 'closed']))

  // Fetch mentor names
  const mentorIds = [...new Set(mentorships.map(m => m.mentorId))]
  let mentorsMap: Record<string, string> = {}
  if (mentorIds.length > 0) {
    const mentorUsers = await db.select({ id: users.id, name: users.name }).from(users).where(inArray(users.id, mentorIds))
    mentorUsers.forEach(u => mentorsMap[u.id] = u.name)
  }

  const result = mentorships.map(m => ({
    id: m.id,
    mentorId: m.mentorId,
    mentorName: mentorsMap[m.mentorId] || 'Inconnu',
    menteeId: m.menteeId,
    menteeName: m.menteeName,
    status: m.status,
    updatedAt: m.updatedAt
  }))

  result.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())

  return { data: result }
})
