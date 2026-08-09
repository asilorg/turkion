# Wars, Battles & Armed Conflicts — Content Design

## Problem

Homepage section **Wars, Battles & Armed Conflicts** lists ten historical conflicts, but every item links to `/docs/common/turkic-peoples`. Visitors cannot open a dedicated article for each war or battle.

## Goal

Add a new encyclopedia content section with one academic article per conflict featured on the homepage, and wire homepage links to those articles for all locales (`en`, `uz`, `ru`).

## Recommended approach

**Extend the existing `docs` collection** with a new numbered section `9.wars` under each locale:

```
content/{en,uz,ru}/docs/9.wars/
  .navigation.yml
  index.md
  1.battle-of-talas.md
  2.seljuk-byzantine-wars.md
  3.mongol-conquests.md
  4.ottoman-wars-of-expansion.md
  5.timurs-military-campaigns.md
  6.ottoman-habsburg-wars.md
  7.russo-kazan-wars.md
  8.ottoman-safavid-wars.md
  9.foundation-of-the-mughal-empire.md
  10.turkish-war-of-independence.md
```

Routes resolve via existing `app/pages/[[lang]]/docs/[...slug].vue` to paths such as `/docs/wars/battle-of-talas` (locale-prefixed by i18n).

### Alternatives considered

1. **Dedicated `wars_*` Nuxt Content collection + new page routes** — more scaffolding (`content.config.ts`, pages, navigation inject), no reuse of docs layout/search/surround. Rejected as overkill.
2. **Single long wars overview page with anchors** — does not satisfy “document per battle.” Rejected.

## Content requirements

- **Scope:** Exactly the ten conflicts already listed in `content/*/index.yml` under `wars.features`.
- **Style:** Academic writing — formal prose, historical context, participants, course, outcomes, significance for Turkic history; avoid promotional tone and emoji.
- **Frontmatter:** `title`, `description` (and optional `links` only if needed by schema defaults).
- **Locales:** Full articles in English, Uzbek, and Russian matching each locale’s homepage titles/descriptions.
- **Homepage wiring:** Update each `wars.features[].to` from `/docs/common/turkic-peoples` to the matching `/docs/wars/<slug>`.

## Architecture / data flow

1. Markdown files under `docs/9.wars` are indexed by existing `docs_{locale}` collections (source already includes `{code}/docs/**/*`).
2. Docs layout + navigation auto-include the new section via Content navigation.
3. Homepage `ULink` already uses `localePath(war.to)`; only YAML `to` values change.

## Out of scope

- Redesigning the homepage wars marquee UI
- Changing gallery / other placeholder links to `turkic-peoples`
- Adding a separate top-level nav item beyond docs navigation
- New Zod collections in `content.config.ts` (not required)

## Success criteria

- Each wars card on `/` (and locale homes) navigates to a distinct article that renders with title, description, and academic body.
- Docs sidebar shows a **Wars** (localized) section with all ten articles.
- `pnpm lint` and `pnpm typecheck` pass; manual browser check confirms navigation and page render.
