import { db } from '~~/server/db'
import { users, mentorProfiles, studentProfiles } from '~~/server/db/schema'
import { eq, desc, and, isNull } from 'drizzle-orm'
import { getSessionFromEvent } from '~~/server/utils/session'

export default defineEventHandler(async (event) => {
  const session = await getSessionFromEvent(event)
  if (!session) throw createError({ statusCode: 401, message: 'Unauthorized' })

  // Ideally, we'd fetch the student's needsHelp or targetedCities and match them against mentors
  const [student] = await db.select().from(studentProfiles).where(eq(studentProfiles.userId, session.userId))
  
  // For now, we fetch up to 4 mentors. In a real app, we'd score them.
  const recommended = await db
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
    .limit(4)
    .orderBy(desc(users.createdAt))

  // Sort them so that mentors sharing "helpTopics" with student's "needsHelp" come first
  if (student && student.needsHelp && student.needsHelp.length > 0) {
    recommended.sort((a, b) => {
      const aMatches = a.helpTopics?.filter((t: string) => student.needsHelp!.includes(t)).length || 0
      const bMatches = b.helpTopics?.filter((t: string) => student.needsHelp!.includes(t)).length || 0
      return bMatches - aMatches
    })
  }

  return { data: recommended }
})
