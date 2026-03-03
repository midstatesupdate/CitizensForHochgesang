import {describe, it, expect} from 'vitest'
import {computeTimeLeft, padValue, resolveTimers, pickDefault, findAllDoneMessage} from './election-countdown'
import type {CountdownTimer} from '@/lib/cms/types'

// ---------------------------------------------------------------------------
// computeTimeLeft
// ---------------------------------------------------------------------------

describe('computeTimeLeft', () => {
  const target = new Date('2026-11-03T06:00:00-05:00')

  it('returns positive values when target is in the future', () => {
    const now = new Date('2026-03-02T12:00:00-05:00')
    const result = computeTimeLeft(target, now)
    expect(result.total).toBeGreaterThan(0)
    expect(result.days).toBeGreaterThan(0)
  })

  it('returns all zeroes when target is in the past', () => {
    const now = new Date('2026-12-01T00:00:00-05:00')
    const result = computeTimeLeft(target, now)
    expect(result).toEqual({days: 0, hours: 0, minutes: 0, seconds: 0, total: 0})
  })

  it('returns all zeroes when target equals now', () => {
    const result = computeTimeLeft(target, target)
    expect(result.total).toBe(0)
  })

  it('computes correct breakdown for exactly 1 day', () => {
    const now = new Date(target.getTime() - 24 * 60 * 60 * 1000)
    const result = computeTimeLeft(target, now)
    expect(result.days).toBe(1)
    expect(result.hours).toBe(0)
    expect(result.minutes).toBe(0)
    expect(result.seconds).toBe(0)
  })

  it('computes correct breakdown for 1 day, 2 hours, 30 minutes, 15 seconds', () => {
    const offset = (1 * 24 * 60 * 60 + 2 * 60 * 60 + 30 * 60 + 15) * 1000
    const now = new Date(target.getTime() - offset)
    const result = computeTimeLeft(target, now)
    expect(result.days).toBe(1)
    expect(result.hours).toBe(2)
    expect(result.minutes).toBe(30)
    expect(result.seconds).toBe(15)
  })

  it('handles large day counts (100+ days)', () => {
    const offset = 150 * 24 * 60 * 60 * 1000
    const now = new Date(target.getTime() - offset)
    const result = computeTimeLeft(target, now)
    expect(result.days).toBe(150)
  })

  it('returns all zeroes when target is null', () => {
    const result = computeTimeLeft(null)
    expect(result).toEqual({days: 0, hours: 0, minutes: 0, seconds: 0, total: 0})
  })

  it('returns all zeroes when target is undefined', () => {
    const result = computeTimeLeft(undefined)
    expect(result).toEqual({days: 0, hours: 0, minutes: 0, seconds: 0, total: 0})
  })

  it('returns all zeroes for an invalid date', () => {
    const result = computeTimeLeft(new Date('invalid'))
    expect(result).toEqual({days: 0, hours: 0, minutes: 0, seconds: 0, total: 0})
  })

  it('hours never exceed 23', () => {
    const offset = 2 * 24 * 60 * 60 * 1000 + 23 * 60 * 60 * 1000
    const now = new Date(target.getTime() - offset)
    const result = computeTimeLeft(target, now)
    expect(result.hours).toBeLessThanOrEqual(23)
  })

  it('minutes never exceed 59', () => {
    const offset = 59 * 60 * 1000
    const now = new Date(target.getTime() - offset)
    const result = computeTimeLeft(target, now)
    expect(result.minutes).toBeLessThanOrEqual(59)
  })

  it('seconds never exceed 59', () => {
    const offset = 59 * 1000
    const now = new Date(target.getTime() - offset)
    const result = computeTimeLeft(target, now)
    expect(result.seconds).toBeLessThanOrEqual(59)
  })
})

// ---------------------------------------------------------------------------
// padValue
// ---------------------------------------------------------------------------

describe('padValue', () => {
  it('pads single digit to 2 characters by default', () => {
    expect(padValue(5)).toBe('05')
  })

  it('does not pad two-digit number with default width', () => {
    expect(padValue(42)).toBe('42')
  })

  it('pads to custom width', () => {
    expect(padValue(7, 3)).toBe('007')
  })

  it('does not truncate numbers wider than requested width', () => {
    expect(padValue(1234, 2)).toBe('1234')
  })

  it('handles zero', () => {
    expect(padValue(0)).toBe('00')
  })

  it('handles 100+ with width 3', () => {
    expect(padValue(150, 3)).toBe('150')
  })
})

// ---------------------------------------------------------------------------
// resolveTimers
// ---------------------------------------------------------------------------

