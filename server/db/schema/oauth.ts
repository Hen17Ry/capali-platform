import { pgTable, uuid, varchar, text, timestamp } from 'drizzle-orm/pg-core'
import { users } from './users'

export const oauthAccounts = pgTable('oauth_accounts', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  provider: varchar('provider', { length: 50 }).notNull(),
  providerAccountId: varchar('provider_account_id', { length: 255 }).notNull(),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})