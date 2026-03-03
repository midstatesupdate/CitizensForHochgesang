import {describe, it, expect} from 'vitest'
import {buildFrame, resolvedCountAt} from './slot-value'

describe('resolvedCountAt', () => {
  it('returns 0 at time 0 when duration is longer than stagger spread', () => {
    // 4 chars, duration 1200, stagger 80
    // first char resolves at 1200 - (3)*80 = 960
    expect(resolvedCountAt(0, 4, 1200, 80)).toBe(0)
  })

  it('returns all chars resolved when elapsed >= duration', () => {
    expect(resolvedCountAt(1200, 4, 1200, 80)).toBe(4)
    expect(resolvedCountAt(5000, 4, 1200, 80)).toBe(4)
  })

  it('resolves characters left-to-right with stagger', () => {
    // 4 chars, duration 1200, stagger 80
    // char 0 resolves at 1200 - 3*80 = 960
    // char 1 resolves at 1200 - 2*80 = 1040
    // char 2 resolves at 1200 - 1*80 = 1120
    // char 3 resolves at 1200 - 0*80 = 1200
    expect(resolvedCountAt(959, 4, 1200, 80)).toBe(0)
    expect(resolvedCountAt(960, 4, 1200, 80)).toBe(1)
    expect(resolvedCountAt(1039, 4, 1200, 80)).toBe(1)
    expect(resolvedCountAt(1040, 4, 1200, 80)).toBe(2)
    expect(resolvedCountAt(1119, 4, 1200, 80)).toBe(2)
    expect(resolvedCountAt(1120, 4, 1200, 80)).toBe(3)
    expect(resolvedCountAt(1199, 4, 1200, 80)).toBe(3)
    expect(resolvedCountAt(1200, 4, 1200, 80)).toBe(4)
  })

  it('handles single character', () => {
    // 1 char, stagger irrelevant, resolves at duration
    expect(resolvedCountAt(0, 1, 1200, 80)).toBe(0)
    expect(resolvedCountAt(1200, 1, 1200, 80)).toBe(1)
  })

  it('handles zero duration', () => {
    expect(resolvedCountAt(0, 4, 0, 80)).toBe(4)
  })
})

describe('buildFrame', () => {
  it('returns the exact target when all characters are resolved', () => {
    expect(buildFrame('81%', 3)).toBe('81%')
  })

  it('returns the exact target when resolvedCount exceeds length', () => {
    expect(buildFrame('$65M', 10)).toBe('$65M')
  })

  it('preserves spaces regardless of resolved count', () => {
    const frame = buildFrame('8 1', 0)
    expect(frame[1]).toBe(' ')
    expect(frame.length).toBe(3)
  })

  it('preserves periods regardless of resolved count', () => {
    const frame = buildFrame('3.5', 0)
    expect(frame[1]).toBe('.')
    expect(frame.length).toBe(3)
  })

  it('preserves dollar signs regardless of resolved count', () => {
    const frame = buildFrame('$65M', 0)
    expect(frame[0]).toBe('$')
    expect(frame.length).toBe(4)
  })

  it('preserves percent signs regardless of resolved count', () => {
    const frame = buildFrame('81%', 0)
    expect(frame[2]).toBe('%')
    expect(frame.length).toBe(3)
  })

  it('preserves commas regardless of resolved count', () => {
    const frame = buildFrame('1,000', 0)
    expect(frame[1]).toBe(',')
    expect(frame.length).toBe(5)
  })

  it('resolved characters match target', () => {
    const frame = buildFrame('81%', 2)
    expect(frame[0]).toBe('8')
    expect(frame[1]).toBe('1')
    expect(frame[2]).toBe('%')
  })

  it('unresolved digits are still digits', () => {
    for (let i = 0; i < 20; i++) {
      const frame = buildFrame('42', 0)
      expect(frame[0]).toMatch(/[0-9]/)
      expect(frame[1]).toMatch(/[0-9]/)
    }
  })

  it('unresolved uppercase letters are still uppercase', () => {
    for (let i = 0; i < 20; i++) {
      const frame = buildFrame('ABC', 0)
      expect(frame[0]).toMatch(/[A-Z]/)
      expect(frame[1]).toMatch(/[A-Z]/)
      expect(frame[2]).toMatch(/[A-Z]/)
    }
  })

  it('unresolved lowercase letters are still lowercase', () => {
    for (let i = 0; i < 20; i++) {
      const frame = buildFrame('abc', 0)
      expect(frame[0]).toMatch(/[a-z]/)
      expect(frame[1]).toMatch(/[a-z]/)
      expect(frame[2]).toMatch(/[a-z]/)
    }
  })

  it('dollar sign is an anchor — always shows immediately', () => {
    const frame = buildFrame('$', 0)
    expect(frame).toBe('$')
  })

  it('handles empty string', () => {
    expect(buildFrame('', 0)).toBe('')
  })
})
