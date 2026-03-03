import {describe, it, expect} from 'vitest'

import {hasProofContent} from './proof-section'

describe('hasProofContent', () => {
  it('returns false when all props are empty/undefined', () => {
    expect(hasProofContent(undefined, undefined, undefined)).toBe(false)
    expect(hasProofContent('', [], '')).toBe(false)
    expect(hasProofContent('   ', [], '   ')).toBe(false)
  })

  it('returns true when heading has content', () => {
    expect(hasProofContent('Some heading', undefined, undefined)).toBe(true)
    expect(hasProofContent('Some heading', [], '')).toBe(true)
  })

  it('returns true when stats are present', () => {
    const stats = [{value: '81%', label: 'of voters oppose MSC'}]
    expect(hasProofContent(undefined, stats, undefined)).toBe(true)
    expect(hasProofContent('', stats, '')).toBe(true)
  })

  it('returns true when body has content', () => {
    expect(hasProofContent(undefined, undefined, 'Some text here')).toBe(true)
    expect(hasProofContent('', [], 'Some text here')).toBe(true)
  })

  it('returns true when multiple props have content', () => {
    const stats = [{value: '81%', label: 'oppose'}, {value: '8', label: 'town halls'}]
    expect(hasProofContent('Heading', stats, 'Body text')).toBe(true)
  })
})
