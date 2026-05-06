import { db } from '~~/server/db'
import { mentorProfiles, users } from '~~/server/db/schema'
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

  // ── Send notification emails (fire-and-forget) ──
  if (body.action === 'validate' || body.action === 'refuse') {
    // Fetch user info for the email
    const [user] = await db
      .select({ name: users.name, email: users.email })
      .from(users)
      .where(eq(users.id, id))
      .limit(1)

    if (user) {
      if (body.action === 'validate') {
        sendMentorValidatedEmail({ name: user.name, email: user.email })
      } else {
        sendMentorRefusedEmail({ name: user.name, email: user.email })
      }
    }
  }

  return { data: updated }
})
