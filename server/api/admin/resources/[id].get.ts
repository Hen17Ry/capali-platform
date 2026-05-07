import { db } from '~~/server/db'
import { resources } from '~~/server/db/schema'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, message: 'ID manquant.' })

  const [resource] = await db
    .select()
    .from(resources)
    .where(eq(resources.id, id))
    .limit(1)

  if (!resource) {
    throw createError({ statusCode: 404, message: 'Ressource non trouvée.' })
  }

  return { data: resource }
})
