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
      eventTitle: events.title,
    })
    .from(galleries)
    .leftJoin(events, eq(galleries.eventId, events.id))
    .orderBy(desc(galleries.createdAt))
    
  // Format to send cover image
  const formattedList = list.map(g => ({
    id: g.id,
    title: g.eventTitle || 'Galerie',
    description: g.description,
    coverImage: g.images && g.images.length > 0 ? g.images[0] : null,
    imageCount: g.images ? g.images.length : 0,
    createdAt: g.createdAt
  }))
  
  return { data: formattedList }
})
