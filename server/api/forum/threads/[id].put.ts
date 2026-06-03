import { z } from 'zod'
import { ForumThread } from '~~/server/models/ForumThread'
import { connectMongo } from '~~/server/utils/mongo'
import { getSessionFromEvent } from '~~/server/utils/session'

const editSchema = z.object({
  title: z.string().min(5).max(150),
  content: z.string().min(10),
})

export default defineEventHandler(async (event) => {
  await connectMongo()
  const threadId = getRouterParam(event, 'id')
  if (!threadId) throw createError({ statusCode: 400, message: 'ID manquant' })

  const session = await getSessionFromEvent(event)
  if (!session) throw createError({ statusCode: 401, message: 'Non authentifié' })

  const body = await readBody(event)
  const parsed = editSchema.safeParse(body)
  if (!parsed.success) throw createError({ statusCode: 400, message: 'Données invalides' })

  const thread = await (ForumThread as any).findById(threadId)
  if (!thread) throw createError({ statusCode: 404, message: 'Discussion introuvable' })

  // Only author or admin can edit
  if (thread.authorId !== session.userId && !session.isAdmin) {
    throw createError({ statusCode: 403, message: 'Non autorisé à modifier' })
  }

  thread.title = parsed.data.title
  thread.content = parsed.data.content
  await thread.save()

  return { data: thread }
})
