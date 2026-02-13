import Image from 'next/image'
import Link from 'next/link'

import {getSanityImageUrl} from '@/lib/cms/image-url'
import type {SiteSettings} from '@/lib/cms/types'
import {SiteNav} from '@/components/site-nav'

type SiteHeaderProps = {
  settings: SiteSettings
}

export function SiteHeader({settings}: SiteHeaderProps) {
  const homeLinkLine1 = settings.homeLinkLine1?.trim() || 'Brad Hochgesang'
  const homeLinkLine2 = settings.homeLinkLine2?.trim() || 'For State Senate'
  const campaignLogoUrl = getSanityImageUrl(settings.campaignLogo, {width: 96, height: 96}) ?? settings.campaignLogoUrl

  return (
    <header className="relative z-[80] border-b border-[color:var(--color-border)] bg-[color:var(--color-surface)]/85 backdrop-blur supports-[backdrop-filter]:bg-[color:var(--color-surface)]/75">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-2 px-4 py-3 sm:gap-4 sm:px-6 sm:py-4">
        <Link className="home-link flex shrink-0 items-center gap-2 text-base font-semibold text-[color:var(--color-ink)] sm:gap-3 sm:text-lg" href="/">
          {campaignLogoUrl ? (
            <Image
              src={campaignLogoUrl}
              alt={settings.campaignLogoAlt ?? settings.siteTitle}
              width={52}
              height={52}
              className="h-10 w-10 shrink-0 rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-surface)] object-cover sm:h-12 sm:w-12"
              unoptimized
            />
          ) : null}
          <span className="home-link-lockup">
            <span className="home-link-line">{homeLinkLine1}</span>
            <span className="home-link-line">{homeLinkLine2}</span>
          </span>
        </Link>

        <SiteNav />
      </div>
    </header>
  )
}
