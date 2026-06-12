import 'dotenv/config'
import { Pool } from 'pg'
import { drizzle } from 'drizzle-orm/node-postgres'
import { pgTable, uuid, varchar, text, timestamp, pgEnum } from 'drizzle-orm/pg-core'
import { eq, and, lt } from 'drizzle-orm'
import { sendMentorshipExpiredEmail } from '../utils/mail'

const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
})

const mentorshipStatusEnum = pgEnum('mentorship_status', [
  'pending', 'accepted', 'refused', 'cancelled', 'closed',
])

const mentorshipRequests = pgTable('mentorship_requests', {
  id: uuid('id').primaryKey().defaultRandom(),
  menteeId: uuid('mentee_id').notNull(),
  mentorId: uuid('mentor_id').notNull(),
  status: mentorshipStatusEnum('status').notNull().default('pending'),
  expiresAt: timestamp('expires_at').notNull(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const db = drizzle(pool)

async function main() {
  const now = new Date()

  const expiredRequests = await db
    .select({ id: mentorshipRequests.id, menteeId: mentorshipRequests.menteeId, mentorId: mentorshipRequests.mentorId })
    .from(mentorshipRequests)
    .where(and(eq(mentorshipRequests.status, 'pending'), lt(mentorshipRequests.expiresAt, now)))

  if (expiredRequests.length === 0) {
    console.log('No expired mentorship requests found.')
    await pool.end()
    process.exit(0)
  }

  let sentCount = 0

  for (const request of expiredRequests) {
    const [mentor] = await db
      .select({ name: users.name, email: users.email })
      .from(users)
      .where(eq(users.id, request.mentorId))
      .limit(1)

    const [mentee] = await db
      .select({ name: users.name, email: users.email })
      .from(users)
      .where(eq(users.id, request.menteeId))
      .limit(1)

    if (!mentor || !mentee) {
      continue
    }

    await sendMentorshipExpiredEmail({
      mentorName: mentor.name,
      mentorEmail: mentor.email,
      menteeName: mentee.name,
      menteeEmail: mentee.email,
    })

    sentCount += 1
  }

  await db
    .update(mentorshipRequests)
    .set({ status: 'cancelled', updatedAt: new Date() })
    .where(and(eq(mentorshipRequests.status, 'pending'), lt(mentorshipRequests.expiresAt, now)))

  console.log(`Expired mentorship requests processed: ${expiredRequests.length}`)
  console.log(`Emails sent: ${sentCount}`)

  await pool.end()
  process.exit(0)
}

main().catch((error) => {
  console.error('Failed to expire mentorship requests:', error)
  process.exit(1)
})
