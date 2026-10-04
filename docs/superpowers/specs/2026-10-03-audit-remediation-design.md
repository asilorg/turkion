# Turkion audit remediation design

The user requested a plan and implementation of all errors found in the project/content audit. Existing Nuxt 4, Nuxt Content, three language prefixes and file-based publishing remain. This is remediation of existing flows with small data-model additions, not a platform migration.

## Outcomes
- Mobile article navigation works; gallery actions have valid destinations; Node and Vercel deployments can serve images.
- All locales expose canonical/alternate metadata, sitemap and functional Markdown/LLM exports.
- Search work is deferred until interaction; all timeline text remains in SSR; reduced motion and landmarks are correct.
- RU/EN/UZ have matching semantic content coverage. Correct the timeline, Uzbek flag translations, mistranslated musical terminology, misleading labels, routes and template remnants.
- Country articles gain relevant, verified references and concrete subject detail. Historical uncertainty remains explicit. Do not invent research, citations, authorship, reviewer identity, dates, provenance or image licenses.
- Miniature/flag assets have a shared media catalog. Known sources are verified; unverified catalog fields remain explicitly unknown. Gallery provides image viewing even without an external source.
- Web-sized media derivatives reduce public delivery/build size without overwriting archival originals. Originals remain locally preserved outside public and documented.
- Content validation and production smoke checks run in CI. Existing routes remain compatible.

## Contracts
- Supported locales: en, ru, uz; site URL defaults to https://www.turkion.org and is configurable with NUXT_PUBLIC_SITE_URL.
- Article sources: sources?: Array<{ title: string, url: string }>. Metadata: editorialStatus?: 'draft' | 'reviewed', updatedAt?: string (ISO date), translationOf?: string. Default existing unspecialist-reviewed content to draft; do not claim peer review.
- Shared media catalog: content/media.yml is a data collection named media; root items: Array<{ id: string, img: string, originalFile: string, sourceUrl?: string, credit?: string, license?: string, licenseUrl?: string, attributionStatus: 'verified' | 'unverified' }>. id is deterministic and locale-independent; gallery matches img. Do not treat an inferred Commons filename URL as verified provenance.
- Existing localized gallery items keep img/name, optional url. Empty URLs must not become self-links. Verified source metadata may live exclusively in the shared catalog; local image viewing always works.
- Root owns content.config.ts, nuxt.config.ts, package files, CI, scripts/tests and integration. UI worker owns app/**, i18n/**, server/**. Text worker owns localized content except flags.yml and miniatures.yml. Media worker owns localized flags.yml/miniatures.yml, content/media.yml, media derivatives/manifests and media processing script.
- No deployment, remote publication or destructive deletion. Changes remain reviewable in the managed worktree.

## Validation
Meaningful content assertions and HTTP smoke tests reproduce pre-fix failures. Validate every MD/YAML file, references, local media, locale IDs/coverage and semantic links. Run lint, typecheck, build, complete content checks and HTTP smoke tests. Manually verify mobile navigation, locale switching, gallery image/source actions and search in the browser. Review the final diff independently.
