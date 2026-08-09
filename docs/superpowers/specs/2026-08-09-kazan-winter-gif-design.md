# Kazan Winter Scene — Animated GIF Design

## Problem

We have a static isometric winter illustration of Kazan (`public/cities/kazan.png`, 1024×1024). The user wants a standalone looping GIF they can download or embed anywhere — not a site integration.

## Goal

Produce one looping GIF of the Kazan winter miniature with subtle life: snowfall, cloud drift, and a gentle camera move. Deliver as a downloadable artifact (not wired into the Nuxt app).

## Recommended approach

**HTML/canvas scene + browser capture → GIF**

1. Build a self-contained HTML page that draws `kazan.png` as the base layer.
2. Overlay a canvas particle system for falling snow.
3. Soft cloud drift (CSS or canvas) and a slow Ken Burns zoom/pan (~3–5% scale).
4. Optional micro “float” on the whole composition (1–2px vertical bob).
5. Capture the page for ~6–8 seconds at 1024×1024, encode to GIF (palette-optimized, looping).

### Alternatives considered

1. **FFmpeg-only filters** — faster pipeline, weaker snow/cloud control. Rejected for visual quality.
2. **Full Three.js rebuild** — not the source image; high effort and likeness risk. Rejected.
3. **MP4/WebM** — user explicitly wants GIF only.

## Deliverable

| Item | Spec |
|------|------|
| Format | GIF, infinite loop |
| Size | 1024×1024 (match source) |
| Length | ~6–8 seconds before loop |
| Source | `/workspace/public/cities/kazan.png` |
| Output | Artifact under `/opt/cursor/artifacts/` (and optionally mirrored under `public/` only if we later need it in-repo) |

## Motion budget (2–4 intentional motions)

1. **Snowfall** — continuous white particles, slight horizontal drift, varied size/speed.
2. **Cloud drift** — slow horizontal movement of soft cloud shapes at the top.
3. **Ken Burns** — very slow zoom-in + slight pan; resets cleanly for loop.
4. **Island float** (optional, keep subtle) — tiny vertical bob so the diorama feels alive.

No UI chrome, no text overlays, no badges.

## Non-goals

- Integrating the GIF into the homepage city grid.
- Replacing `kazan.png` in content YAML.
- Producing MP4/WebM.
- Redesigning landmarks or recoloring the scene.

## Verification

- Visual review of the GIF: snow reads clearly, loop is seamless enough, no flash at loop point.
- File opens in a normal image viewer / browser.
- Dimensions are 1024×1024 (or scaled down only if GIF size becomes impractical; prefer staying at 1024 if under ~8–12 MB).
