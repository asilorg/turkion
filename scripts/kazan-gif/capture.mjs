import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import puppeteer from 'puppeteer-core'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT_DIR = process.env.KAZAN_FRAMES_DIR || '/tmp/kazan-gif-frames'
const HTML = path.join(__dirname, 'index.html')
const SIZE = 1024
const FPS = 12
const DURATION_MS = 7000
const FRAME_COUNT = Math.round((DURATION_MS / 1000) * FPS)

async function main() {
  fs.rmSync(OUT_DIR, { recursive: true, force: true })
  fs.mkdirSync(OUT_DIR, { recursive: true })

  const browser = await puppeteer.launch({
    executablePath: process.env.CHROME_PATH || '/usr/local/bin/google-chrome',
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      `--window-size=${SIZE},${SIZE}`,
      '--hide-scrollbars'
    ],
    defaultViewport: { width: SIZE, height: SIZE, deviceScaleFactor: 1 }
  })

  const page = await browser.newPage()
  await page.goto(pathToFileURL(HTML).href, { waitUntil: 'networkidle0', timeout: 60000 })
  await page.waitForFunction('window.__kazanReady === true', { timeout: 30000 })
  await page.evaluate(() => { window.__CAPTURE__ = true })

  for (let i = 0; i < FRAME_COUNT; i++) {
    const t = (i / FRAME_COUNT) * DURATION_MS
    await page.evaluate((ms) => window.__kazanRender(ms), t)
    // Let layout/paint settle
    await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))))
    const file = path.join(OUT_DIR, `frame-${String(i).padStart(4, '0')}.png`)
    await page.screenshot({ path: file, type: 'png', clip: { x: 0, y: 0, width: SIZE, height: SIZE } })
    if (i % 12 === 0) console.log(`captured ${i + 1}/${FRAME_COUNT}`)
  }

  await browser.close()
  console.log(`Done: ${FRAME_COUNT} frames in ${OUT_DIR}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
