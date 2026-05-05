import { db } from '~~/server/db'
import { resources } from '~~/server/db/schema'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'ID manquant.' })

  const [deleted] = await db
    .delete(resources)
    .where(eq(resources.id, id))
    .returning({ id: resources.id })

  if (!deleted) throw createError({ statusCode: 404, statusMessage: 'Ressource non trouvée.' })

  return { data: null, message: 'Ressource supprimée.' }
})
