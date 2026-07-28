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
  arrivalDate: z.string().optional(),
  needsHelp: z.array(z.string()).optional(),
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

type RegisterData = z.infer<typeof registerSchema>

// --- Helpers pour découper la complexité ---

async function ensureEmailIsUnique(email: string) {
  const [existing] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email.toLowerCase()))
    .limit(1)

  if (existing) {
    throw createError({ statusCode: 409, statusMessage: 'Un compte existe déjà avec cet email.' })
  }
}

async function createNewUser(data: RegisterData, passwordHash: string) {
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
    throw createError({ statusCode: 500, statusMessage: 'Erreur lors de la création du compte.' })
  }
  return newUser
}

async function createMentorProfile(userId: any, data: RegisterData) {
  await db.insert(mentorProfiles).values({
    userId,
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

function dispatchEmails(user: any, status: string) {
  // L'ajout du .catch() corrige l'erreur "unhandled-promise" de l'audit
  sendWelcomeEmail({ name: user.name, email: user.email, status: user.status })
    .catch((err) => console.error("Échec de l'envoi de l'email de bienvenue:", err))

  if (status === 'mentor') {
    sendMentorApplicationEmail({ name: user.name, email: user.email })
      .catch((err) => console.error("Échec de l'envoi de l'email mentor:", err))
  }
}

// --- Contrôleur Principal ---

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  // 1. Validation
  const parsed = registerSchema.safeParse(body)
  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      statusMessage: parsed.error.errors[0]?.message || 'Données invalides.',
    })
  }
  const data = parsed.data

  // 2. Vérification et Préparation
  await ensureEmailIsUnique(data.email)
  const passwordHash = await hashUserPassword(data.password)

  // 3. Écriture en Base de données
  const newUser = await createNewUser(data, passwordHash)
  
  if (data.status === 'mentor') {
    await createMentorProfile(newUser.id, data)
  }

  // 4. Création de la Session
  const sessionId = await createSession({
    userId: newUser.id,
    email: newUser.email,
    name: newUser.name,
    status: newUser.status,
    isAdmin: newUser.isAdmin,
    avatarUrl: newUser.avatarUrl,
  })
  setSessionCookie(event, sessionId)

  // 5. Tâches asynchrones (fire-and-forget)
  dispatchEmails(newUser, data.status)

  return {
    data: {
      user: newUser,
    },
  }
})