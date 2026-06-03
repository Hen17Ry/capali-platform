import { db } from '~~/server/db'
import { users, mentorProfiles, studentProfiles } from '~~/server/db/schema'
import { eq, desc, and, isNull, sql } from 'drizzle-orm'
import { getSessionFromEvent } from '~~/server/utils/session'

export default defineCachedEventHandler(async (event) => {
  const session = await getSessionFromEvent(event)
  if (!session) throw createError({ statusCode: 401, message: 'Unauthorized' })

  // Fetch the student's needsHelp and targetedCities
  const [student] = await db.select().from(studentProfiles).where(eq(studentProfiles.userId, session.userId))
  
  const needsHelpStr = JSON.stringify(student?.needsHelp || [])
  const targetedCitiesStr = JSON.stringify(student?.targetedCities || [])

  // Calculate the score natively in PostgreSQL for maximum performance
  // 1 point for each matching helpTopic
  const skillsScore = sql<number>`(
    SELECT count(*)::int 
    FROM jsonb_array_elements_text(${mentorProfiles.helpTopics}) AS h(val) 
    JOIN jsonb_array_elements_text(${needsHelpStr}::jsonb) AS s(val) ON h.val = s.val
  )`
  
  // 2 points if the mentor's city matches one of the student's targeted cities
  const cityScore = sql<number>`
    CASE WHEN ${users.cityCurrentFr} IN (
      SELECT jsonb_array_elements_text(${targetedCitiesStr}::jsonb)
    ) THEN 2 ELSE 0 END
  `

  const totalScore = sql<number>`(${skillsScore} + ${cityScore})`

  const recommended = await db
    .select({
      id: users.id,
      name: users.name,
      avatarUrl: users.avatarUrl,
      cityCurrentFr: users.cityCurrentFr,
      currentProfession: mentorProfiles.currentProfession,
      yearsExperience: mentorProfiles.yearsExperience,
      helpTopics: mentorProfiles.helpTopics,
      score: totalScore,
    })
    .from(users)
    .innerJoin(mentorProfiles, eq(users.id, mentorProfiles.userId))
    .where(
      and(
        eq(users.status, 'mentor'),
        isNull(users.deletedAt)
      )
    )
    .orderBy(desc(totalScore), desc(users.createdAt))
    .limit(4)

  return { data: recommended }
}, {
  maxAge: 60 * 15, // Cache for 15 minutes
  swr: true, // Serve stale while revalidating
  getKey: (event) => {
    // Generate a unique cache key per session
    const sessionId = getCookie(event, 'capali_session')
    return `mentors-recom-${sessionId || 'anonymous'}`
  }
})
