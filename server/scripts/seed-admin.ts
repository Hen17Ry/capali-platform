import 'dotenv/config'
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import { pgTable, uuid, varchar, boolean, timestamp, pgEnum } from 'drizzle-orm/pg-core'
import { eq } from 'drizzle-orm'
import bcrypt from 'bcryptjs'

// ── Inline schema (avoid Nuxt alias resolution issues with tsx) ──
const userStatusEnum = pgEnum('user_status', ['predeparture', 'newcomer', 'installed', 'mentor'])

const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }),
  name: varchar('name', { length: 100 }).notNull(),
  status: userStatusEnum('status').notNull().default('predeparture'),
  isAdmin: boolean('is_admin').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  deletedAt: timestamp('deleted_at'),
})

// ── DB connection ──
const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const db = drizzle(pool)

/**
 * Seed script: Create a dev admin user if none exists.
 * Run with: npm run db:seed
 */
async function seedAdmin() {
  console.log('🌱 Checking for admin user...')
  console.log('   DATABASE_URL:', process.env.DATABASE_URL ? '✅ loaded' : '❌ missing')

  const existing = await db
    .select({ id: users.id, email: users.email })
    .from(users)
    .where(eq(users.isAdmin, true))
    .limit(1)

  if (existing.length > 0) {
    const found = existing[0]!
    console.log(`✅ Admin already exists: ${found.email} (${found.id})`)
    console.log('\n📋 Credentials:')
    console.log('   Email: ' + found.email)
    console.log('   Password: CapAli@2026')
    return
  }

  const passwordHash = await bcrypt.hash('CapAli@2026', 12)

  const result = await db
    .insert(users)
    .values({
      email: 'admin@capali.org',
      name: 'Admin CAP ALI',
      passwordHash,
      isAdmin: true,
      status: 'installed',
    })
    .returning({ id: users.id, email: users.email })

  const admin = result[0]!
  console.log(`🎉 Admin created: ${admin.email} (${admin.id})`)
  console.log('\n📋 Credentials:')
  console.log('   Email: admin@capali.org')
  console.log('   Password: CapAli@2026')
  console.log('\n🔗 Login at: http://localhost:3000/auth/login')
}

seedAdmin()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ Seed failed:', err)
    process.exit(1)
  })