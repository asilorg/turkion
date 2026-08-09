#!/usr/bin/env python3
"""Remove Gemini sparkle watermarks from war (and similar) 1024×1024 assets."""
from __future__ import annotations

import argparse
import shutil
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parents[2]
WARS_DIR = ROOT / 'public' / 'wars'
BACKUP_DIR = Path(__file__).resolve().parent / 'originals'

# Measured logo center on Gemini 1024×1024 exports
CX, CY = 968, 968
RADIUS = 42


def remove_logo(src: Path, dst: Path) -> tuple[list[float], Path]:
    img = Image.open(src).convert('RGB')
    arr = np.array(img)
    h, w, _ = arr.shape

    yy, xx = np.ogrid[:h, :w]
    dist = np.sqrt((xx - CX) ** 2 + (yy - CY) ** 2)
    ring = (dist > 45) & (dist < 90)
    if not ring.any():
        ring = (dist > 50) & (dist < 120)
    bg = np.median(arr[ring].reshape(-1, 3), axis=0)

    cover = Image.new('L', (w, h), 0)
    draw = ImageDraw.Draw(cover)
    draw.ellipse((CX - RADIUS, CY - RADIUS, CX + RADIUS, CY + RADIUS), fill=255)
    cover = cover.filter(ImageFilter.GaussianBlur(radius=4))
    alpha = np.array(cover).astype(np.float32) / 255.0

    out = arr.astype(np.float32)
    for c in range(3):
        out[..., c] = out[..., c] * (1.0 - alpha) + bg[c] * alpha

    dst.parent.mkdir(parents=True, exist_ok=True)
    Image.fromarray(np.clip(out, 0, 255).astype(np.uint8)).save(dst, optimize=True)
    return bg.tolist(), dst


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument('--inplace', action='store_true', help='Overwrite public/wars PNGs after backup')
    parser.add_argument('--dir', type=Path, default=WARS_DIR)
    args = parser.parse_args()

    files = sorted(args.dir.glob('*.png'))
    if not files:
        raise SystemExit(f'No PNGs in {args.dir}')

    BACKUP_DIR.mkdir(parents=True, exist_ok=True)
    for src in files:
        backup = BACKUP_DIR / src.name
        if not backup.exists():
            shutil.copy2(src, backup)
            print(f'backup → {backup.name}')

        if args.inplace:
            dst = src
            # clean from backup so re-runs stay idempotent
            bg, out = remove_logo(backup, dst)
        else:
            dst = Path(__file__).resolve().parent / 'clean' / src.name
            bg, out = remove_logo(backup if backup.exists() else src, dst)
        print(f'clean  → {out.name} bg={bg}')


if __name__ == '__main__':
    main()
