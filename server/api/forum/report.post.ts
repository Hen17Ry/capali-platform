import { z } from 'zod'
import { ForumThread } from '~~/server/models/ForumThread'
import { ForumPost } from '~~/server/models/ForumPost'
import { connectMongo } from '~~/server/utils/mongo'
import { getSessionFromEvent } from '~~/server/utils/session'

const reportSchema = z.object({
  targetType: z.enum(['thread', 'post']),
  targetId: z.string(),
  reason: z.string().min(5),
})

export default defineEventHandler(async (event) => {
  await connectMongo()

  const session = await getSessionFromEvent(event)
  if (!session) throw createError({ statusCode: 401, message: 'Non authentifié' })

  const body = await readBody(event)
  const parsed = reportSchema.safeParse(body)
  if (!parsed.success) throw createError({ statusCode: 400, message: 'Données invalides' })

  const { targetType, targetId, reason } = parsed.data
  const report = { reporterId: session.userId, reason, reportedAt: new Date() }

  if (targetType === 'thread') {
    const thread = await (ForumThread as any).findById(targetId)
    if (!thread) throw createError({ statusCode: 404, message: 'Discussion introuvable' })
    thread.reports.push(report)
    await thread.save()
  } else {
    const post = await (ForumPost as any).findById(targetId)
    if (!post) throw createError({ statusCode: 404, message: 'Réponse introuvable' })
    post.reports.push(report)
    await post.save()
  }

  return { success: true, message: 'Signalement envoyé à l\'administrateur' }
})
