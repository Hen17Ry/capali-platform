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
  if (body.coverImage !== undefined) updates.coverImage = body.coverImage
  if (body.type) updates.type = body.type
  if (body.city !== undefined) updates.city = body.city
  if (body.eventDate) updates.eventDate = new Date(body.eventDate)
  if (body.registrationDeadline !== undefined) {
    updates.registrationDeadline = body.registrationDeadline ? new Date(body.registrationDeadline) : null
  }
  if (body.registrationUrl !== undefined) updates.registrationUrl = body.registrationUrl
  
  if (body.isPaid !== undefined) updates.isPaid = !!body.isPaid
  if (body.priceEur !== undefined) updates.priceEur = Number(body.priceEur)
  if (body.isLimited !== undefined) updates.isLimited = !!body.isLimited
  if (body.maxAttendees !== undefined) updates.maxAttendees = body.maxAttendees ? Number(body.maxAttendees) : null

  const [updated] = await db.update(events).set(updates).where(eq(events.id, id)).returning()
  if (!updated) throw createError({ statusCode: 404, statusMessage: 'Événement non trouvé.' })

  return { data: updated }
})
