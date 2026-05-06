import { z } from 'zod'
import { db } from '~~/server/db'
import { users, mentorProfiles } from '~~/server/db/schema'
import { eq } from 'drizzle-orm'
import { hashUserPassword } from '~~/server/utils/password'
import { createSession, setSessionCookie } from '~~/server/utils/session'
import { sendMentorApplicationEmail, sendWelcomeEmail } from '~~/server/utils/mail'

const registerSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères.').max(100),
  email: z.string().email('Email invalide.'),
  password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères.'),
  status: z.enum(['predeparture', 'newcomer', 'installed', 'mentor']).default('predeparture'),
  countryOrigin: z.string().max(100).optional(),
  cityCurrentFr: z.string().max(100).optional(),
  domain: z.string().max(100).optional(),
  // Student-specific
  arrivalDate: z.string().optional(),          // When they arrived / plan to arrive
  needsHelp: z.array(z.string()).optional(),   // Topics they need help with
  // Mentor-specific
  helpTopics: z.array(z.string()).optional(),
  motivation: z.string().max(1000).optional(),
  availableHoursMonth: z.number().min(1).max(40).optional(),
  maxMentees: z.number().min(1).max(10).optional(),
  acceptsRemote: z.boolean().optional(),
  acceptsInperson: z.boolean().optional(),
  yearsInFrance: z.number().min(0).max(50).optional(),
  languages: z.array(z.string()).optional(),
  linkedinUrl: z.string().url().optional().or(z.literal('')),
  presentation: z.string().max(500).optional(),
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  // Validate input
  const parsed = registerSchema.safeParse(body)
  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      statusMessage: parsed.error.errors[0]?.message || 'Données invalides.',
    })
  }

  const data = parsed.data

  // Check if email already exists
  const [existing] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, data.email.toLowerCase()))
    .limit(1)

  if (existing) {
    throw createError({
      statusCode: 409,
      statusMessage: 'Un compte existe déjà avec cet email.',
    })
  }

  // Hash password & create user
  const passwordHash = await hashUserPassword(data.password)

  const [newUser] = await db
    .insert(users)
    .values({
      name: data.name,
      email: data.email.toLowerCase(),
      passwordHash,
      status: data.status,
      countryOrigin: data.countryOrigin || null,
      cityCurrentFr: data.cityCurrentFr || null,
      domain: data.domain || null,
      bio: data.needsHelp?.length ? `Besoin d'aide : ${data.needsHelp.join(', ')}` : null,
      isAdmin: false,
    })
    .returning({
      id: users.id,
      name: users.name,
      email: users.email,
      status: users.status,
      isAdmin: users.isAdmin,
      avatarUrl: users.avatarUrl,
    })

  if (!newUser) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur lors de la création du compte.',
    })
  }

  // If mentor, create mentor profile with enriched data
  if (data.status === 'mentor') {
    await db.insert(mentorProfiles).values({
      userId: newUser.id,
      cityInFrance: data.cityCurrentFr || null,
      availableHoursMonth: data.availableHoursMonth ?? 4,
      maxMentees: data.maxMentees ?? 2,
      acceptsRemote: data.acceptsRemote ?? true,
      acceptsInperson: data.acceptsInperson ?? false,
      helpTopics: data.helpTopics ?? [],
      motivation: data.motivation || null,
      yearsInFrance: data.yearsInFrance ?? null,
      languages: data.languages ?? ['français'],
      linkedinUrl: data.linkedinUrl || null,
      presentation: data.presentation || null,
      isValidated: false,
    })
  }

  // Create session in Redis & set HTTP-only cookie
  const sessionId = await createSession({
    userId: newUser.id,
    email: newUser.email,
    name: newUser.name,
    status: newUser.status,
    isAdmin: newUser.isAdmin,
    avatarUrl: newUser.avatarUrl,
  })

  setSessionCookie(event, sessionId)

  // ── Send emails (fire-and-forget — don't block the response) ──
  sendWelcomeEmail({ name: newUser.name, email: newUser.email, status: newUser.status })

  if (data.status === 'mentor') {
    sendMentorApplicationEmail({ name: newUser.name, email: newUser.email })
  }

  return {
    data: {
      user: newUser,
    },
  }
})
