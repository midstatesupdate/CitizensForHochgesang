import type {Metadata} from 'next'
import Image from 'next/image'

import {CmsLink} from '@/components/cms-link'
import {formatDate, formatDateTime} from '@/lib/cms/format'
import {getPageShellClasses, getPageShellDataAttributes} from '@/lib/cms/page-visuals'
import {getPageVisualSettings, getRecentPosts, getSiteSettings, getUpcomingEvents} from '@/lib/cms/repository'

export const metadata: Metadata = {
  title: 'Press',
  description: 'Press access page with campaign contacts, logo assets, and recent updates.',
}

export default async function PressPage() {
  const [settings, posts, events, pageVisualSettings] = await Promise.all([
    getSiteSettings(),
    getRecentPosts(5),
    getUpcomingEvents(),
    getPageVisualSettings('press'),
  ])

  return (
    <main className={getPageShellClasses(pageVisualSettings)} {...getPageShellDataAttributes(pageVisualSettings)}>
      <section className="reveal flex flex-col gap-4">
        <p className="eyebrow">Press</p>
        <h1 className="section-title">Press and media resources</h1>
        <p className="max-w-3xl text-sm text-[color:var(--color-muted)]">
          Access official campaign contact information, visual assets, and the most recent public updates.
        </p>
        {settings.pressUpdatedAt ? (
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[color:var(--color-muted)]">
            Press resources updated {formatDateTime(settings.pressUpdatedAt)}
          </p>
        ) : null}
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <article className="card reveal flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-[color:var(--color-ink)]">Media contact</h2>
          {settings.contactEmail ? (
            <a className="link-soft text-sm font-semibold" href={`mailto:${settings.contactEmail}`}>
              {settings.contactEmail}
            </a>
          ) : (
            <p className="text-sm text-[color:var(--color-muted)]">Contact email pending publication in Site Settings.</p>
          )}
          <p className="text-sm text-[color:var(--color-muted)]">Please include deadline and publication details in outreach requests.</p>
        </article>

        <article className="card reveal flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-[color:var(--color-ink)]">Brand assets</h2>
          {settings.campaignLogoUrl ? (
            <>
              <div className="card-media flex justify-center p-6">
                <Image
                  src={settings.campaignLogoUrl}
                  alt={settings.campaignLogoAlt ?? `${settings.siteTitle} logo`}
                  width={320}
                  height={320}
                  className="h-auto w-full max-w-[14rem] object-contain"
                  unoptimized
                />
              </div>
              <CmsLink className="link-pill link-pill-media" href={settings.campaignLogoUrl}>
                Download campaign logo
              </CmsLink>
              <div className="grid gap-2 text-sm">
                <CmsLink className="link-soft" href="/press-kit/candidate-bio-short.md">
                  Download short bio
                </CmsLink>
                <CmsLink className="link-soft" href="/press-kit/media-contact.txt">
                  Download media contact sheet
                </CmsLink>
                <CmsLink className="link-soft" href="/press-kit/logo-usage.md">
                  Download logo usage guidance
                </CmsLink>
              </div>
            </>
          ) : (
            <p className="text-sm text-[color:var(--color-muted)]">Campaign logo not published in site settings yet.</p>
          )}
        </article>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <article className="card reveal flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-[color:var(--color-ink)]">Latest news for press context</h2>
          <ul className="grid gap-3">
            {posts.map((post) => (
              <li key={post.slug} className="article-card rounded-2xl border border-[color:var(--color-border)] px-4 py-3">
                <p className="article-meta text-xs font-semibold uppercase tracking-[0.25em] text-[color:var(--color-muted)]">
                  {formatDate(post.publishedAt)}
                </p>
                <p className="article-title mt-2 text-sm font-semibold text-[color:var(--color-ink)]">{post.title}</p>
              </li>
            ))}
          </ul>
        </article>

        <article className="card reveal flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-[color:var(--color-ink)]">Upcoming public events</h2>
          <ul className="grid gap-3">
            {events.slice(0, 4).map((event) => (
              <li key={event.id} className="article-card rounded-2xl border border-[color:var(--color-border)] px-4 py-3">
                <p className="article-title text-sm font-semibold text-[color:var(--color-ink)]">{event.title}</p>
                <p className="mt-1 text-sm text-[color:var(--color-muted)]">{event.location}</p>
              </li>
            ))}
          </ul>
        </article>
      </section>
    </main>
  )
}
