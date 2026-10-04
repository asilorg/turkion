<script setup lang="ts">
import type { NuxtError } from '#app'
import type { ContentNavigationItem } from '@nuxt/content'
import * as nuxtUiLocales from '@nuxt/ui/locale'

defineProps<{
  error: NuxtError
}>()

const { locale, t } = useI18n()
const nuxtUiLocale = computed(() => nuxtUiLocales[locale.value as keyof typeof nuxtUiLocales] || nuxtUiLocales.en)

useHead({
  htmlAttrs: {
    lang: locale
  }
})

useSeoMeta({
  title: () => t('common.error.title'),
  description: () => t('common.error.description')
})

const { open: searchOpen } = useContentSearch()

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
const { data: files, execute: executeSearch } = useLazyAsyncData(
  () => `search-${locale.value}`,
  () => queryCollectionSearchSections(`docs_${locale.value}`),
  {
    server: false,
    immediate: false
  }
)

watch([searchOpen, locale], async ([isOpen]) => {
  if (isOpen) {
    await executeSearch()
  }
})

provide('navigation', navigation)
</script>

<template>
  <UApp :locale="nuxtUiLocale">
    <AppBanner />
    <AppHeader />

    <UError :error="error" />

    <AppFooter />

    <ClientOnly>
      <LazyUContentSearch
        :title="t('search.title')"
        :description="t('search.description')"
        :files="files"
        :navigation="navigation"
      />
    </ClientOnly>
  </UApp>
</template>
