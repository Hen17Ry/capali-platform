import { db } from '~~/server/db'
import { mentorProfiles, users } from '~~/server/db/schema'
import { eq, sql } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const filter = (query.filter as string) || 'all' // 'all', 'pending', 'validated', 'paused'

  let whereClause
  if (filter === 'pending') {
    whereClause = eq(mentorProfiles.isValidated, false)
  } else if (filter === 'validated') {
    whereClause = eq(mentorProfiles.isValidated, true)
  } else if (filter === 'paused') {
    whereClause = eq(mentorProfiles.isPaused, true)
  }

  const rows = await db
    .select({
      userId: mentorProfiles.userId,
      cityInFrance: mentorProfiles.cityInFrance,
      availableHoursMonth: mentorProfiles.availableHoursMonth,
      maxMentees: mentorProfiles.maxMentees,
      acceptsRemote: mentorProfiles.acceptsRemote,
      acceptsInperson: mentorProfiles.acceptsInperson,
      presentation: mentorProfiles.presentation,
      isValidated: mentorProfiles.isValidated,
      isPaused: mentorProfiles.isPaused,
      validatedAt: mentorProfiles.validatedAt,
      createdAt: mentorProfiles.createdAt,
      userName: users.name,
      userEmail: users.email,
      userDomain: users.domain,
      userAvatar: users.avatarUrl,
    })
    .from(mentorProfiles)
    .innerJoin(users, eq(mentorProfiles.userId, users.id))
    .where(whereClause)
    .orderBy(sql`${mentorProfiles.createdAt} DESC`)

  return { data: rows }
})
