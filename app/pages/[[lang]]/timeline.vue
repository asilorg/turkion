<script setup lang="ts">
import { WEBSITE_NAME } from '~/constants/common'

const { locale } = useI18n()
const { data: page } = await useAsyncData('timeline', () => queryCollection(`timeline_${locale.value}`).first(), { watch: [locale] })
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
    <div class="min-h-screen xl:grid xl:grid-cols-2">
      <UPageSection
        :title="page.title"
        :description="page.description"
        orientation="vertical"
        :links="[{
          label: 'Documentation',
          icon: 'i-lucide-book-open',
          variant: 'ghost',
          size: 'md',
          to: 'https://ui.nuxt.com/getting-started/installation/nuxt',
          target: '_blank'
        }, {
          label: 'GitHub',
          icon: 'i-simple-icons-github',
          variant: 'ghost',
          size: 'md',
          to: 'https://github.com/nuxt-ui-templates/changelog',
          target: '_blank'
        }]"
        :ui="{
          root: 'border-b border-default xl:border-b-0 xl:sticky xl:inset-y-0 xl:h-screen overflow-hidden',
          container: 'h-full items-center justify-center',
          wrapper: 'flex flex-col',
          headline: 'mb-6',
          title: 'text-left text-4xl w-2/3',
          description: 'text-left max-w-lg',
          links: 'gap-1 justify-start -ms-2.5'
        }"
      >
        <template #top>
          <SkyBg />

          <div class="absolute -right-1/2 z-[-1] rounded-full bg-primary blur-[300px] size-60 sm:size-100 transform -translate-y-1/2 top-1/2" />
        </template>

        <template #headline />

        <template #default />
      </UPageSection>

      <section class="px-4 sm:px-6 xl:px-0 xl:-ms-30 xl:flex-1">
        <UColorModeButton class="fixed top-4 right-4 z-10" />

        <UChangelogVersions
          as="main"
          :indicator-motion="false"
          :ui="{
            root: 'py-16 sm:py-24 lg:py-32',
            indicator: 'inset-y-0'
          }"
        >
          <UChangelogVersion
            v-for="version in page.timeline"
            :key="version.title"
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
              <MDC
                v-if="version.markdown"
                :value="version.markdown"
              />
            </template>
          </UChangelogVersion>
        </UChangelogVersions>
      </section>
    </div>
  </div>
</template>
