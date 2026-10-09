<script setup lang="ts">
interface MediaItem {
  img: string
  sourceUrl?: string
  credit?: string
  license?: string
  licenseUrl?: string
  attributionStatus: 'verified' | 'unverified'
}

const props = defineProps<{
  item: { img: string, name: string, symbolType?: 'state' | 'people' | 'movement' | 'reconstruction', symbolNote?: string }
  media?: MediaItem
}>()

const { t } = useI18n()
// Encode the filename before HTML escaping: Nitro cannot decode numeric &#39; entities.
const imageHref = computed(() => props.item.img.split('/').map(part => encodeURIComponent(part).replaceAll('\'', '%27')).join('/'))
</script>

<template>
  <li class="min-w-0 border-r border-b border-default p-3">
    <figure class="space-y-2">
      <a
        :href="imageHref"
        target="_blank"
        rel="noopener noreferrer"
        class="block overflow-hidden rounded-md focus-visible:outline-2 focus-visible:outline-primary"
        :aria-label="`${t('gallery.viewImage')}: ${item.name}`"
      >
        <NuxtImg
          :src="item.img"
          :alt="item.name"
          width="327"
          height="184"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          format="webp"
          fit="inside"
          :quality="70"
          loading="lazy"
          decoding="async"
          class="aspect-video w-full object-contain transition-transform duration-200 hover:scale-105"
        />
      </a>
      <figcaption class="space-y-1 text-sm">
        <p class="font-medium text-highlighted">
          {{ item.name }}
        </p>
        <p
          v-if="item.symbolType"
          class="text-muted"
        >
          {{ t(`gallery.symbolType.${item.symbolType}`) }}
        </p>
        <p
          v-if="item.symbolNote"
          class="text-muted"
        >
          {{ item.symbolNote }}
        </p>
        <p>
          <a
            v-if="media?.attributionStatus === 'verified' && media.sourceUrl"
            :href="media.sourceUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="text-primary underline underline-offset-2"
          >{{ t('gallery.source') }}</a>
          <span
            v-else
            class="text-muted"
          >{{ t('gallery.sourceUnknown') }}</span>
        </p>
        <p
          v-if="media?.attributionStatus === 'verified' && media.credit"
          class="text-muted"
        >
          {{ t('gallery.credit') }}: {{ media.credit }}
        </p>
        <p
          v-if="media?.attributionStatus === 'verified' && media.license"
          class="text-muted"
        >
          {{ t('gallery.license') }}:
          <a
            v-if="media.licenseUrl"
            :href="media.licenseUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="underline underline-offset-2"
          >{{ media.license }}</a>
          <span v-else>{{ media.license }}</span>
        </p>
      </figcaption>
    </figure>
  </li>
</template>
