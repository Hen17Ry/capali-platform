import { db } from '~~/server/db'
import { users } from '~~/server/db/schema'
import { eq } from 'drizzle-orm'
import { emailService } from '~~/server/utils/email'
import { checkRateLimit } from '~~/server/utils/rateLimit'
import crypto from 'crypto'

export default defineEventHandler(async (event) => {
  // 3 requests per hour per IP for password reset to prevent spam
  await checkRateLimit(event, 'forgot-password', { windowSeconds: 3600, maxRequests: 3 })

  const body = await readBody(event)
  const { email } = body

  if (!email) {
    throw createError({ statusCode: 400, message: 'Email requis' })
  }

  try {
    const [user] = await db.select().from(users).where(eq(users.email, email))

    if (!user) {
      // Pour des raisons de sécurité, ne pas indiquer que l'email n'existe pas,
      // on renvoie simplement un succès générique
      return { success: true, message: "Si cette adresse correspond à un compte, un email a été envoyé." }
    }

    // Générer un token unique de 64 caractères
    const resetToken = crypto.randomBytes(32).toString('hex')
    
    // Date d'expiration (1 heure)
    const expires = new Date()
    expires.setHours(expires.getHours() + 1)

    // Enregistrer le token en base
    await db.update(users)
      .set({ 
        resetPasswordToken: resetToken, 
        resetPasswordExpires: expires 
      })
      .where(eq(users.id, user.id))

    // Construire le lien de réinitialisation
    // Utiliser la variable d'environnement ou le host de la requête
    const host = getRequestHeader(event, 'host')
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'
    const resetLink = `${protocol}://${host}/auth/reset-password?token=${resetToken}`

    // Envoyer l'email
    await emailService.sendPasswordReset(user.email, user.name, resetLink)

    return { 
      success: true, 
      message: "Si cette adresse correspond à un compte, un email a été envoyé." 
    }
  } catch (error: any) {
    console.error('Erreur lors de la demande de réinitialisation:', error)
    throw createError({
      statusCode: 500,
      message: 'Erreur serveur lors de la demande de réinitialisation'
    })
  }
})
