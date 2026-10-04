# Turkion Audit Remediation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox syntax for tracking. The user has explicitly requested parallel agents and immediate implementation; execute independent ownership areas concurrently and integrate centrally.

**Goal:** Repair the technical and editorial defects documented in the audit and make recurrence detectable.

**Architecture:** Preserve Nuxt SSR and localized Markdown/YAML. Add shared media provenance and article source metadata, with validation and production checks. Optimize assets with recoverable archival originals.

**Tech Stack:** Nuxt 4, Vue 3, Nuxt Content 3, Zod, Node built-in test runner, YAML, sharp.

**Spec:** ../specs/2026-10-03-audit-remediation-design.md

## Global Constraints
- Supported locales: en, ru, uz; site URL defaults to https://www.turkion.org and is configurable with NUXT_PUBLIC_SITE_URL.
- Preserve existing URLs, source text unless an identified defect requires editing, and archival images.
- Never invent citations, image provenance, authors or review claims. Distinguish uncertainty from factual errors.
- Shared file ownership and metadata contracts are in the spec. All commands use tok. No push, deploy or merge.
- Ordinary wording corrections are verified by editorial review; add automated tests for systemic invariants and behavior, not one test per sentence.

## Review Focus
- Switching locale after search/gallery interaction must display new-language content and metadata.
- Missing source links and uncertain media licenses must not produce fabricated attribution or self-links.
- Root and localized SSR paths must expose valid canonical, alternates and crawlable text.
- Original assets, existing Markdown article URLs and translated historical claims must survive bulk processing.
- CI and a clean Node production deployment must work without accidental Vercel or hoisted-dependency assumptions.

### Task 1: Regression checks and integration configuration (root)
**Files:** scripts/validate-content.mjs, scripts/smoke.mjs, tests/content-validation.test.mjs, package.json, pnpm-lock.yaml, .github/workflows/ci.yml, nuxt.config.ts, content.config.ts.
**Interfaces:** consume article sources and media schema in spec; produce pnpm content:check, pnpm test, pnpm smoke.
- [x] Add checks for local targets/media, required source lists on subject country articles, locale timeline IDs, real gallery actions, language parity and dated demographics.
- [x] Run checks on baseline and retain expected failures.
- [x] Add production HTTP smoke checks for locale pages, metadata, valid image endpoint, all timeline bodies, sitemap and nonempty llms exports; verify baseline failures.
- [x] Simplify unused template collections and fallback schema; introduce optional article metadata and shared media data collection. Declare actually imported modules as direct dependencies.
- [x] Configure platform-appropriate images, site base URL, localized prerender seeds/route strategy, working llms prefixes, pull_request CI with content checks/tests/build/smoke.
- [x] Run complete test/check suite after integration.

