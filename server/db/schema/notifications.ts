import { pgTable, uuid, varchar, jsonb, boolean, timestamp, pgEnum } from 'drizzle-orm/pg-core'
import { users } from './users'

export const notifTypeEnum = pgEnum('notif_type', [
  'mentorship_request', 'mentorship_accepted', 'mentorship_refused',
  'forum_reply', 'new_event', 'admin_message',
])

export const notifications = pgTable('notifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: notifTypeEnum('type').notNull(),
  payload: jsonb('payload'),
  isRead: boolean('is_read').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})