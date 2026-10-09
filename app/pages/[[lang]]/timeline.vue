<script setup lang="ts">
import { WEBSITE_NAME } from '~/constants/common'

const { locale } = useI18n()
const { data: page } = await useAsyncData(() => `timeline-${locale.value}`, () => queryCollection(`timeline_${locale.value}`).first(), { watch: [locale] })
if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

useSeoMeta({
  titleTemplate: `%s - ${WEBSITE_NAME}`,
  title: () => page.value?.title,
  description: () => page.value?.description,
  ogTitle: () => `${page.value?.title} - ${WEBSITE_NAME}`,
  ogDescription: () => page.value?.description
})

defineOgImageComponent('Docs')
</script>

<template>
  <div v-if="page">
    <div class="min-h-screen xl:grid xl:grid-cols-2">
      <UPageSection
        orientation="vertical"
        :ui="{
          root: 'border-b border-default xl:border-b-0 xl:sticky xl:inset-y-0 xl:h-screen overflow-hidden',
          container: 'h-full items-center justify-center',
          wrapper: 'flex flex-col',
          headline: 'mb-6',
          links: 'gap-1 justify-start -ms-2.5'
        }"
      >
        <template #top>
          <SkyBg />

          <div class="absolute -right-1/2 z-[-1] rounded-full bg-primary blur-[300px] size-60 sm:size-100 transform -translate-y-1/2 top-1/2" />
        </template>

        <template #header>
          <h1 class="text-left text-4xl w-2/3 font-bold tracking-tight text-highlighted">
            {{ page.title }}
          </h1>
          <p class="mt-6 text-left max-w-lg text-muted">
            {{ page.description }}
          </p>
        </template>

        <template #default />
      </UPageSection>

      <section class="px-4 sm:px-6 xl:px-0 xl:-ms-30 xl:flex-1">
        <UColorModeButton class="fixed top-4 right-4 z-10" />

        <UChangelogVersions
          as="div"
          :indicator-motion="false"
          :ui="{
            root: 'py-16 sm:py-24 lg:py-32',
            indicator: 'inset-y-0'
          }"
        >
          <UChangelogVersion
            v-for="version in page.timeline"
            :key="version.id"
            v-bind="version"
            :ui="{
              root: 'flex items-start',
              container: 'max-w-xl',
              header: 'border-b border-default pb-4',
              title: 'text-3xl',
              date: 'text-xs/9 text-highlighted font-mono',
              indicator: 'sticky top-0 pt-16 -mt-16 sm:pt-24 sm:-mt-24 lg:pt-32 lg:-mt-32'
            }"
          >
            <template #body>
              <div
                v-if="version.markdown"
                :id="version.id"
                :data-timeline-section="version.id"
              >
                <MDC :value="version.markdown" />
              </div>
            </template>
          </UChangelogVersion>
        </UChangelogVersions>
      </section>
    </div>
  </div>
</template>
