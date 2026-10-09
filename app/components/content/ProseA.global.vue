<script setup lang="ts">
const props = defineProps<{
  href?: string
  target?: string
  rel?: string
}>()

const config = useRuntimeConfig()
const isExternal = computed(() => {
  if (!props.href || !/^(https?:)?\/\//i.test(props.href)) return false

  try {
    const siteUrl = new URL(config.public.siteUrl)
    return new URL(props.href, siteUrl).hostname !== siteUrl.hostname
  } catch {
    return false
  }
})

const target = computed(() => isExternal.value ? '_blank' : props.target)
const rel = computed(() => target.value === '_blank'
  ? [props.rel, 'noopener', 'noreferrer'].filter(Boolean).join(' ')
  : props.rel)
</script>

<template>
  <ULink
    :to="href"
    :target="target"
    :rel="rel"
    class="text-primary border-b border-transparent hover:border-primary font-medium transition-colors"
    raw
  >
    <slot />
  </ULink>
</template>
