'use client'

import type {PageVisualSettings} from '@/lib/cms/types'
import {ScrollProgressBar} from '@/components/scroll-progress-bar'
import {MagneticButtons} from '@/components/magnetic-buttons'

/**
 * Conditionally renders page-level effects controlled by CMS pageVisualSettings:
 * - Scroll progress bar (thin accent bar at viewport top)
 * - Magnetic CTA buttons (buttons pull toward cursor on desktop)
 *
 * Drop this into any page's JSX alongside the page shell.
 */
export function PageEffects({visuals}: {visuals: PageVisualSettings}) {
  return (
    <>
      {visuals.scrollProgressBar ? <ScrollProgressBar /> : null}
      {visuals.magneticButtons ? <MagneticButtons /> : null}
    </>
  )
}