describe('resolveTimers', () => {
  const now = new Date('2026-06-01T12:00:00Z')

  const timer = (overrides: Partial<CountdownTimer> = {}): CountdownTimer => ({
    enabled: true,
    heading: 'Test',
    targetDate: '2026-11-03T06:00:00Z',
    ...overrides,
  })

  it('returns empty array for empty input', () => {
    expect(resolveTimers([], now)).toEqual([])
  })

  it('excludes disabled timers', () => {
    const result = resolveTimers([timer({enabled: false})], now)
    expect(result).toHaveLength(0)
  })

  it('excludes timers without targetDate', () => {
    const result = resolveTimers([timer({targetDate: null})], now)
    expect(result).toHaveLength(0)
  })

  it('excludes timers with invalid targetDate', () => {
    const result = resolveTimers([timer({targetDate: 'not-a-date'})], now)
    expect(result).toHaveLength(0)
  })

  it('excludes timers whose targetDate is in the past', () => {
    const result = resolveTimers(
      [timer({targetDate: '2026-01-01T00:00:00Z'})],
      now,
    )
    expect(result).toHaveLength(0)
  })

  it('sorts by targetDate ascending', () => {
    const timers = [
      timer({heading: 'C', targetDate: '2026-12-01T00:00:00Z'}),
      timer({heading: 'A', targetDate: '2026-08-01T00:00:00Z'}),
      timer({heading: 'B', targetDate: '2026-10-01T00:00:00Z'}),
    ]
    const result = resolveTimers(timers, now)
    expect(result.map((r) => r.heading)).toEqual(['A', 'B', 'C'])
  })

  it('preserves _index from original array position', () => {
    const timers = [
      timer({heading: 'Second', targetDate: '2026-12-01T00:00:00Z'}),
      timer({heading: 'First', targetDate: '2026-08-01T00:00:00Z'}),
    ]
    const result = resolveTimers(timers, now)
    // "First" was at index 1 in the original array but sorted first
    expect(result[0]._index).toBe(1)
    expect(result[1]._index).toBe(0)
  })

  it('treats enabled as true by default (undefined)', () => {
    const t = timer()
    delete (t as Record<string, unknown>).enabled
    const result = resolveTimers([t], now)
    expect(result).toHaveLength(1)
  })
})

// ---------------------------------------------------------------------------
// pickDefault
// ---------------------------------------------------------------------------

describe('pickDefault', () => {
  const now = new Date('2026-06-01T12:00:00Z')

  const timer = (overrides: Partial<CountdownTimer> = {}): CountdownTimer => ({
    enabled: true,
    heading: 'Test',
    targetDate: '2026-11-03T06:00:00Z',
    ...overrides,
  })

  it('returns -1 for empty array', () => {
    expect(pickDefault([])).toBe(-1)
  })

  it('returns 0 for single timer', () => {
    const resolved = resolveTimers([timer()], now)
    expect(pickDefault(resolved)).toBe(0)
  })

  it('picks the timer with the earliest target date', () => {
    const timers = [
      timer({heading: 'Far', targetDate: '2026-12-01T00:00:00Z'}),
      timer({heading: 'Near', targetDate: '2026-08-01T00:00:00Z'}),
      timer({heading: 'Mid', targetDate: '2026-10-01T00:00:00Z'}),
    ]
    const resolved = resolveTimers(timers, now)
    const idx = pickDefault(resolved)
    expect(resolved[idx].heading).toBe('Near')
  })

  it('breaks ties by returning the first in sorted order', () => {
    const timers = [
      timer({heading: 'A', targetDate: '2026-11-03T00:00:00Z'}),
      timer({heading: 'B', targetDate: '2026-11-03T00:00:00Z'}),
    ]
    const resolved = resolveTimers(timers, now)
    const idx = pickDefault(resolved)
    // Both have same target, first in array (index 0 after sorting) wins
    expect(idx).toBe(0)
  })
})

// ---------------------------------------------------------------------------
// findAllDoneMessage
// ---------------------------------------------------------------------------

describe('findAllDoneMessage', () => {
  const timer = (overrides: Partial<CountdownTimer> = {}): CountdownTimer => ({
    enabled: true,
    heading: 'Test',
    targetDate: '2026-11-03T06:00:00Z',
    ...overrides,
  })

  it('returns null when no timers exist', () => {
    expect(findAllDoneMessage([])).toBeNull()
  })

  it('returns null when no timer has expired content', () => {
    expect(findAllDoneMessage([timer()])).toBeNull()
  })

  it('returns expiredTitle from a timer that has one', () => {
    const result = findAllDoneMessage([timer({expiredTitle: 'Done!'})])
    expect(result?.expiredTitle).toBe('Done!')
  })

  it('returns expiredBody from a timer that has one', () => {
    const body = [{_type: 'block', children: [{_type: 'span', text: 'All done'}]}] as CountdownTimer['expiredBody']
    const result = findAllDoneMessage([timer({expiredBody: body})])
    expect(result?.expiredBody).toBe(body)
  })

  it('picks the timer with the latest target date', () => {
    const result = findAllDoneMessage([
      timer({heading: 'Early', targetDate: '2026-10-01T00:00:00Z', expiredTitle: 'Early done'}),
      timer({heading: 'Last', targetDate: '2026-11-05T00:00:00Z', expiredTitle: 'Last done'}),
      timer({heading: 'Mid', targetDate: '2026-11-03T00:00:00Z', expiredTitle: 'Mid done'}),
    ])
    expect(result?.expiredTitle).toBe('Last done')
  })

  it('skips disabled timers', () => {
    const result = findAllDoneMessage([
      timer({enabled: false, expiredTitle: 'Nope'}),
      timer({expiredTitle: 'Yes'}),
    ])
    expect(result?.expiredTitle).toBe('Yes')
  })

  it('skips timers with invalid targetDate', () => {
    const result = findAllDoneMessage([
      timer({targetDate: 'not-a-date', expiredTitle: 'Bad'}),
      timer({expiredTitle: 'Good'}),
    ])
    expect(result?.expiredTitle).toBe('Good')
  })

  it('returns null when only disabled timers have expired content', () => {
    const result = findAllDoneMessage([
      timer({enabled: false, expiredTitle: 'Nope'}),
      timer(), // no expired content
    ])
    expect(result).toBeNull()
  })
})
