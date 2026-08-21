import { db } from '~~/server/db'
import { events, eventAttendees } from '~~/server/db/schema'
import { sql, eq, getTableColumns  } from 'drizzle-orm'

export default defineEventHandler(async () => {
  const rows = await db
    .select({
      ...getTableColumns(events),
      attendeesCount: sql<number>`count(${eventAttendees.id})::int`
    })
    .from(events)
    .leftJoin(eventAttendees, eq(events.id, eventAttendees.eventId))
    .groupBy(events.id)
    .orderBy(sql`${events.eventDate} DESC`)

  return { data: rows }
})
