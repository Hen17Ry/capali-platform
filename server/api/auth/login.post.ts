import { z } from 'zod'
import { db } from '~~/server/db'
import { users } from '~~/server/db/schema'
import { eq, isNull, and } from 'drizzle-orm'
import { verifyPassword } from '~~/server/utils/password'
import { createSession, setSessionCookie } from '~~/server/utils/session'

const loginSchema = z.object({
  email: z.string().email('Email invalide.'),
  password: z.string().min(1, 'Mot de passe requis.'),
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const parsed = loginSchema.safeParse(body)
  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      statusMessage: parsed.error.errors[0]?.message || 'Données invalides.',
    })
  }

  const { email, password } = parsed.data

  // Find user by email (non-deleted)
  const [user] = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      passwordHash: users.passwordHash,
      status: users.status,
      isAdmin: users.isAdmin,
      avatarUrl: users.avatarUrl,
    })
    .from(users)
    .where(and(eq(users.email, email.toLowerCase()), isNull(users.deletedAt)))
    .limit(1)

  if (!user || !user.passwordHash) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Email ou mot de passe incorrect.',
    })
  }

  // Verify password
  const isValid = await verifyPassword(password, user.passwordHash)
  if (!isValid) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Email ou mot de passe incorrect.',
    })
  }

  // Create session in Redis & set HTTP-only cookie
  const sessionId = await createSession({
    userId: user.id,
    email: user.email,
    name: user.name,
    status: user.status,
    isAdmin: user.isAdmin,
    avatarUrl: user.avatarUrl,
  })

  setSessionCookie(event, sessionId)

  return {
    data: {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        status: user.status,
        isAdmin: user.isAdmin,
        avatarUrl: user.avatarUrl,
      },
    },
  }
})
