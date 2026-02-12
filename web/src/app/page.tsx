import Link from 'next/link'
import Image from 'next/image'
import {FaBullhorn, FaCalendarAlt, FaHandsHelping, FaNewspaper, FaVideo, FaVoteYea} from 'react-icons/fa'

import {CmsLink} from '@/components/cms-link'
import {formatDate, formatDateTime} from '@/lib/cms/format'
import {getPageShellClasses, getPageShellDataAttributes} from '@/lib/cms/page-visuals'
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
  const homeHeroLayout = normalizeHomeHeroLayout(settings.homeHeroLayout)
  const campaignFocusItems = [
    'Strengthening local jobs, small businesses, and workforce training.',
    'Supporting safe communities through partnerships and smart policy.',
    'Protecting quality education and practical pathways for families.',
  ]
  const campaignProofItems = ['District listening sessions', 'Neighborhood town halls', 'Volunteer-powered outreach']

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
                <p className="eyebrow">Indiana State Senate District 48</p>
                <h1 className="hero-title">{settings.siteTitle}</h1>
                <p className="max-w-2xl text-lg text-[color:var(--color-muted)]">{settings.tagline}</p>
                <div className="flex flex-wrap gap-4">
                  <Link className="btn btn-primary" href="/support">
                    <FaHandsHelping aria-hidden />
                    Volunteer
                  </Link>
                  <Link className="btn btn-outline" href="/support">
                    <FaVoteYea aria-hidden />
                    Donate
                  </Link>
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-[color:var(--color-muted)]">
                  <span className="pill-badge">
                    <FaBullhorn aria-hidden />
                    Community-first platform
                  </span>
                  <span className="pill-badge">
                    <FaNewspaper aria-hidden />
                    Transparent updates
                  </span>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="campaign-hero-text">
              <p className="eyebrow">Indiana State Senate District 48</p>
              <div className="flex flex-col gap-4">
                <h1 className="hero-title">{settings.siteTitle}</h1>
                <p className="max-w-2xl text-lg text-[color:var(--color-muted)]">{settings.tagline}</p>
              </div>
              <div className="flex flex-wrap gap-4">
                <Link className="btn btn-primary" href="/support">
                  <FaHandsHelping aria-hidden />
                  Volunteer
                </Link>
                <Link className="btn btn-outline" href="/support">
                  <FaVoteYea aria-hidden />
                  Donate
                </Link>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-[color:var(--color-muted)]">
                <span className="pill-badge">
                  <FaBullhorn aria-hidden />
                  Community-first platform
                </span>
                <span className="pill-badge">
                  <FaNewspaper aria-hidden />
                  Transparent updates
                </span>
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
          {campaignProofItems.map((item) => (
            <span key={item} className="pill-badge">
              {item}
            </span>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        {[
          {title: 'News & Updates', copy: 'Campaign announcements and policy updates.', href: '/news', icon: FaNewspaper},
          {title: 'Events', copy: 'Town halls, meetups, and district listening sessions.', href: '/events', icon: FaCalendarAlt},
          {title: 'Media', copy: 'Video, interviews, and social coverage in one feed.', href: '/media', icon: FaVideo},
        ].map((item) => (
          <div key={item.title} className="card">
            <h2 className="text-xl font-semibold text-[color:var(--color-ink)]">
              <item.icon aria-hidden className="mr-2 inline-block" />
              {item.title}
            </h2>
            <p className="mt-3 text-sm text-[color:var(--color-muted)]">
              {item.copy}
            </p>
            <div className="mt-4">
              <Link className="btn btn-outline" href={item.href}>
                View {item.title}
              </Link>
            </div>
          </div>
        ))}
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
