import { db } from '~~/server/db'
import { mentorshipRequests } from '~~/server/db/schema'
import { eq, and } from 'drizzle-orm'
import { getSessionFromEvent } from '~~/server/utils/session'

export default defineEventHandler(async (event) => {
  const session = await getSessionFromEvent(event)
  if (!session || session.status !== 'mentor') {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, message: 'ID missing' })

  const body = await readBody(event)
  const { status, mentorNote } = body

  if (!['accepted', 'refused'].includes(status)) {
    throw createError({ statusCode: 400, message: 'Invalid status' })
  }

  // Ensure the request belongs to the current mentor
  const [existingRequest] = await db
    .select()
    .from(mentorshipRequests)
    .where(
      and(
        eq(mentorshipRequests.id, id),
        eq(mentorshipRequests.mentorId, session.userId)
      )
    )

  if (!existingRequest) {
    throw createError({ statusCode: 404, message: 'Request not found' })
  }

  if (existingRequest.status !== 'pending') {
    throw createError({ statusCode: 400, message: 'Request is no longer pending' })
  }

  // Update status
  await db
    .update(mentorshipRequests)
    .set({
      status,
      mentorNote: mentorNote || null,
      updatedAt: new Date(),
    })
    .where(eq(mentorshipRequests.id, id))

  return { success: true }
})
