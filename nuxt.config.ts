// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({

  modules: [
    '@pinia/nuxt',
    'shadcn-nuxt',
    '@nuxtjs/i18n',
    '@nuxtjs/seo',
    '@nuxt/image',
    '@nuxt/icon',
    '@nuxt/fonts',
    '@nuxt/eslint',
    'nuxt-directus',
    'nuxt-security',
    'nuxt-gtag',
  ],
  ssr: true,
  components: [
    {
      path: '~/components',
      pathPrefix: false,
      extensions: ['.vue'],
    },
  ],
  devtools: { enabled: true },

  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
  },

  css: ['~/assets/css/tailwind.css'],
  site: {
    name: 'Visit Dubai Deals & Offers',
    url: process.env.NUXT_PUBLIC_SITE_URL || 'https://booking.visitdubai.com/',
  },

  runtimeConfig: {
    directusUrl: process.env.NUXT_DIRECTUS_URL || '',
    apiSecret: process.env.NUXT_API_SECRET || '',
    jwtSecret: process.env.NUXT_JWT_SECRET || '',
    directusToken: process.env.NUXT_DIRECTUS_TOKEN || '',
    public: {
      directus: {
        url: process.env.NUXT_DIRECTUS_URL || '',
      },
      gaMeasurementId: process.env.NUXT_PUBLIC_GA_MEASUREMENT_ID || '',
      directusAssetsUrl: process.env.NUXT_PUBLIC_DIRECTUS_ASSETS_URL || '',
      name: process.env.NUXT_PUBLIC_NAME || '',
      cdnLink: process.env.NUXT_PUBLIC_CDN_LINK || '',
      siteCrawl: process.env.NUXT_PUBLIC_SITE_CRAWL || '',
      gqlHost: process.env.NUXT_PUBLIC_GQL_HOST || '',
      tealiumEnv: process.env.NUXT_PUBLIC_TEALIUM_ENV || '',
      tealiumCollectDomain: process.env.NUXT_PUBLIC_TEALIUM_COLLECT_DOMAIN || 'https://collect-eu-central-1.tealiumiq.com',
      visitDubaiUrl: process.env.NUXT_PUBLIC_VISIT_DUBAI_URL || 'https://booking.visitdubai.com/',
    },
  },

  routeRules: {
    '/en': { swr: 120 },
    '/ar': { swr: 120 },
    '/en/account/**': { ssr: false },
    '/ar/account/**': { ssr: false },
    '/en/checkout/**': { ssr: false },
    '/ar/checkout/**': { ssr: false },
  },

  compatibilityDate: '2025-05-19',

  nitro: {
    compressPublicAssets: true,
  },

  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: [
        '@vueuse/core',
        'class-variance-authority',
        'clsx',
        'embla-carousel-vue',
        'lucide-vue-next',
        'reka-ui',
        'tailwind-merge',
      ],
    },
  },

  directus: {
    url: process.env.NUXT_DIRECTUS_URL!,
  },

  eslint: { config: { stylistic: true } },
  fonts: {
    families: [
      {
        name: 'Dubai',
        provider: 'none',
      },
      {
        name: 'GE SS Two',
        provider: 'none',
      },
    ],
  },

  gtag: {
    id: process.env.NUXT_PUBLIC_GA_MEASUREMENT_ID || '',
  },
  i18n: {
    locales: [
      {
        code: 'en',
        language: 'en-AE',
        dir: 'ltr',
        file: 'en.json',
        name: 'English',
      },
      {
        code: 'ar',
        language: 'ar-AE',
        dir: 'rtl',
        file: 'ar.json',
        name: 'العربية',
      },
    ],
    defaultLocale: 'en',
    strategy: 'prefix',
    detectBrowserLanguage: false,
    langDir: '../i18n/locales',
  },

  image: {
    quality: 70,
    format: ['webp'],
    provider: 'bunny',
    bunny: {
      baseURL: process.env.NUXT_PUBLIC_CDN_LINK!,
    },
  },

  pinia: { storesDirs: ['./app/stores/**'] },

  security: {
    enabled: true,
    headers: {
      crossOriginEmbedderPolicy: 'unsafe-none',
      contentSecurityPolicy: {
        'script-src': ['\'self\'', '\'unsafe-inline\'', 'https://tags.tiqcdn.com', 'https://www.googletagmanager.com', 'https://www.google-analytics.com', 'https://www.google.com'],
        'script-src-attr': false,
        'img-src': ["'self'", 'data:', `${process.env.NUXT_PUBLIC_CDN_LINK}/`, `${process.env.NUXT_PUBLIC_DIRECTUS_ASSETS_URL}/`, 'https://www.google-analytics.com', 'https://www.googletagmanager.com', 'https://www.visitdubai.com', 'https://collect-eu-central-1.tealiumiq.com'],
        'connect-src': ["'self'", 'https://www.google-analytics.com', 'https://analytics.google.com', 'https://stats.g.doubleclick.net', 'https://www.google.com', `${process.env.NUXT_DIRECTUS_URL}/`, `${process.env.NUXT_PUBLIC_TEALIUM_COLLECT_DOMAIN || 'https://collect-eu-central-1.tealiumiq.com'}`],
      },
    },
    rateLimiter: {
      tokensPerInterval: 150,
      interval: 300000,
    },
  },
  shadcn: {
    prefix: '',
    componentDir: '@/components/ui',
  },
})
