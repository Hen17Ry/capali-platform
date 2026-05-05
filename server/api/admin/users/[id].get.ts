import { db } from '~~/server/db'
import { users, mentorProfiles } from '~~/server/db/schema'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'ID manquant.' })

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, id))
    .limit(1)

  if (!user) {
    throw createError({ statusCode: 404, statusMessage: 'Utilisateur non trouvé.' })
  }

  // If user is a mentor, get mentor profile
  let mentorProfile = null
  if (user.status === 'mentor') {
    const [profile] = await db
      .select()
      .from(mentorProfiles)
      .where(eq(mentorProfiles.userId, id))
      .limit(1)
    mentorProfile = profile || null
  }

  return { data: { ...user, mentorProfile } }
})
