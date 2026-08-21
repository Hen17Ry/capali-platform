import { db } from '~~/server/db'
import { users } from '~~/server/db/schema'
import { eq, and, gt } from 'drizzle-orm'
import { checkRateLimit } from '~~/server/utils/rateLimit'
import bcrypt from 'bcryptjs'

export default defineEventHandler(async (event) => {
  // 5 requests per minute to prevent brute-forcing the token
  await checkRateLimit(event, 'reset-password', { windowSeconds: 60, maxRequests: 5 })

  const body = await readBody(event)
  const { token, newPassword } = body

  if (!token || !newPassword) {
    throw createError({ statusCode: 400, message: 'Token et nouveau mot de passe requis' })
  }

  if (newPassword.length < 8) {
    throw createError({ statusCode: 400, message: 'Le mot de passe doit faire au moins 8 caractères' })
  }

  try {
    // Chercher l'utilisateur avec ce token et dont la date d'expiration est > maintenant
    const [user] = await db.select()
      .from(users)
      .where(
        and(
          eq(users.resetPasswordToken, token),
          gt(users.resetPasswordExpires, new Date())
        )
      )

    if (!user) {
      throw createError({ statusCode: 400, message: 'Lien de réinitialisation invalide ou expiré' })
    }

    // Hasher le nouveau mot de passe
    const passwordHash = await bcrypt.hash(newPassword, 10)

    // Mettre à jour l'utilisateur
    await db.update(users)
      .set({ 
        passwordHash,
        resetPasswordToken: null, // On invalide le token
        resetPasswordExpires: null
      })
      .where(eq(users.id, user.id))

    return { 
      success: true, 
      message: "Mot de passe réinitialisé avec succès" 
    }
  } catch (error: any) {
    console.error('Erreur lors de la réinitialisation:', error)
    if (error.statusCode) throw error
    throw createError({
      statusCode: 500,
      message: 'Erreur serveur lors de la réinitialisation'
    })
  }
})
