import {FaDonate, FaHandsHelping} from 'react-icons/fa'

import {CmsLink} from '@/components/cms-link'

type MidPageCtaProps = {
  heading?: string
  copy?: string
  donateUrl?: string
  volunteerUrl?: string
}

/** Returns true when the section has content worth rendering. */
export function hasMidCtaContent(donateUrl?: string, volunteerUrl?: string): boolean {
  return (donateUrl != null && donateUrl.length > 0) || (volunteerUrl != null && volunteerUrl.length > 0)
}

/** Mid-page call-to-action that breaks up the scroll with donate/volunteer buttons. */
export function MidPageCta({heading, copy, donateUrl, volunteerUrl}: MidPageCtaProps) {
  if (!hasMidCtaContent(donateUrl, volunteerUrl)) {
    return null
  }

  const resolvedHeading = heading?.trim() || 'Ready to help?'
  const resolvedCopy =
    copy?.trim() ||
    'This campaign runs on people, not PACs. Every dollar and every door knock makes a difference.'

  return (
    <section className="mid-page-cta">
      <div className="mid-page-cta-inner">
        <h2 className="section-title">{resolvedHeading}</h2>
        <p className="text-base text-[color:var(--color-muted)]">{resolvedCopy}</p>
        <div className="flex flex-wrap justify-center gap-4">
          {donateUrl ? (
            <CmsLink className="btn btn-accent" href={donateUrl}>
              <FaDonate aria-hidden />
              Donate
            </CmsLink>
          ) : null}
          {volunteerUrl ? (
            <CmsLink className="btn btn-primary" href={volunteerUrl}>
              <FaHandsHelping aria-hidden />
              Volunteer
            </CmsLink>
          ) : null}
        </div>
      </div>
    </section>
  )
}
