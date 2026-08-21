import { getRedis } from './redis'
import type { H3Event } from 'h3'

interface RateLimitOptions {
  windowSeconds: number;
  maxRequests: number;
}

export async function checkRateLimit(event: H3Event, actionName: string, options: RateLimitOptions) {
  const redis = getRedis()
  
  // Extraire l'IP de l'utilisateur (gère les proxys / Nginx)
  const ip = getRequestHeader(event, 'x-forwarded-for')?.split(',')?.[0]?.trim() 
    || getRequestHeader(event, 'x-real-ip') 
    || event.node.req.socket.remoteAddress 
    || 'unknown-ip'

  const redisKey = `ratelimit:${actionName}:${ip}`
  
  // Incrémenter le compteur pour cette clé
  const current = await redis.incr(redisKey)
  
  // Si c'est la première requête, définir l'expiration (Time To Live)
  if (current === 1) {
    await redis.expire(redisKey, options.windowSeconds)
  }
  
  // Si la limite est dépassée, bloquer
  if (current > options.maxRequests) {
    throw createError({
      statusCode: 429,
      statusMessage: 'Too Many Requests',
      message: 'Trop de requêtes. Veuillez réessayer plus tard.'
    })
  }
  
  return current
}
