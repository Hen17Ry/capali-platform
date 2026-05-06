import { db } from '~~/server/db'
import { users } from '~~/server/db/schema'
import { eq, isNull, and } from 'drizzle-orm'
import { getSessionFromEvent, refreshSession, SESSION_COOKIE_NAME } from '~~/server/utils/session'

export default defineEventHandler(async (event) => {
  const session = await getSessionFromEvent(event)

  if (!session) {
    throw createError({ statusCode: 401, statusMessage: 'Non authentifié.' })
  }

  // Fetch fresh user data from DB
  const [user] = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      status: users.status,
      isAdmin: users.isAdmin,
      avatarUrl: users.avatarUrl,
      countryOrigin: users.countryOrigin,
      cityCurrentFr: users.cityCurrentFr,
      domain: users.domain,
      bio: users.bio,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(and(eq(users.id, session.userId), isNull(users.deletedAt)))
    .limit(1)

  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Utilisateur non trouvé.' })
  }

  // Extend session TTL on activity
  const sessionId = getCookie(event, SESSION_COOKIE_NAME)
  if (sessionId) {
    await refreshSession(sessionId)
  }

  return { data: user }
})
