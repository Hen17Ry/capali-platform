import { db } from '~~/server/db'
import { users, mentorProfiles, mentorshipRequests, resources, events, forumPosts } from '~~/server/db/schema'
import { eq, sql, isNull, and, gte } from 'drizzle-orm'

export default defineEventHandler(async () => {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  // Helper to safely extract count
  const getCount = async (query: Promise<{ count: number }[]>) => {
    const result = await query
    return result[0]?.count ?? 0
  }

  // Total users (non-deleted)
  const totalUsers = await getCount(
    db.select({ count: sql<number>`count(*)::int` }).from(users).where(isNull(users.deletedAt))
  )

  // New users this month
  const newUsersThisMonth = await getCount(
    db.select({ count: sql<number>`count(*)::int` }).from(users).where(and(isNull(users.deletedAt), gte(users.createdAt, startOfMonth)))
  )

  // Mentorship stats
  const mentorshipStats = await db
    .select({
      status: mentorshipRequests.status,
      count: sql<number>`count(*)::int`,
    })
    .from(mentorshipRequests)
    .groupBy(mentorshipRequests.status)

  const mentorships = {
    pending: 0,
    accepted: 0,
    refused: 0,
    cancelled: 0,
    closed: 0,
  }
  for (const row of mentorshipStats) {
    if (row.status in mentorships) {
      mentorships[row.status as keyof typeof mentorships] = row.count
    }
  }

  // Pending mentor validations
  const pendingMentors = await getCount(
    db.select({ count: sql<number>`count(*)::int` }).from(mentorProfiles).where(eq(mentorProfiles.isValidated, false))
  )

  // Total published resources
  const totalResources = await getCount(
    db.select({ count: sql<number>`count(*)::int` }).from(resources).where(eq(resources.isDraft, false))
  )

  // Upcoming events
  const upcomingEvents = await getCount(
    db.select({ count: sql<number>`count(*)::int` }).from(events).where(gte(events.eventDate, now))
  )

  // Flagged posts
  const flaggedPosts = await getCount(
    db.select({ count: sql<number>`count(*)::int` }).from(forumPosts).where(eq(forumPosts.isFlagged, true))
  )

  return {
    data: {
      users: {
        total: totalUsers,
        newThisMonth: newUsersThisMonth,
      },
      mentorships,
      pendingMentors,
      resources: totalResources,
      upcomingEvents,
      flaggedPosts,
    },
  }
})
