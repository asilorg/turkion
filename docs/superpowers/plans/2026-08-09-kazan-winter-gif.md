# Kazan Winter GIF — Implementation Plan

> **For agentic workers:** Execute task-by-task. Commit after each completed task group.

**Goal:** Produce a looping 1024×1024 GIF of `public/cities/kazan.png` with snow, cloud drift, and gentle Ken Burns, delivered as a downloadable artifact.

**Spec:** `docs/superpowers/specs/2026-08-09-kazan-winter-gif-design.md`

---

### Task 1: Animation scene (HTML + canvas)

**Files:**
- Create: `scripts/kazan-gif/index.html`
- Create: `scripts/kazan-gif/scene.js`

**Steps:**
1. Full-viewport 1024×1024 scene using the Kazan PNG as base.
2. Canvas overlays: snowfall particles, soft cloud shapes, sine-based zoom/float for seamless loop.
3. Expose `window.__kazanReady` and `window.__kazanTick(t)` (or continuous rAF driven by wall clock) for capture.

**Done when:** Opening the HTML in Chrome shows a living loopable scene.

---

### Task 2: Capture script

**Files:**
- Create: `scripts/kazan-gif/capture.mjs`

**Steps:**
1. Use `puppeteer-core` + system `google-chrome`.
2. Load the HTML via `file://` (or a tiny static server).
3. Capture ~6s at 12 fps → PNG frame sequence under `/tmp/kazan-gif-frames/`.

**Done when:** Frame directory contains ~72 PNGs at 1024×1024.

---

### Task 3: Encode GIF

**Steps:**
1. `ffmpeg` two-pass palette (`palettegen` / `paletteuse`) → `/opt/cursor/artifacts/kazan-winter.gif`.
2. Optionally copy into `public/cities/kazan-winter.gif` for repo downloadability.
3. Visually verify loop (open GIF / sample frames).

**Done when:** GIF loops cleanly, snow is visible, file opens in browser.

---

### Task 4: Ship

1. Commit scripts + GIF (if under a reasonable size; otherwise artifact-only + scripts).
2. Push branch, update PR.
