'use client'

import {useEffect, useMemo, useState} from 'react'
import Link from 'next/link'
import {usePathname} from 'next/navigation'

type Crumb = {
  href: string
  label: string
}

const segmentLabels: Record<string, string> = {
  news: 'News',
  events: 'Events',
  faq: 'FAQ',
  media: 'Media',
  press: 'Press',
  support: 'Support',
}

function formatSegment(segment: string) {
  if (segmentLabels[segment]) {
    return segmentLabels[segment]
  }

  return segment
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function buildCrumbs(pathname: string): Crumb[] {
  const segments = pathname.split('/').filter(Boolean)
  const crumbs: Crumb[] = [{href: '/', label: 'Home'}]

  if (segments.length === 0) {
    return crumbs
  }

  let currentPath = ''

  for (const segment of segments) {
    currentPath += `/${segment}`
    crumbs.push({
      href: currentPath,
      label: formatSegment(segment),
    })
  }

  return crumbs
}

function getNewsSlug(pathname: string) {
  const segments = pathname.split('/').filter(Boolean)
  if (segments.length === 2 && segments[0] === 'news') {
    return segments[1]
  }

  return null
}

function resolveSanityApiUrl(query: string, slug: string) {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? 'scos8zjw'
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'citizens-for-hochgesang'
  const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? '2025-02-19'

  const url = new URL(`https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}`)
  url.searchParams.set('query', query)
  url.searchParams.set('$slug', JSON.stringify(slug))
  url.searchParams.set('perspective', 'published')

  return url.toString()
}

export function Breadcrumbs() {
  const pathname = usePathname() ?? '/'
  const [articleTitles, setArticleTitles] = useState<Record<string, string>>({})
  const crumbs = useMemo(() => buildCrumbs(pathname), [pathname])
  const slug = useMemo(() => getNewsSlug(pathname), [pathname])
  const articleTitle = slug ? articleTitles[slug] : null

  useEffect(() => {
    if (!slug) {
      return
    }

    if (articleTitles[slug]) {
      return
    }

    let cancelled = false
    const controller = new AbortController()

    const query = '*[_type=="post" && slug.current==$slug][0]{title}'
    fetch(resolveSanityApiUrl(query, slug), {signal: controller.signal})
      .then((response) => (response.ok ? response.json() : null))
      .then((payload: {result?: {title?: string}} | null) => {
        if (cancelled) {
          return
        }

        const title = payload?.result?.title
        if (typeof title === 'string' && title.trim().length > 0) {
          setArticleTitles((previous) => ({
            ...previous,
            [slug]: title,
          }))
        }
      })
      .catch(() => undefined)

    return () => {
      cancelled = true
      controller.abort()
    }
  }, [slug, articleTitles])

  if (crumbs.length <= 1) {
    return <div aria-hidden className="breadcrumbs-shell breadcrumbs-shell-empty" />
  }

  return (
    <nav aria-label="Breadcrumb" className="breadcrumbs-shell">
      <ol className="breadcrumbs-list breadcrumbs-list-active">
        {crumbs.map((crumb, index) => {
          const isCurrent = index === crumbs.length - 1
          const label = isCurrent && articleTitle ? articleTitle : crumb.label

          return (
            <li key={crumb.href} className="breadcrumbs-item">
              {isCurrent ? (
                <span aria-current="page" className="breadcrumbs-current breadcrumbs-label" title={label}>
                  {label}
                </span>
              ) : (
                <Link href={crumb.href} className="breadcrumbs-link breadcrumbs-label" title={label}>
                  {label}
                </Link>
              )}
              {!isCurrent ? <span className="breadcrumbs-sep">/</span> : null}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
