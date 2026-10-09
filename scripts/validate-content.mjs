import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import YAML from 'yaml'

export const locales = ['en', 'ru', 'uz']
const isHttp = (value) => {
  try {
    return ['https:', 'http:'].includes(new URL(value).protocol)
  } catch {
    return false
  }
}

export function articleErrors(data, { requireSources = false } = {}) {
  const errors = []
  if (!data?.title?.trim()) errors.push('missing title')
  if (!data?.description?.trim()) errors.push('missing description')
  if (requireSources && !data.sources?.length) errors.push('missing article sources')
  if (data.sources !== undefined) {
    if (!Array.isArray(data.sources)) errors.push('sources must be an array')
    else for (const source of data.sources) {
      if (!source?.title?.trim() || !isHttp(source.url)) errors.push('source needs a title and HTTP(S) URL')
    }
  }
  if (data.editorialStatus && !['draft', 'reviewed'].includes(data.editorialStatus)) errors.push('unknown editorial status')
  if (data.updatedAt && !/^\d{4}-\d{2}-\d{2}$/.test(data.updatedAt)) errors.push('updatedAt must use YYYY-MM-DD')
  return errors
}

export function auditContent(root = '.') {
  root = resolve(root)
  const contentRoot = resolve(root, 'content')
  const files = readdirSync(contentRoot, { recursive: true }).filter(file => /\.(md|ya?ml)$/.test(file) && locales.includes(file.split('/')[0]))
  const errors = []
  const records = []
  const routes = new Set(['/'])
  const complain = (file, message) => errors.push(`${file}: ${message}`)
  for (const locale of locales) for (const page of ['', '/docs', '/timeline', '/flags', '/miniatures', '/people', '/blog']) routes.add(`/${locale}${page}`)
  for (const file of files) {
    const text = readFileSync(resolve(contentRoot, file), 'utf8')
    try {
      const frontmatter = file.endsWith('.md') ? text.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/)?.[1] : text
      if (frontmatter === undefined) {
        complain(file, 'missing frontmatter')
        continue
      }
      const data = YAML.parse(frontmatter)
      const pagePath = '/' + file.replace(/\.md$/, '').split('/').map(part => part.replace(/^\d+\./, '')).join('/').replace(/\/index$/, '')
      if (file.endsWith('.md')) routes.add(pagePath)
      records.push({ file, data, text, pagePath, locale: file.split('/')[0] })
    } catch (error) {
      complain(file, `invalid YAML: ${error.message}`)
    }
  }
  let imageReferences = 0
  let internalLinks = 0
  const checkTarget = (file, locale, target, media = false) => {
    if (typeof target !== 'string' || !target.startsWith('/')) return
    const pathname = target.split(/[?#]/)[0].replace(/\/$/, '') || '/'
    const decoded = decodeURI(pathname)
    if (media || /\.[a-z0-9]{2,5}$/i.test(decoded)) {
      imageReferences += Number(media)
      if (!existsSync(resolve(root, 'public', decoded.slice(1)))) complain(file, `missing asset ${pathname}`)
    } else {
      internalLinks++
      const localized = /^\/(en|ru|uz)(?:\/|$)/.test(pathname) ? pathname : `/${locale}${pathname === '/' ? '' : pathname}`
      if (!routes.has(localized)) complain(file, `missing route ${localized}`)
    }
  }
  const walk = (value, record, key = '') => {
    if (Array.isArray(value)) value.forEach(item => walk(item, record, key))
    else if (value && typeof value === 'object') Object.entries(value).forEach(([k, item]) => walk(item, record, k))
    else if (['img', 'src', 'to'].includes(key)) checkTarget(record.file, record.locale, value, key !== 'to')
  }
  for (const record of records) {
    const { file, data, text, locale } = record
    walk(data, record)
    if (file.endsWith('.md')) {
      const subject = /\/docs\/[2-7]\.[^/]+\/(?!index\.md)[^/]+\.md$/.test(file)
      for (const error of articleErrors(data, { requireSources: subject })) complain(file, error)
      for (const match of text.matchAll(/\]\((\/[^\s)]*)\)/g)) checkTarget(file, locale, match[1])
    }
  }
  const expectedFiles = files.filter(file => file.startsWith('en/')).map(file => file.slice(3)).sort()
  for (const locale of locales.slice(1)) {
    const actual = files.filter(file => file.startsWith(`${locale}/`)).map(file => file.slice(3)).sort()
    for (const missing of expectedFiles.filter(file => !actual.includes(file))) complain(locale, `missing translation ${missing}`)
    for (const extra of actual.filter(file => !expectedFiles.includes(file))) complain(locale, `unpaired translation ${extra}`)
  }
  const catalogPath = resolve(contentRoot, 'media.yml')
  if (!existsSync(catalogPath)) complain('media.yml', 'missing shared media catalog')
  else {
    try {
      const catalog = YAML.parse(readFileSync(catalogPath, 'utf8')).items
      const ids = new Set()
      const images = new Set()
      for (const item of catalog) {
        if (!item.id || ids.has(item.id)) complain('media.yml', `missing or duplicate id ${item.id}`)
        if (!item.img || images.has(item.img)) complain('media.yml', `missing or duplicate image ${item.img}`)
        ids.add(item.id)
        images.add(item.img)
        checkTarget('media.yml', 'en', item.img, true)
        if (!item.originalFile || !existsSync(resolve(root, item.originalFile))) complain('media.yml', `missing original ${item.originalFile}`)
        if (!['verified', 'unverified'].includes(item.attributionStatus)) complain('media.yml', `invalid attribution status for ${item.id}`)
        if (item.attributionStatus === 'verified' && !isHttp(item.sourceUrl)) complain('media.yml', `verified media lacks source ${item.id}`)
        if (item.licenseUrl && !isHttp(item.licenseUrl)) complain('media.yml', `invalid license URL ${item.id}`)
      }
      for (const record of records.filter(r => /\/(flags|miniatures)\.yml$/.test(r.file))) {
        const groups = record.data.flags || [...record.data.timur_miniatures, ...record.data.ottoman_miniatures, ...record.data.mughal_miniatures]
        for (const group of groups) for (const item of group.items) {
          if (!images.has(item.img)) complain(record.file, `media not cataloged ${item.img}`)
        }
      }
    } catch (error) {
      complain('media.yml', error.message)
    }
  }
  return { errors, stats: { files: files.length, articleCount: records.filter(r => r.file.endsWith('.md')).length, imageReferences, internalLinks } }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const { errors, stats } = auditContent(process.argv[2] || '.')
  console.log(JSON.stringify(stats))
  errors.forEach(error => console.error(error))
  if (errors.length) {
    console.error(`${errors.length} content errors`)
    process.exitCode = 1
  } else console.log('Content validation passed')
}
