import {isPageEnabled} from '@/lib/cms/types'
import type {PageVisibility, PageVisibilityKey} from '@/lib/cms/types'

type NavVisibilityItem = {
  href: string
}

/** Maps known internal page hrefs to their PageVisibilityKey. */
const PAGE_VISIBILITY_HREF_MAP: Record<string, PageVisibilityKey> = {
  '/news': 'news',
  '/events': 'events',
  '/faq': 'faq',
  '/platform': 'platform',
  '/media': 'media',
  '/press': 'media',
  '/support': 'support',
}

export function filterNavByVisibility<T extends NavVisibilityItem>(items: T[], pageVisibility?: PageVisibility): T[] {
  const visibility = pageVisibility ?? {}
  return items.filter((item) => {
    const key = PAGE_VISIBILITY_HREF_MAP[item.href]
    // Preserve non-mapped/internal-custom routes. Visibility toggles only govern
    // the known top-level campaign sections listed in PAGE_VISIBILITY_HREF_MAP.
    if (!key) return true
    return isPageEnabled(visibility, key)
  })
}
