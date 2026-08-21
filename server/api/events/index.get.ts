import { db } from '~~/server/db'
import { events } from '~~/server/db/schema'
import { desc, gt, or, isNull } from 'drizzle-orm'

export default defineEventHandler(async () => {
  const rows = await db
    .select({
      id: events.id,
      title: events.title,
      description: events.description,
      coverImage: events.coverImage,
      type: events.type,
      city: events.city,
      eventDate: events.eventDate,
      registrationDeadline: events.registrationDeadline,
      registrationUrl: events.registrationUrl,
    })
    .from(events)
    .orderBy(desc(events.eventDate))

  return { data: rows }
})
