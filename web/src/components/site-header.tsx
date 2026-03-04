import type {ReactNode} from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {FaDonate, FaHandsHelping} from 'react-icons/fa'

import {CmsLink} from '@/components/cms-link'
import {getSanityImageUrl} from '@/lib/cms/image-url'
import type {SiteSettings} from '@/lib/cms/types'

type SiteHeaderProps = {
  settings: SiteSettings
  /** Slot for <SiteNav> — rendered inline on desktop, repositioned to mobile bottom bar via CSS */
  children?: ReactNode
}

function sanitizeHeaderMarkup(markup: string): string {
  return markup
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
    .replace(/\son\w+\s*=\s*"[^"]*"/gi, '')
    .replace(/\son\w+\s*=\s*'[^']*'/gi, '')
    .replace(/javascript:/gi, '')
}

/**
 * Unified site header.
 *
 * Desktop (md+): single fixed top bar — Logo | spacer | Donate | Volunteer | Menu.
 * Mobile (<md): brand row scrolls with page; Donate | Menu | Volunteer cluster is
 * repositioned to a fixed bottom bar via `.site-header-controls` CSS.
 */
export function SiteHeader({settings, children}: SiteHeaderProps) {
  const homeLinkMarkup =
    settings.homeLinkMarkup?.trim() ||
    '<span class="home-link-line">Brad Hochgesang</span><span class="home-link-line">For State Senate</span>'
  const campaignLogoUrl =
    getSanityImageUrl(settings.headerLogoSmall, {width: 128, height: 128}) ??
    settings.headerLogoSmallUrl ??
    getSanityImageUrl(settings.campaignLogo, {width: 128, height: 128}) ??
    settings.campaignLogoUrl

  const {donateUrl, volunteerUrl} = settings

  return (
    <header className="site-header-bar">
      <div className="site-header-bar-inner">
        {/* Brand / logo — always visible at top */}
        <Link
          className="home-link flex shrink-0 items-center gap-2 text-base font-semibold text-[color:var(--color-ink)] sm:gap-3 sm:text-lg"
          href="/"
        >
          {campaignLogoUrl ? (
            <Image
              src={campaignLogoUrl}
              alt={settings.campaignLogoAlt ?? settings.siteTitle}
              width={64}
              height={64}
              className="site-header-logo shrink-0 rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-surface)] object-contain p-0.5"
              unoptimized
            />
          ) : null}
          <span
            className="home-link-lockup"
            dangerouslySetInnerHTML={{
              __html: sanitizeHeaderMarkup(homeLinkMarkup),
            }}
          />
        </Link>

        {/* Action controls: Donate · Menu · Volunteer
            Desktop (md+): inline in the top bar right side.
            Mobile (<md): CSS pulls this div to a fixed bottom bar. */}
        <div className="site-header-controls" aria-label="Site actions">
          {donateUrl ? (
            <CmsLink className="sticky-action-btn sticky-action-btn-accent" href={donateUrl}>
              <FaDonate aria-hidden className="text-xs" />
              <span>Donate</span>
            </CmsLink>
          ) : null}

          {/* Nav (hamburger) — center slot on mobile bottom bar */}
          {children}

          {volunteerUrl ? (
            <CmsLink className="sticky-action-btn sticky-action-btn-primary" href={volunteerUrl}>
              <FaHandsHelping aria-hidden className="text-xs" />
              <span>Volunteer</span>
            </CmsLink>
          ) : null}
        </div>
      </div>
    </header>
  )
}
