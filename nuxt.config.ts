export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/i18n',
    'nuxt-auth-utils',
    '@nuxt/eslint',
  ],

  runtimeConfig: {
    // Variables privées (serveur uniquement)
    databaseUrl: process.env.DATABASE_URL,
    redisUrl: process.env.REDIS_URL,
    jwtSecret: process.env.JWT_SECRET,
    bcryptRounds: 12,
    resendApiKey: process.env.RESEND_API_KEY,
    minioEndpoint: process.env.MINIO_ENDPOINT,
    minioAccessKey: process.env.MINIO_ACCESS_KEY,
    minioSecretKey: process.env.MINIO_SECRET_KEY,
    minioBucket: process.env.MINIO_BUCKET || 'capali',
    // Variables publiques (accessibles côté client)
    public: {
      appName: 'CAP ALI',
      appUrl: process.env.APP_URL || 'http://localhost:3000',
    },
  },

  nitro: {
    experimental: {
      tasks: true,
    },
  },

  typescript: {
    strict: true,
  },
})