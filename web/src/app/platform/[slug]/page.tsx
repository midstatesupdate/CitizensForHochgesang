import type {Metadata} from 'next'
import Link from 'next/link'
import {notFound} from 'next/navigation'

import {ArticleContent} from '@/components/article-content'
import {CmsLink} from '@/components/cms-link'
import {getPageShellClasses, getPageShellDataAttributes} from '@/lib/cms/page-visuals'
import {assertPageEnabled, getAboutPriorities, getPageVisualSettings, getSiteSettings} from '@/lib/cms/repository'
import {isPageEnabled} from '@/lib/cms/types'

type PriorityDetailPageProps = {
  params: Promise<{slug: string}>
}

export async function generateStaticParams() {
  const {pageVisibility} = await getSiteSettings()
  if (!isPageEnabled(pageVisibility, 'platform')) return []
  const about = await getAboutPriorities()
  return about.priorities.map((priority) => ({slug: priority.slug}))
}

export async function generateMetadata({params}: PriorityDetailPageProps): Promise<Metadata> {
  const {pageVisibility} = await getSiteSettings()
  if (!isPageEnabled(pageVisibility, 'platform')) {
    // Keep metadata generation aligned with static export gating when the
    // section is disabled before page rendering runs.
    return {title: 'About & Priorities unavailable'}
  }
  const {slug} = await params
  const about = await getAboutPriorities()
  const priority = about.priorities.find((item) => item.slug === slug)

  if (!priority) {
    return {
      title: 'Priority not found',
    }
  }

  return {
    title: `${priority.title} | About & Priorities`,
    description: priority.summary,
  }
}

export default async function PriorityDetailPage({params}: PriorityDetailPageProps) {
  await assertPageEnabled('platform')
  const {slug} = await params
  const [about, pageVisualSettings] = await Promise.all([
    getAboutPriorities(),
    getPageVisualSettings('platform-detail'),
  ])

  const priority = about.priorities.find((item) => item.slug === slug)

  if (!priority) {
    notFound()
  }

  return (
    <main className={getPageShellClasses(pageVisualSettings)} {...getPageShellDataAttributes(pageVisualSettings)}>
      <article className="card mx-auto w-full max-w-4xl">
        <div className="flex flex-col gap-5">
          <Link className="text-sm font-semibold text-[color:var(--color-accent)] hover:underline" href="/platform">
            ← Back to About & Priorities
          </Link>

          <p className="eyebrow">Priority Detail</p>
          <h1 className="hero-title">{priority.title}</h1>
          <p className="text-base text-[color:var(--color-muted)]">{priority.summary}</p>

          <ArticleContent body={priority.body} />

          {priority.links.length > 0 ? (
            <section className="grid gap-3">
              <p className="eyebrow">Related links</p>
              <ul className="grid gap-2">
                {priority.links.map((item) => (
                  <li key={`${priority.slug}-${item.label}-${item.url}`}>
                    <CmsLink className="link-soft text-sm font-semibold" href={item.url}>
                      {item.label}
                    </CmsLink>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>
      </article>
    </main>
  )
}
