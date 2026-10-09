import { test } from 'node:test'
import assert from 'node:assert/strict'
import { articleErrors, auditContent } from '../scripts/validate-content.mjs'

test('subject articles without references fail validation', () => {
  assert.deepEqual(articleErrors({ title: 'Dombyra', description: 'Instrument tradition' }, { requireSources: true }), ['missing article sources'])
})
test('a source with a non-web address is rejected', () => {
  assert.deepEqual(articleErrors({ title: 'Dombyra', description: 'Instrument tradition', sources: [{ title: 'Archive', url: 'javascript:alert(1)' }] }), ['source needs a title and HTTP(S) URL'])
})
test('a sourced draft does not need fabricated reviewer metadata', () => {
  assert.deepEqual(articleErrors({ title: 'Dombyra', description: 'Instrument tradition', editorialStatus: 'draft', sources: [{ title: 'UNESCO', url: 'https://ich.unesco.org/' }] }, { requireSources: true }), [])
})
test('the published corpus has valid references, paths and locale coverage', () => {
  const result = auditContent()
  assert.deepEqual(result.errors, [])
})
