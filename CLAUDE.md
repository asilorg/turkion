# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm preview      # Preview production build
pnpm lint         # Run ESLint
pnpm typecheck    # TypeScript type checking
```

Package manager is **pnpm**. There are no tests — CI runs lint and typecheck only.

## Architecture

**Turkion** is a Nuxt 4 (Vue 3) digital encyclopedia of the Turkic world. It is a content-driven, SSR site with dual-language support (English and Uzbek).

### Key layers

- **`app/pages/`** — File-based routing. `index.vue` is the home page; all other routes live under `[[lang]]/` for i18n prefix routing (`/en/*`, `/uz/*`). Default locale is English.
- **`content/`** — All site content stored as YAML and Markdown files, organized by locale (`content/en/`, `content/uz/`). Managed via Nuxt Content v3 with 11 typed collections defined in `content.config.ts` (index, docs, timeline, flags, blog, people, miniatures, templates, community, team, releases).
- **`app/components/`** — Vue components, grouped by feature (e.g. `home/`, `content/`, `OgImage/`).
- **`app/composables/`** — Shared logic: `useNavigation.ts`, `useHeader.ts`, `useMiniatures.ts`, `useFrameworks.ts`.
- **`app/app.config.ts`** — App-level runtime config: UI colors, header/footer links, SEO defaults, TOC settings.
- **`i18n/locales/`** — Translation strings in `en.json` and `uz.json`. UI strings go here; page content goes in `content/`.
- **`server/routes/raw/`** — Server-side API routes.
- **`public/`** — Static assets: flags, city images, miniatures, war images, audio, user avatars.

### Notable modules & their roles

| Module | Role |
|--------|------|
| `@nuxt/content` | Markdown/YAML CMS with typed collections |
| `@nuxtjs/i18n` | Locale prefix routing and translation |
| `@nuxt/ui` + Tailwind CSS 4 | Component library and styling |
| `@nuxt/image` | Optimized image handling |
| `nuxt-og-image` | Dynamic OG image generation (requires `NUXT_PUBLIC_SITE_URL`) |
| `nuxt-llms` + `@nuxtjs/mcp-toolkit` | LLM/MCP integration |
| `motion-v/nuxt` | Animations |

### Environment

Copy `.env.example` to `.env` and set `NUXT_PUBLIC_SITE_URL` for OG image generation to work locally.

### Content schema

Collection schemas are defined with Zod in `content.config.ts`. When adding or modifying content types, update the schema there first.