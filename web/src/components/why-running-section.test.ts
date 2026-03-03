import {describe, it, expect} from 'vitest'

import {hasWhyRunningContent} from './why-running-section'

describe('hasWhyRunningContent', () => {
  it('returns false when both body and heading are empty/undefined', () => {
    expect(hasWhyRunningContent(undefined, undefined)).toBe(false)
    expect(hasWhyRunningContent([], undefined)).toBe(false)
    expect(hasWhyRunningContent([], '')).toBe(false)
    expect(hasWhyRunningContent([], '   ')).toBe(false)
  })

  it('returns true when heading has content', () => {
    expect(hasWhyRunningContent(undefined, "Why I'm Running")).toBe(true)
    expect(hasWhyRunningContent([], "Why I'm Running")).toBe(true)
  })

  it('returns true when body has blocks', () => {
    const body = [{_type: 'block' as const, children: [{_type: 'span' as const, text: 'Hello', marks: []}]}]
    expect(hasWhyRunningContent(body, undefined)).toBe(true)
    expect(hasWhyRunningContent(body, '')).toBe(true)
  })

  it('returns true when both heading and body have content', () => {
    const body = [{_type: 'block' as const, children: [{_type: 'span' as const, text: 'Hello', marks: []}]}]
    expect(hasWhyRunningContent(body, "Why I'm Running")).toBe(true)
  })
})
