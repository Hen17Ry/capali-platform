import { db } from '~~/server/db'
import { mentorshipRequests, users } from '~~/server/db/schema'
import { eq, or, and } from 'drizzle-orm'
import { getSessionFromEvent } from '~~/server/utils/session'
import { connectMongo } from '~~/server/utils/mongo'
import { Message } from '~~/server/models/Message'

export default defineEventHandler(async (event) => {
  const session = await getSessionFromEvent(event)
  if (!session) throw createError({ statusCode: 401, message: 'Non authentifié' })

  // Find all active mentorships for this user
  const activeMentorships = await db.select({
    id: mentorshipRequests.id,
    menteeId: mentorshipRequests.menteeId,
    mentorId: mentorshipRequests.mentorId,
    menteeName: users.name,
    menteeAvatar: users.avatarUrl,
  }).from(mentorshipRequests)
    .innerJoin(users, eq(mentorshipRequests.menteeId, users.id))
    .where(
      and(
        eq(mentorshipRequests.status, 'accepted'),
        or(
          eq(mentorshipRequests.menteeId, session.userId),
          eq(mentorshipRequests.mentorId, session.userId)
        )
      )
    )

  // We need to fetch the mentor's info separately or via aliases, but we can just do another query for simplicity
  // or use two queries. Let's fetch all users involved.
  const mentorIds = activeMentorships.map(m => m.mentorId)
  const mentors = mentorIds.length ? await db.select({ id: users.id, name: users.name, avatar: users.avatarUrl }).from(users).where(or(...mentorIds.map(id => eq(users.id, id)))) : []

  await connectMongo()

  const conversations = []

  for (const m of activeMentorships) {
    const isMentor = session.userId === m.mentorId
    const mentorInfo = mentors.find(user => user.id === m.mentorId)
    
    // Partner info is the OTHER person
    const partnerId = isMentor ? m.menteeId : m.mentorId
    const partnerName = isMentor ? m.menteeName : mentorInfo?.name
    const partnerAvatar = isMentor ? m.menteeAvatar : mentorInfo?.avatar

    // Get last message from Mongo
    const lastMsg = await (Message as any).findOne({ mentorshipId: m.id }).sort({ createdAt: -1 }).lean()

    conversations.push({
      id: m.id,
      partnerId,
      partnerName,
      partnerAvatar,
      lastMessage: lastMsg?.content || (lastMsg?.type === 'image' ? '📷 Image' : 'Nouvelle conversation'),
      lastMessageAt: lastMsg?.createdAt || new Date(0),
      unreadCount: 0 // To be implemented
    })
  }

  // Sort by last message date descending
  conversations.sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime())

  return { data: conversations }
})
