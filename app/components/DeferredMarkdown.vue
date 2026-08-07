<script setup lang="ts">
/**
 * Defers MDC parsing/render until near the viewport on the client.
 * SSR and eager entries render immediately to avoid blank critical content.
 */
const props = withDefaults(defineProps<{
  value: string
  eager?: boolean
}>(), {
  eager: false
})

const root = ref<HTMLElement | null>(null)
const visible = ref(props.eager || import.meta.server)

onMounted(() => {
  if (visible.value) {
    return
  }

  const el = root.value
  if (!el || !('IntersectionObserver' in window)) {
    visible.value = true
    return
  }

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry?.isIntersecting) {
        visible.value = true
        observer.disconnect()
      }
    },
    { rootMargin: '240px 0px' }
  )

  observer.observe(el)
  onBeforeUnmount(() => observer.disconnect())
})
</script>

<template>
  <div ref="root">
    <MDC
      v-if="visible"
      :value="props.value"
    />
    <div
      v-else
      class="min-h-28"
      aria-hidden="true"
    />
  </div>
</template>
