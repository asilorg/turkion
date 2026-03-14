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
      { code: 'uz', name: 'Oʻzbek', language: 'uz', file: 'uz.json' }
    ],
    strategy: 'prefix',
    defaultLocale: 'en'
  },

  icon: {
    provider: 'iconify'
  },

  llms: {
    domain: 'https://docs-template.nuxt.dev/',
    title: 'Nuxt Docs Template',
    description: 'A template for building documentation with Nuxt UI and Nuxt Content.',
    full: {
      title: 'Nuxt Docs Template - Full Documentation',
      description: 'This is the full documentation for the Nuxt Docs Template.'
    },
    sections: [
      {
        title: 'Getting Started',
        contentCollection: 'docs_en',
        contentFilters: [
          { field: 'path', operator: 'LIKE', value: '/getting-started%' }
        ]
      },
      {
        title: 'Explore timeline',
        contentCollection: 'docs_en',
        contentFilters: [
          { field: 'path', operator: 'LIKE', value: '/essentials%' }
        ]
      }
    ]
  }
})
