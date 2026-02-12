import {CmsLink} from '@/components/cms-link'
import {formatDate} from '@/lib/cms/format'
import {getPageShellClasses, getPageShellDataAttributes} from '@/lib/cms/page-visuals'
import {getMediaLinks, getPageVisualSettings} from '@/lib/cms/repository'
import Image from 'next/image'

export const metadata = {
  title: 'Media | Brad Hochgesang for State Senate',
  description: 'YouTube, Facebook, and other media coverage for the campaign.',
}

function getTypeLabel(mediaType: string): string {
  if (mediaType === 'youtube') return 'YouTube'
  if (mediaType === 'facebook') return 'Facebook'
  if (mediaType === 'audio') return 'Audio'
  return 'Media'
}

export default async function MediaPage() {
  const [mediaLinks, pageVisualSettings] = await Promise.all([getMediaLinks(), getPageVisualSettings('media')])

  return (
    <main className={getPageShellClasses(pageVisualSettings)} {...getPageShellDataAttributes(pageVisualSettings)}>
      <section className="flex flex-col gap-4">
        <p className="eyebrow">Media</p>
        <h1 className="section-title">Interviews, videos, and social updates</h1>
        <p className="max-w-3xl text-sm text-[color:var(--color-muted)]">
          Watch and share campaign coverage across platforms.
        </p>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        {mediaLinks.map((item) => (
          <article key={item.id} className="card article-card flex flex-col gap-4">
            {item.thumbnailUrl ? (
              <div className="card-media">
                <Image
                  src={item.thumbnailUrl}
                  alt={`${item.title} thumbnail`}
                  width={1200}
                  height={630}
                  className="h-52 w-full object-cover"
                  unoptimized
                />
              </div>
            ) : null}
            <p className="article-meta text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--color-muted)]">
              {getTypeLabel(item.mediaType)}
            </p>
            <h2 className="article-title text-xl font-semibold text-[color:var(--color-ink)]">{item.title}</h2>
            {item.publishedAt ? (
              <p className="text-sm text-[color:var(--color-muted)]">Published {formatDate(item.publishedAt)}</p>
            ) : null}
            <div>
              <CmsLink
                className="article-cta link-pill link-pill-media"
                href={item.url}
              >
                Open media
              </CmsLink>
            </div>
          </article>
        ))}
      </section>
    </main>
  )
}
