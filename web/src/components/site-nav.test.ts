import {describe, it, expect} from 'vitest'

import {filterNavByVisibility} from './site-nav-visibility'
import type {PageVisibility} from '@/lib/cms/types'

const allNavItems = [
  {href: '/news', label: 'News'},
  {href: '/events', label: 'Events'},
  {href: '/faq', label: 'FAQ'},
  {href: '/platform', label: 'About & Priorities'},
  {href: '/media', label: 'Media & Press'},
  {href: '/support', label: 'Support'},
]

describe('filterNavByVisibility', () => {
  it('returns no known internal items when pageVisibility is undefined (default disabled)', () => {
    const result = filterNavByVisibility(allNavItems, undefined)
    expect(result).toEqual([])
  })

  it('returns no known internal items when pageVisibility is empty (all default to disabled)', () => {
    const result = filterNavByVisibility(allNavItems, {})
    expect(result).toEqual([])
  })

  it('filters out items whose page key is explicitly false', () => {
    const visibility: PageVisibility = {news: false}
    const result = filterNavByVisibility(allNavItems, visibility)
    expect(result.some((item) => item.href === '/news')).toBe(false)
    expect(result.some((item) => item.href === '/events')).toBe(false)
  })

  it('keeps items whose page key is explicitly true', () => {
    const visibility: PageVisibility = {news: true}
    const result = filterNavByVisibility(allNavItems, visibility)
    expect(result.some((item) => item.href === '/news')).toBe(true)
  })

  it('filters out all items when all visibility keys are false', () => {
    const visibility: PageVisibility = {
      news: false,
      events: false,
      faq: false,
      platform: false,
      media: false,
      support: false,
    }
    const result = filterNavByVisibility(allNavItems, visibility)
    expect(result).toHaveLength(0)
  })

  it('keeps items with unrecognized hrefs regardless of visibility', () => {
    const customItems = [{href: '/custom-page', label: 'Custom'}]
    const visibility: PageVisibility = {news: false}
    const result = filterNavByVisibility(customItems, visibility)
    expect(result).toEqual(customItems)
  })

  it('maps /press href to the media visibility key', () => {
    const pressItems = [{href: '/press', label: 'Press'}]
    expect(filterNavByVisibility(pressItems, {media: true})).toHaveLength(1)
    expect(filterNavByVisibility(pressItems, {media: false})).toHaveLength(0)
  })
})
