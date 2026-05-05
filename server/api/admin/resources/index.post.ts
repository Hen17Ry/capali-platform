import { db } from '~~/server/db'
import { resources } from '~~/server/db/schema'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body.title || !body.content || !body.theme || !body.targetLevel) {
    throw createError({ statusCode: 400, statusMessage: 'Titre, contenu, thème et niveau cible sont obligatoires.' })
  }

  const [created] = await db
    .insert(resources)
    .values({
      title: body.title,
      content: body.content,
      type: body.type || 'article',
      theme: body.theme,
      targetCountry: body.targetCountry || 'both',
      targetLevel: body.targetLevel,
      authorId: event.context.adminUser?.id || null,
      isDraft: body.isDraft ?? true,
      publishedAt: body.isDraft === false ? new Date() : null,
    })
    .returning()

  return { data: created }
})
