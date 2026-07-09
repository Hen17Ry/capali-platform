import { db } from '~~/server/db'
import { events } from '~~/server/db/schema'
import { desc } from 'drizzle-orm'

export default defineEventHandler(async () => {
  // Optionnel: On pourrait filtrer pour ne montrer que les événements futurs
  // const now = new Date()
  // const rows = await db.select().from(events).where(gte(events.eventDate, now)).orderBy(desc(events.eventDate))
  
  const rows = await db
    .select({
      id: events.id,
      title: events.title,
      description: events.description,
      coverImage: events.coverImage,
      type: events.type,
      city: events.city,
      eventDate: events.eventDate,
      registrationUrl: events.registrationUrl,
    })
    .from(events)
    .orderBy(desc(events.eventDate))

  return { data: rows }
})
