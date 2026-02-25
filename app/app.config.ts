import { WEBSITE_NAME } from '~/constants/common'

export default defineAppConfig({
  toaster: {
    position: 'bottom-right' as const,
    duration: 5000,
    max: 5,
    expand: true
  },
  ui: {
    colors: {
      primary: 'green',
      neutral: 'slate'
    },
    footer: {
      slots: {
        root: 'border-t border-default',
        left: 'text-sm text-muted'
      }
    }
  },
  seo: {
    siteName: WEBSITE_NAME
  },
  header: {
    title: '',
    to: '/',
    logo: {
      alt: '',
      light: '',
      dark: ''
    },
    search: true,
    colorMode: true,
    links: [{
      'icon': 'i-simple-icons-github',
      'to': 'https://github.com/asilorg/turkion',
      'target': '_blank',
      'aria-label': 'GitHub'
    }]
  },
  footer: {
    credits: `Copyright • © 2025 - ${new Date().getFullYear()} Asilbek Madiev`,
    colorMode: false,
    links: [
    //   {
    //     'icon': 'i-simple-icons-discord',
    //     'to': 'https://go.nuxt.com/discord',
    //     'target': '_blank',
    //     'aria-label': 'Nuxt on Discord'
    //   },
    //   {
    //     'icon': 'i-simple-icons-x',
    //     'to': 'https://go.nuxt.com/x',
    //     'target': '_blank',
    //     'aria-label': 'Nuxt on X'
    //   },
    //   {
    //     'icon': 'i-simple-icons-github',
    //     'to': 'https://github.com/nuxt/ui',
    //     'target': '_blank',
    //     'aria-label': 'Nuxt UI on GitHub'
    //   }
    ]
  },
  toc: {
    title: 'Table of Contents',
    bottom: {
      title: 'Community',
      edit: 'https://github.com/asilorg/turkion/blob/main/content/',
      links: [{
        icon: 'i-lucide-star',
        label: 'Star on GitHub',
        to: 'https://github.com/asilorg/turkion',
        target: '_blank'
      }
      ]
    }
  }
})
