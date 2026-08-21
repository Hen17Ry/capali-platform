import { db } from '~~/server/db'
import { galleries } from '~~/server/db/schema'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, message: 'ID manquant' })

  await db.delete(galleries).where(eq(galleries.id, id))

  return { success: true }
})
