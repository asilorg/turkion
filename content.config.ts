import { z } from 'zod'
import type { DefinedCollection } from '@nuxt/content'
import { defineCollection, defineContentConfig } from '@nuxt/content'
import { useNuxt } from '@nuxt/kit'
import { joinURL } from 'ufo'

const { options } = useNuxt()
const cwd = joinURL(options.rootDir, 'content')
const locales = options.i18n?.locales

const Avatar = z.object({
  src: z.string(),
  alt: z.string().optional()
})

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

const PageFeature = z.object({
  title: z.string(),
  description: z.string().optional(),
  icon: z.string(),
  to: z.string(),
  target: z.enum(['_blank', '_self']).optional()
})

const PageHero = z.object({
  title: z.string(),
  description: z.string(),
  links: z.array(Button).optional()
})

const PageSection = z.object({
  title: z.string(),
  description: z.string(),
  icon: z.string().optional(),
  links: z.array(Button).optional(),
  features: z.array(PageFeature).optional()
})

const Page = z.object({
  title: z.string(),
  description: z.string(),
  hero: PageHero
})

let collections: Record<string, DefinedCollection>

if (locales && Array.isArray(locales)) {
  collections = {}

  for (const locale of locales) {
    const code = (typeof locale === 'string' ? locale : locale.code).replace('-', '_')

    collections[`index_${code}`] = defineCollection({
      type: 'page',
      source: `${code}/index.yml`,
      schema: Page.extend({
        title_left: z.string(),
        title_right: z.string(),
        hero: PageHero.extend({
          features: z.array(PageFeature)
        }),
        features: z.array(PageFeature),
        design_system: PageSection.extend({
          code: z.string()
        }),
        countries: PageSection.extend({
          features: z.array(PageFeature.extend({
            img: z.string()
          }))
        }),
        historyCountries: PageSection.extend({
          features: z.array(PageFeature.extend({
            img: z.string()
          }))
        }),
        details: PageSection.extend({
          cities: z.array(PageFeature.extend({
            img: z.string(),
            quote: z.string()
          })),
          miniatures: z.array(PageFeature.extend({
            img: z.string()
          }))
        }),
        users: PageSection.extend({
          features: z.array(PageFeature.extend({
            img: z.string(),
            quote: z.string()
          }))
        }),
        gallery: PageSection.extend({
          features: z.array(PageFeature.extend({
            img: z.string()
          }))
        }),
        wars: PageSection.extend({
          features: z.array(PageFeature.extend({
            img: z.string()
          }))
        }),
        templates: PageSection,
        community: PageSection
      })
    })
    collections[`docs_${code}`] = defineCollection({
      type: 'page',
      source: [{
        cwd,
        include: `${code}/docs/**/*`,
        prefix: `/${code}/docs`,
        exclude: [`${code}/docs/index.md`]
      }],
      schema: z.object({
        category: z.enum(['layout', 'form', 'element', 'navigation', 'data', 'overlay', 'dashboard', 'page', 'ai', 'color-mode', 'i18n']).optional(),
        framework: z.enum(['nuxt', 'vue']).optional(),
        navigation: z.object({
          title: z.string().optional()
        }),
        links: z.array(Button)
      })
    })
    collections[`timeline_${code}`] = defineCollection({
      type: 'page',
      source: `${code}/timeline.yml`,
      schema: Page.extend({
        timeline: z.array(z.object({
          title: z.string(),
          date: z.string(),
          markdown: z.string()
        }))
      })
    })
    collections[`flags_${code}`] = defineCollection({
      type: 'page',
      source: `${code}/flags.yml`,
      schema: Page.extend({
        flags: z.array(z.object({
          title: z.string(),
          items: z.array(z.object({
            img: z.string(),
            name: z.string(),
            url: z.string()
          }))
        }))
      })
    })
    collections[`blog_${code}`] = defineCollection({
      type: 'page',
      source: `${code}/blog.yml`,
      schema: Page.extend({})
    })
    collections[`people_${code}`] = defineCollection({
      type: 'page',
      source: `${code}/people.yml`,
      schema: Page.extend({})
    })
    collections[`miniatures_${code}`] = defineCollection({
      type: 'page',
      source: `${code}/miniatures.yml`,
      schema: Page.extend({
        timur_miniatures: z.array(z.object({
          title: z.string(),
          items: z.array(z.object({
            img: z.string(),
            name: z.string(),
            url: z.string()
          }))
        })),
        ottoman_miniatures: z.array(z.object({
          title: z.string(),
          items: z.array(z.object({
            img: z.string(),
            name: z.string(),
            url: z.string()
          }))
        })),
        mughal_miniatures: z.array(z.object({
          title: z.string(),
          items: z.array(z.object({
            img: z.string(),
            name: z.string(),
            url: z.string()
          }))
        }))
      })
    })
    collections[`templates_${code}`] = defineCollection({
      type: 'page',
      source: `${code}/templates.yml`,
      schema: Page.extend({
        items: z.array(z.object({
          title: z.string(),
          description: z.string(),
          icon: z.string(),
          framework: z.enum(['nuxt', 'vue']),
          features: z.array(PageFeature).optional(),
          links: z.array(Button).optional(),
          deploy_links: z.array(Button).optional()
        }))
      })
    })
    collections[`community_${code}`] = defineCollection({
      type: 'page',
      source: 'community.yml',
      schema: Page.extend({
        items: z.array(z.object({
          label: z.string(),
          description: z.string(),
          avatar: Avatar,
          user: z.object({
            name: z.string(),
            avatar: Avatar,
            to: z.string()
          }),
          to: z.string()
        }))
      })
    })
    collections[`team_${code}`] = defineCollection({
      type: 'page',
      source: 'team.yml',
      schema: Page
    })
    collections[`releases_${code}`] = defineCollection({
      type: 'page',
      source: 'releases.yml',
      schema: Page
    })
  }
} else {
  collections = {
    /** index */
    index: defineCollection({
      type: 'page',
      source: 'en/index.yml',
      schema: Page.extend({
        hero: PageHero.extend({
          features: z.array(PageFeature)
        }),
        features: z.array(PageFeature),
        design_system: PageSection.extend({
          code: z.string()
        }),
        countries: PageSection.extend({
          features: z.array(PageFeature.extend({
            img: z.string(),
            quote: z.string()
          }))
        }),
        historyCountries: PageSection.extend({
          features: z.array(PageFeature.extend({
            img: z.string(),
            quote: z.string()
          }))
        }),
        details: PageSection.extend({
          cities: z.array(PageFeature.extend({
            img: z.string(),
            quote: z.string()
          })),
          miniatures: z.array(PageFeature.extend({
            img: z.string()
          }))
        }),
        users: PageSection.extend({
          features: z.array(PageFeature.extend({
            img: z.string(),
            quote: z.string()
          }))
        }),
        gallery: PageSection.extend({
          features: z.array(PageFeature.extend({
            img: z.string()
          }))
        }),
        wars: PageSection.extend({
          features: z.array(PageFeature.extend({
            img: z.string()
          }))
        }),
        templates: PageSection,
        community: PageSection
      })
    }),
    /** docs */
    docs: defineCollection({
      type: 'page',
      source: [{
        cwd,
        include: 'en/docs/**/*',
        prefix: `/en/docs`,
        exclude: [`en/docs/index.md`]
      }],
      schema: z.object({
        category: z.enum(['layout', 'form', 'element', 'navigation', 'data', 'overlay', 'dashboard', 'page', 'ai', 'color-mode', 'i18n']).optional(),
        framework: z.enum(['nuxt', 'vue']).optional(),
        navigation: z.object({
          title: z.string().optional()
        }),
        links: z.array(Button)
      })
    }),
    timeline: defineCollection({
      type: 'page',
      source: 'en/timeline.yml',
      schema: Page.extend({
        timeline: z.array(z.object({
          title: z.string(),
          date: z.string(),
          markdown: z.string()
        }))
      })
    }),
    flags: defineCollection({
      type: 'page',
      source: 'en/flags.yml',
      schema: Page.extend({
        flags: z.array(z.object({
          title: z.string(),
          items: z.array(z.object({
            img: z.string(),
            name: z.string(),
            url: z.string()
          }))
        }))
      })
    }),
    miniatures: defineCollection({
      type: 'page',
      source: 'en/miniatures.yml',
      schema: Page.extend({
        timur_miniatures: z.array(z.object({
          title: z.string(),
          items: z.array(z.object({
            img: z.string(),
            name: z.string(),
            url: z.string()
          }))
        })),
        ottoman_miniatures: z.array(z.object({
          title: z.string(),
          items: z.array(z.object({
            img: z.string(),
            name: z.string(),
            url: z.string()
          }))
        })),
        mughal_miniatures: z.array(z.object({
          title: z.string(),
          items: z.array(z.object({
            img: z.string(),
            name: z.string(),
            url: z.string()
          }))
        }))
      })
    }),
    templates: defineCollection({
      type: 'page',
      source: 'en/templates.yml',
      schema: Page.extend({
        items: z.array(z.object({
          title: z.string(),
          description: z.string(),
          icon: z.string(),
          framework: z.enum(['nuxt', 'vue']),
          features: z.array(PageFeature).optional(),
          links: z.array(Button).optional(),
          deploy_links: z.array(Button).optional()
        }))
      })
    }),
    community: defineCollection({
      type: 'page',
      source: 'community.yml',
      schema: Page.extend({
        items: z.array(z.object({
          label: z.string(),
          description: z.string(),
          avatar: Avatar,
          user: z.object({
            name: z.string(),
            avatar: Avatar,
            to: z.string()
          }),
          to: z.string()
        }))
      })
    }),
    team: defineCollection({
      type: 'page',
      source: 'team.yml',
      schema: Page
    }),
    releases: defineCollection({
      type: 'page',
      source: 'releases.yml',
      schema: Page
    })
  }
}

export default defineContentConfig({ collections })
