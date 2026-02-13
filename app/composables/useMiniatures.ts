export enum MiniatureType {
  TIMURID = 'Timurid Miniatures',
  OTTOMAN = 'Ottoman Miniatures',
  MUGHAL = 'Mughal Miniatures'
}

export function useMiniatures() {
  const miniature = useCookie('miniature', { default: () => MiniatureType.TIMURID })

  const miniatures = computed(() => [
    {
      label: MiniatureType.TIMURID,
      icon: 'i-fluent:building-mosque-16-filled',
      value: MiniatureType.TIMURID,
      onSelect: () => miniature.value = MiniatureType.TIMURID
    },
    {
      label: MiniatureType.OTTOMAN,
      icon: 'i-file-icons:istanbul',
      value: MiniatureType.OTTOMAN,
      onSelect: () => miniature.value = MiniatureType.OTTOMAN
    },
    {
      label: MiniatureType.MUGHAL,
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
