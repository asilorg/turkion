<script setup lang="ts">
import type { NuxtError } from '#app'
import type { ContentNavigationItem } from '@nuxt/content'

defineProps<{
  error: NuxtError
}>()

useHead({
  htmlAttrs: {
    lang: 'en'
  }
})

useSeoMeta({
  title: 'Page not found',
  description: 'We are sorry but this page could not be found.'
})

const { locale } = useI18n()

const { data: navigation } = await useAsyncData(
  () => `navigation-${locale.value}`,
  () => queryCollectionNavigation(`docs_${locale.value}`),
  {
    transform: (data: ContentNavigationItem[]) => {
      const rootResult = data.find(item => item.path === '/docs')?.children || data || []

      const children = rootResult
        .find(item => item.path === `/${locale.value}`)?.children
        ?.find(item => item.path === `/${locale.value}/docs`)?.children || rootResult

      const sanitize = (items: ContentNavigationItem[] = []): ContentNavigationItem[] =>
        items.map((item) => {
          const next = { ...item } as ContentNavigationItem & { icon?: unknown }
          if (typeof next.icon !== 'string') {
            delete next.icon
          }
          if (next.children?.length) {
            next.children = sanitize(next.children)
          }
          return next
        })

      return sanitize(children)
    },
    watch: [locale]
  }
)
const { data: files } = useLazyAsyncData(
  () => `search-${locale.value}`,
  () => queryCollectionSearchSections(`docs_${locale.value}`),
  {
    server: false,
    watch: [locale]
  }
)

provide('navigation', navigation)
</script>

<template>
  <UApp>
    <AppBanner />
    <AppHeader />

    <UError :error="error" />

    <AppFooter />

    <ClientOnly>
      <LazyUContentSearch
        :files="files"
        :navigation="navigation"
      />
    </ClientOnly>
  </UApp>
</template>
