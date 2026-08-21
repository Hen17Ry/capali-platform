import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core'
import { events } from './events'

export const galleries = pgTable('galleries', {
  id: uuid('id').primaryKey().defaultRandom(),
  eventId: uuid('event_id').references(() => events.id, { onDelete: 'cascade' }).notNull(),
  description: text('description'),
  images: text('images').array().notNull().default([]),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})
