import Link from 'next/link'
import Image from 'next/image'
import {FaBullhorn, FaCalendarAlt, FaHandsHelping, FaNewspaper, FaVideo, FaVoteYea} from 'react-icons/fa'
import type {IconType} from 'react-icons'

import {CmsLink} from '@/components/cms-link'
import {formatDate, formatDateTime} from '@/lib/cms/format'
import {getPageShellClasses, getPageShellDataAttributes} from '@/lib/cms/page-visuals'
import type {IconName} from '@/lib/cms/types'
import {
  getFundraisingLinks,
  getMediaLinks,
  getPageVisualSettings,
  getRecentPosts,
  getSiteSettings,
  getUpcomingEvents,
} from '@/lib/cms/repository'

function normalizeHomeHeroLayout(value: string | undefined): 'clean-split' | 'portrait-left' | 'immersive-overlay' {
  if (!value) {
    return 'clean-split'
  }

  const normalized = value.trim().toLowerCase()

  if (normalized === 'portrait-left' || normalized === 'portraitleft' || normalized === 'portrait_left') {
    return 'portrait-left'
  }

  if (
    normalized === 'immersive-overlay' ||
    normalized === 'immersiveoverlay' ||
    normalized === 'immersive_overlay'
  ) {
    return 'immersive-overlay'
  }

  return 'clean-split'
}

const iconMap: Record<IconName, IconType> = {
  bullhorn: FaBullhorn,
  calendar: FaCalendarAlt,
  'hands-helping': FaHandsHelping,
  newspaper: FaNewspaper,
  'question-circle': FaNewspaper,
  'reg-newspaper': FaNewspaper,
  video: FaVideo,
  'vote-yea': FaVoteYea,
}

function resolveIcon(icon: IconName | undefined, fallback: IconType): IconType {
  if (!icon) {
    return fallback
  }

  return iconMap[icon] ?? fallback
}

function resolveActionClass(style: 'primary' | 'outline' | 'accent' | undefined): string {
  if (style === 'accent') {
    return 'btn btn-accent'
  }

  if (style === 'outline') {
    return 'btn btn-outline'
  }

  return 'btn btn-primary'
}

