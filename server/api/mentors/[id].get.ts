import { db } from '~~/server/db'
import { users, mentorProfiles } from '~~/server/db/schema'
import { eq, and, isNull } from 'drizzle-orm'
import { getSessionFromEvent } from '~~/server/utils/session'

export default defineEventHandler(async (event) => {
  const session = await getSessionFromEvent(event)
  if (!session) throw createError({ statusCode: 401, message: 'Unauthorized' })

  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, message: 'ID missing' })

  const [mentor] = await db
    .select({
      id: users.id,
      name: users.name,
      avatarUrl: users.avatarUrl,
      cityCurrentFr: users.cityCurrentFr,
      countryOrigin: users.countryOrigin,
      currentProfession: mentorProfiles.currentProfession,
      yearsExperience: mentorProfiles.yearsExperience,
      helpTopics: mentorProfiles.helpTopics,
      presentation: mentorProfiles.presentation,
      linkedinUrl: mentorProfiles.linkedinUrl,
      experiences: mentorProfiles.experiences,
      availableHoursMonth: mentorProfiles.availableHoursMonth,
    })
    .from(users)
    .innerJoin(mentorProfiles, eq(users.id, mentorProfiles.userId))
    .where(
      and(
        eq(users.id, id),
        eq(users.status, 'mentor'),
        isNull(users.deletedAt)
      )
    )

  if (!mentor) throw createError({ statusCode: 404, message: 'Mentor not found' })

  return { data: mentor }
})
