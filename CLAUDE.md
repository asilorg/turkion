# CLAUDE.md

## Commands

Use pnpm and Node.js >=22.18.0 (CI uses Node 24).

```bash
pnpm dev            # Development server
pnpm build          # Production build, including linked localized prerender routes
pnpm preview        # Production preview
pnpm lint           # ESLint
pnpm typecheck      # TypeScript
pnpm content:check  # Local links/assets, metadata and locale parity
pnpm test           # Node regression tests
pnpm media:prepare  # Regenerate public miniature derivatives from archival originals
```

CI runs media checks, regression tests (including content validation), lint, typecheck and build on pushes and pull requests.

## Architecture

Turkion is a Nuxt 4 / Vue 3 content-driven SSR encyclopedia with English, Russian and Uzbek locale prefixes.

- `app/pages/`: homepage plus routes under `[[lang]]`; `/en`, `/ru`, `/uz` prefixes.
- `content/{en,ru,uz}`: YAML/Markdown, seven collections per locale (index, docs, timeline, flags, blog, people, miniatures). `content.config.ts` also defines the shared `media` data collection.
- `app/components/`: reusable UI. `GalleryMediaCard` separates the local image action from verified attribution.
- `app/app.vue`: localized navigation, reactive SEO and search sections fetched on first opening.
- `app/app.config.ts`: UI colors, navigation and footer configuration.
- `i18n/locales/{en,ru,uz}.json`: interface translations; editorial copy lives in content.
- `server/routes/`: raw Markdown export, sitemap and robots.
- `public/`: deployable static assets and miniature WebP derivatives.
- `media/originals/`: archival originals, excluded from public deployment.
- `scripts/`, `tests/`: repeatable content/media tooling and regression coverage.

Nuxt Content uses native SQLite. Nuxt Image detects the deployment provider, defaulting to IPX on Node. Motion is a direct dependency. Vercel Analytics is guarded by runtime configuration. The unused component metadata module is intentionally absent.

## Content contracts

Schemas live in `content.config.ts`. Country subject articles require relevant `sources: [{title, url}]`; additional fields include `editorialStatus`, `updatedAt`, `translationOf`. Never imply expert review from the presence of citations.

Timeline IDs must correspond across all three locales. Shared media entries contain `id`, public `img`, `originalFile`, and `attributionStatus`; source/credit/license fields are populated only from verified records. Flag entries distinguish states, peoples, movements and reconstructions. Preserve existing article routes and archival originals.

Set `NUXT_PUBLIC_SITE_URL` before building for another domain. It controls canonical/alternate URLs, sitemap and social preview metadata. The default is https://www.turkion.org.
