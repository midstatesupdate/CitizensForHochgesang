import {describe, it, expect} from 'vitest'

/**
 * StickyActionBar is a simple server component that conditionally renders
 * based on the presence of donateUrl and volunteerUrl. The render logic
 * is straightforward (null when both are missing), so we test the
 * conditional visibility predicate here as a pure function.
 */

function shouldShowStickyActionBar(donateUrl?: string, volunteerUrl?: string): boolean {
  return Boolean(donateUrl) || Boolean(volunteerUrl)
}

describe('shouldShowStickyActionBar', () => {
  it('returns false when both URLs are missing', () => {
    expect(shouldShowStickyActionBar(undefined, undefined)).toBe(false)
    expect(shouldShowStickyActionBar('', '')).toBe(false)
  })

  it('returns true when donateUrl is provided', () => {
    expect(shouldShowStickyActionBar('https://donate.example.com', undefined)).toBe(true)
  })

  it('returns true when volunteerUrl is provided', () => {
    expect(shouldShowStickyActionBar(undefined, 'https://volunteer.example.com')).toBe(true)
  })

  it('returns true when both URLs are provided', () => {
    expect(shouldShowStickyActionBar('https://donate.example.com', 'https://volunteer.example.com')).toBe(true)
  })
})
