import { ForumPost } from '~~/server/models/ForumPost'
import { ForumThread } from '~~/server/models/ForumThread'
import { connectMongo } from '~~/server/utils/mongo'
import { getSessionFromEvent } from '~~/server/utils/session'

export default defineEventHandler(async (event) => {
  await connectMongo()
  const postId = getRouterParam(event, 'id')
  if (!postId) throw createError({ statusCode: 400, message: 'ID manquant' })

  const session = await getSessionFromEvent(event)
  if (!session) throw createError({ statusCode: 401, message: 'Non authentifié' })

  const post = await (ForumPost as any).findById(postId)
  if (!post) throw createError({ statusCode: 404, message: 'Réponse introuvable' })

  if (post.authorId !== session.userId && !session.isAdmin) {
    throw createError({ statusCode: 403, message: 'Non autorisé à supprimer' })
  }

  const threadId = post.threadId
  await (ForumPost as any).findByIdAndDelete(postId)

  // Decrement reply count
  await (ForumThread as any).findByIdAndUpdate(threadId, { $inc: { replyCount: -1 } })

  return { success: true }
})
