import { db } from '~~/server/db'
import { galleries, events } from '~~/server/db/schema'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, message: 'ID manquant' })

  const [gallery] = await db
    .select({
      id: galleries.id,
      description: galleries.description,
      images: galleries.images,
      createdAt: galleries.createdAt,
      eventTitle: events.title,
    })
    .from(galleries)
    .leftJoin(events, eq(galleries.eventId, events.id))
    .where(eq(galleries.id, id))

  if (!gallery) throw createError({ statusCode: 404, message: 'Introuvable' })

  return { data: gallery }
})
