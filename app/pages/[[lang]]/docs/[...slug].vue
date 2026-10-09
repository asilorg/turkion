<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'
import { findPageHeadline } from '@nuxt/content/utils'

definePageMeta({
  layout: 'docs'
})

const route = useRoute()
const { toc } = useAppConfig()
const navigation = inject<Ref<ContentNavigationItem[]>>('navigation')
const { locale, t } = useI18n()

const { data: page } = await useAsyncData(
  () => `docs-${locale.value}-${route.path}`,
  () => queryCollection(`docs_${locale.value}`).path(route.path).first(),
  { watch: [locale, () => route.path] }
)

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

const { data: surround } = await useAsyncData(
  () => `docs-surround-${locale.value}-${route.path}`,
  () => queryCollectionItemSurroundings(`docs_${locale.value}`, route.path, {
    fields: ['description']
  }),
  { watch: [locale, () => route.path] }
)

const title = computed(() => page.value?.seo?.title || page.value?.title)
const description = computed(() => page.value?.seo?.description || page.value?.description)

useSeoMeta({
  title,
  ogTitle: title,
  description,
  ogDescription: description
})

const headline = computed(() => findPageHeadline(navigation?.value, page.value?.path))

defineOgImageComponent('Docs', {
  headline: headline.value
})

const links = computed(() => {
  const links = []
  if (toc?.bottom?.edit && page.value?.stem) {
    const stem = String(page.value.stem).replace(/^\//, '')
    const extension = page.value.extension || 'md'
    const base = toc.bottom.edit.replace(/\/?$/, '/')
    links.push({
      icon: 'i-lucide-external-link',
      label: t('docs.edit'),
      to: `${base}${stem}.${extension}`,
      target: '_blank'
    })
  }

  return [...links, ...(toc?.bottom?.links || []).map(link => ({
    ...link,
    label: link.label === 'Star on GitHub' ? t('docs.star') : link.label
  }))].filter(Boolean)
})
</script>

<template>
  <UPage v-if="page">
    <UPageHeader
      :title="page.title"
      :description="page.description"
      :headline="headline"
    >
      <template #links>
        <UButton
          v-for="(link, index) in page.links"
          :key="index"
          v-bind="link"
        />

        <!--        <PageHeaderLinks /> -->
      </template>
    </UPageHeader>

    <UPageBody>
      <ContentRenderer
        v-if="page"
        :value="page"
      />

      <section
        v-if="page.sources?.length || page.editorialStatus || page.updatedAt"
        class="mt-10 border-t border-default pt-6 text-sm"
        :aria-label="t('article.editorialStatus')"
      >
        <dl
          v-if="page.editorialStatus || page.updatedAt"
          class="mb-5 flex flex-wrap gap-x-8 gap-y-2 text-muted"
        >
          <div
            v-if="page.editorialStatus"
            class="flex gap-2"
          >
            <dt>{{ t('article.editorialStatus') }}:</dt>
            <dd>{{ t(`article.${page.editorialStatus}`) }}</dd>
          </div>
          <div
            v-if="page.updatedAt"
            class="flex gap-2"
          >
            <dt>{{ t('article.updatedAt') }}:</dt>
            <dd><time :datetime="page.updatedAt">{{ page.updatedAt }}</time></dd>
          </div>
        </dl>
        <div v-if="page.sources?.length">
          <h2 class="mb-3 text-lg font-semibold text-highlighted">
            {{ t('article.references') }}
          </h2>
          <ul class="list-disc space-y-2 ps-5">
            <li
              v-for="source in page.sources"
              :key="source.url"
            >
              <a
                :href="source.url"
                target="_blank"
                rel="noopener noreferrer"
                class="text-primary underline underline-offset-2"
              >{{ source.title }}</a>
            </li>
          </ul>
        </div>
      </section>

      <USeparator v-if="surround?.length" />

      <UContentSurround :surround="surround" />
    </UPageBody>

    <template
      v-if="page?.body?.toc?.links?.length"
      #right
    >
      <UContentToc
        :title="t('docs.toc')"
        :links="page.body?.toc?.links"
      >
        <template
          v-if="toc?.bottom"
          #bottom
        >
          <div
            class="hidden lg:block space-y-6"
            :class="{ '!mt-6': page.body?.toc?.links?.length }"
          >
            <USeparator
              v-if="page.body?.toc?.links?.length"
              type="dashed"
            />

            <UPageLinks
              :title="t('docs.links')"
              :links="links"
            />
          </div>
        </template>
      </UContentToc>
    </template>
  </UPage>
</template>
