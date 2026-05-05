import { db } from '~~/server/db'
import { users } from '~~/server/db/schema'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'ID manquant.' })

  const body = await readBody(event)

  // Only allow specific fields to be updated by admin
  const updates: Record<string, unknown> = {}
  if (typeof body.isAdmin === 'boolean') updates.isAdmin = body.isAdmin
  if (body.status) updates.status = body.status

  // Suspend = soft delete
  if (body.action === 'suspend') {
    updates.deletedAt = new Date()
  }
  if (body.action === 'unsuspend') {
    updates.deletedAt = null
  }

  if (Object.keys(updates).length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'Aucune modification fournie.' })
  }

  const [updated] = await db
    .update(users)
    .set(updates)
    .where(eq(users.id, id))
    .returning({ id: users.id, name: users.name, email: users.email })

  if (!updated) {
    throw createError({ statusCode: 404, statusMessage: 'Utilisateur non trouvé.' })
  }

  return { data: updated }
})
