import {CmsLink} from '@/components/cms-link'
import type {SiteSettings} from '@/lib/cms/types'
import {FaFacebook, FaGlobe, FaYoutube} from 'react-icons/fa'

type SiteFooterProps = {
  settings: SiteSettings
}

export function SiteFooter({settings}: SiteFooterProps) {
  return (
    <footer className="border-t border-[color:var(--color-border)] bg-[color:var(--color-surface)]">
      <div className="mx-auto grid w-full max-w-6xl gap-6 px-6 py-8 text-sm text-[color:var(--color-muted)] sm:grid-cols-2">
        <div className="space-y-2">
          <p className="font-semibold text-[color:var(--color-ink)]">{settings.siteTitle}</p>
          <p>{settings.tagline}</p>
          {settings.contactEmail ? <p>Contact: {settings.contactEmail}</p> : null}
        </div>

        <div className="space-y-2 sm:justify-self-end sm:text-right">
          <p className="font-semibold text-[color:var(--color-ink)]">Follow</p>
          <ul className="space-y-1">
            {settings.socialLinks.map((item) => (
              <li key={`${item.label}-${item.url}`}>
                <CmsLink className="link-pill link-pill-support" href={item.url}>
                  <SocialIcon label={item.label} />
                  {item.label}
                </CmsLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  )
}

function SocialIcon({label}: {label: string}) {
  const lower = label.toLowerCase()

  if (lower.includes('facebook')) {
    return <FaFacebook aria-hidden />
  }

  if (lower.includes('youtube')) {
    return <FaYoutube aria-hidden />
  }

  return <FaGlobe aria-hidden />
}
