import { z } from 'zod'
import { ForumThread } from '~~/server/models/ForumThread'
import { ForumPost } from '~~/server/models/ForumPost'
import { connectMongo } from '~~/server/utils/mongo'
import { getSessionFromEvent } from '~~/server/utils/session'
import { db } from '~~/server/db'
import { users } from '~~/server/db/schema'
import { eq } from 'drizzle-orm'

const postSchema = z.object({
  content: z.string().min(2, "Le message est trop court"),
})

export default defineEventHandler(async (event) => {
  await connectMongo()
  const threadId = getRouterParam(event, 'id')
  
  if (!threadId) throw createError({ statusCode: 400, message: 'ID discussion manquant' })

  // Auth via Session
  const session = await getSessionFromEvent(event)
  if (!session) throw createError({ statusCode: 401, message: 'Non authentifié' })
  
  const body = await readBody(event)
  const parsed = postSchema.safeParse(body)
  if (!parsed.success) throw createError({ statusCode: 400, message: parsed.error?.errors?.[0]?.message || 'Données invalides' })

  const [user] = await db.select({ name: users.name }).from(users).where(eq(users.id, session.userId)).limit(1)
  if (!user) throw createError({ statusCode: 404, message: 'Utilisateur introuvable' })

  const thread = await (ForumThread as any).findById(threadId)
  if (!thread) throw createError({ statusCode: 404, message: 'Discussion introuvable' })
  if (thread.isClosed) throw createError({ statusCode: 403, message: 'Cette discussion est fermée' })

  const post = new ForumPost({
    threadId,
    content: parsed.data.content,
    authorId: session.userId,
    authorName: user.name,
  })

  await post.save()

  // Update thread stats
  thread.replyCount += 1
  thread.lastActivityAt = new Date()
  await thread.save()

  // ── Send notification emails (fire-and-forget) ──
  try {
    const { emailService } = await import('~~/server/utils/email')
    
    // 1. Notifier l'auteur du thread s'il est différent de l'auteur de la réponse
    if (thread.authorId !== session.userId) {
      const [threadAuthor] = await db
        .select({ email: users.email })
        .from(users)
        .where(eq(users.id, thread.authorId))
        .limit(1)

      if (threadAuthor) {
        emailService.sendForumReply(threadAuthor.email, thread.title, user.name)
          .catch(err => console.error("Erreur email forum reply:", err))
      }
    }

    // 2. Extraire les mentions (@username) et notifier
    const mentionRegex = /@([a-zA-Z0-9_]+)/g
    const matches = Array.from(parsed.data.content.matchAll(mentionRegex))
    const mentions = matches.map((m: any) => m[1]).filter(Boolean) as string[]

    if (mentions.length > 0) {
      // Trouver les emails des utilisateurs mentionnés (on limite à 5 par précaution)
      for (const mention of mentions.slice(0, 5)) {
        // Supposons que "name" ou "username" corresponde à la mention
        // Ici on cherche par nom pour simplifier (la logique exacte dépend de ton choix d'identifiant)
        const [mentionedUser] = await db
          .select({ email: users.email })
          .from(users)
          .where(eq(users.name, mention)) // ou .ilike(users.name, mention) etc.
          .limit(1)

        if (mentionedUser && mentionedUser.email) {
          emailService.sendForumMention(mentionedUser.email, thread.title, user.name)
            .catch(err => console.error("Erreur email forum mention:", err))
        }
      }
    }
  } catch (err) {
    console.error("Erreur préparation emails forum:", err)
  }

  return { data: post }
})
