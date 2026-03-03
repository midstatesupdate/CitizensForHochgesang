import {describe, it, expect} from 'vitest'

import {hasMidCtaContent} from './mid-page-cta'

describe('hasMidCtaContent', () => {
  it('returns false when both URLs are missing/empty', () => {
    expect(hasMidCtaContent(undefined, undefined)).toBe(false)
    expect(hasMidCtaContent('', '')).toBe(false)
  })

  it('returns true when donateUrl is provided', () => {
    expect(hasMidCtaContent('https://donate.example.com', undefined)).toBe(true)
    expect(hasMidCtaContent('https://donate.example.com', '')).toBe(true)
  })

  it('returns true when volunteerUrl is provided', () => {
    expect(hasMidCtaContent(undefined, 'https://volunteer.example.com')).toBe(true)
    expect(hasMidCtaContent('', 'https://volunteer.example.com')).toBe(true)
  })

  it('returns true when both URLs are provided', () => {
    expect(hasMidCtaContent('https://donate.example.com', 'https://volunteer.example.com')).toBe(true)
  })
})
