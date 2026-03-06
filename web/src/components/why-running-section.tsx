import Image from 'next/image'
import {PortableText, type PortableTextComponents} from '@portabletext/react'

import {CmsLink} from '@/components/cms-link'
import {mapEmbedBlockType} from '@/components/map-embed-block-type'
import {sharedBlockTypes} from '@/components/portable-block-types'
import type {PostBodyNode} from '@/lib/cms/types'

type WhyRunningSectionProps = {
  heading?: string
  body?: PostBodyNode[]
  imageUrl?: string
}

const whyRunningComponents: PortableTextComponents = {
  block: {
    normal: ({children}) => (
      <p className="text-base leading-8 text-[color:var(--color-ink)]">{children}</p>
    ),
    h3: ({children}) => (
      <h3 className="mt-4 text-xl font-semibold text-[color:var(--color-ink)]">{children}</h3>
    ),
    blockquote: ({children}) => (
      <blockquote className="border-l-4 border-[color:var(--color-accent)] pl-4 italic text-[color:var(--color-muted)]">
        {children}
      </blockquote>
    ),
  },
  marks: {
    link: ({children, value}) => {
      const href = typeof value?.href === 'string' ? value.href : '#'
      return (
        <CmsLink className="link-soft" href={href}>
          {children}
        </CmsLink>
      )
    },
  },
  types: {
    ...sharedBlockTypes,
    ...mapEmbedBlockType,
    htmlEmbed: ({value}: {value: {html?: string}}) => {
      if (!value?.html) return null
      return <div className="portable-html-embed" dangerouslySetInnerHTML={{__html: value.html}} />
    },
  },
}

/** Returns true when the section has content worth rendering. */
export function hasWhyRunningContent(body?: PostBodyNode[], heading?: string): boolean {
  return (body != null && body.length > 0) || (heading != null && heading.trim().length > 0)
}

/** Personal narrative section displayed between hero and priority cards. */
export function WhyRunningSection({heading, body, imageUrl}: WhyRunningSectionProps) {
  if (!hasWhyRunningContent(body, heading)) {
    return null
  }

  const resolvedHeading = heading?.trim() || "Why I'm Running"

  return (
    <section className="why-running-section">
      <div className="why-running-inner">
        <div className="why-running-text">
          <h2 className="section-title">{resolvedHeading}</h2>
          {body && body.length > 0 ? (
            <div className="why-running-prose">
              <PortableText value={body as never} components={whyRunningComponents} />
            </div>
          ) : null}
        </div>
        {imageUrl ? (
          <div className="why-running-media">
            <Image
              src={imageUrl}
              alt={resolvedHeading}
              width={600}
              height={400}
              className="rounded-2xl object-cover"
              unoptimized
            />
          </div>
        ) : null}
      </div>
    </section>
  )
}
