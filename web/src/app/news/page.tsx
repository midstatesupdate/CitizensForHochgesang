import Link from 'next/link'
import Image from 'next/image'

import {formatDate} from '@/lib/cms/format'
import {getSanityImageUrl} from '@/lib/cms/image-url'
import {getPageShellClasses, getPageShellDataAttributes} from '@/lib/cms/page-visuals'
import {getAllPosts, getPageVisualSettings} from '@/lib/cms/repository'

const RATIO_DIMENSIONS: Record<string, {width: number; height: number; className: string}> = {
  '16:9': {width: 1600, height: 900, className: 'aspect-[16/9]'},
  '4:3': {width: 1200, height: 900, className: 'aspect-[4/3]'},
  '3:2': {width: 1500, height: 1000, className: 'aspect-[3/2]'},
  '1:1': {width: 1200, height: 1200, className: 'aspect-square'},
  '4:5': {width: 1200, height: 1500, className: 'aspect-[4/5]'},
  '3:4': {width: 1200, height: 1600, className: 'aspect-[3/4]'},
  '2:3': {width: 1000, height: 1500, className: 'aspect-[2/3]'},
  '9:16': {width: 900, height: 1600, className: 'aspect-[9/16]'},
}

const LAYOUT_CLASSNAMES: Record<string, string> = {
  stacked: 'news-card-layout-stacked',
  'image-left': 'news-card-layout-image-left',
  'image-right': 'news-card-layout-image-right',
  'feature-split': 'news-card-layout-feature-split',
  'no-photo': 'news-card-layout-no-photo',
}

const ANIMATION_CLASSNAMES: Record<string, string> = {
  'fade-up': 'news-card-anim-fade-up',
  'slide-up': 'news-card-anim-slide-up',
  'slide-left': 'news-card-anim-slide-left',
  'slide-right': 'news-card-anim-slide-right',
  none: 'news-card-anim-none',
}

function getBodyPreview(post: Awaited<ReturnType<typeof getAllPosts>>[number]): string | null {
  const text = (post.bodyPreview || post.excerpt || '').trim()
  if (!text) {
    return null
  }

  const limit = post.newsBodyPreviewChars && post.newsBodyPreviewChars > 0 ? post.newsBodyPreviewChars : 420
  return text.slice(0, limit)
}

export const metadata = {
  title: 'News | Brad Hochgesang for State Senate',
  description: 'Campaign updates, articles, and announcements from District 48.',
}

export default async function NewsPage() {
  const [posts, pageVisualSettings] = await Promise.all([getAllPosts(), getPageVisualSettings('news')])

  return (
    <main className={getPageShellClasses(pageVisualSettings)} {...getPageShellDataAttributes(pageVisualSettings)}>
      <section className="flex flex-col gap-4">
        <p className="eyebrow">News</p>
        <h1 className="section-title">Campaign updates and articles</h1>
        <p className="max-w-3xl text-sm text-[color:var(--color-muted)]">
          Read updates on policy priorities, local events, and campaign progress.
        </p>
      </section>

      <section className="grid gap-6">
        {posts.map((post) => {
          const ratio = RATIO_DIMENSIONS[post.newsImageAspectRatio ?? '3:2'] ?? RATIO_DIMENSIONS['3:2']
          const layoutClass = LAYOUT_CLASSNAMES[post.newsCardLayout ?? 'stacked'] ?? LAYOUT_CLASSNAMES.stacked
          const animationClass =
            ANIMATION_CLASSNAMES[post.newsCardAnimation ?? 'fade-up'] ?? ANIMATION_CLASSNAMES['fade-up']
          const coverImageUrl =
            getSanityImageUrl(post.coverImage, {width: ratio.width, height: ratio.height}) ?? post.coverImageUrl
          const previewText = getBodyPreview(post)
          const showMedia = post.newsCardLayout !== 'no-photo' && !!coverImageUrl

          return (
            <article key={post.slug} className={`card article-card news-card ${layoutClass} ${animationClass}`}>
              <div className="news-card-content-wrap">
                {showMedia ? (
                  <div className={`card-media news-card-media ${ratio.className}`}>
                    <Image
                      src={coverImageUrl!}
                      alt={`${post.title} cover image`}
                      width={ratio.width}
                      height={ratio.height}
                      className="h-full w-full object-cover"
                      unoptimized
                    />
                  </div>
                ) : null}

                <div className="news-card-copy">
                  <p className="article-meta text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--color-muted)]">
                    {formatDate(post.publishedAt)}
                  </p>
                  <h2 className="article-title text-2xl font-semibold text-[color:var(--color-ink)]">{post.title}</h2>
                  {previewText ? <p className="news-excerpt text-sm text-[color:var(--color-muted)]">{previewText}</p> : null}
                  {post.tags.length > 0 ? (
                    <ul className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <li
                          key={`${post.slug}-${tag}`}
                          className="rounded-full border border-[color:var(--color-border)] px-3 py-1 text-xs text-[color:var(--color-muted)]"
                        >
                          {tag}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                  <div>
                    <Link className="article-cta link-pill link-pill-news" href={`/news/${post.slug}`}>
                      Read article
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          )
        })}
      </section>
    </main>
  )
}
