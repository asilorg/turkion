<script setup lang="ts">
/**
 * Defers MDC parsing/render until near the viewport on the client.
 * Initial state must match SSR to avoid hydration mismatches: non-eager
 * entries start as placeholders on both server and client, then mount when visible.
 */
const props = withDefaults(defineProps<{
  value: string
  eager?: boolean
}>(), {
  eager: false
})

const root = ref<HTMLElement | null>(null)
const visible = ref(props.eager)

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
