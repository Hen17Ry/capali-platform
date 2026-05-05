import { db } from '~~/server/db'
import { resources } from '~~/server/db/schema'
import { sql } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const page = Math.max(1, Number(query.page) || 1)
  const perPage = Math.min(50, Math.max(1, Number(query.perPage) || 20))
  const offset = (page - 1) * perPage

  const countResult = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(resources)
  const total = countResult[0]?.count ?? 0

  const rows = await db
    .select()
    .from(resources)
    .orderBy(sql`${resources.createdAt} DESC`)
    .limit(perPage)
    .offset(offset)

  return {
    data: rows,
    meta: { total, page, perPage, totalPages: Math.ceil(total / perPage) },
  }
})
