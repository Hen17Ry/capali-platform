import { db } from '~~/server/db'
import { galleries } from '~~/server/db/schema'
import { eq } from 'drizzle-orm'
import { defineEventHandler, getRouterParam, createError } from 'h3'

export default defineEventHandler(async (event) => {
  const eventId = getRouterParam(event, 'eventId')
  
  if (!eventId) {
    throw createError({ statusCode: 400, message: 'Event ID is required' })
  }

  const [galleryData] = await db.select().from(galleries).where(eq(galleries.eventId, eventId))

  if (!galleryData) {
    return { data: null } // Ne pas lever d'erreur 404, renvoyer simplement null si aucune galerie n'existe
  }

  return { data: galleryData }
})
