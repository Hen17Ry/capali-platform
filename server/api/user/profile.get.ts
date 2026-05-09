import { db } from '~~/server/db'
import { users, mentorProfiles } from '~~/server/db/schema'
import { eq } from 'drizzle-orm'

import { getSessionFromEvent } from '~~/server/utils/session'

export default defineEventHandler(async (event) => {
  const session = await getSessionFromEvent(event)
  if (!session) throw createError({ statusCode: 401, message: 'Unauthorized' })
  const userId = session.userId

  const [userRow] = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))

  if (!userRow) throw createError({ statusCode: 404, message: 'Utilisateur non trouvé' })

  let mentorRow = null
  if (userRow.status === 'mentor') {
    const [mRow] = await db
      .select()
      .from(mentorProfiles)
      .where(eq(mentorProfiles.userId, userId))
    mentorRow = mRow || null
  }

  return {
    data: {
      ...userRow,
      mentorProfile: mentorRow,
    }
  }
})
