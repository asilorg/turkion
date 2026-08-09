#!/usr/bin/env python3
"""Remove the Gemini sparkle watermark from the Kazan city miniature."""
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parents[2]
SRC = ROOT / 'public' / 'cities' / 'kazan.png'
OUT = Path(__file__).resolve().parent / 'kazan-clean.png'

# Measured logo center on 1024×1024 asset
CX, CY = 968, 968
RADIUS = 42


def main() -> None:
    src = Image.open(SRC).convert('RGB')
    arr = np.array(src)
    h, w, _ = arr.shape

    yy, xx = np.ogrid[:h, :w]
    dist = np.sqrt((xx - CX) ** 2 + (yy - CY) ** 2)
    ring = (dist > 45) & (dist < 90)
    bg = np.median(arr[ring].reshape(-1, 3), axis=0)

    cover = Image.new('L', (w, h), 0)
    draw = ImageDraw.Draw(cover)
    draw.ellipse((CX - RADIUS, CY - RADIUS, CX + RADIUS, CY + RADIUS), fill=255)
    cover = cover.filter(ImageFilter.GaussianBlur(radius=4))
    alpha = np.array(cover).astype(np.float32) / 255.0

    out = arr.astype(np.float32)
    for c in range(3):
        out[..., c] = out[..., c] * (1.0 - alpha) + bg[c] * alpha

    Image.fromarray(np.clip(out, 0, 255).astype(np.uint8)).save(OUT, optimize=True)
    print(f'Wrote {OUT} (bg={bg.tolist()})')


if __name__ == '__main__':
    main()
