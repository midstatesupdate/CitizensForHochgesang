import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { getDefaultPageVisual, getPageShellClasses, getPageShellDataAttributes } from './page-visuals'
import type { PageVisualSettings } from './types'

describe('getDefaultPageVisual', () => {
  it('returns the correct default for "home"', () => {
    const visual = getDefaultPageVisual('home')
    expect(visual.pageKey).toBe('home')
    expect(visual.backgroundVariant).toBe('stately-gradient')
  })

  it('returns the correct default for "news"', () => {
    const visual = getDefaultPageVisual('news')
    expect(visual.pageKey).toBe('news')
    expect(visual.toneVariant).toBe('news')
  })

  it('returns the correct default for "events"', () => {
    const visual = getDefaultPageVisual('events')
    expect(visual.pageKey).toBe('events')
    expect(visual.motionPreset).toBe('lively')
  })

  it('returns the correct default for "support"', () => {
    const visual = getDefaultPageVisual('support')
    expect(visual.pageKey).toBe('support')
    expect(visual.toneVariant).toBe('support')
  })

  it('returns the correct default for narrow container pages', () => {
    const newsDetail = getDefaultPageVisual('news-detail')
    expect(newsDetail.containerVariant).toBe('narrow')

    const eventsDetail = getDefaultPageVisual('events-detail')
    expect(eventsDetail.containerVariant).toBe('narrow')

    const platformDetail = getDefaultPageVisual('platform-detail')
    expect(platformDetail.containerVariant).toBe('narrow')
  })
})

describe('getPageShellClasses', () => {
  const baseVisuals: PageVisualSettings = {
    pageKey: 'home',
    backgroundVariant: 'stately-gradient',
    containerVariant: 'standard',
    toneVariant: 'default',
    motionPreset: 'calm',
    textLinkAnimation: 'sweep',
    pageBackgroundAnimation: 'drift',
    scrollRevealAnimation: 'soft',
  }

  beforeEach(() => {
    // Clear env vars before each test
    vi.stubEnv('NEXT_PUBLIC_ENABLE_BG_ANIMATIONS', '')
    vi.stubEnv('NEXT_PUBLIC_BG_ANIM_STEPPED', '')
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('always includes page-shell as the first class', () => {
    const classes = getPageShellClasses(baseVisuals)
    expect(classes.startsWith('page-shell ')).toBe(true)
  })

  it('includes background variant class', () => {
    const classes = getPageShellClasses(baseVisuals)
    expect(classes).toContain('page-bg-stately-gradient')
  })

  it('includes container variant class', () => {
    const classes = getPageShellClasses(baseVisuals)
    expect(classes).toContain('page-shell-container-standard')
  })

  it('includes motion preset class', () => {
    const classes = getPageShellClasses(baseVisuals)
    expect(classes).toContain('motion-calm')
  })

  it('includes text link animation class', () => {
    const classes = getPageShellClasses(baseVisuals)
    expect(classes).toContain('text-links-sweep')
  })

  it('includes scroll reveal animation class', () => {
    const classes = getPageShellClasses(baseVisuals)
    expect(classes).toContain('scroll-reveal-soft')
  })

  it('uses bg-anim-none when background animations are disabled', () => {
    vi.stubEnv('NEXT_PUBLIC_ENABLE_BG_ANIMATIONS', '')
    const classes = getPageShellClasses(baseVisuals)
    expect(classes).toContain('bg-anim-none')
  })

  it('uses the actual animation when background animations are enabled', () => {
    vi.stubEnv('NEXT_PUBLIC_ENABLE_BG_ANIMATIONS', '1')
    const classes = getPageShellClasses(baseVisuals)
    expect(classes).toContain('bg-anim-drift')
  })

  it('uses bg-anim-fps-normal by default', () => {
    const classes = getPageShellClasses(baseVisuals)
    expect(classes).toContain('bg-anim-fps-normal')
  })

  it('uses bg-anim-fps-stepped when stepped animations are enabled', () => {
    vi.stubEnv('NEXT_PUBLIC_BG_ANIM_STEPPED', '1')
    const classes = getPageShellClasses(baseVisuals)
    expect(classes).toContain('bg-anim-fps-stepped')
  })

  it('does NOT include tone class when toneVariant is default', () => {
    const classes = getPageShellClasses(baseVisuals)
    expect(classes).not.toMatch(/tone-/)
  })

  it('includes tone class when toneVariant is not default', () => {
    const newsVisuals: PageVisualSettings = { ...baseVisuals, toneVariant: 'news' }
    const classes = getPageShellClasses(newsVisuals)
    expect(classes).toContain('tone-news')
  })
})

describe('getPageShellDataAttributes', () => {
  it('returns data-scroll-reveal with the scroll reveal animation value', () => {
    const attrs = getPageShellDataAttributes({
      pageKey: 'home',
      backgroundVariant: 'stately-gradient',
      containerVariant: 'standard',
      toneVariant: 'default',
      motionPreset: 'calm',
      textLinkAnimation: 'sweep',
      pageBackgroundAnimation: 'drift',
      scrollRevealAnimation: 'soft',
    })
    expect(attrs).toEqual({ 'data-scroll-reveal': 'soft' })
  })

  it('returns dynamic when scrollRevealAnimation is dynamic', () => {
    const attrs = getPageShellDataAttributes({
      pageKey: 'news',
      backgroundVariant: 'topo-lines',
      containerVariant: 'standard',
      toneVariant: 'news',
      motionPreset: 'balanced',
      textLinkAnimation: 'glint',
      pageBackgroundAnimation: 'drift',
      scrollRevealAnimation: 'dynamic',
    })
    expect(attrs['data-scroll-reveal']).toBe('dynamic')
  })
})
