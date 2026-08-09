# Wars Battles Content Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `docs/9.wars` content section with ten academic articles per locale and wire homepage wars links to those articles.

**Architecture:** Reuse the existing Nuxt Content `docs_{locale}` collection and docs slug page. No Vue/route/schema changes. Content lives under `content/{locale}/docs/9.wars/`; homepage YAML `to` fields point at `/docs/wars/<slug>`.

**Tech Stack:** Nuxt Content v3, Markdown + YAML frontmatter, existing docs layout.

## Global Constraints

- Branch name: `cursor/wars-battles-content-021e`
- Locales: `en`, `uz`, `ru` — full parity
- Exactly ten conflicts from homepage `wars.features`
- Academic writing style; no new UI components
- CI: `pnpm lint` and `pnpm typecheck` must pass

---

## File map

| Path | Responsibility |
|------|----------------|
| `content/{locale}/docs/9.wars/.navigation.yml` | Docs sidebar label/icon for Wars |
| `content/{locale}/docs/9.wars/index.md` | Section landing page + article index |
| `content/{locale}/docs/9.wars/*.md` | One academic article per conflict |
| `content/{locale}/index.yml` | Update `wars.features[].to` links |
| `docs/superpowers/specs/2026-08-09-wars-battles-content-design.md` | Design record |
| `docs/superpowers/plans/2026-08-09-wars-battles-content.md` | This plan |

### Slug map

| Homepage topic | Slug |
|----------------|------|
| Battle of Talas | `battle-of-talas` |
| Seljuk-Byzantine Wars | `seljuk-byzantine-wars` |
| Mongol Conquests | `mongol-conquests` |
| Ottoman Wars of Expansion | `ottoman-wars-of-expansion` |
| Timur's Military Campaigns | `timurs-military-campaigns` |
| Ottoman-Habsburg Wars | `ottoman-habsburg-wars` |
| Russo-Kazan Wars | `russo-kazan-wars` |
| Ottoman-Safavid Wars | `ottoman-safavid-wars` |
| Foundation of the Mughal Empire | `foundation-of-the-mughal-empire` |
| Turkish War of Independence | `turkish-war-of-independence` |

---

### Task 1: Scaffold wars section (en/uz/ru)

- [ ] Create `9.wars/.navigation.yml` and `index.md` for each locale
- [ ] Commit scaffold

### Task 2: Write English academic articles

- [ ] Create ten English markdown articles with academic structure (context, participants, course, outcomes, significance)
- [ ] Commit

### Task 3: Write Uzbek and Russian academic articles

- [ ] Create ten Uzbek + ten Russian articles (parity with English topics)
- [ ] Commit

### Task 4: Wire homepage links

- [ ] Update `wars.features[].to` in `content/en/index.yml`, `content/uz/index.yml`, `content/ru/index.yml`
- [ ] Commit

### Task 5: Verify

- [ ] Run `pnpm lint` and `pnpm typecheck`
- [ ] Start `pnpm dev`, open homepage wars links in browser, confirm article pages render
- [ ] Fix any issues; commit if needed
