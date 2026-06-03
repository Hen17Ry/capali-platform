import { ForumThread } from '~~/server/models/ForumThread'
import { ForumPost } from '~~/server/models/ForumPost'
import { connectMongo } from '~~/server/utils/mongo'

export default defineEventHandler(async (event) => {
  await connectMongo()
  const id = getRouterParam(event, 'id')

  if (!id) throw createError({ statusCode: 400, message: 'ID manquant' })

  // Increment view count
  const thread = await ForumThread.findByIdAndUpdate(id, { $inc: { viewCount: 1 } }, { new: true }).lean()
  if (!thread) {
    throw createError({ statusCode: 404, message: 'Discussion introuvable' })
  }

  // Get posts
  const posts = await ForumPost.find({ threadId: id }).sort({ createdAt: 1 }).lean()

  return {
    data: {
      thread,
      posts
    }
  }
})
