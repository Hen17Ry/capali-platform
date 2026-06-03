import { db } from '~~/server/db'
import { users } from '~~/server/db/schema'
import { eq } from 'drizzle-orm'
import { getSessionFromEvent, deleteAllUserSessions } from '~~/server/utils/session'
import { z } from 'zod'

const statusSchema = z.object({
  status: z.enum(['active', 'suspended', 'banned'])
})

export default defineEventHandler(async (event) => {
  const session = await getSessionFromEvent(event)
  if (!session || !session.isAdmin) throw createError({ statusCode: 403, message: 'Accès refusé' })

  const targetUserId = getRouterParam(event, 'id')
  if (!targetUserId) throw createError({ statusCode: 400, message: 'ID manquant' })

  const body = await readBody(event)
  const parsed = statusSchema.safeParse(body)
  if (!parsed.success) throw createError({ statusCode: 400, message: 'Statut invalide' })

  if (parsed.data.status !== 'active') {
    await db.update(users).set({ deletedAt: new Date() }).where(eq(users.id, targetUserId))
    await deleteAllUserSessions(targetUserId)
  } else {
    await db.update(users).set({ deletedAt: null }).where(eq(users.id, targetUserId))
  }

  return { success: true }
})
