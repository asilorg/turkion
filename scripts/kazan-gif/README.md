# Kazan winter GIF

Generates a looping animated GIF from `public/cities/kazan.png`.

## Requirements

- Node.js 20+
- Google Chrome (`/usr/local/bin/google-chrome` or set `CHROME_PATH`)
- ffmpeg
- gifsicle (optional, for smaller output)

## Usage

```bash
cd scripts/kazan-gif
npm install
npm run gif
```

Outputs:

- `/opt/cursor/artifacts/kazan-winter.gif` — compact shareable GIF
- `/opt/cursor/artifacts/kazan-winter-hq.gif` — higher quality artifact
- `public/cities/kazan-winter.gif` — repo copy of the compact GIF
