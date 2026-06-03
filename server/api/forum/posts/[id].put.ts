import { z } from 'zod'
import { ForumPost } from '~~/server/models/ForumPost'
import { connectMongo } from '~~/server/utils/mongo'
import { getSessionFromEvent } from '~~/server/utils/session'

const editSchema = z.object({
  content: z.string().min(2),
})

export default defineEventHandler(async (event) => {
  await connectMongo()
  const postId = getRouterParam(event, 'id')
  if (!postId) throw createError({ statusCode: 400, message: 'ID manquant' })

  const session = await getSessionFromEvent(event)
  if (!session) throw createError({ statusCode: 401, message: 'Non authentifié' })

  const body = await readBody(event)
  const parsed = editSchema.safeParse(body)
  if (!parsed.success) throw createError({ statusCode: 400, message: 'Données invalides' })

  const post = await (ForumPost as any).findById(postId)
  if (!post) throw createError({ statusCode: 404, message: 'Réponse introuvable' })

  // Only author or admin can edit
  if (post.authorId !== session.userId && !session.isAdmin) {
    throw createError({ statusCode: 403, message: 'Non autorisé à modifier' })
  }

  post.content = parsed.data.content
  await post.save()

  return { data: post }
})
