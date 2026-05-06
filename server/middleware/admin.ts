import { db } from '~~/server/db'
import { users } from '~~/server/db/schema'
import { eq } from 'drizzle-orm'
import { getSessionFromEvent } from '~~/server/utils/session'

export default defineEventHandler(async (event) => {
  // Only protect /api/admin/* routes
  const url = getRequestURL(event)
  if (!url.pathname.startsWith('/api/admin')) return

  const session = await getSessionFromEvent(event)

  // ─── DEV MODE BYPASS ───────────────────────────────────
  // In development, if no session exists, allow access.
  // TODO: Remove this bypass when auth is fully wired in production.
  if (!session && process.dev) {
    const [devAdmin] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.isAdmin, true))
      .limit(1)

    event.context.adminUser = { id: devAdmin?.id || 'dev-admin' }
    return
  }
  // ────────────────────────────────────────────────────────

  if (!session) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Non authentifié. Veuillez vous connecter.',
    })
  }

  // Check if user exists and is admin
  const [user] = await db
    .select({ id: users.id, isAdmin: users.isAdmin, deletedAt: users.deletedAt })
    .from(users)
    .where(eq(users.id, session.userId))
    .limit(1)

  if (!user || user.deletedAt) {
    throw createError({ statusCode: 401, statusMessage: 'Utilisateur non trouvé.' })
  }

  if (!user.isAdmin) {
    throw createError({ statusCode: 403, statusMessage: 'Accès refusé. Droits administrateur requis.' })
  }

  event.context.adminUser = { id: user.id }
})
