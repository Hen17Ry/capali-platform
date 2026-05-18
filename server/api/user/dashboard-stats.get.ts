import { db } from '~~/server/db'
import { events, resources, forumPosts, mentorshipRequests } from '~~/server/db/schema'
import { gte, countDistinct, eq, and, sql  } from 'drizzle-orm'
import { getSessionFromEvent } from '~~/server/utils/session'

export default defineEventHandler(async (event) => {
  const session = await getSessionFromEvent(event)
  if (!session) throw createError({ statusCode: 401, message: 'Unauthorized' })

  if (session.status === 'mentor') {
    // Stats for mentor
    const pendingRes = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(mentorshipRequests)
      .where(and(eq(mentorshipRequests.mentorId, session.userId), eq(mentorshipRequests.status, 'pending')))
    
    const activeRes = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(mentorshipRequests)
      .where(and(eq(mentorshipRequests.mentorId, session.userId), eq(mentorshipRequests.status, 'accepted')))

    return {
      pendingRequests: pendingRes[0]?.count || 0,
      activeMentees: activeRes[0]?.count || 0,
    }
  } else {
    // Stats for students / default
    const upcomingRes = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(events)
      .where(gte(events.eventDate, new Date()))
    const upcomingEvents = upcomingRes[0]?.count || 0

    const resourcesRes = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(resources)
    const totalResources = resourcesRes[0]?.count || 0

    const forumRes = await db
      .select({ count: countDistinct(forumPosts.authorId) })
      .from(forumPosts)
    const activeForumMembers = Number(forumRes[0]?.count) || 0

    return {
      upcomingEvents,
      totalResources,
      activeForumMembers,
    }
  }
})
