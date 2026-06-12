import { db } from '~~/server/db'
import { users } from '~~/server/db/schema'
import { inArray } from 'drizzle-orm'
import { connectMongo } from '~~/server/utils/mongo'
import { ForumPost } from '~~/server/models/ForumPost'
import { ForumThread } from '~~/server/models/ForumThread'

export default defineEventHandler(async () => {
  await connectMongo()

  const flaggedThreads = await (ForumThread as any).find({ 'reports.0': { $exists: true } }).lean()
  const flaggedPosts = await (ForumPost as any).find({ 'reports.0': { $exists: true } }).lean()

  const authorIds = [...new Set([...flaggedThreads.map((t: any) => t.authorId), ...flaggedPosts.map((p: any) => p.authorId)])]
  
  const authorsMap: Record<string, any> = {}
  if (authorIds.length > 0) {
    const authors = await db.select({ id: users.id, email: users.email }).from(users).where(inArray(users.id, authorIds))
    authors.forEach((a) => { authorsMap[a.id] = a.email })
  }

  const reports = []

  for (const t of flaggedThreads) {
    reports.push({
      id: t._id,
      type: 'thread',
      content: t.content,
      isFlagged: true,
      flaggedAt: t.reports[t.reports.length - 1].reportedAt,
      createdAt: t.createdAt,
      threadId: t._id,
      threadTitle: t.title,
      authorId: t.authorId,
      authorName: t.authorName,
      authorEmail: authorsMap[t.authorId] || 'Inconnu'
    })
  }

  for (const p of flaggedPosts) {
    const thread = await (ForumThread as any).findById(p.threadId).lean()
    reports.push({
      id: p._id,
      type: 'post',
      content: p.content,
      isFlagged: true,
      flaggedAt: p.reports[p.reports.length - 1].reportedAt,
      createdAt: p.createdAt,
      threadId: p.threadId,
      threadTitle: thread ? thread.title : 'Discussion inconnue',
      authorId: p.authorId,
      authorName: p.authorName,
      authorEmail: authorsMap[p.authorId] || 'Inconnu'
    })
  }

  reports.sort((a, b) => new Date(b.flaggedAt).getTime() - new Date(a.flaggedAt).getTime())

  return { data: reports }
})
