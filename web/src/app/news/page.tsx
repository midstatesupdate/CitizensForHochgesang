import Link from 'next/link'
import Image from 'next/image'

import {formatDate} from '@/lib/cms/format'
import {getPageShellClasses, getPageShellDataAttributes} from '@/lib/cms/page-visuals'
import {getAllPosts, getPageVisualSettings} from '@/lib/cms/repository'

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
        {posts.map((post) => (
          <article key={post.slug} className="card article-card">
            <div className="flex flex-col gap-3">
              {post.coverImageUrl ? (
                <div className="card-media">
                  <Image
                    src={post.coverImageUrl}
                    alt={`${post.title} cover image`}
                    width={1200}
                    height={630}
                    className="h-56 w-full object-cover"
                    unoptimized
                  />
                </div>
              ) : null}
              <p className="article-meta text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--color-muted)]">
                {formatDate(post.publishedAt)}
              </p>
              <h2 className="article-title text-2xl font-semibold text-[color:var(--color-ink)]">{post.title}</h2>
              {post.excerpt ? (
                <p className="text-sm text-[color:var(--color-muted)]">{post.excerpt}</p>
              ) : null}
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
          </article>
        ))}
      </section>
    </main>
  )
}
