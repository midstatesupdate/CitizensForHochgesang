import { describe, it, expect } from 'vitest'
import { FaFlag, FaHome, FaNewspaper } from 'react-icons/fa'
import { resolveCmsIcon } from './icon-map'

describe('resolveCmsIcon', () => {
  it('returns the mapped icon for a valid icon name', () => {
    expect(resolveCmsIcon('home', FaFlag)).toBe(FaHome)
  })

  it('returns a different mapped icon correctly', () => {
    expect(resolveCmsIcon('newspaper', FaFlag)).toBe(FaNewspaper)
  })

  it('returns the fallback when icon is undefined', () => {
    expect(resolveCmsIcon(undefined, FaFlag)).toBe(FaFlag)
  })

  it('returns the fallback for an unrecognized icon name', () => {
    // Cast to bypass TypeScript — simulates runtime data from CMS
    const result = resolveCmsIcon('nonexistent-icon' as never, FaFlag)
    expect(result).toBe(FaFlag)
  })
})
