import { pgTable, uuid, varchar, boolean, timestamp, pgEnum } from 'drizzle-orm/pg-core'

export const userStatusEnum = pgEnum('user_status', [
  'predeparture',
  'newcomer',
  'installed',
  'mentor',
])

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }),
  name: varchar('name', { length: 100 }).notNull(),
  avatarUrl: varchar('avatar_url', { length: 500 }),
  countryOrigin: varchar('country_origin', { length: 100 }),
  cityCurrentFr: varchar('city_current_fr', { length: 100 }),
  status: userStatusEnum('status').notNull().default('predeparture'),
  domain: varchar('domain', { length: 100 }),
  bio: varchar('bio', { length: 280 }),
  isAdmin: boolean('is_admin').notNull().default(false),
  emailVerifiedAt: timestamp('email_verified_at'),
  notifEmail: boolean('notif_email').notNull().default(true),
  notifSummary: boolean('notif_summary').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  deletedAt: timestamp('deleted_at'),
})

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert