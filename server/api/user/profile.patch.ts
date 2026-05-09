import { db } from '~~/server/db'
import { users, mentorProfiles } from '~~/server/db/schema'
import { eq } from 'drizzle-orm'

import { getSessionFromEvent, updateRedisSession } from '~~/server/utils/session'

export default defineEventHandler(async (event) => {
  const session = await getSessionFromEvent(event)
  if (!session) throw createError({ statusCode: 401, message: 'Unauthorized' })
  const userId = session.userId
  const body = await readBody(event)

  // 1. Update basic user info
  const userUpdates: Record<string, any> = {}
  if (body.name) userUpdates.name = body.name
  if (body.avatarUrl !== undefined) userUpdates.avatarUrl = body.avatarUrl
  if (body.cityCurrentFr !== undefined) userUpdates.cityCurrentFr = body.cityCurrentFr

  if (Object.keys(userUpdates).length > 0) {
    await db.update(users).set(userUpdates).where(eq(users.id, userId))
  }

  // 2. Update mentor profile if applicable
  if (session.status === 'mentor') {
    const mentorUpdates: Record<string, any> = {}
    
    if (body.currentProfession !== undefined) mentorUpdates.currentProfession = body.currentProfession
    if (body.presentation !== undefined) mentorUpdates.presentation = body.presentation
    if (body.linkedinUrl !== undefined) mentorUpdates.linkedinUrl = body.linkedinUrl
    if (body.yearsExperience !== undefined) mentorUpdates.yearsExperience = body.yearsExperience
    if (body.helpTopics !== undefined) mentorUpdates.helpTopics = body.helpTopics
    if (body.experiences !== undefined) mentorUpdates.experiences = body.experiences
    
    if (Object.keys(mentorUpdates).length > 0) {
      // Upsert mentor profile
      const [existingMentor] = await db.select().from(mentorProfiles).where(eq(mentorProfiles.userId, userId))
      if (existingMentor) {
        await db.update(mentorProfiles).set(mentorUpdates).where(eq(mentorProfiles.userId, userId))
      } else {
        await db.insert(mentorProfiles).values({
          userId,
          ...mentorUpdates,
        })
      }
    }
  }

  return { success: true }
})