### Task 2: Application behavior (UI worker)
**Files:** app/**, i18n/**, server/** only.
**Interfaces:** consume sources/editorialStatus/updatedAt article metadata and media collection per spec. Shared search state must allow button and keyboard opening without eager index fetch.
- [x] Reproduce mobile tree failure and gallery self-links from existing implementation; cover with a small behavior test where feasible, otherwise document browser/HTTP reproduction for central smoke checks.
- [x] Fix mobile localized navigation; show full article tree on mobile. Preserve desktop navigation.
- [x] Add reactive locale SEO via useLocaleHead; fix homepage OG to absolute /preview.png; use translated UI labels and reactive gallery data.
- [x] Defer content-search sections until search is opened, retaining Cmd/Ctrl+K and locale refresh.
- [x] Render all timeline text with SSR; remove duplicate main, template timeline external buttons; support prefers-reduced-motion in custom animation.
- [x] Gallery links open the image, with separately labeled verified source/attribution from media catalog; empty source is rendered as explicit unknown, never self-link. Fix hover-only labels for keyboard/touch accessibility and invalid gallery UHeader semantics.
- [x] Render article references/editorial metadata and people directory data supplied by text worker. Implement sitemap.xml/robots.txt from actual content paths and configured site URL.
- [x] Self-review and report covering checks; do not modify root-owned config or content files.

### Task 3: Editorial and localization repairs (text worker)
**Files:** content/{en,ru,uz}/** except flags.yml/miniatures.yml; editorial documentation if useful.
**Interfaces:** article sources as spec. People page may use items: Array<{ name: string, description: string, to: string }> in localized people.yml, with actual sourced profiles under docs/common/people/; coordinate additions with UI worker/root.
- [x] Correct all three timeline introductions/Xiongnu dates and uncertainty, EN 21st-century heading and scope; complete Russian coverage through modern period. Give corresponding sections stable id values across locales.
- [x] Correct all locale country card destinations and mislabeled sections; replace one-language slogan; align war catalog titles with actual article subject.
- [x] Relocate template tutorial navigation into an explicit contributor guide while retaining existing routes; replace excluded docs/index template prose with accurate entry text.
- [x] Add relevant verified sources and subject-specific concrete detail to the 60 country subject articles per locale. Do not mass-attach unrelated references. Add honest editorialStatus draft and stable translationOf where relevant; human-review needs remain visible.
- [x] Improve RU/UZ terminology, especially music/performance, check corpus for recurring literal mistranslations. Fix empty overview description, duplicate lines, label old demographic estimates historically (do not invent new counts).
- [x] Replace empty People landing with useful sourced profiles/navigation emphasizing underrepresented peoples; replace blog placeholder with accurate project/editorial information and useful links.
- [x] Verify all locales parse, semantic paths exist, no source-less country subject article remains; report factual sources and any honest uncertainties.

### Task 4: Catalogs, provenance and media (media worker)
**Files:** content/{en,ru,uz}/{flags,miniatures}.yml, content/media.yml, public media derivatives, scripts/prepare-media.mjs, media manifest/README.
**Interfaces:** shared media collection per spec; localized item img paths point to web derivatives and shared catalog img; originalFile names retained.
- [x] Translate all Uzbek flag copy/group/item names; fix incorrect flag destinations and classify symbols as states/peoples/movements/reconstructions with explicit uncertainty where not verified.
- [x] Correct miniature descriptions and promised groups. Replace all null item.url with an actual local image destination or verified source; source metadata belongs in shared catalog.
- [x] Obtain Commons/museum attribution using actual metadata where possible; mark unverified entries explicitly. Do not guess creator/license/date from filename. Share counts of verified vs unverified metadata.
- [x] Generate web-sized derivatives with sharp, ensure large originals remain recoverably preserved outside public, update all content references (coordinate references in index.yml with text worker; do not edit their files concurrently).
- [x] Record deterministic mapping and reproducible processing command; verify every referenced image and catalog item, preview representative output.

### Task 5: Final verification and independent review (root)
- [x] Integrate worker outputs and contracts; run content:check/test/lint/typecheck/build/smoke with clean dependency metadata.
- [x] Verify browser mobile navigation, 3-language switching, search, gallery image/source behavior, source display and representative corrected pages.
- [x] Dispatch independent review with final diff/spec/plan; resolve important findings and rerun relevant checks.
- [x] Update plan with results and limitations; report changes, verification and remaining specialist-review needs accurately. Leave changes reviewable without remote publishing.

## Execution record
- Baseline integrity tests: 4 failures reproduced (timeline IDs/coverage, gallery destinations, country links, Uzbek flags).
- Baseline corpus validation: 190 issues (mostly missing sources); retained log /tmp/turkion-content-baseline.log.
- Decision: legacy Turkic peoples body in RU/UZ is English. Replace with a coherent sourced overview across three languages and preserve full legacy text in docs/reference; this sacrifices encyclopedia-copy length in favor of maintainable actual localization.
- Installation used registry.npmjs.org because the user-level corporate registry could not resolve; project registry configuration remains unchanged.

- Production baseline: 12 smoke failures reproduced before implementation (/tmp/turkion-smoke-baseline.log).
- Dependency alignment: ESLint 10 with @nuxt/eslint 1.15, Nuxt Kit/devtools versions kept compatible with Nuxt 4.3.1. Direct imports motion-v, @nuxt/kit and scule are declared; YAML/sharp tooling is explicit.
- Browser checks: Russian search via button and Uzbek search via Cmd+K return the correct language; RU→UZ updates title, html lang and canonical. At 390px, full navigation tree opens and its Karakalpak profile link navigates correctly. Browser inspection exposed and resolved leftover internal UI labels (TOC, menu, search title).
- Independent review: two P2 findings (frontmatter sources missing from raw/LLM exports; unsupported Markdown heading anchor syntax) repaired and re-reviewed. Shared export metadata has two passing unit tests; actual overview sources and seven unique legacy anchors per locale were verified.
- Technical limitations retained: upstream Nuxt CLI peer warning for citty; no claim of exhaustive scholarly verification or invented image rights.

- Media completed centrally after worker file-write approval stalled. 300 derivatives: 953,242,000 original bytes → 89,545,576 public bytes (90.61% reduction). All 300 archived blobs match Git HEAD exactly; media:check verifies their SHA-256 manifest and derivative dimensions.
- Shared catalog: 428 assets, 186 verified by exact SHA-1 match to Commons API records, 242 explicitly unverified. Evidence recorded in media/commons-verification.json. A separate reviewer confirmed all 186 evidence/catalog/local-file matches.
- Flags: all 121 items translated/classified in three locales, including territorial flags and uncertain modern reconstructions. All image paths and ordering retained.
- Final regression tests: 10/10 pass; full ESLint passes. Final verification completed on 2026-10-04, as recorded below.

## Final verification (2026-10-04)
- `pnpm test`: 10/10 passing. Baseline failure cases are covered by the final regression suite.
- `pnpm content:check`: passed, 315 files, 267 Markdown articles, 1,829 image references and 1,251 internal links.
- `pnpm media:check`: passed for all 300 original/derivative pairs; archival integrity and dimensions checked.
- `pnpm lint`: passed across the project; last three Vue changes also passed a scoped rerun.
- `pnpm typecheck`: passed after clean dependency installation and generated types. The clean check exposed eight diagnostics: removed unsupported `watch: false` in two lazy search calls and guarded six optional card destinations before `localePath`. Independent review confirmed the runtime semantics.
- `pnpm build`: passed on the final source tree, prerendering 597 routes with `failOnError: true`.
- `pnpm smoke`: 13/13 production HTTP checks passed on the final build, including all locales, timeline SSR, legacy anchors, metadata, social preview, gallery image/legacy redirect/IPX aspect ratio, sitemap/robots, full LLM export and raw Markdown source/status preservation.
- Browser checks additionally confirmed readable gallery captions, verified source/credit/license metadata, explicit unknown-source labels, preserved artwork proportions and no console errors. Temporary browser tabs and local servers were stopped.
- Latest independent review approved the export, anchor, encoded-image-URL, aspect-ratio and clean-typecheck fixes without outstanding findings.
- Whitespace validation passes for active source and documentation. Three pre-existing whitespace diagnostics in the archived legacy Markdown are intentionally retained because these are exact archival copies, not published content.

## Runtime issues resolved during verification
- URL-encode gallery filenames before HTML escaping, including apostrophes, to prevent Nitro's crawler from truncating numeric HTML entities into broken URLs.
- Disable Nuxt Content's built-in raw Markdown handler via its public `contentRawMarkdown: false` option so the source-preserving custom handler owns `/raw/**`. Full LLM generation still receives the metadata hook.
- Use `fit="inside"` for IPX thumbnails to preserve complete paintings and flags; production smoke compares decoded image aspect ratios.
- An interrupted x64/Rosetta build failed after the host slept. Reinstalled the same frozen lockfile using native ARM Node 24.16.0 and pnpm 10.29.2; lockfile unchanged. The subsequent final builds and checks passed. Build artifacts are local ARM artifacts; deployment should build from source on its target platform.

## Handoff and remaining editorial work
- Changes are staged on `codex/audit-remediation` in `/Users/amadiev/.codex/worktrees/turkion-audit-fixes/turkion`. The original checkout remains clean. No remote publishing or deployment was performed.
- All reproducible defects addressed by this remediation plan are repaired. Historical prose is not presented as exhaustively peer-reviewed: articles retain an honest draft status and source scope. Specialist and native-language editorial review remains appropriate.
- Of 428 catalog assets, 186 have an exact Commons file match with recorded evidence; 242 retain explicit unverified status. Uncertain ownership/attribution is not represented as verified.
- Non-fatal upstream warnings remain (Nuxt CLI peer metadata, build chunk/sourcemap and browser-data advisories); no failing project check remains.

## Local browser QA follow-up (2026-10-04)
- Retested the production build on `http://127.0.0.1:3197` at mobile and desktop widths. Clicked primary navigation, the mobile menu, document tree, search results, language switcher, city and participation cards, flag and miniature galleries, and contributor guide pagination. Browser console had no errors on inspected pages.
- Fixed the root SEO redirect (`/` now 301 to `/en` and is absent from the sitemap), timeline H1, locale-preserving logo navigation, language-menu dismissal, invalid contributor-guide fragments, misleading homepage city cards and investor testimonials. Replaced the participation banner copy with an invitation to researchers, students, writers and translators.
- Translated the four Uzbek contributor-guide articles surfaced by the new participation card. Checked their localized H1/title/canonical and working example images in the browser.
- Independent production crawl: 282 sitemap pages (94 per locale) and 457 distinct internal link paths returned HTTP 200; all 232 distinct rendered image URLs returned image responses. It found no broken fragments or missing canonical, hreflang, language, title, description, H1, OpenGraph or alt metadata.
- Final validation after these edits: 11/11 tests, content validation, ESLint, Nuxt typecheck, production build and all production smoke checks passed. The local preview remains available on port 3197 for review.
