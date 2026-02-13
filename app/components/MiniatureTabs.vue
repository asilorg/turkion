<script setup lang="ts">
import { useMiniatures } from '~/composables/useMiniatures'

const { miniature, miniatures } = useMiniatures()

const value = ref<string | undefined>(undefined)

onMounted(() => {
  value.value = miniature.value
})

watch(miniature, () => {
  value.value = miniature.value
})
</script>

<template>
  <UTabs
    v-model="value"
    :items="miniatures"
    :content="false"
    color="neutral"
    :ui="{
      indicator: 'bg-default',
      trigger: 'px-1 data-[state=active]:text-highlighted w-full'
    }"
    size="sm"
    @update:model-value="(miniature = $event as MiniatureType)"
  />
</template>
