import 'dotenv/config'
import { db } from '../db/index'
import { eq, like } from 'drizzle-orm'
import { events, resources, users } from '../db/schema'

async function main() {
  console.log('Replacing old localhost URLs with /s3/ proxy URLs...')
  
  // Events
  const allEvents = await db.select().from(events).where(like(events.coverImage, 'http://localhost:9000%'))
  for (const ev of allEvents) {
    if (ev.coverImage && ev.coverImage.startsWith('http://localhost:9000/capali/')) {
      const newUrl = ev.coverImage.replace('http://localhost:9000/capali/', '/s3/')
      await db.update(events).set({ coverImage: newUrl }).where(eq(events.id, ev.id))
      console.log(`Updated event ${ev.id}: ${newUrl}`)
    }
  }

  // Resources
  const allResources = await db.select().from(resources).where(like(resources.coverImage, 'http://localhost:9000%'))
  for (const res of allResources) {
    if (res.coverImage && res.coverImage.startsWith('http://localhost:9000/capali/')) {
      const newUrl = res.coverImage.replace('http://localhost:9000/capali/', '/s3/')
      await db.update(resources).set({ coverImage: newUrl }).where(eq(resources.id, res.id))
      console.log(`Updated resource ${res.id}: ${newUrl}`)
    }
  }

  // Users
  const allUsers = await db.select().from(users).where(like(users.avatarUrl, 'http://localhost:9000%'))
  for (const u of allUsers) {
    if (u.avatarUrl && u.avatarUrl.startsWith('http://localhost:9000/capali/')) {
      const newUrl = u.avatarUrl.replace('http://localhost:9000/capali/', '/s3/')
      await db.update(users).set({ avatarUrl: newUrl }).where(eq(users.id, u.id))
      console.log(`Updated user ${u.id}: ${newUrl}`)
    }
  }

  console.log('Done.')
  process.exit(0)
}

main().catch(console.error)
