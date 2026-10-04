import { queryCollection } from '@nuxt/content/server'

const locales = ['en', 'ru', 'uz'] as const
const sections = ['', '/timeline', '/flags', '/miniatures', '/people', '/blog']

function escapeXml(value: string): string {
  return value.replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', '\'': '&apos;'
  })[char]!)
}

export default eventHandler(async (event) => {
  const siteUrl = useRuntimeConfig(event).public.siteUrl.replace(/\/$/, '')
  const paths = new Set<string>()

  for (const locale of locales) {
    for (const section of sections) {
      paths.add(`/${locale}${section}`)
    }
    const articles = await queryCollection(event, `docs_${locale}` as 'docs_en' | 'docs_ru' | 'docs_uz').select('path').all()
    for (const article of articles) {
      if (article.path && !article.path.split('/').some(segment => segment.startsWith('.'))) {
        paths.add(article.path)
      }
    }
  }

  setHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${[...paths].sort().map(path => `  <url><loc>${escapeXml(`${siteUrl}${path}`)}</loc></url>`).join('\n')}\n</urlset>`
})
