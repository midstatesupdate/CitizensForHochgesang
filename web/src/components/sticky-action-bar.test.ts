import {describe, it, expect} from 'vitest'

/**
 * The unified SiteHeader always renders (it always shows the logo), but the
 * action buttons (Donate / Volunteer) are conditionally included based on
 * CMS-provided URLs. This predicate mirrors the inline `{url ? <btn> : null}`
 * logic inside the header controls cluster.
 *
 * Renamed from the former StickyActionBar visibility test — the underlying
 * requirement is identical, just hosted in SiteHeader now.
 */

function shouldShowActionButton(url?: string): boolean {
  return Boolean(url)
}

describe('shouldShowActionButton (unified header)', () => {
  it('returns false when URL is undefined', () => {
    expect(shouldShowActionButton(undefined)).toBe(false)
  })

  it('returns false when URL is empty string', () => {
    expect(shouldShowActionButton('')).toBe(false)
  })

  it('returns true when URL is provided', () => {
    expect(shouldShowActionButton('https://donate.example.com')).toBe(true)
  })
})
