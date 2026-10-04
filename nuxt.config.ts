const siteUrl = (process.env.NUXT_PUBLIC_SITE_URL || 'https://www.turkion.org').replace(/\/$/, '')
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/ui',
    '@nuxt/content',
    'nuxt-og-image',
    'nuxt-llms',
    'motion-v/nuxt',
    '@nuxtjs/i18n'
  ],

  // Devtools file watchers hit EMFILE in ~/.cursor/worktrees on macOS
  devtools: {
    enabled: false
  },

  css: ['~/assets/css/main.css'],

  site: { url: siteUrl },

  content: {
    build: {
      markdown: {
        toc: {
          searchDepth: 1
        }
      }
    },
    experimental: { sqliteConnector: 'native' }
  },

  runtimeConfig: {
    public: { siteUrl, analyticsEnabled: Boolean(process.env.VERCEL) }
  },

  routeRules: {
    '/': { redirect: { to: '/en', statusCode: 301 } }
  },

  compatibilityDate: '2024-07-11',

  nitro: {
    prerender: {
      routes: [
        '/en', '/ru', '/uz', '/sitemap.xml', '/robots.txt'
      ],
      crawlLinks: true,
      autoSubfolderIndex: false,
      failOnError: true,
      // External image and OG services are generated on demand.
      ignore: ['/_ipx/', '/__og-image__/']
    }
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },

  i18n: {
    baseUrl: siteUrl,
    locales: [
      { code: 'en', name: 'English', language: 'en', file: 'en.json' },
      { code: 'uz', name: 'Oʻzbek', language: 'uz', file: 'uz.json' },
      { code: 'ru', name: 'Русский', language: 'ru', file: 'ru.json' }
    ],
    strategy: 'prefix',
    defaultLocale: 'en'
  },

  icon: {
    provider: 'iconify'
  },

  image: {
    // Nuxt Image detects Vercel/Netlify; Node deployments use its IPX default.
    // Avoid 2x IPX variants for gallery-heavy pages; pages can override.
    densities: [1],
    quality: 75
  },

  llms: {
    // Use our raw Markdown route so references and editorial status are preserved.
    contentRawMarkdown: false,
    domain: siteUrl,
    title: 'Turkion',
    description: 'Open-source digital encyclopedia of the Turkic world.',
    full: {
      title: 'Turkion — Encyclopedia',
      description: 'Encyclopedia articles in English, Russian and Uzbek.'
    },
    sections: [
      { title: 'English', contentCollection: 'docs_en', contentFilters: [{ field: 'path', operator: 'LIKE', value: '/en/docs/%' }] },
      { title: 'Русский', contentCollection: 'docs_ru', contentFilters: [{ field: 'path', operator: 'LIKE', value: '/ru/docs/%' }] },
      { title: 'Oʻzbek', contentCollection: 'docs_uz', contentFilters: [{ field: 'path', operator: 'LIKE', value: '/uz/docs/%' }] }
    ]
  }
})
