import { db } from '~~/server/db'
import { events, resources, forumPosts } from '~~/server/db/schema'
import { gte, countDistinct } from 'drizzle-orm'
import { sql } from 'drizzle-orm'
import { getSessionFromEvent } from '~~/server/utils/session'

export default defineEventHandler(async (event) => {
  const session = await getSessionFromEvent(event)
  if (!session) throw createError({ statusCode: 401, message: 'Unauthorized' })

  // 1. Upcoming events count
  const upcomingRes = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(events)
    .where(gte(events.eventDate, new Date()))
  const upcomingEvents = upcomingRes[0]?.count || 0

  // 2. Total resources count
  const resourcesRes = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(resources)
  const totalResources = resourcesRes[0]?.count || 0

  // 3. Active forum members (distinct users who posted)
  const forumRes = await db
    .select({ count: countDistinct(forumPosts.authorId) })
    .from(forumPosts)
  const activeForumMembers = Number(forumRes[0]?.count) || 0

  return {
    upcomingEvents,
    totalResources,
    activeForumMembers: activeForumMembers || 0,
  }
})
