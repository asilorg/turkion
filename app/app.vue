<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'
import * as nuxtUiLocales from '@nuxt/ui/locale'

const { seo } = useAppConfig()
const { locale } = useI18n()
const nuxtUiLocale = computed(() => nuxtUiLocales[locale.value as keyof typeof nuxtUiLocales] || nuxtUiLocales.en)
const lang = computed(() => nuxtUiLocale.value.code)
const dir = computed(() => nuxtUiLocale.value.dir)

const { data: navigation } = await useAsyncData('navigation', () => queryCollectionNavigation(`docs_${locale.value}`), {
  transform: (data: ContentNavigationItem[]) => {
    const rootResult = data.find(item => item.path === '/docs')?.children || data || []

    return rootResult
      .find(item => item.path === `/${locale.value}`)?.children
      ?.find(item => item.path === `/${locale.value}/docs`)?.children || rootResult
  },
  watch: [locale]
})

const { data: files } = useLazyAsyncData('search', () => queryCollectionSearchSections(`docs_${locale.value}`),
  {
    server: false,
    watch: [locale]
  })

useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' }
  ],
  htmlAttrs: {
    lang,
    dir
  }
})

useSeoMeta({
  titleTemplate: `%s - ${seo?.siteName}`,
  ogSiteName: seo?.siteName,
  twitterCard: 'summary_large_image'
})

provide('navigation', navigation)
</script>

<template>
  <UApp>
    <NuxtLoadingIndicator color="var(--ui-primary)" />
    <AppBanner />
    <AppHeader />

    <UMain>
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </UMain>

    <AppFooter />

    <ClientOnly>
      <LazyUContentSearch
        label="Search123"
        :files="files"
        :navigation="navigation"
      />
    </ClientOnly>
  </UApp>
</template>
