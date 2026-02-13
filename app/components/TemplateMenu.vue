<script setup lang="ts">
import type { DropdownMenuItem } from '#ui/components/DropdownMenu.vue'
import type { ArrayOrNested } from '#ui/types/utils'

const route = useRoute()
const { desktopLinks } = useHeader()

const DROPDOWN_ITEMS: ArrayOrNested<DropdownMenuItem> = [
  {
    label: 'Timeline',
    to: '/timeline',
    checked: route.path === '/timeline'
  }, {
    label: 'Flags',
    to: '/flags'
  },
  {
    label: 'Nations',
    to: '/nations',
    color: 'primary',
    // checked: true,
    type: 'checkbox'
  }, {
    label: 'SaaS',
    to: 'https://saas-template.nuxt.dev/'
  }, {
    label: 'Dashboard',
    to: 'https://dashboard-template.nuxt.dev/'
  }, {
    label: 'Chat',
    to: 'https://chat-template.nuxt.dev/'
  }, {
    label: 'Portfolio',
    to: 'https://portfolio-template.nuxt.dev/'
  }, {
    label: 'Changelog',
    to: 'https://changelog-template.nuxt.dev/'
  }]
</script>

<template>
  <UDropdownMenu
    v-slot="{ open }"
    :modal="false"
    :items="desktopLinks"
    :content="{ align: 'start' }"
    :ui="{ content: 'min-w-fit' }"
    size="xs"
  >
    <UButton
      :label="desktopLinks.find(desktopLink => route.path === desktopLink.to)?.label ?? route.path"
      variant="subtle"
      trailing-icon="i-lucide-chevron-down"
      size="xs"
      class="-mb-[6px] font-semibold rounded-full truncate"
      :class="[open && 'bg-primary/15']"
      :ui="{
        trailingIcon: ['transition-transform duration-200', open ? 'rotate-180' : undefined].filter(Boolean).join(' ')
      }"
    />
  </UDropdownMenu>
</template>
