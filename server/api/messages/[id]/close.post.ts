import { db } from '~~/server/db'
import { mentorshipRequests } from '~~/server/db/schema'
import { eq } from 'drizzle-orm'
import { getSessionFromEvent } from '~~/server/utils/session'

export default defineEventHandler(async (event) => {
  const session = await getSessionFromEvent(event)
  if (!session) throw createError({ statusCode: 401, message: 'Non authentifié' })

  const mentorshipId = getRouterParam(event, 'id')
  if (!mentorshipId) throw createError({ statusCode: 400, message: 'ID manquant' })

  const [mentorship] = await db.select().from(mentorshipRequests).where(eq(mentorshipRequests.id, mentorshipId)).limit(1)
  
  if (!mentorship) throw createError({ statusCode: 404, message: 'Conversation introuvable' })
  if (mentorship.mentorId !== session.userId && !session.isAdmin) {
    throw createError({ statusCode: 403, message: 'Seul le mentor peut clore cette relation.' })
  }

  await db.update(mentorshipRequests)
    .set({ status: 'closed', updatedAt: new Date() })
    .where(eq(mentorshipRequests.id, mentorshipId))

  return { success: true, message: 'Relation terminée et conversation fermée.' }
})
