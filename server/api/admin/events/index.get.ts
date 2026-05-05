import { db } from '~~/server/db'
import { events } from '~~/server/db/schema'
import { sql } from 'drizzle-orm'

export default defineEventHandler(async () => {
  const rows = await db
    .select()
    .from(events)
    .orderBy(sql`${events.eventDate} DESC`)

  return { data: rows }
})
