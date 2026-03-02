import {CmsLink} from '@/components/cms-link'
import {ArticleContent} from '@/components/article-content'
import {getPageShellClasses, getPageShellDataAttributes} from '@/lib/cms/page-visuals'
import {assertPageEnabled, getAboutPriorities, getPageVisualSettings} from '@/lib/cms/repository'

export const metadata = {
  title: 'About & Priorities | Brad Hochgesang for State Senate',
  description:
    'Background, campaign priorities, and practical commitments for Indiana State Senate District 48.',
}

export default async function PlatformPage() {
  await assertPageEnabled('platform')
  const [about, pageVisualSettings] = await Promise.all([getAboutPriorities(), getPageVisualSettings('platform')])

  return (
    <main className={getPageShellClasses(pageVisualSettings)} {...getPageShellDataAttributes(pageVisualSettings)}>
      <section className="flex flex-col gap-4">
        <p className="eyebrow">{about.pageEyebrow}</p>
        <h1 className="section-title">{about.pageTitle}</h1>
        <p className="max-w-3xl text-sm text-[color:var(--color-muted)]">
          {about.pageIntro}
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <article className="card article-card flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-[color:var(--color-ink)]">{about.bioHeading}</h2>
          <ArticleContent body={about.bioBody} />
        </article>

        <article className="card article-card flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-[color:var(--color-ink)]">{about.valuesHeading}</h2>
          <ul className="grid gap-2 text-sm text-[color:var(--color-muted)]">
            {about.values.map((value) => (
              <li key={value} className="rounded-2xl border border-[color:var(--color-border)] px-4 py-3">
                {value}
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section className="grid gap-6">
        <h2 className="section-title">{about.prioritiesHeading}</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {about.priorities.map((priority) => (
            <article key={priority.title} className="card article-card flex flex-col gap-3">
              <h3 className="text-lg font-semibold text-[color:var(--color-ink)]">{priority.title}</h3>
              <p className="text-sm text-[color:var(--color-muted)]">{priority.summary}</p>
              <p className="article-inline-cta text-sm font-semibold">
                <CmsLink className="article-inline-link" href={`/platform/${priority.slug}`}>
                  Learn more →
                </CmsLink>
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="card article-card flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-[color:var(--color-ink)]">{about.ctaHeading}</h2>
        <p className="text-sm text-[color:var(--color-muted)]">
          {about.ctaCopy}
        </p>
        <div className="flex flex-wrap gap-3">
          <CmsLink className="btn btn-primary" href={about.primaryCtaUrl}>
            {about.primaryCtaLabel}
          </CmsLink>
          <CmsLink className="btn btn-outline" href={about.secondaryCtaUrl}>
            {about.secondaryCtaLabel}
          </CmsLink>
        </div>
      </section>
    </main>
  )
}
