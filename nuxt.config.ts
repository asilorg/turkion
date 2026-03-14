// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/ui',
    '@nuxt/content',
    'nuxt-og-image',
    'nuxt-llms',
    'motion-v/nuxt',
    'nuxt-component-meta',
    '@nuxtjs/i18n'
  ],

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

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

  compatibilityDate: '2024-07-11',

  nitro: {
    prerender: {
      routes: [
        '/'
      ],
      crawlLinks: true,
      autoSubfolderIndex: false
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

  llms: {
    domain: 'https://turkion.org/',
    title: 'Turkion',
    description: 'Open-source digital encyclopedia of the Turkic world.',
    full: {
      title: 'Turkion - Full Documentation',
      description: 'Full documentation for Turkion — the open-source digital encyclopedia of the Turkic world.'
    },
    sections: [
      {
        title: 'Getting Started',
        contentCollection: 'docs_en',
        contentFilters: [
          { field: 'path', operator: 'LIKE', value: '/getting-started' }
        ]
      },
      {
        title: 'Explore',
        contentCollection: 'docs_en',
        contentFilters: [
          { field: 'path', operator: 'LIKE', value: '/common' }
        ]
      },
      {
        title: 'Исследовать ',
        contentCollection: 'docs_ru',
        contentFilters: [
          { field: 'path', operator: 'LIKE', value: '/common' }
        ]
      }
    ]
  }
})
