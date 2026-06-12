import { db } from '~~/server/db'
import { mentorshipRequests } from '~~/server/db/schema'
import { eq } from 'drizzle-orm'
import { getSessionFromEvent } from '~~/server/utils/session'
import { connectMongo } from '~~/server/utils/mongo'
import { Message } from '~~/server/models/Message'
import { z } from 'zod'

const messageSchema = z.object({
  content: z.string().optional(),
  type: z.enum(['text', 'image']).default('text'),
  mediaUrl: z.string().optional()
})

export default defineEventHandler(async (event) => {
  const session = await getSessionFromEvent(event)
  if (!session) throw createError({ statusCode: 401, message: 'Non authentifié' })

  const mentorshipId = getRouterParam(event, 'id')
  if (!mentorshipId) throw createError({ statusCode: 400, message: 'ID manquant' })

  const body = await readBody(event)
  const parsed = messageSchema.safeParse(body)
  if (!parsed.success) throw createError({ statusCode: 400, message: 'Données invalides' })
  if (parsed.data.type === 'text' && !parsed.data.content?.trim()) throw createError({ statusCode: 400, message: 'Message vide' })

  const [mentorship] = await db.select().from(mentorshipRequests).where(eq(mentorshipRequests.id, mentorshipId)).limit(1)
  
  if (!mentorship) throw createError({ statusCode: 404, message: 'Conversation introuvable' })
  if (mentorship.menteeId !== session.userId && mentorship.mentorId !== session.userId) {
    throw createError({ statusCode: 403, message: 'Accès refusé' })
  }

  if (mentorship.status !== 'accepted') {
    throw createError({ statusCode: 403, message: 'Vous ne pouvez plus envoyer de messages dans cette conversation.' })
  }

  await connectMongo()

  const msg = new Message({
    mentorshipId,
    senderId: session.userId,
    content: parsed.data.content,
    type: parsed.data.type,
    mediaUrl: parsed.data.mediaUrl
  })

  await msg.save()

  return { data: msg }
})
