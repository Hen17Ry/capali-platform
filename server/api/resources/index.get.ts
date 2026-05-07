import { db } from '~~/server/db'
import { resources } from '~~/server/db/schema'
import { eq, and, sql, ilike, or } from 'drizzle-orm'

/**
 * Public resources endpoint — only published resources
 * Supports: full-text search, combinable filters, pagination
 *
 * Query params:
 * - q: search query (searches title + content)
 * - theme: logement|banque|etudes|emploi|vie_quotidienne|sante|orientation|droits
 * - type: article|video|webinar
 * - level: predeparture|first_month|installed
 * - country: benin|france|both
 * - page: page number (default 1)
 * - perPage: items per page (default 20, max 50)
 */
export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  const page = Math.max(1, Number(query.page) || 1)
  const perPage = Math.min(50, Math.max(1, Number(query.perPage) || 20))
  const offset = (page - 1) * perPage

  // Build WHERE conditions
  const conditions = [eq(resources.isDraft, false)]

  // Theme filter
  if (query.theme && typeof query.theme === 'string') {
    conditions.push(eq(resources.theme, query.theme as any))
  }

  // Type filter
  if (query.type && typeof query.type === 'string') {
    conditions.push(eq(resources.type, query.type as any))
  }

  // Level filter
  if (query.level && typeof query.level === 'string') {
    conditions.push(eq(resources.targetLevel, query.level as any))
  }

  // Country filter
  if (query.country && typeof query.country === 'string') {
    conditions.push(eq(resources.targetCountry, query.country as any))
  }

  // Full-text search
  if (query.q && typeof query.q === 'string') {
    const search = `%${query.q}%`
    conditions.push(
      or(
        ilike(resources.title, search),
        ilike(resources.content, search),
        ilike(resources.excerpt, search),
      )!
    )
  }

  const whereClause = and(...conditions)

  // Count
  const countResult = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(resources)
    .where(whereClause)
  const total = countResult[0]?.count ?? 0

  // Fetch rows (without full content for list view — only excerpt)
  const rows = await db
    .select({
      id: resources.id,
      title: resources.title,
      excerpt: resources.excerpt,
      coverImage: resources.coverImage,
      type: resources.type,
      theme: resources.theme,
      targetCountry: resources.targetCountry,
      targetLevel: resources.targetLevel,
      sourceUrl: resources.sourceUrl,
      sourcePlatform: resources.sourcePlatform,
      publishedAt: resources.publishedAt,
    })
    .from(resources)
    .where(whereClause)
    .orderBy(sql`${resources.publishedAt} DESC NULLS LAST`)
    .limit(perPage)
    .offset(offset)

  return {
    data: rows,
    meta: {
      total,
      page,
      perPage,
      totalPages: Math.ceil(total / perPage),
    },
  }
})
