#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
WARS_DIR="$ROOT/public/wars"
FRAMES_ROOT="${WARS_FRAMES_ROOT:-/tmp/wars-gif-frames}"
ARTIFACT_DIR="${WARS_ARTIFACT_DIR:-/opt/cursor/artifacts/wars-gifs}"
mkdir -p "$ARTIFACT_DIR"

slug() {
  echo "$1" | sed -E 's/\.png$//; s/[^a-zA-Z0-9]+/-/g; s/^-+|-+$//g' | tr '[:upper:]' '[:lower:]'
}

encode_one() {
  local png="$1"
  local base="${png%.png}"
  local s
  s="$(slug "$png")"
  local frames="$FRAMES_ROOT/$s"
  local raw="/tmp/wars-$s-raw.gif"
  local palette="/tmp/wars-$s-palette.png"
  local out_gif="$WARS_DIR/${base}.gif"
  local artifact="$ARTIFACT_DIR/${s}.gif"

  if [[ ! -d "$frames" ]]; then
    echo "skip $png (no frames at $frames)" >&2
    return 1
  fi

  ffmpeg -y -framerate 12 -i "$frames/frame-%04d.png" \
    -vf "fps=8,scale=560:560:flags=lanczos,palettegen=max_colors=128:stats_mode=diff" \
    -update 1 "$palette" >/dev/null 2>&1

  ffmpeg -y -framerate 12 -i "$frames/frame-%04d.png" -i "$palette" \
    -lavfi "fps=8,scale=560:560:flags=lanczos[x];[x][1:v]paletteuse=dither=bayer:bayer_scale=5:diff_mode=rectangle" \
    -loop 0 "$raw" >/dev/null 2>&1

  if command -v gifsicle >/dev/null 2>&1; then
    gifsicle -O3 --lossy=55 --colors 128 -o "$out_gif" "$raw"
  else
    cp -f "$raw" "$out_gif"
  fi
  cp -f "$out_gif" "$artifact"
  ls -lh "$out_gif"
}

shopt -s nullglob
for png in "$WARS_DIR"/*.png; do
  name="$(basename "$png")"
  if [[ $# -gt 0 ]]; then
    match=0
    for arg in "$@"; do
      [[ "$name" == "$arg" || "$(slug "$name")" == "$arg" ]] && match=1
    done
    [[ $match -eq 1 ]] || continue
  fi
  encode_one "$name"
done
