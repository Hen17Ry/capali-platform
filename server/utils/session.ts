import crypto from 'node:crypto'
import { getRedis } from './redis'

const SESSION_PREFIX = 'session:'
const SESSION_TTL = 7 * 24 * 60 * 60 // 7 days in seconds
export const SESSION_COOKIE_NAME = 'capali_session'

export interface SessionData {
  userId: string
  email: string
  name: string
  status: string
  isAdmin: boolean
  avatarUrl: string | null
}

/**
 * Create a new session in Redis and return the session ID
 */
export async function createSession(data: SessionData): Promise<string> {
  const redis = getRedis()
  const sessionId = crypto.randomUUID()
  const key = SESSION_PREFIX + sessionId

  await redis.set(key, JSON.stringify(data), 'EX', SESSION_TTL)

  return sessionId
}

/**
 * Get session data from Redis by session ID
 */
export async function getRedisSession(sessionId: string): Promise<SessionData | null> {
  const redis = getRedis()
  const raw = await redis.get(SESSION_PREFIX + sessionId)
  if (!raw) return null

  try {
    return JSON.parse(raw) as SessionData
  } catch {
    return null
  }
}

/**
 * Delete a session from Redis
 */
export async function deleteSession(sessionId: string): Promise<void> {
  const redis = getRedis()
  await redis.del(SESSION_PREFIX + sessionId)
}

/**
 * Refresh session TTL (extend expiry on activity)
 */
export async function refreshSession(sessionId: string): Promise<void> {
  const redis = getRedis()
  await redis.expire(SESSION_PREFIX + sessionId, SESSION_TTL)
}

/**
 * Update session data (e.g. after profile change)
 */
export async function updateRedisSession(sessionId: string, data: Partial<SessionData>): Promise<void> {
  const existing = await getRedisSession(sessionId)
  if (!existing) return

  const redis = getRedis()
  const updated = { ...existing, ...data }
  const ttl = await redis.ttl(SESSION_PREFIX + sessionId)

  await redis.set(SESSION_PREFIX + sessionId, JSON.stringify(updated), 'EX', ttl > 0 ? ttl : SESSION_TTL)
}

/**
 * Delete all sessions for a given user (e.g. on password change)
 */
export async function deleteAllUserSessions(userId: string): Promise<void> {
  const redis = getRedis()
  const keys = await redis.keys(SESSION_PREFIX + '*')

  for (const key of keys) {
    const raw = await redis.get(key)
    if (raw) {
      try {
        const data = JSON.parse(raw) as SessionData
        if (data.userId === userId) {
          await redis.del(key)
        }
      } catch {
        // skip malformed sessions
      }
    }
  }
}

/**
 * Set session cookie on the response
 */
export function setSessionCookie(event: any, sessionId: string): void {
  setCookie(event, SESSION_COOKIE_NAME, sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_TTL,
  })
}

/**
 * Clear session cookie
 */
export function clearSessionCookie(event: any): void {
  deleteCookie(event, SESSION_COOKIE_NAME, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  })
}

/**
 * Read session from the request cookie
 */
export async function getSessionFromEvent(event: any): Promise<SessionData | null> {
  const sessionId = getCookie(event, SESSION_COOKIE_NAME)
  if (!sessionId) return null
  return getRedisSession(sessionId)
}
