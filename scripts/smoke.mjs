import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import YAML from 'yaml'
import sharp from 'sharp'

const root = resolve(process.env.SMOKE_ROOT || '.')
const port = process.env.SMOKE_PORT || '3198'
const base = process.env.SMOKE_URL || `http://127.0.0.1:${port}`
const site = (process.env.NUXT_PUBLIC_SITE_URL || 'https://www.turkion.org').replace(/\/$/, '')
const child = process.env.SMOKE_URL
  ? undefined
  : spawn(process.execPath, [resolve(root, '.output/server/index.mjs')], {
      cwd: root,
      env: { ...process.env, HOST: '127.0.0.1', PORT: port, NUXT_PUBLIC_SITE_URL: site },
      stdio: ['ignore', 'pipe', 'pipe']
    })
let output = ''
child?.stdout.on('data', (data) => {
  output = (output + data).slice(-5000)
})
child?.stderr.on('data', (data) => {
  output = (output + data).slice(-5000)
})
const errors = []
const decode = value => value?.replaceAll('&amp;', '&').replaceAll('&#39;', '\'').replaceAll('&quot;', '"')
const tags = (html, tag) => [...html.matchAll(new RegExp(`<${tag}\\b[^>]*>`, 'g'))].map(match => Object.fromEntries([...match[0].matchAll(/([\w:-]+)="([^"]*)"/g)].map(attr => [attr[1], decode(attr[2])])))
const get = async (path) => {
  const response = await fetch(new URL(path, base), { signal: AbortSignal.timeout(60000) })
  const text = await response.text()
  assert.equal(response.status, 200, `${path}: ${response.status}`)
  return text
}
const check = async (name, run) => {
  try {
    await run()
    console.log(`PASS ${name}`)
  } catch (error) {
    errors.push(`${name}: ${error.message}`)
    console.error(`FAIL ${name}: ${error.message}`)
  }
}
try {
  let ready = false
  for (let attempt = 0; attempt < 100; attempt++) {
    if (child?.exitCode != null) throw new Error(`Server exited: ${output}`)
    try {
      await fetch(`${base}/favicon.ico`, { signal: AbortSignal.timeout(1000) })
      ready = true
      break
    } catch {
      await new Promise(resolve => setTimeout(resolve, 300))
    }
  }
  assert.ok(ready, `Production server did not start: ${output}`)
  for (const locale of ['en', 'ru', 'uz']) {
    await check(`${locale}: page metadata and article sources`, async () => {
      const path = `/${locale}/docs/uzbekistan/maqom`
      const html = await get(path)
      assert.equal(tags(html, 'html')[0]?.lang, locale, 'document language did not match route')
      const links = tags(html, 'link')
      assert.ok(!tags(html, 'a').some(link => link.href === '/'), 'site logo must keep the active locale')
      assert.ok(links.some(link => link.rel === 'canonical' && link.href === site + path), 'canonical URL missing or incorrect')
      for (const language of ['en', 'ru', 'uz']) assert.ok(links.some(link => link.hreflang === language && link.href === `${site}/${language}/docs/uzbekistan/maqom`), `missing alternate ${language}`)
      const md = readFileSync(resolve(root, `content/${locale}/docs/7.uzbekistan/maqom.md`), 'utf8')
      const data = YAML.parse(md.match(/^---\n([\s\S]*?)\n---/)[1])
      assert.ok(data.sources?.length, 'missing article sources')
      const body = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, '')
      assert.ok(tags(body, 'a').some(link => link.href === data.sources[0].url), 'source absent from rendered article')
    })
    await check(`${locale}: social preview image resolves`, async () => {
      const html = await get(`/${locale}`)
      const image = tags(html, 'meta').find(meta => meta.property === 'og:image')?.content
      assert.equal(image, `${site}/preview.png`)
      const response = await fetch(new URL(new URL(image).pathname, base))
      assert.equal(response.status, 200)
      assert.ok(response.headers.get('content-type')?.startsWith('image/'))
    })
    await check(`${locale}: timeline text renders without JavaScript`, async () => {
      const html = (await get(`/${locale}/timeline`)).replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, '')
      assert.equal((html.match(/<main\b/g) || []).length, 1, 'page must have one main landmark')
      assert.equal((html.match(/<h1\b/g) || []).length, 1, 'timeline needs one page heading')
      assert.match(html, /2005/, 'later events are absent from server HTML')
      assert.match(html, /2016/, 'modern events are absent from server HTML')
      const timeline = YAML.parse(readFileSync(resolve(root, `content/${locale}/timeline.yml`), 'utf8')).timeline
      const sections = [...html.matchAll(/data-timeline-section="([^"]+)"/g)].map(match => match[1])
      assert.deepEqual(sections, timeline.map(section => section.id), 'some timeline bodies were deferred instead of rendered on the server')
    })
  }
  await check('overview headings preserve legacy fragment links', async () => {
    for (const locale of ['en', 'ru', 'uz']) {
      const html = (await get(`/${locale}/docs/common/turkic-peoples`)).replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, '')
      assert.ok(!/\{#(?:language|history|references)\}/.test(html), 'unsupported heading syntax leaked into the page')
      for (const id of ['language', 'list-of-ethnic-groups', 'etymology', 'history', 'religion', 'demographics', 'references']) {
        assert.equal([...html.matchAll(new RegExp(`id="${id}"`, 'g'))].length, 1, `missing or duplicate legacy anchor ${id}`)
      }
    }
  })
  await check('gallery opens an image and Node production serves its thumbnail', async () => {
    const page = YAML.parse(readFileSync(resolve(root, 'content/en/miniatures.yml'), 'utf8'))
    const first = page.timur_miniatures[0].items[0]
    const html = await get('/en/miniatures')
    assert.ok(tags(html, 'a').some(link => decodeURIComponent(link.href || '') === first.img), 'gallery has no image-view link')
    const quoted = page.timur_miniatures.flatMap(group => group.items).find(item => item.img.includes('\''))
    const quotedLink = tags(html, 'a').find(link => decodeURIComponent(link.href || '') === quoted?.img)
    assert.ok(quotedLink?.href.includes('%27'), 'apostrophes must be URL encoded before HTML escaping')
    assert.equal((await fetch(new URL(quotedLink.href, base))).status, 200, 'image filename containing an apostrophe is broken')
    const legacyPath = first.img.replace('/miniatures-web/', '/miniatures/').replace(/\.webp$/, '')
    const redirect = await fetch(new URL(legacyPath, base), { redirect: 'manual' })
    assert.equal(redirect.status, 301, 'legacy image URL should redirect to its derivative')
    assert.equal(decodeURIComponent(redirect.headers.get('location')), first.img)
    const image = tags(html, 'img').find(img => img['data-nuxt-img'] !== undefined || img.src?.includes('_ipx') || img.src?.includes('_vercel'))
    assert.ok(image?.src, 'no gallery image rendered')
    const response = await fetch(new URL(image.src, base), { signal: AbortSignal.timeout(30000) })
    assert.equal(response.status, 200, 'image provider does not work in Node production')
    assert.ok(response.headers.get('content-type')?.startsWith('image/'))
    const thumbnail = await sharp(Buffer.from(await response.arrayBuffer())).metadata()
    const original = await sharp(resolve(root, 'public', first.img.slice(1))).metadata()
    assert.ok(Math.abs(thumbnail.width / thumbnail.height - original.width / original.height) < 0.02, 'gallery thumbnail crops the artwork or flag')
  })
  await check('sitemap and robots expose localized articles', async () => {
    const xml = await get('/sitemap.xml')
    for (const locale of ['en', 'ru', 'uz']) assert.ok(xml.includes(`${site}/${locale}/docs/uzbekistan/maqom`))
    assert.ok(!xml.includes(`<loc>${site}/</loc>`), 'redirecting site root must not be in sitemap')
    const rootResponse = await fetch(new URL('/', base), { redirect: 'manual' })
    assert.equal(rootResponse.status, 301, 'site root needs a permanent HTTP redirect')
    assert.equal(rootResponse.headers.get('location'), '/en')
    assert.ok((await get('/robots.txt')).includes(`Sitemap: ${site}/sitemap.xml`))
  })
  await check('documentation fragment links resolve in every locale', async () => {
    for (const locale of ['en', 'ru', 'uz']) {
      const html = await get(`/${locale}/docs/essentials/code-blocks`)
      for (const link of tags(html, 'a').filter(link => link.href?.startsWith('#'))) {
        const id = decodeURIComponent(link.href.slice(1))
        assert.ok(html.includes(`id="${id}"`), `${locale} code examples have broken fragment #${id}`)
      }
    }
  })
  await check('LLM exports and raw Markdown contain articles', async () => {
    const index = await get('/llms.txt')
    for (const locale of ['en', 'ru', 'uz']) assert.ok(index.includes(`/${locale}/docs/`), `missing LLM ${locale} links`)
    const full = await get('/llms-full.txt')
    assert.ok(full.length > 10000, 'full LLM export is empty or truncated')
    const profile = YAML.parse(readFileSync(resolve(root, 'content/en/docs/1.common/people/chuvash.md'), 'utf8').match(/^---\n([\s\S]*?)\n---/)[1])
    const raw = await get('/raw/en/docs/common/people/chuvash.md')
    for (const [name, exported] of [['LLM', full], ['raw Markdown', raw]]) {
      assert.ok(exported.includes(profile.sources[0].url), `${name} export lost frontmatter references`)
      assert.ok(exported.includes('Editorial status: Draft'), `${name} export lost draft status`)
    }
    assert.match(await get('/raw/en/docs/common/navruz.md'), /Navruz/)
  })
  if (errors.length) throw new Error(`${errors.length} production smoke checks failed`)
  console.log('Production smoke checks passed')
} catch (error) {
  console.error(error.message)
  process.exitCode = 1
} finally {
  child?.kill('SIGTERM')
}