export default async function Home() {
  const [settings, posts, events, mediaLinks, fundraisingLinks, pageVisualSettings] = await Promise.all([
    getSiteSettings(),
    getRecentPosts(3),
    getUpcomingEvents(),
    getMediaLinks(3),
    getFundraisingLinks(),
    getPageVisualSettings('home'),
  ])

  const topFundraisingLink = fundraisingLinks[0] ?? null
  const heroPortraitUrl = settings.candidatePortraitUrl ?? settings.campaignLogoUrl
  const heroPortraitAlt =
    settings.candidatePortraitAlt ??
    settings.campaignLogoAlt ??
    `${settings.siteTitle} candidate portrait`
  const heroPortraitCaption = settings.candidatePortraitCaption?.trim()
  const homeHeroLayout = normalizeHomeHeroLayout(settings.homeHeroLayout)
  const districtLabel = settings.homeDistrictLabel?.trim() || 'Indiana State Senate District 48'
  const heroSummary = settings.homeHeroSummary?.trim() || settings.tagline
  const campaignFocusItems = settings.homeFocusItems
  const homeSectionCards = settings.homeSectionCards
  const textBadges = settings.homeHeroBadges.filter((item) => item.placement === 'text')
  const mediaBadges = settings.homeHeroBadges.filter((item) => item.placement === 'media')
  const proofBadges = settings.homeHeroBadges.filter((item) => item.placement === 'proof')
  const heroActions = settings.homeHeroActions

  return (
    <main className={getPageShellClasses(pageVisualSettings)} {...getPageShellDataAttributes(pageVisualSettings)}>
      <section className={`campaign-hero campaign-hero-${homeHeroLayout}`}>
        {homeHeroLayout === 'immersive-overlay' ? (
          <>
            <div className="campaign-hero-immersive-frame">
              {heroPortraitUrl ? (
                <Image
                  src={heroPortraitUrl}
                  alt={heroPortraitAlt}
                  width={1600}
                  height={1040}
                  className="campaign-hero-image"
                  unoptimized
                  priority
                />
              ) : null}
              <div className="campaign-hero-immersive-overlay">
                <p className="eyebrow">{districtLabel}</p>
                <h1 className="hero-title">{settings.siteTitle}</h1>
                <p className="max-w-2xl text-lg text-[color:var(--color-muted)]">{heroSummary}</p>
                <div className="flex flex-wrap gap-4">
                  {heroActions.map((action) => {
                    const ActionIcon = resolveIcon(action.icon, FaHandsHelping)

                    return (
                      <CmsLink key={`${action.label}-${action.url}`} className={resolveActionClass(action.style)} href={action.url}>
                        <ActionIcon aria-hidden />
                        {action.label}
                      </CmsLink>
                    )
                  })}
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-[color:var(--color-muted)]">
                  {textBadges.map((badge) => {
                    const BadgeIcon = resolveIcon(badge.icon, FaBullhorn)
                    const key = `${badge.label}-${badge.url ?? 'no-link'}`

                    if (badge.url) {
                      return (
                        <CmsLink key={key} href={badge.url} className="pill-badge">
                          <BadgeIcon aria-hidden />
                          {badge.label}
                        </CmsLink>
                      )
                    }

                    return (
                      <span key={key} className="pill-badge">
                        <BadgeIcon aria-hidden />
                        {badge.label}
                      </span>
                    )
                  })}
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="campaign-hero-text">
              <p className="eyebrow">{districtLabel}</p>
              <div className="flex flex-col gap-4">
                <h1 className="hero-title">{settings.siteTitle}</h1>
                <p className="max-w-2xl text-lg text-[color:var(--color-muted)]">{heroSummary}</p>
              </div>
              <div className="flex flex-wrap gap-4">
                {heroActions.map((action) => {
                  const ActionIcon = resolveIcon(action.icon, FaHandsHelping)

                  return (
                    <CmsLink key={`${action.label}-${action.url}`} className={resolveActionClass(action.style)} href={action.url}>
                      <ActionIcon aria-hidden />
                      {action.label}
                    </CmsLink>
                  )
                })}
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-[color:var(--color-muted)]">
                {textBadges.map((badge) => {
                  const BadgeIcon = resolveIcon(badge.icon, FaBullhorn)
                  const key = `${badge.label}-${badge.url ?? 'no-link'}`

                  if (badge.url) {
                    return (
                      <CmsLink key={key} href={badge.url} className="pill-badge">
                        <BadgeIcon aria-hidden />
                        {badge.label}
                      </CmsLink>
                    )
                  }

                  return (
                    <span key={key} className="pill-badge">
                      <BadgeIcon aria-hidden />
                      {badge.label}
                    </span>
                  )
                })}
              </div>
              <ul className="campaign-focus-list">
                {campaignFocusItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="campaign-hero-media">
              {heroPortraitUrl ? (
                <Image
                  src={heroPortraitUrl}
                  alt={heroPortraitAlt}
                  width={960}
                  height={1200}
                  className="campaign-hero-image"
                  unoptimized
                  priority
                />
              ) : null}
              {heroPortraitCaption ? <p className="text-sm text-[color:var(--color-muted)]">{heroPortraitCaption}</p> : null}
              {mediaBadges.length > 0 ? (
                <div className="flex flex-wrap gap-3">
                  {mediaBadges.map((badge) => {
                    const BadgeIcon = resolveIcon(badge.icon, FaBullhorn)
                    const key = `${badge.label}-${badge.url ?? 'no-link'}`

                    if (badge.url) {
                      return (
                        <CmsLink key={key} href={badge.url} className="pill-badge">
                          <BadgeIcon aria-hidden />
                          {badge.label}
                        </CmsLink>
                      )
                    }

                    return (
                      <span key={key} className="pill-badge">
                        <BadgeIcon aria-hidden />
                        {badge.label}
                      </span>
                    )
                  })}
                </div>
              ) : null}
              {topFundraisingLink ? (
                <CmsLink className="btn btn-accent campaign-hero-donate" href={topFundraisingLink.url}>
                  <FaVoteYea aria-hidden />
                  Donate now
                </CmsLink>
              ) : null}
            </div>
          </>
        )}

        <div className="campaign-proof-strip">
          {proofBadges.map((badge) => {
            const BadgeIcon = resolveIcon(badge.icon, FaBullhorn)
            const key = `${badge.label}-${badge.url ?? 'no-link'}`

            if (badge.url) {
              return (
                <CmsLink key={key} href={badge.url} className="pill-badge">
                  <BadgeIcon aria-hidden />
                  {badge.label}
                </CmsLink>
              )
            }

            return (
              <span key={key} className="pill-badge">
                <BadgeIcon aria-hidden />
                {badge.label}
              </span>
            )
          })}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        {homeSectionCards.map((item) => {
          const SectionIcon = resolveIcon(item.icon, FaNewspaper)

          return (
          <div key={item.title} className="card">
            <h2 className="text-xl font-semibold text-[color:var(--color-ink)]">
              <SectionIcon aria-hidden className="mr-2 inline-block" />
              {item.title}
            </h2>
            <p className="mt-3 text-sm text-[color:var(--color-muted)]">
              {item.copy}
            </p>
            <div className="mt-4">
              <Link className="btn btn-outline" href={item.href}>
                {item.ctaLabel || `View ${item.title}`}
              </Link>
            </div>
          </div>
          )
        })}
      </section>

      <section className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="card flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <p className="eyebrow">Recent news</p>
            <h2 className="section-title">Latest updates</h2>
            <p className="text-sm text-[color:var(--color-muted)]">
              Read the latest campaign posts and issue-focused announcements.
            </p>
          </div>
          <div className="grid gap-4">
            {posts.map((post) => (
              <article key={post.slug} className="article-card rounded-2xl border border-[color:var(--color-border)] px-4 py-4">
                <p className="article-meta text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--color-muted)]">
                  {formatDate(post.publishedAt)}
                </p>
                <p className="article-title mt-2 text-base font-semibold text-[color:var(--color-ink)]">{post.title}</p>
                {post.excerpt ? (
                  <p className="mt-2 text-sm text-[color:var(--color-muted)]">{post.excerpt}</p>
                ) : null}
                <div className="mt-3">
                  <Link className="article-cta btn btn-outline" href={`/news/${post.slug}`}>
                    Read post
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="card flex flex-col gap-6">
          <p className="eyebrow">Upcoming events</p>
          <h2 className="section-title">Meet us in the district</h2>
          <div className="grid gap-4">
            {events.slice(0, 2).map((event) => (
              <article key={event.id} className="article-card rounded-2xl border border-[color:var(--color-border)] px-4 py-4">
                <p className="article-meta text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--color-muted)]">
                  {formatDateTime(event.startDate)}
                </p>
                <p className="article-title mt-2 text-base font-semibold text-[color:var(--color-ink)]">{event.title}</p>
                <p className="mt-2 text-sm text-[color:var(--color-muted)]">{event.location}</p>
              </article>
            ))}
          </div>
          <Link className="btn btn-outline" href="/events">
            <FaCalendarAlt aria-hidden />
            View all events
          </Link>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="card flex flex-col gap-4">
          <p className="eyebrow">Recent media</p>
          <h2 className="section-title">Watch and share</h2>
          <div className="grid gap-3">
            {mediaLinks.map((item) => (
              <CmsLink
                key={item.id}
                href={item.url}
                className="rounded-2xl border border-[color:var(--color-border)] px-4 py-3 text-sm font-semibold text-[color:var(--color-accent)] transition hover:bg-[color:var(--color-highlight)]"
              >
                {item.title}
              </CmsLink>
            ))}
          </div>
          <Link className="btn btn-outline" href="/media">
            <FaVideo aria-hidden />
            Browse media
          </Link>
        </div>

        <div className="card flex flex-col gap-4">
          <p className="eyebrow">Support the campaign</p>
          <h2 className="section-title">Contribute and volunteer</h2>
          <p className="text-sm text-[color:var(--color-muted)]">
            Help fuel voter outreach, field organization, and campaign events.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link className="btn btn-primary" href="/support">
              <FaHandsHelping aria-hidden />
              Volunteer
            </Link>
            {topFundraisingLink ? (
              <CmsLink
                className="btn btn-accent"
                href={topFundraisingLink.url}
              >
                <FaVoteYea aria-hidden />
                Donate now
              </CmsLink>
            ) : null}
          </div>
        </div>
      </section>
    </main>
  );
}
