import { db } from '~~/server/db'
import { forumPosts, users } from '~~/server/db/schema'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'ID manquant.' })

  const body = await readBody(event)

  if (body.action === 'dismiss') {
    // Unflag the post
    await db.update(forumPosts).set({ isFlagged: false, flaggedAt: null }).where(eq(forumPosts.id, id))
    return { data: null, message: 'Signalement ignoré.' }
  }

  if (body.action === 'delete_post') {
    // Delete the flagged post
    await db.delete(forumPosts).where(eq(forumPosts.id, id))
    return { data: null, message: 'Post supprimé.' }
  }

  if (body.action === 'suspend_user') {
    // Get the post author and suspend them
    const [post] = await db.select({ authorId: forumPosts.authorId }).from(forumPosts).where(eq(forumPosts.id, id))
    if (post) {
      await db.update(users).set({ deletedAt: new Date() }).where(eq(users.id, post.authorId))
      await db.delete(forumPosts).where(eq(forumPosts.id, id))
    }
    return { data: null, message: 'Utilisateur suspendu et post supprimé.' }
  }

  throw createError({ statusCode: 400, statusMessage: 'Action invalide. Utilisez: dismiss, delete_post, suspend_user.' })
})
