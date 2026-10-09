import { withLeadingSlash } from 'ufo'
import { stringify } from 'minimark/stringify'
import { queryCollection } from '@nuxt/content/server'
import { articleMetadataNodes } from '../../utils/article-metadata'

export default eventHandler(async (event) => {
  const slug = getRouterParams(event)['slug.md']
  if (!slug?.endsWith('.md')) {
    throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
  }

  const path = withLeadingSlash(slug.replace('.md', ''))

  const localeMatch = path.match(/^\/(en|uz|ru)(?=\/)/)
  const locale = localeMatch?.[1] ?? 'en'
  const collection = `docs_${locale}` as 'docs_en' | 'docs_ru' | 'docs_uz'

  const page = await queryCollection(event, collection).path(path).first()
  if (!page) {
    throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
  }

  const body = { ...page.body, value: [...page.body.value] }
  // Work on a copy so repeated exports cannot mutate cached content.
  if (body.value[0]?.[0] !== 'h1') {
    body.value.unshift(['blockquote', {}, page.description])
    body.value.unshift(['h1', {}, page.title])
  }
  body.value.push(...articleMetadataNodes(page))

  setHeader(event, 'Content-Type', 'text/markdown; charset=utf-8')
  return stringify({ ...body, type: 'minimark' }, { format: 'markdown/html' })
})
