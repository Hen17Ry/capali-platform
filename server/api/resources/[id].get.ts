import { db } from '~~/server/db'
import { resources, users } from '~~/server/db/schema'
import { eq, and } from 'drizzle-orm'

/**
 * Public single resource endpoint — only published resources
 */
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, message: 'ID manquant.' })

  const [resource] = await db
    .select({
      id: resources.id,
      title: resources.title,
      excerpt: resources.excerpt,
      content: resources.content,
      coverImage: resources.coverImage,
      type: resources.type,
      theme: resources.theme,
      targetCountry: resources.targetCountry,
      targetLevel: resources.targetLevel,
      sourceUrl: resources.sourceUrl,
      sourcePlatform: resources.sourcePlatform,
      publishedAt: resources.publishedAt,
      createdAt: resources.createdAt,
      authorName: users.name,
      authorAvatar: users.avatarUrl,
    })
    .from(resources)
    .leftJoin(users, eq(resources.authorId, users.id))
    .where(and(eq(resources.id, id), eq(resources.isDraft, false)))
    .limit(1)

  if (!resource) {
    throw createError({ statusCode: 404, message: 'Ressource non trouvée.' })
  }

  return { data: resource }
})
