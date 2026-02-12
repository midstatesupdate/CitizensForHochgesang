import type {PageVisualSettings, PageVisualPageKey} from './types'

const defaultVisuals: Record<PageVisualPageKey, PageVisualSettings> = {
  home: {
    pageKey: 'home',
    backgroundVariant: 'stately-gradient',
    containerVariant: 'standard',
    toneVariant: 'default',
    motionPreset: 'calm',
    textLinkAnimation: 'sweep',
    pageBackgroundAnimation: 'drift',
    scrollRevealAnimation: 'soft',
  },
  news: {
    pageKey: 'news',
    backgroundVariant: 'topo-lines',
    containerVariant: 'standard',
    toneVariant: 'news',
    motionPreset: 'balanced',
    textLinkAnimation: 'glint',
    pageBackgroundAnimation: 'pulse',
    scrollRevealAnimation: 'dynamic',
  },
  'news-detail': {
    pageKey: 'news-detail',
    backgroundVariant: 'civic-fabric',
    containerVariant: 'narrow',
    toneVariant: 'news',
    motionPreset: 'calm',
    textLinkAnimation: 'subtle',
    pageBackgroundAnimation: 'none',
    scrollRevealAnimation: 'soft',
  },
  events: {
    pageKey: 'events',
    backgroundVariant: 'diagonal-wash',
    containerVariant: 'standard',
    toneVariant: 'events',
    motionPreset: 'lively',
    textLinkAnimation: 'sweep',
    pageBackgroundAnimation: 'drift',
    scrollRevealAnimation: 'dynamic',
  },
  faq: {
    pageKey: 'faq',
    backgroundVariant: 'civic-fabric',
    containerVariant: 'standard',
    toneVariant: 'support',
    motionPreset: 'still',
    textLinkAnimation: 'none',
    pageBackgroundAnimation: 'none',
    scrollRevealAnimation: 'cascade',
  },
  media: {
    pageKey: 'media',
    backgroundVariant: 'signal-grid',
    containerVariant: 'standard',
    toneVariant: 'media',
    motionPreset: 'lively',
    textLinkAnimation: 'glint',
    pageBackgroundAnimation: 'tracers',
    scrollRevealAnimation: 'dynamic',
  },
  press: {
    pageKey: 'press',
    backgroundVariant: 'signal-grid',
    containerVariant: 'standard',
    toneVariant: 'media',
    motionPreset: 'calm',
    textLinkAnimation: 'subtle',
    pageBackgroundAnimation: 'drift-tracers',
    scrollRevealAnimation: 'soft',
  },
  support: {
    pageKey: 'support',
    backgroundVariant: 'stately-gradient',
    containerVariant: 'standard',
    toneVariant: 'support',
    motionPreset: 'balanced',
    textLinkAnimation: 'glint',
    pageBackgroundAnimation: 'drift',
    scrollRevealAnimation: 'cascade',
  },
}

export function getDefaultPageVisual(pageKey: PageVisualPageKey): PageVisualSettings {
  return defaultVisuals[pageKey]
}

export function getPageShellClasses(visuals: PageVisualSettings): string {
  const classes = ['page-shell']

  classes.push(`page-bg-${visuals.backgroundVariant}`)
  classes.push(`page-shell-container-${visuals.containerVariant}`)
  classes.push(`motion-${visuals.motionPreset}`)
  classes.push(`text-links-${visuals.textLinkAnimation}`)
  classes.push(`bg-anim-${visuals.pageBackgroundAnimation}`)
  classes.push(`scroll-reveal-${visuals.scrollRevealAnimation}`)

  if (visuals.toneVariant !== 'default') {
    classes.push(`tone-${visuals.toneVariant}`)
  }

  return classes.join(' ')
}

export function getPageShellDataAttributes(visuals: PageVisualSettings): {'data-scroll-reveal': PageVisualSettings['scrollRevealAnimation']} {
  return {
    'data-scroll-reveal': visuals.scrollRevealAnimation,
  }
}
