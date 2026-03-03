/**
 * Shared PortableText custom block-type renderers.
 *
 * videoEmbed  – responsive YouTube / Vimeo embed
 * ctaButton   – inline call-to-action button
 * pullQuote   – attributed testimonial / quote
 * infoBox     – tone-based callout (info | tip | warning | note)
 *
 * Import `sharedBlockTypes` and spread into any PortableTextComponents.types object.
 */

import type {PortableTextTypeComponentProps} from '@portabletext/react'

/* ---------- value shapes (match Sanity schemas) ---------- */

type VideoEmbedValue = {url?: string; caption?: string}
type CtaButtonValue = {label?: string; url?: string; style?: 'primary' | 'outline' | 'accent'}
type PullQuoteValue = {quote?: string; attribution?: string}
type InfoBoxValue = {tone?: 'info' | 'tip' | 'warning' | 'note'; heading?: string; body?: string}

/* ---------- helpers ---------- */

/** Extract a YouTube or Vimeo embed-friendly URL. Returns null for unsupported URLs. */
function toEmbedUrl(raw: string): string | null {
  try {
    const url = new URL(raw)

    // YouTube: standard + short links
    if (url.hostname.includes('youtube.com') || url.hostname === 'www.youtube.com') {
      const id = url.searchParams.get('v')
      if (id) return `https://www.youtube-nocookie.com/embed/${id}`
    }
    if (url.hostname === 'youtu.be') {
      const id = url.pathname.slice(1)
      if (id) return `https://www.youtube-nocookie.com/embed/${id}`
    }

    // Vimeo
    if (url.hostname.includes('vimeo.com')) {
      const match = url.pathname.match(/\/(\d+)/)
      if (match) return `https://player.vimeo.com/video/${match[1]}`
    }

    return null
  } catch {
    return null
  }
}

/* ---------- renderers ---------- */

function VideoEmbed({value}: PortableTextTypeComponentProps<VideoEmbedValue>) {
  const rawUrl = value?.url
  if (!rawUrl) return null

  const embedUrl = toEmbedUrl(rawUrl)

  return (
    <figure className="video-embed">
      {embedUrl ? (
        <div className="video-embed-wrapper">
          <iframe
            src={embedUrl}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
            title={value.caption || 'Embedded video'}
          />
        </div>
      ) : (
        <a href={rawUrl} target="_blank" rel="noopener noreferrer" className="video-embed-link">
          ▶ Watch video
        </a>
      )}
      {value.caption ? <figcaption className="video-embed-caption">{value.caption}</figcaption> : null}
    </figure>
  )
}

function CtaButton({value}: PortableTextTypeComponentProps<CtaButtonValue>) {
  const label = value?.label?.trim()
  const href = value?.url?.trim()
  if (!label || !href) return null

  const styleClass = value.style === 'outline' ? 'cta-btn-outline'
    : value.style === 'accent' ? 'cta-btn-accent'
    : 'cta-btn-primary'

  return (
    <div className="cta-button-block">
      <a href={href} className={`cta-btn ${styleClass}`}>
        {label}
      </a>
    </div>
  )
}

function PullQuote({value}: PortableTextTypeComponentProps<PullQuoteValue>) {
  const quote = value?.quote?.trim()
  if (!quote) return null

  return (
    <blockquote className="pull-quote">
      <p className="pull-quote-text">&ldquo;{quote}&rdquo;</p>
      {value.attribution ? (
        <footer className="pull-quote-attribution">&mdash; {value.attribution}</footer>
      ) : null}
    </blockquote>
  )
}

function InfoBox({value}: PortableTextTypeComponentProps<InfoBoxValue>) {
  const body = value?.body?.trim()
  if (!body) return null

  const tone = value.tone ?? 'info'

  return (
    <aside className={`info-box info-box-${tone}`}>
      {value.heading ? <strong className="info-box-heading">{value.heading}</strong> : null}
      <p className="info-box-body">{body}</p>
    </aside>
  )
}

/* ---------- export map ---------- */

/**
 * Spread into any PortableTextComponents `types` object:
 * ```
 * types: { ...sharedBlockTypes, myOtherType: ... }
 * ```
 */
export const sharedBlockTypes = {
  videoEmbed: VideoEmbed,
  ctaButton: CtaButton,
  pullQuote: PullQuote,
  infoBox: InfoBox,
} as const
