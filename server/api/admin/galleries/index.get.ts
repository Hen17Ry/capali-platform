import { db } from '~~/server/db'
import { galleries, events } from '~~/server/db/schema'
import { desc, eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const list = await db
    .select({
      id: galleries.id,
      description: galleries.description,
      images: galleries.images,
      createdAt: galleries.createdAt,
      eventId: galleries.eventId,
      eventTitle: events.title,
    })
    .from(galleries)
    .leftJoin(events, eq(galleries.eventId, events.id))
    .orderBy(desc(galleries.createdAt))
    
  return { data: list }
})
