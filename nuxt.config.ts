export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/i18n',
    'nuxt-auth-utils',
    '@nuxt/eslint',
  ],

  i18n: {
    locales: [
      { code: 'fr', name: 'Français', file: 'fr.json' },
      { code: 'en', name: 'English', file: 'en.json' },
    ],
    defaultLocale: 'fr',
    langDir: '../i18n/locales',
    strategy: 'prefix_except_default',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root',
    },
  },

  app: {
    head: {
      title: 'CAP ALI — Communauté d\'Appui au Parcours des Africains et Leaders Inspirants',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'CAP ALI accompagne les jeunes Béninois et Africains francophones dans leur parcours vers et en France : mentorat, ressources, communauté.' },
        { name: 'theme-color', content: '#1B6B3A' },
        { property: 'og:title', content: 'CAP ALI — Plateforme Communautaire' },
        { property: 'og:description', content: 'Mentorat, ressources et communauté pour les jeunes Africains en France.' },
        { property: 'og:image', content: '/logo.png' },
        { property: 'og:type', content: 'website' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap' },
      ],
    },
  },

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

  css: ['~/assets/css/main.css'],

  typescript: {
    strict: true,
  },
})