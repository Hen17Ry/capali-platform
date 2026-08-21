import { db } from '~~/server/db'
import { galleries } from '~~/server/db/schema'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, message: 'ID manquant' })

  const [gallery] = await db.select().from(galleries).where(eq(galleries.id, id))
  if (!gallery) throw createError({ statusCode: 404, message: 'Introuvable' })

  return { data: gallery }
})
