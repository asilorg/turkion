#!/usr/bin/env bash
set -euo pipefail

FRAMES_DIR="${KAZAN_FRAMES_DIR:-/tmp/kazan-gif-frames}"
ARTIFACT_DIR="${KAZAN_ARTIFACT_DIR:-/opt/cursor/artifacts}"
OUT_GIF="${ARTIFACT_DIR}/kazan-winter.gif"
OUT_HQ="${ARTIFACT_DIR}/kazan-winter-hq.gif"
REPO_COPY="/workspace/public/cities/kazan-winter.gif"
PALETTE="/tmp/kazan-palette.png"
RAW="/tmp/kazan-raw.gif"

mkdir -p "$ARTIFACT_DIR"

# Compact shareable GIF (640px / 8fps)
ffmpeg -y -framerate 12 -i "$FRAMES_DIR/frame-%04d.png" \
  -vf "fps=8,scale=640:640:flags=lanczos,palettegen=max_colors=128:stats_mode=diff" \
  -update 1 "$PALETTE"

ffmpeg -y -framerate 12 -i "$FRAMES_DIR/frame-%04d.png" -i "$PALETTE" \
  -lavfi "fps=8,scale=640:640:flags=lanczos[x];[x][1:v]paletteuse=dither=bayer:bayer_scale=5:diff_mode=rectangle" \
  -loop 0 "$RAW"

if command -v gifsicle >/dev/null 2>&1; then
  gifsicle -O3 --lossy=60 --colors 128 -o "$OUT_GIF" "$RAW"
else
  cp -f "$RAW" "$OUT_GIF"
fi

cp -f "$OUT_GIF" "$REPO_COPY"

# Optional higher-quality artifact (not committed)
ffmpeg -y -framerate 12 -i "$FRAMES_DIR/frame-%04d.png" \
  -vf "fps=10,scale=800:800:flags=lanczos,palettegen=max_colors=192:stats_mode=diff" \
  -update 1 /tmp/kazan-palette-hq.png

ffmpeg -y -framerate 12 -i "$FRAMES_DIR/frame-%04d.png" -i /tmp/kazan-palette-hq.png \
  -lavfi "fps=10,scale=800:800:flags=lanczos[x];[x][1:v]paletteuse=dither=bayer:bayer_scale=4" \
  -loop 0 /tmp/kazan-hq.gif

if command -v gifsicle >/dev/null 2>&1; then
  gifsicle -O3 --lossy=35 -o "$OUT_HQ" /tmp/kazan-hq.gif
else
  cp -f /tmp/kazan-hq.gif "$OUT_HQ"
fi

ls -lh "$OUT_GIF" "$OUT_HQ" "$REPO_COPY"
