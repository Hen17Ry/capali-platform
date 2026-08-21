export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/i18n',
    'nuxt-auth-utils',
    '@nuxt/eslint',
    '@nuxt/image',
    '@vite-pwa/nuxt',
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
      title: 'CAP ALI',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'CAP ALI accompagne les jeunes Béninois et Africains francophones dans leur parcours vers et en France : mentorat, ressources, communauté.' },
        { name: 'theme-color', content: '#1B6B3A' },
        { property: 'og:title', content: 'CAP ALI' },
        { property: 'og:description', content: 'Mentorat, ressources et communauté pour les jeunes Africains en France.' },
        { property: 'og:image', content: '/logo.png' },
        { property: 'og:type', content: 'website' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/logo.png' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap' },
      ],
      script: [
        { src: 'https://cdn.kkiapay.me/k.js', defer: true }
      ]
    },
  },

  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'CAP ALI Platform',
      short_name: 'CAP ALI',
      theme_color: '#1B6B3A',
      background_color: '#ffffff',
      display: 'standalone',
      start_url: '/',
      icons: [
        {
          src: '/logo.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: '/logo.png',
          sizes: '512x512',
          type: 'image/png'
        },
        {
          src: '/logo.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any maskable'
        }
      ]
    },
    workbox: {
      navigateFallback: '/',
      globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
      maximumFileSizeToCacheInBytes: 3000000,
    },
    client: {
      installPrompt: true,
    },
    devOptions: {
      enabled: true,
      suppressWarnings: true,
      navigateFallbackAllowlist: [/^\/$/],
      type: 'module',
    }
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
    kkiapaySecretKey: process.env.KKIAPAY_SECRET_KEY,
    kkiapayPrivateKey: process.env.KKIAPAY_PRIVATE_KEY,
    // Variables publiques (accessibles côté client)
    public: {
      appName: 'CAP ALI',
      appUrl: process.env.APP_URL, // CORRECTION : Plus de fallback localhost en dur
      kkiapayPublicKey: process.env.KKIAPAY_PUBLIC_KEY,
    },
  },

  nitro: {
    experimental: {
      tasks: true,
      websocket: true,
    },
  },

  // CORRECTION : Utilisation d'une variable d'environnement pour le proxy de stockage
  routeRules: {
    '/s3/**': { proxy: process.env.S3_PROXY_TARGET },
    // Cache SSR (SWR/ISR) pour les pages publiques afin de réduire la latence
    '/': { swr: 300 },
    '/events': { swr: 300 },
    '/galleries': { swr: 300 },
    '/resources': { swr: 300 },
  },

  devServer: {
    host: '0.0.0.0'
  },
  
  vite: {
    server: {
      allowedHosts: [
      'capali.org',
      'www.capali.org',
      'localhost',
    ],
      hmr:{
        protocol: 'wss',
      host: 'capali.org',
        clientPort: 443
      }
    }
  },

  css: ['~/assets/css/main.css'],

  typescript: {
    strict: true,
  },
})