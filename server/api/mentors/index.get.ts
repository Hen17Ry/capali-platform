import { db } from '~~/server/db'
import { users, mentorProfiles } from '~~/server/db/schema'
import { eq, and, isNull } from 'drizzle-orm'
import { getSessionFromEvent } from '~~/server/utils/session'

export default defineEventHandler(async (event) => {
  const session = await getSessionFromEvent(event)
  if (!session) throw createError({ statusCode: 401, message: 'Unauthorized' })

  const allMentors = await db
    .select({
      id: users.id,
      name: users.name,
      avatarUrl: users.avatarUrl,
      cityCurrentFr: users.cityCurrentFr,
      currentProfession: mentorProfiles.currentProfession,
      yearsExperience: mentorProfiles.yearsExperience,
      helpTopics: mentorProfiles.helpTopics,
    })
    .from(users)
    .innerJoin(mentorProfiles, eq(users.id, mentorProfiles.userId))
    .where(
      and(
        eq(users.status, 'mentor'),
        isNull(users.deletedAt)
      )
    )

  return { data: allMentors }
})
