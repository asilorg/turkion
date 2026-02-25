<script setup lang="ts">
import { WEBSITE_NAME } from '~/constants/common'

const { locale } = useI18n()
const localePath = useLocalePath()
const { data: page } = await useAsyncData('index', () => queryCollection(`index_${locale.value}`).first(), { watch: [locale] })

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

const title = page.value.seo?.title || page.value.title
const description = page.value.seo?.description || page.value.description

useSeoMeta({
  titleTemplate: `%s - ${WEBSITE_NAME}`,
  title,
  ogTitle: title,
  description,
  ogDescription: description,
  ogImage: 'public/preview.png',
  twitterImage: 'public/preview.png'
})
</script>

<template>
  <div v-if="page">
    <UPageHero
      orientation="horizontal"
      :ui="{
        container: 'pb-0 sm:pb-0 lg:py-0',
        title: 'lg:mt-16 md:text-6xl',
        links: 'lg:mb-16',
        description: 'text-balance'
      }"
    >
      <template
        v-if="locale === 'uz'"
        #title
      >
        <span class="text-primary">Turk Dunyosi</span> <br> Raqamli Ensiklopediyasi
      </template>
      <template
        v-else
        #title
      >
        Digital Encyclopedia <br> of the <span class="text-primary">Turkic World</span>
      </template>

      <template #description>
        {{ page.description }}
      </template>

      <template #links>
        <UButton
          v-for="link of page.hero.links"
          :key="link.label"
          v-bind="link"
          size="xl"
          :to="localePath(link.to)"
        />
        <div class="w-full my-6">
          <USeparator
            class="w-1/2"
            type="dashed"
          />
        </div>
        <div class="flex flex-col gap-4">
          <Motion
            v-for="(feature, index) in page.hero.features"
            :key="feature.title"
            as-child
            :initial="{ opacity: 0, transform: 'translateX(-10px)' }"
            :while-in-view="{ opacity: 1, transform: 'translateX(0)' }"
            :transition="{ delay: 0.2 + 0.4 * index }"
            :in-view-options="{ once: true }"
          >
            <UPageFeature
              v-bind="feature"
              class="opacity-0"
            />
          </Motion>
        </div>
      </template>

      <SkyBg is-index />

      <div class="h-[344px] lg:h-full lg:relative w-full lg:min-h-[calc(100vh-var(--ui-header-height)-1px)] overflow-hidden">
        <UMarquee
          pause-on-hover
          :overlay="false"
          :ui="{
            root: '[--gap:--spacing(4)] [--duration:40s] border-default absolute w-full left-0 border-y lg:border-x lg:border-y-0 lg:w-[calc(50%-6px)] 2xl:w-[320px] lg:flex-col',
            content: 'lg:w-auto lg:flex-col lg:animate-[marquee-vertical_var(--duration)_linear_infinite] lg:rtl:animate-[marquee-vertical-rtl_var(--duration)_linear_infinite] lg:h-[fit-content]'
          }"
        >
          <ULink
            v-for="component of page.historyCountries.features"
            :key="component.to"
            class="relative group/link aspect-video border-default w-[290px] xl:w-[330px] 2xl:w-[320px] 2xl:p-2 2xl:border-y"
            :to="localePath(component.to)"
          >
            <UColorModeImage
              :light="component.img"
              :dark="component.img"
              :alt="`${component.title} preview`"
              width="290"
              height="163"
              class="hover:scale-105 lg:hover:scale-110 transition-transform aspect-video w-full border-x lg:border-x-0 lg:border-y border-default 2xl:border-y-0"
              loading="lazy"
            />
            <UBadge
              color="neutral"
              variant="outline"
              size="md"
              :label="component.title"
              class="hidden lg:block absolute mx-auto top-4 left-6 xl:left-4 group-hover/link:opacity-100 opacity-0 transition-all duration-300 pointer-events-none -translate-y-2 group-hover/link:translate-y-0"
            />
          </ULink>
        </UMarquee>

        <UMarquee
          pause-on-hover
          reverse
          :overlay="false"
          :ui="{
            root: '[--gap:--spacing(4)] [--duration:40s] border-default absolute w-full mt-[180px] left-0 border-y lg:mt-auto lg:left-auto lg:border-y-0 lg:border-x lg:w-[calc(50%-6px)] 2xl:w-[320px] lg:right-0 lg:flex-col',
            content: 'lg:w-auto lg:flex-col lg:animate-[marquee-vertical_var(--duration)_linear_infinite] lg:rtl:animate-[marquee-vertical-rtl_var(--duration)_linear_infinite] lg:h-[fit-content] lg:[animation-direction:reverse]'
          }"
        >
          <ULink
            v-for="component of page.countries.features"
            :key="component.to"
            class="relative group/link aspect-video border-default w-[290px] xl:w-[330px] 2xl:w-[320px] 2xl:p-2 2xl:border-y"
            :to="localePath(component.to)"
          >
            <UColorModeImage
              :light="component.img"
              :dark="component.img"
              :alt="`${component.title} preview`"
              width="290"
              height="163"
              class="object-fill hover:scale-105 lg:hover:scale-110 transition-transform aspect-video w-full border-x lg:border-x-0 lg:border-y border-default 2xl:border-y-0"
              loading="lazy"
            />
            <UBadge
              color="neutral"
              variant="outline"
              size="md"
              :label="component.title"
              class="hidden lg:block absolute mx-auto top-4 left-6 xl:left-4 group-hover/link:opacity-100 opacity-0 transition-all duration-300 pointer-events-none -translate-y-2 group-hover/link:translate-y-0"
            />
          </ULink>
        </UMarquee>
      </div>
    </UPageHero>

    <USeparator />

    <UPageSection :ui="{ container: 'lg:py-16', root: 'bg-muted/25' }">
      <ul class="grid grid-cols-1 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 gap-y-6 lg:gap-x-8 lg:gap-y-8 xl:gap-y-10">
        <Motion
          v-for="(feature, index) in page.features"
          :key="feature.title"
          as="li"
          :initial="{ opacity: 0, transform: 'translateY(10px)' }"
          :while-in-view="{ opacity: 1, transform: 'translateY(0)' }"
          :transition="{ delay: 0.1 * index }"
          :in-view-options="{ once: true }"
          class="flex items-start gap-x-3 relative group"
        >
          <NuxtLink
            v-if="feature.to"
            :to="localePath(feature.to)"
            class="absolute inset-0 z-10"
          >
            <span class="sr-only">Go to {{ feature.title }}</span>
          </NuxtLink>

          <div
            class="relative p-3"
          >
            <svg
              class="absolute inset-0"
              viewBox="0 0 44 44"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <line
                x1="6.5"
                x2="6.5"
                y2="44"
                stroke="var(--ui-border)"
              />
              <line
                x1="38.5"
                x2="38.5"
                y2="44"
                stroke="var(--ui-border)"
              />
              <line
                y1="5.5"
                x2="44"
                y2="5.5"
                stroke="var(--ui-border)"
              />
              <line
                y1="37.5"
                x2="44"
                y2="37.5"
                stroke="var(--ui-border)"
              />
              <circle
                cx="6.53613"
                cy="5.45508"
                r="1.5"
                fill="var(--ui-border-accented)"
              />
              <circle
                cx="38.5957"
                cy="5.45508"
                r="1.5"
                fill="var(--ui-border-accented)"
              />
              <circle
                cx="6.53711"
                cy="37.4551"
                r="1.5"
                fill="var(--ui-border-accented)"
              />
              <circle
                cx="38.5957"
                cy="37.4551"
                r="1.5"
                fill="var(--ui-border-accented)"
              />
            </svg>
            <UIcon
              :name="feature.icon"
              class="size-5 shrink-0"
            />
          </div>
          <div class="flex flex-col">
            <h2 class="font-medium text-highlighted inline-flex items-center gap-x-1">
              {{ feature.title }}
              <UIcon
                v-if="feature.to"
                name="i-lucide-arrow-right"
                class="size-4 shrink-0 opacity-0 group-hover:opacity-100 transition-all duration-200 -translate-x-1 group-hover:translate-x-0"
              />
            </h2>
            <p class="text-sm text-muted">
              {{ feature.description }}
            </p>
          </div>
        </Motion>
      </ul>
    </UPageSection>

    <USeparator />

    <UPageSection
      :title="page.details.title"
    >
      <div class="lg:relative overflow-hidden">
        <UMarquee
          pause-on-hover
          :overlay="false"
          :ui="{
            root: '[--gap:--spacing(4)] [--duration:40s]'
          }"
          class="mb-6"
        >
          <ULink
            v-for="miniature of page.details.miniatures"
            :key="miniature.img"
            class="relative group/link w-[290px] xl:w-[330px] 2xl:w-[320px] 2xl:p-2"
            :to="localePath(miniature.to)"
          >
            <UColorModeImage
              :light="miniature.img"
              :dark="miniature.img"
              :alt="`${miniature.title} preview`"
              width="350"
              height="500"
              class="hover:scale-105 lg:hover:scale-110 transition-transform w-full"
              loading="lazy"
            />
            <UBadge
              color="neutral"
              variant="outline"
              size="md"
              :label="miniature.title"
              class="hidden lg:block absolute mx-auto top-4 left-6 xl:left-4 group-hover/link:opacity-100 opacity-0 transition-all duration-300 pointer-events-none -translate-y-2 group-hover/link:translate-y-0"
            />
          </ULink>
        </UMarquee>
        <UMarquee
          pause-on-hover
          reverse
          :overlay="false"
          :ui="{
            root: '[--gap:--spacing(4)] [--duration:40s]'
          }"
        >
          <ULink
            v-for="city of page.details.cities"
            :key="city.img"
            class="relative group/link w-[300px] xl:w-[300px] 2xl:w-[300px] 2xl:p-2"
            :to="localePath(city.to)"
          >
            <UColorModeImage
              :light="city.img"
              :dark="city.img"
              :alt="`${city.title} preview`"
              width="300"
              height="300"
              class="hover:scale-105 lg:hover:scale-110 transition-transform w-full"
              loading="lazy"
            />
            <UBadge
              color="neutral"
              variant="outline"
              size="md"
              :label="city.title"
              class="lg:block absolute mx-auto top-6 left-6 xl:left-4 transition-all duration-300 pointer-events-none -translate-y-2 group-hover/link:translate-y-0"
            />
          </ULink>
        </UMarquee>
      </div>
    </UPageSection>

    <USeparator />

    <UPageSection
      :title="page.users.title"
    >
      <ul class="grid grid-cols-1 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 gap-y-6 lg:gap-x-8 lg:gap-y-8 xl:gap-y-10">
        <UPageCard
          v-for="(user, index) in page.users.features"
          :key="user.title + index"
          as="li"
          :description="user.quote"
          orientation="vertical"
          spotlight
          spotlight-color="primary"
          :ui="{
            description: 'before:content-[open-quote] after:content-[close-quote] min-h-[160px] text-center',
            header: 'flex flex-col w-full items-center text-center'
          }"
        >
          <template #header>
            <img
              :src="user.img"
              :alt="user.title"
              class="w-[200px] rounded-full mb-2"
            >
            <UUser
              :name="user.title"
              :description="user.description"
              size="xl"
            />
            <USeparator class="mt-2" />
          </template>
        </UPageCard>
      </ul>
    </UPageSection>

    <USeparator />

    <UPageSection
      :title="page.gallery.title"
      :description="page.gallery.description"
      :links="page.gallery.links"
      orientation="horizontal"
      :ui="{ root: 'bg-muted/25' }"
    >
      <UCarousel
        v-slot="{ item }"
        loop
        dots
        fade
        wheel-gestures
        :contain-scroll="false"
        :autoplay="{ delay: 3000 }"
        :items="page.gallery.features"
        :ui="{
          container: 'py-px',
          viewport: 'px-px'
        }"
      >
        <UPageCard
          :to="localePath(item.to)"
          :icon="item.icon"
          :title="item.title"
          target="_blank"
          variant="subtle"
          class="group rounded-md"
          :ui="{
            container: 'p-4 sm:p-4',
            wrapper: 'flex-row items-center gap-1.5',
            leading: 'mb-0',
            leadingIcon: 'text-highlighted'
          }"
        >
          <UColorModeImage
            :light="item.img"
            :dark="item.img"
            :alt="`Template ${item.title} screenshot`"
            width="620"
            height="348"
            loading="lazy"
            class="rounded-lg w-full border border-default aspect-video bg-cover"
          />
        </UPageCard>
      </UCarousel>
    </UPageSection>

    <USeparator />

    <UPageSection :title="page.wars.title">
      <div class="lg:relative overflow-hidden">
        <UMarquee
          pause-on-hover
          reverse
          :overlay="false"
          :ui="{
            root: '[--gap:--spacing(4)] [--duration:40s]'
          }"
        >
          <ULink
            v-for="war of page.wars.features"
            :key="war.img"
            class="relative group/link w-[300px] xl:w-[300px] 2xl:w-[300px] 2xl:p-2"
            :to="localePath(war.to)"
          >
            <UColorModeImage
              :light="war.img"
              :dark="war.img"
              :alt="`${war.title} preview`"
              width="300"
              height="300"
              class="hover:scale-105 lg:hover:scale-110 transition-transform w-full"
              loading="lazy"
            />
            <UBadge
              color="neutral"
              variant="outline"
              size="md"
              :label="war.title"
              class="lg:block absolute mx-auto top-6 left-6 xl:left-4 transition-all duration-300 pointer-events-none -translate-y-2 group-hover/link:translate-y-0"
            />
          </ULink>
        </UMarquee>
      </div>
    </UPageSection>
  </div>
</template>
