import { z } from 'zod'
import type { DefinedCollection } from '@nuxt/content'
import { defineCollection, defineContentConfig } from '@nuxt/content'
import { useNuxt } from '@nuxt/kit'
import { joinURL } from 'ufo'

const cwd = joinURL(useNuxt().options.rootDir, 'content')
const Avatar = z.object({ src: z.string(), alt: z.string().optional() })
const Button = z.object({
  label: z.string(),
  icon: z.string().optional(),
  avatar: Avatar.optional(),
  leadingIcon: z.string().optional(),
  trailingIcon: z.string().optional(),
  to: z.string(),
  target: z.enum(['_blank', '_self']).optional(),
  color: z.enum(['primary', 'neutral', 'success', 'warning', 'error', 'info']).optional(),
  size: z.enum(['xs', 'sm', 'md', 'lg', 'xl']).optional(),
  variant: z.enum(['solid', 'outline', 'subtle', 'soft', 'ghost', 'link']).optional(),
  id: z.string().optional(),
  class: z.string().optional()
})
const Feature = z.object({
  title: z.string(),
  description: z.string().optional(),
  icon: z.string().optional(),
  to: z.string().optional(),
  target: z.enum(['_blank', '_self']).optional()
})
const Hero = z.object({ title: z.string(), description: z.string(), links: z.array(Button).optional() })
const Section = z.object({
  title: z.string(),
  description: z.string().optional(),
  icon: z.string().optional(),
  links: z.array(Button).optional(),
  features: z.array(Feature).optional()
})
const Page = z.object({ title: z.string(), description: z.string(), hero: Hero })
const ImageFeature = Feature.extend({ img: z.string() })
const GalleryItem = z.object({
  img: z.string(),
  name: z.string(),
  url: z.string().optional(),
  symbolType: z.enum(['state', 'people', 'movement', 'reconstruction']).optional(),
  status: z.string().optional(),
  symbolNote: z.string().optional()
})
const Gallery = z.array(z.object({ title: z.string(), items: z.array(GalleryItem) }))
const Source = z.object({ title: z.string(), url: z.string().url() })

const collections: Record<string, DefinedCollection> = {}
for (const code of ['en', 'ru', 'uz']) {
  collections[`index_${code}`] = defineCollection({
    type: 'page',
    source: `${code}/index.yml`,
    schema: Page.extend({
      hero: Hero.extend({ features: z.array(Feature) }),
      features: z.array(Feature),
      countries: Section.extend({ features: z.array(ImageFeature) }),
      historyCountries: Section.extend({ features: z.array(ImageFeature) }),
      details: Section.extend({
        cities: z.array(ImageFeature.extend({ quote: z.string().optional() })),
        miniatures: z.array(ImageFeature)
      }),
      users: Section.extend({ features: z.array(ImageFeature.extend({ body: z.string() })) }),
      gallery: Section.extend({ features: z.array(ImageFeature) }),
      wars: Section.extend({ features: z.array(ImageFeature) })
    })
  })
  collections[`docs_${code}`] = defineCollection({
    type: 'page',
    source: [{ cwd, include: `${code}/docs/**/*`, prefix: `/${code}/docs`, exclude: [`${code}/docs/index.md`] }],
    schema: z.object({
      navigation: z.union([z.boolean(), z.object({ title: z.string().optional(), icon: z.string().optional() })]).optional(),
      links: z.array(Button).default([]),
      sources: z.array(Source).default([]),
      editorialStatus: z.enum(['draft', 'reviewed']).optional(),
      updatedAt: z.string().optional(),
      translationOf: z.string().optional()
    })
  })
  collections[`timeline_${code}`] = defineCollection({
    type: 'page',
    source: `${code}/timeline.yml`,
    schema: z.object({
      title: z.string(),
      description: z.string(),
      timeline: z.array(z.object({ id: z.string(), title: z.string(), date: z.string(), markdown: z.string() }))
    })
  })
  collections[`flags_${code}`] = defineCollection({ type: 'page', source: `${code}/flags.yml`, schema: Page.extend({ flags: Gallery }) })
  collections[`miniatures_${code}`] = defineCollection({
    type: 'page', source: `${code}/miniatures.yml`,
    schema: Page.extend({ timur_miniatures: Gallery, ottoman_miniatures: Gallery, mughal_miniatures: Gallery })
  })
  collections[`people_${code}`] = defineCollection({
    type: 'page', source: `${code}/people.yml`,
    schema: Page.extend({ items: z.array(z.object({ name: z.string(), description: z.string(), to: z.string() })).default([]) })
  })
  collections[`blog_${code}`] = defineCollection({ type: 'page', source: `${code}/blog.yml`, schema: Page })
}
collections.media = defineCollection({
  type: 'data',
  source: 'media.yml',
  schema: z.object({
    items: z.array(z.object({
      id: z.string(),
      img: z.string(),
      originalFile: z.string(),
      sourceUrl: z.string().optional(),
      credit: z.string().optional(),
      license: z.string().optional(),
      licenseUrl: z.string().optional(),
      attributionStatus: z.enum(['verified', 'unverified'])
    }))
  })
})
export default defineContentConfig({ collections })
