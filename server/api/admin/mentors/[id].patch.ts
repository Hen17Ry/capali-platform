import { db } from '~~/server/db'
import { mentorProfiles } from '~~/server/db/schema'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'ID manquant.' })

  const body = await readBody(event)
  const updates: Record<string, unknown> = {}

  if (body.action === 'validate') {
    updates.isValidated = true
    updates.validatedAt = new Date()
  } else if (body.action === 'refuse') {
    updates.isValidated = false
    updates.validatedAt = null
  } else if (body.action === 'pause') {
    updates.isPaused = true
  } else if (body.action === 'unpause') {
    updates.isPaused = false
  } else {
    throw createError({ statusCode: 400, statusMessage: 'Action invalide. Utilisez: validate, refuse, pause, unpause.' })
  }

  const [updated] = await db
    .update(mentorProfiles)
    .set(updates)
    .where(eq(mentorProfiles.userId, id))
    .returning()

  if (!updated) {
    throw createError({ statusCode: 404, statusMessage: 'Profil mentor non trouvé.' })
  }

  return { data: updated }
})
