import { db } from '~~/server/db'
import { galleries } from '~~/server/db/schema'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, message: 'ID manquant' })

  const body = await readBody(event)
  const { eventId, description, images } = body

  if (!eventId || !images || !Array.isArray(images)) {
    throw createError({ statusCode: 400, message: 'Paramètres invalides' })
  }

  await db.update(galleries)
    .set({ eventId, description, images, updatedAt: new Date() })
    .where(eq(galleries.id, id))

  return { success: true }
})
