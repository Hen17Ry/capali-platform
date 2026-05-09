import { db } from '~~/server/db'
import { users, mentorshipRequests, studentProfiles } from '~~/server/db/schema'
import { eq, desc } from 'drizzle-orm'
import { getSessionFromEvent } from '~~/server/utils/session'

export default defineEventHandler(async (event) => {
  const session = await getSessionFromEvent(event)
  if (!session || session.status !== 'mentor') {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  const requests = await db
    .select({
      id: mentorshipRequests.id,
      status: mentorshipRequests.status,
      message: mentorshipRequests.message,
      createdAt: mentorshipRequests.createdAt,
      mentee: {
        id: users.id,
        name: users.name,
        avatarUrl: users.avatarUrl,
        cityCurrentFr: users.cityCurrentFr,
      },
      studentProfile: {
        educationLevel: studentProfiles.educationLevel,
        schoolName: studentProfiles.schoolName,
        arrivalDate: studentProfiles.arrivalDate,
        needsHelp: studentProfiles.needsHelp,
        targetedCities: studentProfiles.targetedCities,
        presentation: studentProfiles.presentation,
      }
    })
    .from(mentorshipRequests)
    .innerJoin(users, eq(mentorshipRequests.menteeId, users.id))
    .leftJoin(studentProfiles, eq(users.id, studentProfiles.userId))
    .where(eq(mentorshipRequests.mentorId, session.userId))
    .orderBy(desc(mentorshipRequests.createdAt))

  return { data: requests }
})
