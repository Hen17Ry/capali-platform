import { db } from '~~/server/db'
import { users } from '~~/server/db/schema'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  // Only protect /api/admin/* routes
  const url = getRequestURL(event)
  if (!url.pathname.startsWith('/api/admin')) return

  // TODO: Replace with real JWT session extraction when auth module is implemented
  const userId = getHeader(event, 'x-user-id')

  if (!userId) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Non authentifié. Veuillez vous connecter.',
    })
  }

  // Check if user exists and is admin
  const [user] = await db
    .select({ id: users.id, isAdmin: users.isAdmin, deletedAt: users.deletedAt })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1)

  if (!user || user.deletedAt) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Utilisateur non trouvé.',
    })
  }

  if (!user.isAdmin) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Accès refusé. Droits administrateur requis.',
    })
  }

  // Attach admin user to event context for downstream handlers
  event.context.adminUser = { id: user.id }
})
