import { db } from '~~/server/db'
import { mentorshipRequests } from '~~/server/db/schema'
import { eq } from 'drizzle-orm'
import { getSessionFromEvent } from '~~/server/utils/session'
import { connectMongo } from '~~/server/utils/mongo'
import { Message } from '~~/server/models/Message'

export default defineEventHandler(async (event) => {
  const session = await getSessionFromEvent(event)
  if (!session) throw createError({ statusCode: 401, message: 'Non authentifié' })

  const mentorshipId = getRouterParam(event, 'id')
  if (!mentorshipId) throw createError({ statusCode: 400, message: 'ID manquant' })

  const [mentorship] = await db.select().from(mentorshipRequests).where(eq(mentorshipRequests.id, mentorshipId)).limit(1)
  
  if (!mentorship) throw createError({ statusCode: 404, message: 'Conversation introuvable' })
  if (mentorship.menteeId !== session.userId && mentorship.mentorId !== session.userId && !session.isAdmin) {
    throw createError({ statusCode: 403, message: 'Accès refusé' })
  }

  // Only accepted relationships or admin can read messages
  if (mentorship.status !== 'accepted' && !session.isAdmin) {
    throw createError({ statusCode: 403, message: 'Cette conversation est terminée.' })
  }

  await connectMongo()

  const messages = await (Message as any).find({ mentorshipId }).sort({ createdAt: 1 }).lean()

  // Mark messages as read if the current user is not the sender
  const unreadMessages = messages.filter((m: any) => !m.isRead && m.senderId !== session.userId)
  if (unreadMessages.length > 0) {
    await (Message as any).updateMany(
      { _id: { $in: unreadMessages.map((m: any) => m._id) } },
      { $set: { isRead: true } }
    )
  }

  return { data: messages }
})
