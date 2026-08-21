import { db } from '~~/server/db'
import { events } from '~~/server/db/schema'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'ID manquant.' })

  const [eventRecord] = await db.select().from(events).where(eq(events.id, id))
  
  if (!eventRecord) {
    throw createError({ statusCode: 404, statusMessage: 'Événement non trouvé' })
  }

  return { data: eventRecord }
})
