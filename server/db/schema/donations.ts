import { pgTable, uuid, varchar, integer, timestamp, pgEnum } from 'drizzle-orm/pg-core'

export const donationStatusEnum = pgEnum('donation_status', [
  'pending',
  'completed',
  'failed',
])

export const donationMethodEnum = pgEnum('donation_method', [
  'stripe',
  'kkiapay',
])

export const donations = pgTable('donations', {
  id: uuid('id').primaryKey().defaultRandom(),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  amount: integer('amount').notNull(), // amount in base unit (e.g., Euros)
  method: donationMethodEnum('method').notNull().default('stripe'),
  status: donationStatusEnum('status').notNull().default('pending'),
  transactionId: varchar('transaction_id', { length: 255 }), // Stripe Session ID or Kkiapay transaction ID
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})
