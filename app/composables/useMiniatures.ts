export enum MiniatureType {
  TIMURID = 'Timurid Miniatures',
  OTTOMAN = 'Ottoman Miniatures',
  MUGHAL = 'Mughal Miniatures'
}

export function useMiniatures() {
  const { t } = useI18n()
  const miniature = useCookie('miniature', { default: () => MiniatureType.TIMURID })

  const miniatures = computed(() => [
    {
      label: t('miniatures.timurid'),
      icon: 'i-fluent:building-mosque-16-filled',
      value: MiniatureType.TIMURID,
      onSelect: () => miniature.value = MiniatureType.TIMURID
    },
    {
      label: t('miniatures.ottoman'),
      icon: 'i-file-icons:istanbul',
      value: MiniatureType.OTTOMAN,
      onSelect: () => miniature.value = MiniatureType.OTTOMAN
    },
    {
      label: t('miniatures.mughal'),
      icon: 'i-mingcute:taj-mahal-fill',
      value: MiniatureType.MUGHAL,
      onSelect: () => miniature.value = MiniatureType.MUGHAL
    }
  ].map(f => ({ ...f, active: miniature.value === f.value })))

  return {
    miniature,
    miniatures
  }
}
