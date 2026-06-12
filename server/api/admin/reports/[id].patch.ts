import { db } from '~~/server/db'
import { users } from '~~/server/db/schema'
import { eq } from 'drizzle-orm'
import { connectMongo } from '~~/server/utils/mongo'
import { ForumPost } from '~~/server/models/ForumPost'
import { ForumThread } from '~~/server/models/ForumThread'
import { deleteAllUserSessions } from '~~/server/utils/session'

export default defineEventHandler(async (event) => {
  await connectMongo()
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'ID manquant.' })

  const body = await readBody(event)

  if (body.action === 'dismiss') {
    await (ForumPost as any).findByIdAndUpdate(id, { $set: { reports: [] } })
    await (ForumThread as any).findByIdAndUpdate(id, { $set: { reports: [] } })
    return { data: null, message: 'Signalement ignoré.' }
  }

  if (body.action === 'delete_post') {
    const p = await (ForumPost as any).findByIdAndDelete(id)
    const t = await (ForumThread as any).findByIdAndDelete(id)
    if (p) await (ForumThread as any).findByIdAndUpdate(p.threadId, { $inc: { replyCount: -1 } })
    if (t) await (ForumPost as any).deleteMany({ threadId: id })
    return { data: null, message: 'Contenu supprimé.' }
  }

  if (body.action === 'suspend_user') {
    let authorId = null
    const post = await (ForumPost as any).findByIdAndDelete(id)
    if (post) { authorId = post.authorId; await (ForumThread as any).findByIdAndUpdate(post.threadId, { $inc: { replyCount: -1 } }) }
    const thread = await (ForumThread as any).findByIdAndDelete(id)
    if (thread) { authorId = thread.authorId; await (ForumPost as any).deleteMany({ threadId: id }) }

    if (authorId) {
      await db.update(users).set({ deletedAt: new Date() }).where(eq(users.id, authorId))
      await deleteAllUserSessions(authorId)
    }
    return { data: null, message: 'Utilisateur suspendu et contenu supprimé.' }
  }

  throw createError({ statusCode: 400, statusMessage: 'Action invalide.' })
})
