import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import YAML from 'yaml'

const root = resolve(process.env.CONTENT_ROOT || '.')
const locales = ['en', 'ru', 'uz']
const read = (locale, name) => YAML.parse(readFileSync(resolve(root, 'content', locale, name), 'utf8'))

test('every locale exposes the same identified timeline sections', () => {
  const timelines = locales.map(locale => read(locale, 'timeline.yml').timeline)
  for (const timeline of timelines) {
    assert.ok(timeline.every(section => typeof section.id === 'string' && section.id.trim()), 'every section needs a stable id')
    assert.equal(new Set(timeline.map(section => section.id)).size, timeline.length)
    assert.ok(timeline.length >= 22, 'the chronology must include the already published historical coverage')
  }
  assert.deepEqual(timelines[1].map(section => section.id), timelines[0].map(section => section.id))
  assert.deepEqual(timelines[2].map(section => section.id), timelines[0].map(section => section.id))
})

test('gallery entries lead to an image or source instead of the gallery itself', () => {
  for (const locale of locales) {
    const page = read(locale, 'miniatures.yml')
    for (const groups of [page.timur_miniatures, page.ottoman_miniatures, page.mughal_miniatures]) {
      for (const { items } of groups) for (const item of items) {
        assert.ok(typeof item.url === 'string' && item.url.length, `${locale}: ${item.name} has no destination`)
        assert.ok(!/^\/(en|ru|uz)?\/?miniatures$/.test(item.url), `${locale}: gallery self-link`)
        if (item.url.startsWith('/')) assert.ok(existsSync(resolve(root, 'public', item.url.slice(1))), item.url)
      }
    }
  }
})

test('country cards open the relevant country articles', () => {
  const destinations = ['/docs/turkmenistan', '/docs/turkey', '/docs/kazakhstan', '/docs/uzbekistan', '/docs/azerbaijan', '/docs/kyrgyzstan']
  for (const locale of locales) assert.deepEqual(read(locale, 'index.yml').features.map(item => item.to), destinations)
})

test('city cards only link to relevant country overviews', () => {
  const countryPaths = new Set(['/docs/kazakhstan', '/docs/turkey', '/docs/uzbekistan', '/docs/azerbaijan', '/docs/turkmenistan'])
  for (const locale of locales) {
    const cities = read(locale, 'index.yml').details.cities
    assert.equal(new Set(cities.map(city => city.img)).size, cities.length, `${locale}: duplicate city card`)
    for (const city of cities) if (city.to) {
      assert.ok(countryPaths.has(city.to), `${locale}: ${city.title} points to an unrelated section`)
    }
  }
})

test('Uzbek flag names and groups are localized', () => {
  const en = read('en', 'flags.yml')
  const uz = read('uz', 'flags.yml')
  assert.notEqual(uz.description, en.description)
  assert.ok(uz.flags.every(group => !/^Extinct Turks|^Europe$|^Central Asia$/.test(group.title)))
  const names = uz.flags.flatMap(group => group.items.map(item => item.name))
  assert.ok(names.every(name => !/^Flag of|^Proposed flag|^Official flag/.test(name)), 'English flag labels remain')
})
