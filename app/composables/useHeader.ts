export function useHeader() {
  const route = useRoute()
  const localePath = useLocalePath()
  const { t } = useI18n()

  const desktopLinks = computed(() => [
    {
      label: t('navigation.explore'),
      to: localePath('/docs/common/turkic-peoples')
    },
    {
      label: t('navigation.timeline'),
      to: localePath('/timeline')
    },
    {
      label: t('navigation.flags'),
      to: localePath('/flags')
    },
    {
      label: t('navigation.miniatures'),
      to: localePath('/miniatures')
    },
    {
      label: t('navigation.blog'),
      to: localePath('/blog')
    },
    {
      label: t('navigation.people'),
      to: localePath('/people')
    }
  ])

  const mobileLinks = computed(() => [{
    label: 'Get Started',
    icon: 'i-lucide-square-play',
    to: localePath('/expore'),
    active: route.path.startsWith('/docs/getting-started')
  }, {
    label: 'Components',
    icon: 'i-lucide-square-code',
    to: localePath('/docs/components'),
    active: route.path.startsWith('/docs/components')
  }, {
    label: 'Composables',
    icon: 'i-lucide-square-function',
    to: localePath('/docs/composables'),
    active: route.path.startsWith('/docs/composables')
  }, {
    label: 'Typography',
    icon: 'i-lucide-square-pilcrow',
    to: localePath('/docs/typography'),
    active: route.path.startsWith('/docs/typography')
  }, {
    label: 'Figma',
    icon: 'i-simple-icons-figma',
    to: localePath('/figma')
  }, {
    label: 'Templates',
    icon: 'i-lucide-panels-top-left',
    to: localePath('/templates')
  }, {
    label: 'Showcase',
    icon: 'i-lucide-presentation',
    to: localePath('/showcase')
  }, {
    label: 'Community',
    icon: 'i-lucide-globe',
    to: localePath('/community')
  }, {
    label: 'Team',
    icon: 'i-lucide-users',
    to: localePath('/team')
  }, {
    label: 'Releases',
    icon: 'i-lucide-newspaper',
    to: localePath('/releases')
  }, {
    label: 'GitHub',
    to: 'https://github.com/nuxt/ui',
    icon: 'i-simple-icons-github',
    target: '_blank'
  }])

  return {
    desktopLinks,
    mobileLinks
  }
}
