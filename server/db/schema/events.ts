import { pgTable, uuid, varchar, text, timestamp, pgEnum } from 'drizzle-orm/pg-core'
import { users } from './users'

export const eventTypeEnum = pgEnum('event_type', ['france', 'benin', 'online'])

export const events = pgTable('events', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  type: eventTypeEnum('type').notNull(),
  city: varchar('city', { length: 100 }),
  eventDate: timestamp('event_date').notNull(),
  registrationUrl: varchar('registration_url', { length: 500 }),
  createdBy: uuid('created_by').references(() => users.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const eventAttendees = pgTable('event_attendees', {
  eventId: uuid('event_id').notNull().references(() => events.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  registeredAt: timestamp('registered_at').notNull().defaultNow(),
})