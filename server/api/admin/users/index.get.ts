import { db } from '~~/server/db'
import { users } from '~~/server/db/schema'
import { sql, isNull, ilike, or } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const page = Math.max(1, Number(query.page) || 1)
  const perPage = Math.min(50, Math.max(1, Number(query.perPage) || 20))
  const search = (query.search as string) || ''
  const offset = (page - 1) * perPage

  const conditions = [isNull(users.deletedAt)]

  if (search.trim()) {
    conditions.push(
      or(
        ilike(users.name, `%${search}%`),
        ilike(users.email, `%${search}%`),
      )!
    )
  }

  const whereClause = conditions.length > 1
    ? sql`${conditions.reduce((acc, c, i) => i === 0 ? c : sql`${acc} AND ${c}`)}`
    : conditions[0]

  const countResult = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(users)
    .where(whereClause)
  const total = countResult[0]?.count ?? 0

  const rows = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      status: users.status,
      isAdmin: users.isAdmin,
      avatarUrl: users.avatarUrl,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(whereClause)
    .orderBy(sql`${users.createdAt} DESC`)
    .limit(perPage)
    .offset(offset)

  return {
    data: rows,
    meta: { total, page, perPage, totalPages: Math.ceil(total / perPage) },
  }
})
