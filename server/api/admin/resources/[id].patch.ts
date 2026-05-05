import { db } from '~~/server/db'
import { resources } from '~~/server/db/schema'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'ID manquant.' })

  const body = await readBody(event)
  const updates: Record<string, unknown> = { updatedAt: new Date() }

  if (body.title) updates.title = body.title
  if (body.content) updates.content = body.content
  if (body.type) updates.type = body.type
  if (body.theme) updates.theme = body.theme
  if (body.targetCountry) updates.targetCountry = body.targetCountry
  if (body.targetLevel) updates.targetLevel = body.targetLevel
  if (typeof body.isDraft === 'boolean') {
    updates.isDraft = body.isDraft
    if (!body.isDraft) updates.publishedAt = new Date()
  }

  const [updated] = await db
    .update(resources)
    .set(updates)
    .where(eq(resources.id, id))
    .returning()

  if (!updated) throw createError({ statusCode: 404, statusMessage: 'Ressource non trouvée.' })

  return { data: updated }
})
