import { db } from '~~/server/db'
import { events } from '~~/server/db/schema'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  
  if (!id) {
    throw createError({ statusCode: 400, message: 'Event ID is required' })
  }

  const [eventData] = await db.select().from(events).where(eq(events.id, id))

  if (!eventData) {
    throw createError({ statusCode: 404, message: 'Event not found' })
  }

  return { data: eventData }
})
