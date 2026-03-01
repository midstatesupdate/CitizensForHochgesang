import { describe, it, expect } from 'vitest'
import { getSanityImageUrl } from './image-url'
import type { SanityImageSource } from './types'

const validSource: SanityImageSource = {
  _type: 'image',
  asset: {
    _ref: 'image-abcdef1234567890abcdef1234567890-1920x1080-jpg',
    _type: 'reference',
  },
}

describe('getSanityImageUrl', () => {
  describe('invalid / missing inputs', () => {
    it('returns undefined for undefined source', () => {
      expect(getSanityImageUrl(undefined)).toBeUndefined()
    })

    it('returns undefined for source with no asset property', () => {
      expect(getSanityImageUrl({} as SanityImageSource)).toBeUndefined()
    })

    it('returns undefined for source with asset but no _ref', () => {
      expect(getSanityImageUrl({ asset: {} } as SanityImageSource)).toBeUndefined()
    })

    it('returns undefined for source with empty string _ref', () => {
      expect(getSanityImageUrl({ asset: { _ref: '' } } as SanityImageSource)).toBeUndefined()
    })

    it('returns undefined for source with null _ref', () => {
      expect(getSanityImageUrl({ asset: { _ref: null as unknown as string } })).toBeUndefined()
    })
  })

  describe('URL construction', () => {
    it('returns a string for a valid image source', () => {
      const url = getSanityImageUrl(validSource)
      expect(typeof url).toBe('string')
    })

    it('returns a Sanity CDN URL', () => {
      const url = getSanityImageUrl(validSource)
      expect(url).toMatch(/^https:\/\/cdn\.sanity\.io\/images\//)
    })

    it('includes fit=crop in the returned URL', () => {
      const url = getSanityImageUrl(validSource)
      expect(url).toContain('fit=crop')
    })

    it('includes auto=format in the returned URL', () => {
      const url = getSanityImageUrl(validSource)
      expect(url).toContain('auto=format')
    })

    it('includes project ID in the URL path', () => {
      const url = getSanityImageUrl(validSource)
      // Default project ID used when env var is absent
      expect(url).toContain('n2oyijjv')
    })

    it('includes dataset in the URL path', () => {
      const url = getSanityImageUrl(validSource)
      expect(url).toContain('production')
    })
  })

  describe('dimension options', () => {
    it('includes width param when width is provided', () => {
      const url = getSanityImageUrl(validSource, { width: 800 })
      expect(url).toContain('w=800')
    })

    it('includes height param when height is provided', () => {
      const url = getSanityImageUrl(validSource, { height: 600 })
      expect(url).toContain('h=600')
    })

    it('includes both width and height when both are provided', () => {
      const url = getSanityImageUrl(validSource, { width: 400, height: 300 })
      expect(url).toContain('w=400')
      expect(url).toContain('h=300')
    })

    it('omits width and height params when no options are provided', () => {
      const url = getSanityImageUrl(validSource)
      expect(url).not.toContain('w=')
      expect(url).not.toContain('h=')
    })

    it('omits height when only width is specified', () => {
      const url = getSanityImageUrl(validSource, { width: 1200 })
      expect(url).not.toContain('h=')
    })

    it('omits width when only height is specified', () => {
      const url = getSanityImageUrl(validSource, { height: 900 })
      expect(url).not.toContain('w=')
    })

    it('omits width param when width is 0 (falsy)', () => {
      // The implementation uses `if (options?.width)` — 0 is falsy
      const url = getSanityImageUrl(validSource, { width: 0 })
      expect(url).not.toContain('w=')
    })

    it('omits height param when height is 0 (falsy)', () => {
      const url = getSanityImageUrl(validSource, { height: 0 })
      expect(url).not.toContain('h=')
    })
  })
})
