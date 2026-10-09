<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'
import * as nuxtUiLocales from '@nuxt/ui/locale'
import { Analytics } from '@vercel/analytics/nuxt'

const { seo } = useAppConfig()
const analyticsEnabled = useRuntimeConfig().public.analyticsEnabled
const { locale, t } = useI18n()
const nuxtUiLocale = computed(() => nuxtUiLocales[locale.value as keyof typeof nuxtUiLocales] || nuxtUiLocales.en)
const lang = computed(() => nuxtUiLocale.value.code)
const dir = computed(() => nuxtUiLocale.value.dir)
const localeHead = useLocaleHead({ seo: true })
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

      // Guard against invalid boolean icons from content meta (breaks UIcon / hydration)
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

useHead(() => localeHead.value)

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
  <Analytics v-if="analyticsEnabled" />
  <UApp :locale="nuxtUiLocale">
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
        :title="t('search.title')"
        :description="t('search.description')"
        :files="files"
        :navigation="navigation"
      />
    </ClientOnly>
  </UApp>
</template>
