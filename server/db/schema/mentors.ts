import { pgTable, uuid, varchar, integer, boolean, timestamp, text, pgEnum } from 'drizzle-orm/pg-core'
import { users } from './users'

export const mentorProfiles = pgTable('mentor_profiles', {
  userId: uuid('user_id').primaryKey().references(() => users.id, { onDelete: 'cascade' }),
  cityInFrance: varchar('city_in_france', { length: 100 }),
  availableHoursMonth: integer('available_hours_month'),
  maxMentees: integer('max_mentees').notNull().default(2),
  acceptsRemote: boolean('accepts_remote').notNull().default(true),
  acceptsInperson: boolean('accepts_inperson').notNull().default(false),
  presentation: text('presentation'),
  isValidated: boolean('is_validated').notNull().default(false),
  isPaused: boolean('is_paused').notNull().default(false),
  validatedAt: timestamp('validated_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const mentorshipStatusEnum = pgEnum('mentorship_status', [
  'pending', 'accepted', 'refused', 'cancelled', 'closed',
])


export const mentorshipRequests = pgTable('mentorship_requests', {
  id: uuid('id').primaryKey().defaultRandom(),
  menteeId: uuid('mentee_id').notNull().references(() => users.id),
  mentorId: uuid('mentor_id').notNull().references(() => users.id),
  status: mentorshipStatusEnum('status').notNull().default('pending'),
  message: text('message').notNull(),
  mentorNote: text('mentor_note'),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})