import { db } from '~~/server/db'
import { resources, users } from '~~/server/db/schema'
import { emailService } from '~~/server/utils/email'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body.title || !body.content || !body.theme || !body.targetLevel) {
    throw createError({ statusCode: 400, message: 'Titre, contenu, thème et niveau cible sont obligatoires.' })
  }

  const [created] = await db
    .insert(resources)
    .values({
      title: body.title,
      excerpt: body.excerpt || null,
      content: body.content,
      coverImage: body.coverImage || null,
      type: body.type || 'article',
      theme: body.theme,
      targetCountry: body.targetCountry || 'both',
      targetLevel: body.targetLevel,
      authorId: event.context.adminUser?.id || null,
      isDraft: body.isDraft ?? true,
      videoId: body.videoId || null,
      sourceUrl: body.sourceUrl || null,
      sourcePlatform: body.sourcePlatform || null,
      publishedAt: body.isDraft === false ? new Date() : null,
    })
    .returning()

  // Si la ressource est publiée (non draft), on notifie les utilisateurs
  if (created && created.isDraft === false) {
    const allUsers = await db.select({ email: users.email }).from(users)
    const emails = allUsers.map(u => u.email).filter(Boolean) as string[]

    if (emails.length > 0) {
      const config = useRuntimeConfig()
      const resourceLink = `${config.public.appUrl || 'https://capali.org'}/resources/${created.id}`

      // On peut ajuster sendNewResourceAlert pour prendre un array d'emails, je le mettrai à jour dans emailService
      emailService.sendNewResourceAlert(emails, created.title, resourceLink)
        .catch(err => console.error("Erreur lors de l'envoi de l'alerte ressource:", err))
    }
  }

  return { data: created }
})
