import Redis from 'ioredis'

let redisInstance: Redis | null = null

export function getRedis(): Redis {
  if (!redisInstance) {
    redisInstance = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
      maxRetriesPerRequest: 3,
      lazyConnect: true,
    })

    redisInstance.on('error', (err) => {
      console.error('[Redis] Connection error:', err)
    })

    redisInstance.on('connect', () => {
      console.log('[Redis] Connected')
    })
  }
  return redisInstance
}