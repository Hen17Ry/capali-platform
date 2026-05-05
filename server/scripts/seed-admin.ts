import { eq } from 'drizzle-orm'
import 'dotenv/config'
import { db } from '../db'
import { users } from '../db/schema'

/**
 * Seed script: Create a dev admin user if none exists.
 *
 * Run with: npx tsx server/scripts/seed-admin.ts
 */
async function seedAdmin() {
  console.log('🌱 Checking for admin user...')

  const [existing] = await db
    .select({ id: users.id, email: users.email })
    .from(users)
    .where(eq(users.isAdmin, true))
    .limit(1)

  if (existing) {
    console.log(`✅ Admin already exists: ${existing.email} (${existing.id})`)
    return
  }

  const [admin] = await db
    .insert(users)
    .values({
      email: 'admin@capali.org',
      name: 'Admin',
      passwordHash: null, // Dev only — no password needed
      isAdmin: true,
      status: 'installed',
    })
    .returning({ id: users.id, email: users.email })

  if (!admin) {
    throw new Error('Admin user creation failed: no user returned from database.')
  }

  console.log(`🎉 Admin created: ${admin.email} (${admin.id})`)
  console.log('\n📋 You can now access /admin in your browser.')
}

seedAdmin()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ Seed failed:', err)
    process.exit(1)
  })