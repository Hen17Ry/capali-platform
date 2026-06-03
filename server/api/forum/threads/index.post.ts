import { z } from 'zod'
import { ForumThread } from '~~/server/models/ForumThread'
import { connectMongo } from '~~/server/utils/mongo'
import { getSessionFromEvent } from '~~/server/utils/session'
import { db } from '~~/server/db'
import { users } from '~~/server/db/schema'
import { eq } from 'drizzle-orm'

const createThreadSchema = z.object({
  title: z.string().min(5).max(150),
  content: z.string().min(10),
  category: z.string(),
  tags: z.array(z.string()).optional(),
})

export default defineEventHandler(async (event) => {
  await connectMongo()

  // Authentication via Session
  const session = await getSessionFromEvent(event)
  if (!session) {
    throw createError({ statusCode: 401, message: 'Non authentifié' })
  }

  const body = await readBody(event)
  const parsed = createThreadSchema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, message: 'Données invalides' })
  }

  const { title, content, category, tags } = parsed.data

  // Fetch user name from DB or token

  const [user] = await db.select({ name: users.name }).from(users).where(eq(users.id, session.userId)).limit(1)
  
  if (!user) {
    throw createError({ statusCode: 404, message: 'Utilisateur introuvable' })
  }

  const thread = new ForumThread({
    title,
    content,
    authorId: session.userId,
    authorName: user.name,
    category,
    tags: tags || [],
  })

  await thread.save()

  return { data: thread }
})
