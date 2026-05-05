import { db } from '~~/server/db'
import { events } from '~~/server/db/schema'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'ID manquant.' })

  const body = await readBody(event)
  const updates: Record<string, unknown> = {}

  if (body.title) updates.title = body.title
  if (body.description !== undefined) updates.description = body.description
  if (body.type) updates.type = body.type
  if (body.city !== undefined) updates.city = body.city
  if (body.eventDate) updates.eventDate = new Date(body.eventDate)
  if (body.registrationUrl !== undefined) updates.registrationUrl = body.registrationUrl

  const [updated] = await db.update(events).set(updates).where(eq(events.id, id)).returning()
  if (!updated) throw createError({ statusCode: 404, statusMessage: 'Événement non trouvé.' })

  return { data: updated }
})
