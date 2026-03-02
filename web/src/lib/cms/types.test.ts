import {describe, it, expect} from 'vitest'
import {isPageEnabled} from './types'
import type {PageVisibility} from './types'

describe('isPageEnabled', () => {
  it('returns true for all keys when visibility is undefined', () => {
    const keys = ['news', 'events', 'faq', 'platform', 'media', 'support'] as const
    for (const key of keys) {
      expect(isPageEnabled(undefined, key)).toBe(true)
    }
  })

  it('returns true when the key is absent from the visibility object (not yet configured)', () => {
    const visibility: PageVisibility = {}
    expect(isPageEnabled(visibility, 'news')).toBe(true)
  })

  it('returns true when the key is explicitly true', () => {
    expect(isPageEnabled({news: true}, 'news')).toBe(true)
  })

  it('returns false when the key is explicitly false', () => {
    expect(isPageEnabled({news: false}, 'news')).toBe(false)
  })

  it('disabling one page does not affect other pages', () => {
    const visibility: PageVisibility = {news: false, events: true}
    expect(isPageEnabled(visibility, 'news')).toBe(false)
    expect(isPageEnabled(visibility, 'events')).toBe(true)
    // unset keys default to enabled
    expect(isPageEnabled(visibility, 'faq')).toBe(true)
    expect(isPageEnabled(visibility, 'platform')).toBe(true)
    expect(isPageEnabled(visibility, 'media')).toBe(true)
    expect(isPageEnabled(visibility, 'support')).toBe(true)
  })

  it('returns false for all keys when all are disabled', () => {
    const visibility: PageVisibility = {
      news: false,
      events: false,
      faq: false,
      platform: false,
      media: false,
      support: false,
    }
    const keys = ['news', 'events', 'faq', 'platform', 'media', 'support'] as const
    for (const key of keys) {
      expect(isPageEnabled(visibility, key)).toBe(false)
    }
  })

  it('returns true for all keys when all are enabled', () => {
    const visibility: PageVisibility = {
      news: true,
      events: true,
      faq: true,
      platform: true,
      media: true,
      support: true,
    }
    const keys = ['news', 'events', 'faq', 'platform', 'media', 'support'] as const
    for (const key of keys) {
      expect(isPageEnabled(visibility, key)).toBe(true)
    }
  })
})
