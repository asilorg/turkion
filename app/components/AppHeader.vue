<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'

const navigation = inject<Ref<ContentNavigationItem[]>>('navigation')

const { desktopLinks } = useHeader()
const { t } = useI18n()
const localePath = useLocalePath()
const config = useRuntimeConfig().public
const locales = config.i18n.locales

const { header } = useAppConfig()
</script>

<template>
  <UHeader
    :ui="{ center: 'flex-1' }"
    :to="localePath(header?.to || '/')"
    :menu="{ title: t('header.menuTitle'), description: t('header.menuDescription') }"
  >
    <UNavigationMenu
      :items="desktopLinks"
      variant="link"
    />

    <template
      v-if="header?.logo?.dark || header?.logo?.light || header?.title"
      #title
    >
      <UColorModeImage
        v-if="header?.logo?.dark || header?.logo?.light"
        :light="header?.logo?.light!"
        :dark="header?.logo?.dark!"
        :alt="header?.logo?.alt"
        class="h-6 w-auto shrink-0"
      />

      <span v-else-if="header?.title">
        {{ header.title }}
      </span>
    </template>

    <template
      v-else
      #left
    >
      <NuxtLink :to="localePath(header?.to || '/')">
        <AppLogo class="w-auto h-6 shrink-0" />
      </NuxtLink>

      <!--      <TemplateMenu /> -->
    </template>

    <template #right>
      <UContentSearchButton
        v-if="header?.search"
        :collapsed="false"
        class="w-auto"
      />

      <template v-if="locales.length > 1">
        <ClientOnly>
          <LanguageSelect />

          <template #fallback>
            <div class="h-8 w-8 animate-pulse bg-neutral-200 dark:bg-neutral-800 rounded-md" />
          </template>
        </ClientOnly>

        <USeparator
          orientation="vertical"
          class="h-8"
        />
      </template>

      <UColorModeButton v-if="header?.colorMode" />

      <template v-if="header?.links">
        <UButton
          v-for="(link, index) of header.links"
          :key="index"
          v-bind="{ color: 'neutral', variant: 'ghost', ...link }"
        />
      </template>
    </template>

    <template #body>
      <UNavigationMenu
        orientation="vertical"
        :items="desktopLinks"
        class="-mx-2.5"
      />

      <UContentNavigation
        :navigation="navigation"
        highlight
        :ui="{ linkTrailingBadge: 'font-semibold uppercase' }"
      />
    </template>
  </UHeader>
</template>
