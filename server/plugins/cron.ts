import cron from 'node-cron'
import { db } from '~~/server/db'
import { events, eventAttendees, users } from '~~/server/db/schema'
import { and, gt, lt, eq } from 'drizzle-orm'
import { emailService } from '~~/server/utils/email'

export default defineNitroPlugin(() => {
  // Exécuter chaque heure à la minute 0 (0 * * * *)
  cron.schedule('0 * * * *', async () => {
    console.log('[Cron] Vérification des rappels d\'événements (48h avant)...')
    try {
      const now = new Date()
      // Fenêtre : entre 48h et 49h à partir de maintenant
      const startWindow = new Date(now.getTime() + 48 * 60 * 60 * 1000)
      const endWindow = new Date(now.getTime() + 49 * 60 * 60 * 1000)
      
      // Trouver les événements qui commencent dans cette fenêtre exacte
      const upcomingEvents = await db.select()
        .from(events)
        .where(
          and(
            gt(events.eventDate, startWindow),
            lt(events.eventDate, endWindow)
          )
        )
      
      if (upcomingEvents.length === 0) {
        return
      }
      
      for (const event of upcomingEvents) {
        // Trouver les participants
        const attendees = await db.select({
          email: users.email,
          name: users.name
        })
        .from(eventAttendees)
        .innerJoin(users, eq(eventAttendees.userId, users.id))
        .where(eq(eventAttendees.eventId, event.id))
        
        if (attendees.length > 0) {
          // Utilisation du champ "BCC" (copie cachée) pour envoyer en masse ou bien en boucle
          // On le fait en boucle ici pour éventuellement personnaliser le mail avec le nom de la personne si nécessaire plus tard
          for (const attendee of attendees) {
            await emailService.sendEventReminder(attendee.email, event.title, '48 heures')
          }
          console.log(`[Cron] Rappel envoyé pour l'événement "${event.title}" à ${attendees.length} participants.`)
        }
      }
    } catch (error) {
      console.error('[Cron] Erreur lors de l\'envoi des rappels:', error)
    }
  })
})
