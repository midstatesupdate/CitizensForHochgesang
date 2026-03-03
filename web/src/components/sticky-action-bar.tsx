import {FaDonate, FaHandsHelping} from 'react-icons/fa'

import {CmsLink} from '@/components/cms-link'

type StickyActionBarProps = {
  donateUrl?: string
  volunteerUrl?: string
}

/** Persistent donate/volunteer bar fixed to the top of every page. */
export function StickyActionBar({donateUrl, volunteerUrl}: StickyActionBarProps) {
  if (!donateUrl && !volunteerUrl) {
    return null
  }

  return (
    <div className="sticky-action-bar" role="banner" aria-label="Campaign actions">
      <div className="sticky-action-bar-inner">
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
    </div>
  )
}
