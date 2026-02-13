import Link from 'next/link'
import type {AnchorHTMLAttributes, ReactNode} from 'react'

import {normalizeHref, shouldOpenInNewTab} from '@/lib/cms/format'

type CmsLinkProps = {
  href: string
  children: ReactNode
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'children'>

export function CmsLink({href, className, children, ...rest}: CmsLinkProps) {
  const normalized = normalizeHref(href)

  if (normalized.startsWith('/')) {
    return (
      <Link className={className} href={normalized} {...rest}>
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
      {...rest}
    >
      {children}
    </a>
  )
}
