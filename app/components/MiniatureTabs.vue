<script setup lang="ts">
import { useMiniatures } from '~/composables/useMiniatures'

const { miniature, miniatures } = useMiniatures()

const value = computed({
  get: () => miniature.value,
  set: next => miniature.value = next
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
  />
</template>
