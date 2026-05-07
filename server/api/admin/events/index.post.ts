import { db } from '~~/server/db'
import { events } from '~~/server/db/schema'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body.title || !body.type || !body.eventDate) {
    throw createError({ statusCode: 400, statusMessage: 'Titre, type et date sont obligatoires.' })
  }

  const [created] = await db
    .insert(events)
    .values({
      title: body.title,
      description: body.description || null,
      coverImage: body.coverImage || null,
      type: body.type,
      city: body.city || null,
      eventDate: new Date(body.eventDate),
      registrationUrl: body.registrationUrl || null,
      createdBy: event.context.adminUser?.id || null,
    })
    .returning()

  return { data: created }
})
