import Link from 'next/link'
import type {ReactNode} from 'react'

import {normalizeHref, shouldOpenInNewTab} from '@/lib/cms/format'

type CmsLinkProps = {
  href: string
  className?: string
  children: ReactNode
}

export function CmsLink({href, className, children}: CmsLinkProps) {
  const normalized = normalizeHref(href)

  if (normalized.startsWith('/')) {
    return (
      <Link className={className} href={normalized}>
        {children}
      </Link>
    )
  }

  const openInNewTab = shouldOpenInNewTab(normalized)

  return (
    <a
      className={className}
      href={normalized}
      target={openInNewTab ? '_blank' : undefined}
      rel={openInNewTab ? 'noreferrer' : undefined}
    >
      {children}
    </a>
  )
}
