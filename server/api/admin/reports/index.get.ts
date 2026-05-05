import { db } from '~~/server/db'
import { forumPosts, forumThreads, users } from '~~/server/db/schema'
import { eq, sql } from 'drizzle-orm'

export default defineEventHandler(async () => {
  const rows = await db
    .select({
      id: forumPosts.id,
      content: forumPosts.content,
      isFlagged: forumPosts.isFlagged,
      flaggedAt: forumPosts.flaggedAt,
      createdAt: forumPosts.createdAt,
      threadId: forumPosts.threadId,
      threadTitle: forumThreads.title,
      authorId: forumPosts.authorId,
      authorName: users.name,
      authorEmail: users.email,
    })
    .from(forumPosts)
    .innerJoin(forumThreads, eq(forumPosts.threadId, forumThreads.id))
    .innerJoin(users, eq(forumPosts.authorId, users.id))
    .where(eq(forumPosts.isFlagged, true))
    .orderBy(sql`${forumPosts.flaggedAt} DESC`)

  return { data: rows }
})
