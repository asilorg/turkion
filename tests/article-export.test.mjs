import { test } from 'node:test'
import assert from 'node:assert/strict'
import { stringify } from 'minimark/stringify'
import { articleMetadataNodes } from '../server/utils/article-metadata.ts'

test('Markdown exports keep source URLs and the localized draft status', () => {
  for (const [locale, draft] of [['en', 'Draft'], ['ru', 'Черновик'], ['uz', 'Qoralama']]) {
    const nodes = articleMetadataNodes({
      path: `/${locale}/docs/common/people/chuvash`,
      editorialStatus: 'draft',
      sources: [{ title: 'Glottolog: Chuvash', url: 'https://glottolog.org/resource/languoid/id/chuv1255' }]
    })
    const markdown = stringify({ type: 'minimark', value: nodes }, { format: 'markdown/html' })
    assert.ok(markdown.includes('https://glottolog.org/resource/languoid/id/chuv1255'))
    assert.ok(markdown.includes(draft))
  }
})

test('exporting old content does not invent sources or review status', () => {
  assert.deepEqual(articleMetadataNodes({ path: '/en/docs/common/navruz' }), [])
})
