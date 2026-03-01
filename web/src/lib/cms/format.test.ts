import { describe, it, expect } from 'vitest'
import { formatDate, formatDateTime, normalizeHref, shouldOpenInNewTab } from './format'

describe('formatDate', () => {
  it('formats a valid ISO date string', () => {
    const result = formatDate('2026-03-15T12:00:00Z')
    // en-US short format: "Mar 15, 2026"
    expect(result).toMatch(/Mar\s+15,\s+2026/)
  })

  it('formats a full ISO datetime as date only', () => {
    const result = formatDate('2026-07-04T14:30:00Z')
    expect(result).toMatch(/Jul\s+4,\s+2026/)
  })

  it('returns the raw string for an invalid date', () => {
    expect(formatDate('not-a-date')).toBe('not-a-date')
  })

  it('returns the raw string for an empty string', () => {
    expect(formatDate('')).toBe('')
  })
})

describe('formatDateTime', () => {
  it('formats a valid ISO datetime with time', () => {
    const result = formatDateTime('2026-03-01T14:30:00Z')
    // Should include date and time portions
    expect(result).toMatch(/Mar/)
    expect(result).toMatch(/2026/)
    // Time portion should be present (format varies by locale/timezone)
    expect(result).toMatch(/\d{1,2}:\d{2}/)
  })

  it('returns the raw string for an invalid date', () => {
    expect(formatDateTime('garbage')).toBe('garbage')
  })
})

describe('normalizeHref', () => {
  it('preserves http:// URLs', () => {
    expect(normalizeHref('http://example.com')).toBe('http://example.com')
  })

  it('preserves https:// URLs', () => {
    expect(normalizeHref('https://example.com')).toBe('https://example.com')
  })

  it('preserves absolute paths', () => {
    expect(normalizeHref('/events')).toBe('/events')
  })

  it('preserves anchor links', () => {
    expect(normalizeHref('#section')).toBe('#section')
  })

  it('preserves mailto: links', () => {
    expect(normalizeHref('mailto:brad@example.com')).toBe('mailto:brad@example.com')
  })

  it('preserves tel: links', () => {
    expect(normalizeHref('tel:+15551234567')).toBe('tel:+15551234567')
  })

  it('prefixes bare domains with https://', () => {
    expect(normalizeHref('example.com')).toBe('https://example.com')
  })

  it('prefixes bare domains with paths', () => {
    expect(normalizeHref('example.com/page')).toBe('https://example.com/page')
  })

  it('prefixes www. domains', () => {
    expect(normalizeHref('www.example.com')).toBe('https://www.example.com')
  })
})

describe('shouldOpenInNewTab', () => {
  it('returns true for https:// URLs', () => {
    expect(shouldOpenInNewTab('https://example.com')).toBe(true)
  })

  it('returns true for http:// URLs', () => {
    expect(shouldOpenInNewTab('http://example.com')).toBe(true)
  })

  it('returns true for bare domains (normalized to https://)', () => {
    expect(shouldOpenInNewTab('example.com')).toBe(true)
  })

  it('returns false for absolute paths', () => {
    expect(shouldOpenInNewTab('/events')).toBe(false)
  })

  it('returns false for anchor links', () => {
    expect(shouldOpenInNewTab('#top')).toBe(false)
  })

  it('returns false for mailto: links', () => {
    expect(shouldOpenInNewTab('mailto:brad@example.com')).toBe(false)
  })

  it('returns false for tel: links', () => {
    expect(shouldOpenInNewTab('tel:+15551234567')).toBe(false)
  })
})
