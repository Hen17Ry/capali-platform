import { pgTable, uuid, varchar, text, timestamp, pgEnum, boolean, integer } from 'drizzle-orm/pg-core'
import { users } from './users'

export const eventTypeEnum = pgEnum('event_type', ['france', 'benin', 'online'])
export const paymentStatusEnum = pgEnum('payment_status', ['pending', 'paid', 'free', 'failed'])

export const events = pgTable('events', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  coverImage: text('cover_image'),
  type: eventTypeEnum('type').notNull(),
  city: varchar('city', { length: 100 }),
  eventDate: timestamp('event_date').notNull(),
  registrationDeadline: timestamp('registration_deadline'),
  registrationUrl: varchar('registration_url', { length: 500 }), // Keep for external backwards compatibility
  
  // Nouveaux champs pour paiement et limites
  isPaid: boolean('is_paid').default(false).notNull(),
  priceEur: integer('price_eur').default(0), // Prix en centimes d'Euros
  isLimited: boolean('is_limited').default(false).notNull(),
  maxAttendees: integer('max_attendees'),
  
  createdBy: uuid('created_by').references(() => users.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const eventAttendees = pgTable('event_attendees', {
  id: uuid('id').primaryKey().defaultRandom(),
  eventId: uuid('event_id').notNull().references(() => events.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }), // Optionnel
  
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  profession: varchar('profession', { length: 255 }),
  phone: varchar('phone', { length: 50 }),
  
  // Suivi du paiement
  paymentStatus: paymentStatusEnum('payment_status').default('free').notNull(),
  paymentProvider: varchar('payment_provider', { length: 50 }), // 'stripe', 'kkiapay'
  transactionId: varchar('transaction_id', { length: 255 }), // Idempotence & Reference
  
  registeredAt: timestamp('registered_at').notNull().defaultNow(),
})