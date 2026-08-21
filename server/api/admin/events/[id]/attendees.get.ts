import { db } from '~~/server/db'
import { eventAttendees, users, events } from '~~/server/db/schema'
import { eq, desc, sql } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const eventId = getRouterParam(event, 'id')
  if (!eventId) throw createError({ statusCode: 400, message: 'ID événement manquant' })

  // Vérifier si l'événement existe
  const [evt] = await db.select().from(events).where(eq(events.id, eventId))
  if (!evt) throw createError({ statusCode: 404, message: 'Événement introuvable' })

  // Récupérer les participants inscrits avec leurs informations (issues soit de la table utilisateur soit de la table attendees)
  const attendeesList = await db.select({
    id: eventAttendees.id,
    name: eventAttendees.name,
    email: eventAttendees.email,
    phone: eventAttendees.phone,
    profession: eventAttendees.profession,
    paymentStatus: eventAttendees.paymentStatus,
    paymentProvider: eventAttendees.paymentProvider,
    registeredAt: eventAttendees.registeredAt,
    userProfileImage: users.avatarUrl
  })
  .from(eventAttendees)
  .leftJoin(users, eq(eventAttendees.userId, users.id))
  .where(
    sql`${eventAttendees.eventId} = ${eventId} AND ${eventAttendees.paymentStatus} IN ('paid', 'free')`
  )
  .orderBy(desc(eventAttendees.registeredAt))

  return {
    data: {
      event: evt,
      attendees: attendeesList
    }
  }
})
