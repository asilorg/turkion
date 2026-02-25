<script setup lang="ts">
import { WEBSITE_NAME } from '~/constants/common'

const { locale } = useI18n()
const { data: page } = await useAsyncData('people', () => queryCollection(`people_${locale.value}`).first(), { watch: [locale] })
if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

useSeoMeta({
  titleTemplate: `%s - ${WEBSITE_NAME}`,
  title: page.value.title,
  description: page.value.description,
  ogTitle: `${page.value.title} - ${WEBSITE_NAME}`,
  ogDescription: page.value.description
})

defineOgImageComponent('Docs')
</script>

<template>
  <div v-if="page">
    <UPageHero
      :title="page.hero.title"
      :description="page.hero.description"
      :links="page.hero.links"
      :ui="{
        container: 'relative lg:py-32 min-h-[calc(100vh-var(--ui-header-height)-1px)]'
      }"
    >
      <template #top>
        <div class="absolute z-[-1] rounded-full bg-primary blur-[300px] size-60 sm:size-80 transform -translate-x-1/2 left-1/2 -translate-y-80" />
      </template>

      <LazyStarsBg />

      <div
        aria-hidden="true"
        class="hidden lg:block absolute z-[-1] border-x border-default inset-0 mx-4 sm:mx-6 lg:mx-8"
      />
    </UPageHero>
  </div>
</template>
