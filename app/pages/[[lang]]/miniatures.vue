<script setup lang="ts">
import { MiniatureType, useMiniatures } from '~/composables/useMiniatures'
import { WEBSITE_NAME } from '~/constants/common'

const { miniature } = useMiniatures()
const { locale } = useI18n()

const { data: page } = await useAsyncData(() => `miniatures-${locale.value}`, () => queryCollection(`miniatures_${locale.value}`).first(), { watch: [locale] })
const { data: mediaCatalog } = await useAsyncData('media-catalog', () => queryCollection('media').first())
const mediaByImage = computed(() => new Map(mediaCatalog.value?.items?.map(item => [item.img, item]) || []))

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

const galleries = computed(() => ({
  [MiniatureType.TIMURID]: page.value?.timur_miniatures || [],
  [MiniatureType.OTTOMAN]: page.value?.ottoman_miniatures || [],
  [MiniatureType.MUGHAL]: page.value?.mughal_miniatures || []
}))

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
    <UPageHero
      :title="`${page.hero.title}`"
      :description="page.hero.description"
      :links="page.hero.links"
      :ui="{
        container: 'relative lg:py-32'
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

    <UPageSection :ui="{ container: '!pt-0 relative' }">
      <div
        aria-hidden="true"
        class="hidden lg:block absolute z-[-1] border-x border-default inset-0 mx-4 sm:mx-6 lg:mx-8"
      />
      <MiniatureTabs class="w-full" />

      <section
        v-for="group in galleries[miniature]"
        :key="group.title"
        class="border-l border-t border-default"
      >
        <h2 class="border-r border-default px-4 py-3 text-center text-xl font-semibold">
          {{ group.title }}
        </h2>
        <ul class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <GalleryMediaCard
            v-for="item in group.items"
            :key="item.img"
            :item="item"
            :media="mediaByImage.get(item.img)"
          />
        </ul>
      </section>
    </UPageSection>
  </div>
</template>
