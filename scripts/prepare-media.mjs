#!/usr/bin/env node
import { readdir, mkdir, rename, stat, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'
import { createHash } from 'node:crypto'

const root = process.cwd()
const originals = path.join(root, 'media/originals/miniatures')
const legacy = path.join(root, 'public/miniatures')
const derivatives = path.join(root, 'public/miniatures-web')
const maxWidth = 1600
const quality = 82

async function walk(dir) {
  try {
    const entries = await readdir(dir, { withFileTypes: true })
    const files = []
    for (const entry of entries) {
      const full = path.join(dir, entry.name)
      if (entry.isDirectory()) files.push(...await walk(full))
      else if (entry.isFile()) files.push(full)
    }
    return files.sort()
  } catch (error) {
    if (error.code === 'ENOENT') return []
    throw error
  }
}

const legacyFiles = await walk(legacy)
const archiveFiles = await walk(originals)
const relative = new Set([...legacyFiles.map(file => path.relative(legacy, file)), ...archiveFiles.map(file => path.relative(originals, file))])
const files = [...relative].sort()
if (files.length === 0) throw new Error('No miniature originals found')
const check = process.argv.includes('--check')
const manifestPath = path.join(root, 'media/miniatures-manifest.json')
const previousManifest = check ? JSON.parse(await readFile(manifestPath, 'utf8')) : undefined
if (check && previousManifest.items.length !== files.length) throw new Error('Original file count does not match the preservation manifest')
const manifest = []
let oldBytes = 0
let webBytes = 0
let created = 0
for (const rel of files) {
  const oldPath = path.join(legacy, rel)
  const archivedPath = path.join(originals, rel)
  const webPath = path.join(derivatives, `${rel}.webp`)
  const oldExists = legacyFiles.includes(oldPath)
  const archivedExists = archiveFiles.includes(archivedPath)
  if (oldExists && archivedExists) throw new Error(`Ambiguous duplicate original: ${rel}`)
  if (check && oldExists) throw new Error(`Original still under public: ${rel}`)
  if (!check && oldExists) {
    await mkdir(path.dirname(archivedPath), { recursive: true })
    await rename(oldPath, archivedPath)
  }
  const originalInfo = await stat(archivedPath)
  oldBytes += originalInfo.size
  if (!check) {
    await mkdir(path.dirname(webPath), { recursive: true })
    await sharp(archivedPath, { limitInputPixels: 268402689 }).rotate().resize({ width: maxWidth, height: maxWidth, fit: 'inside', withoutEnlargement: true }).webp({ quality, effort: 4 }).toFile(webPath)
    created++
  }
  const sha256 = createHash('sha256').update(await readFile(archivedPath)).digest('hex')
  if (check && previousManifest?.items.find(item => item.originalFile === `media/originals/miniatures/${rel}`)?.sha256 !== sha256) throw new Error(`Original hash mismatch: ${rel}`)
  manifest.push({ originalFile: `media/originals/miniatures/${rel}`, img: `/miniatures-web/${rel}.webp`, sha256, originalBytes: originalInfo.size })
  const webInfo = await stat(webPath)
  webBytes += webInfo.size
  if (webInfo.size === 0) throw new Error(`Empty derivative: ${rel}`)
  if (check) {
    const info = await sharp(webPath).metadata()
    if (info.format !== 'webp' || info.width > maxWidth || info.height > maxWidth) throw new Error(`Invalid derivative: ${rel}`)
  }
}
if (!check) await writeFile(manifestPath, JSON.stringify({ maxDimension: maxWidth, quality, items: manifest }, null, 2) + '\n')
console.log(JSON.stringify({ files: files.length, created, originalBytes: oldBytes, derivativeBytes: webBytes, savedPercent: +(100 * (1 - webBytes / oldBytes)).toFixed(2), mode: check ? 'check' : 'prepare' }))
