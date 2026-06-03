import { ForumThread } from '~~/server/models/ForumThread'
import { ForumPost } from '~~/server/models/ForumPost'
import { connectMongo } from '~~/server/utils/mongo'
import { getSessionFromEvent } from '~~/server/utils/session'

export default defineEventHandler(async (event) => {
  await connectMongo()
  const threadId = getRouterParam(event, 'id')
  if (!threadId) throw createError({ statusCode: 400, message: 'ID manquant' })

  const session = await getSessionFromEvent(event)
  if (!session) throw createError({ statusCode: 401, message: 'Non authentifié' })

  const thread = await (ForumThread as any).findById(threadId)
  if (!thread) throw createError({ statusCode: 404, message: 'Discussion introuvable' })

  if (thread.authorId !== session.userId && !session.isAdmin) {
    throw createError({ statusCode: 403, message: 'Non autorisé à supprimer' })
  }

  // Delete thread and all its posts
  await (ForumThread as any).findByIdAndDelete(threadId)
  await (ForumPost as any).deleteMany({ threadId })

  return { success: true }
})
