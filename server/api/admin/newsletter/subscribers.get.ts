import { db } from '~~/server/db'
import { users, newsletterSubscribers } from '~~/server/db/schema'
import { eq, isNull, and } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  // Get users who are not admin
  const platformUsers = await db
    .select({
      id: users.id,
      firstName: users.name,
      email: users.email,
      source: users.status,
      createdAt: users.createdAt
    })
    .from(users)
    .where(and(eq(users.isAdmin, false), isNull(users.deletedAt)))

  // Get external newsletter subscribers
  const externalSubscribers = await db
    .select({
      id: newsletterSubscribers.id,
      firstName: newsletterSubscribers.firstName,
      lastName: newsletterSubscribers.lastName,
      email: newsletterSubscribers.email,
      source: newsletterSubscribers.source,
      createdAt: newsletterSubscribers.createdAt
    })
    .from(newsletterSubscribers)

  // Merge the lists and deduplicate by email
  const merged = [...platformUsers, ...externalSubscribers]
  
  const uniqueSubscribers = Array.from(new Map(merged.map(item => [item.email, item])).values())
  
  // Sort by createdAt descending
  uniqueSubscribers.sort((a, b) => {
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0
    return dateB - dateA
  })

  return uniqueSubscribers
})
