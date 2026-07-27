export function useHeader() {
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

  return {
    desktopLinks
  }
}
