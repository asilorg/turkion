# Wars section animated GIFs

Cleans Gemini watermarks from `public/wars/*.png`, then builds looping GIFs
(Ken Burns + dust/smoke atmosphere) for the homepage Wars marquee.

## Usage

```bash
cd scripts/wars-gif
npm install
pip install pillow numpy
npm run gif
```

Then point `content/*/index.yml` `wars.features[].img` at the matching `.gif`.
