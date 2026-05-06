import { deleteSession, clearSessionCookie, SESSION_COOKIE_NAME } from '~~/server/utils/session'

export default defineEventHandler(async (event) => {
  const sessionId = getCookie(event, SESSION_COOKIE_NAME)

  if (sessionId) {
    await deleteSession(sessionId)
  }

  clearSessionCookie(event)

  return { data: { message: 'Déconnecté avec succès.' } }
})
