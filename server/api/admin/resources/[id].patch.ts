import { db } from '~~/server/db'
import { resources } from '~~/server/db/schema'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, message: 'ID manquant.' })

  const body = await readBody(event)
  const updates: Record<string, unknown> = { updatedAt: new Date() }

  if (body.title !== undefined) updates.title = body.title
  if (body.excerpt !== undefined) updates.excerpt = body.excerpt || null
  if (body.content !== undefined) updates.content = body.content
  if (body.coverImage !== undefined) updates.coverImage = body.coverImage || null
  if (body.type) updates.type = body.type
  if (body.theme) updates.theme = body.theme
  if (body.targetCountry) updates.targetCountry = body.targetCountry
  if (body.targetLevel) updates.targetLevel = body.targetLevel
  if (body.sourceUrl !== undefined) updates.sourceUrl = body.sourceUrl || null
  if (body.sourcePlatform !== undefined) updates.sourcePlatform = body.sourcePlatform || null
  if (typeof body.isDraft === 'boolean') {
    updates.isDraft = body.isDraft
    if (!body.isDraft) updates.publishedAt = new Date()
  }

  const [updated] = await db
    .update(resources)
    .set(updates)
    .where(eq(resources.id, id))
    .returning()

  if (!updated) throw createError({ statusCode: 404, message: 'Ressource non trouvée.' })

  return { data: updated }
})
