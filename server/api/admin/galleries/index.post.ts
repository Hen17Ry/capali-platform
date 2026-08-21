import { db } from '~~/server/db'
import { galleries } from '~~/server/db/schema'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { eventId, description, images } = body

  if (!eventId || !images || !Array.isArray(images)) {
    throw createError({ statusCode: 400, message: 'Paramètres invalides' })
  }

  const [newGallery] = await db.insert(galleries).values({
    eventId,
    description,
    images
  }).returning()

  return { success: true, data: newGallery }
})
