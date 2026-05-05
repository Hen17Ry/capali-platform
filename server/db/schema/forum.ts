import { pgTable, uuid, varchar, text, boolean, timestamp, pgEnum } from 'drizzle-orm/pg-core'
import { users } from './users'
import { resourceThemeEnum } from './resources'

export const forumThreads = pgTable('forum_threads', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 255 }).notNull(),
  theme: resourceThemeEnum('theme').notNull(),
  authorId: uuid('author_id').notNull().references(() => users.id),
  isPinned: boolean('is_pinned').notNull().default(false),
  isClosed: boolean('is_closed').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const forumPosts = pgTable('forum_posts', {
  id: uuid('id').primaryKey().defaultRandom(),
  threadId: uuid('thread_id').notNull().references(() => forumThreads.id, { onDelete: 'cascade' }),
  authorId: uuid('author_id').notNull().references(() => users.id),
  content: text('content').notNull(),
  isFlagged: boolean('is_flagged').notNull().default(false),
  flaggedAt: timestamp('flagged_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})