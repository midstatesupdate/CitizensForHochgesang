import type {ReactNode} from 'react'
import {FaDonate, FaHandsHelping} from 'react-icons/fa'

import {CmsLink} from '@/components/cms-link'

type StickyActionBarProps = {
  donateUrl?: string
  volunteerUrl?: string
  children?: ReactNode
}

/** Persistent top bar fixed to every page. Donate/Volunteer on the left; nav controls (theme toggle, menu) on the right. */
export function StickyActionBar({donateUrl, volunteerUrl, children}: StickyActionBarProps) {
  if (!donateUrl && !volunteerUrl && !children) {
    return null
  }

  return (
    <div className="sticky-action-bar" aria-label="Site actions">
      <div className="sticky-action-bar-inner">
        <div className="flex items-center gap-2">
          {donateUrl ? (
            <CmsLink className="sticky-action-btn sticky-action-btn-accent" href={donateUrl}>
              <FaDonate aria-hidden className="text-xs" />
              Donate
            </CmsLink>
          ) : null}
          {volunteerUrl ? (
            <CmsLink className="sticky-action-btn sticky-action-btn-primary" href={volunteerUrl}>
              <FaHandsHelping aria-hidden className="text-xs" />
              Volunteer
            </CmsLink>
          ) : null}
        </div>
        {children}
      </div>
    </div>
  )
}
