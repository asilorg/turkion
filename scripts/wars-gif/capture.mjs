import fs from 'node:fs'
import http from 'node:http'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import puppeteer from 'puppeteer-core'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '../..')
const WARS_DIR = path.join(ROOT, 'public', 'wars')
const FRAMES_ROOT = process.env.WARS_FRAMES_ROOT || '/tmp/wars-gif-frames'
const SIZE = 1024
const FPS = 12
const DURATION_MS = 7000
const FRAME_COUNT = Math.round((DURATION_MS / 1000) * FPS)

function listPngs() {
  return fs.readdirSync(WARS_DIR)
    .filter((f) => f.toLowerCase().endsWith('.png'))
    .sort()
}

function slug(name) {
  return name.replace(/\.png$/i, '').replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, '').toLowerCase()
}

function contentType(filePath) {
  if (filePath.endsWith('.html')) return 'text/html; charset=utf-8'
  if (filePath.endsWith('.png')) return 'image/png'
  if (filePath.endsWith('.js')) return 'text/javascript'
  return 'application/octet-stream'
}

function startServer() {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const url = new URL(req.url || '/', 'http://127.0.0.1')
      const rel = decodeURIComponent(url.pathname)
      const filePath = path.join(ROOT, rel)
      if (!filePath.startsWith(ROOT) || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
        res.writeHead(404)
        res.end('not found')
        return
      }
      res.writeHead(200, { 'Content-Type': contentType(filePath) })
      fs.createReadStream(filePath).pipe(res)
    })
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address()
      resolve({ server, port })
    })
  })
}

async function captureOne(browser, port, pngName) {
  const outDir = path.join(FRAMES_ROOT, slug(pngName))
  fs.rmSync(outDir, { recursive: true, force: true })
  fs.mkdirSync(outDir, { recursive: true })

  const page = await browser.newPage()
  const imgPath = `/public/wars/${encodeURIComponent(pngName).replace(/%2F/g, '/')}`
  // encodeURIComponent encodes spaces; keep path segments intact
  const imgUrl = `/public/wars/${pngName.split('/').map(encodeURIComponent).join('/')}`
  const htmlUrl = `http://127.0.0.1:${port}/scripts/wars-gif/index.html?src=${encodeURIComponent(imgUrl)}`
  await page.goto(htmlUrl, { waitUntil: 'networkidle0', timeout: 60000 })
  await page.waitForFunction('window.__sceneReady === true', { timeout: 30000 })
  await page.evaluate(() => { window.__CAPTURE__ = true })

  for (let i = 0; i < FRAME_COUNT; i++) {
    const t = (i / FRAME_COUNT) * DURATION_MS
    await page.evaluate((ms) => window.__sceneRender(ms), t)
    await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))))
    await page.screenshot({
      path: path.join(outDir, `frame-${String(i).padStart(4, '0')}.png`),
      type: 'png',
      clip: { x: 0, y: 0, width: SIZE, height: SIZE }
    })
  }
  await page.close()
  console.log(`captured ${pngName} → ${FRAME_COUNT} frames`)
  return outDir
}

async function main() {
  const only = process.argv.slice(2)
  const files = listPngs().filter((f) => only.length === 0 || only.includes(f) || only.includes(slug(f)))
  if (!files.length) throw new Error('No matching war PNGs')

  const { server, port } = await startServer()
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

  try {
    for (const file of files) {
      await captureOne(browser, port, file)
    }
  } finally {
    await browser.close()
    server.close()
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
