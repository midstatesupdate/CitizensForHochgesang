import Image from 'next/image'
import Link from 'next/link'

import {getSanityImageUrl} from '@/lib/cms/image-url'
import type {SiteSettings} from '@/lib/cms/types'
import {SiteNav} from '@/components/site-nav'

type SiteHeaderProps = {
  settings: SiteSettings
}

function sanitizeHeaderMarkup(markup: string): string {
  return markup
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
    .replace(/\son\w+\s*=\s*"[^"]*"/gi, '')
    .replace(/\son\w+\s*=\s*'[^']*'/gi, '')
    .replace(/javascript:/gi, '')
}

export function SiteHeader({settings}: SiteHeaderProps) {
  const homeLinkMarkup =
    settings.homeLinkMarkup?.trim() ||
    '<span class="home-link-line">Brad Hochgesang</span><span class="home-link-line">For State Senate</span>'
  const campaignLogoUrl =
    getSanityImageUrl(settings.headerLogoSmall, {width: 128, height: 128}) ??
    settings.headerLogoSmallUrl ??
    getSanityImageUrl(settings.campaignLogo, {width: 128, height: 128}) ??
    settings.campaignLogoUrl

  return (
    <header className="relative z-[80] border-b border-[color:var(--color-border)] bg-[color:var(--color-surface)]/85 backdrop-blur supports-[backdrop-filter]:bg-[color:var(--color-surface)]/75">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-2 px-4 py-1 sm:gap-4 sm:px-6 sm:py-2">
        <Link className="home-link flex shrink-0 items-center gap-2 text-base font-semibold text-[color:var(--color-ink)] sm:gap-3 sm:text-lg" href="/">
          {campaignLogoUrl ? (
            <Image
              src={campaignLogoUrl}
              alt={settings.campaignLogoAlt ?? settings.siteTitle}
              width={64}
              height={64}
              className="h-14 w-14 shrink-0 rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-surface)] object-contain p-0.5 sm:h-16 sm:w-16"
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

        <SiteNav items={settings.headerNavItems} pageVisibility={settings.pageVisibility} />
      </div>
    </header>
  )
}
