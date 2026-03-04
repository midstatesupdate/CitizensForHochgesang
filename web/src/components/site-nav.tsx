'use client'

import {useState, useEffect, useRef} from 'react'
import {usePathname} from 'next/navigation'
import {FaBars, FaNewspaper, FaTimes} from 'react-icons/fa'

import {CmsLink} from '@/components/cms-link'
import {ThemeToggleMenuItem} from '@/components/theme-toggle'
import {resolveCmsIcon} from '@/lib/cms/icon-map'
import type {IconName, PageVisibility} from '@/lib/cms/types'
import {filterNavByVisibility} from '@/components/site-nav-visibility'

type NavItem = {
  href: string
  label: string
  icon?: IconName
}

const defaultNavItems: NavItem[] = [
  {href: '/news', label: 'News', icon: 'newspaper'},
  {href: '/events', label: 'Events', icon: 'calendar'},
  {href: '/platform', label: 'About & Priorities', icon: 'user-friends'},
  {href: '/faq', label: 'FAQ', icon: 'question-circle'},
  {href: '/media', label: 'Media & Press', icon: 'video'},
  {href: '/support', label: 'Support', icon: 'hands-helping'},
]

type SiteNavProps = {
  items?: NavItem[]
  pageVisibility?: PageVisibility
}

function isActivePath(pathname: string, href: string) {
  if (pathname === href) {
    return true
  }

  return pathname.startsWith(`${href}/`)
}

function normalizeNavItems(items: NavItem[]): NavItem[] {
  const normalized: NavItem[] = []

  for (const item of items) {
    if (item.href === '/press' || item.href === '/media') {
      if (normalized.some((entry) => entry.href === '/media')) {
        continue
      }

      normalized.push({
        href: '/media',
        label: 'Media & Press',
        icon: item.icon === 'reg-newspaper' ? 'video' : item.icon,
      })
      continue
    }

    normalized.push(item)
  }

  if (!normalized.some((entry) => entry.href === '/platform')) {
    const eventsIndex = normalized.findIndex((entry) => entry.href === '/events')
    const platformItem: NavItem = {href: '/platform', label: 'About & Priorities', icon: 'user-friends'}

    if (eventsIndex >= 0) {
      normalized.splice(eventsIndex + 1, 0, platformItem)
    } else {
      normalized.unshift(platformItem)
    }
  }

  return normalized
}

export function SiteNav({items, pageVisibility}: SiteNavProps) {
  const pathname = usePathname() ?? '/'
  const [mobileOpen, setMobileOpen] = useState(false)
  const navRef = useRef<HTMLElement>(null)
  const navItems = filterNavByVisibility(
    normalizeNavItems(items && items.length > 0 ? items : defaultNavItems),
    pageVisibility,
  )

  // Close menu when clicking outside the nav
  useEffect(() => {
    if (!mobileOpen) return

    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setMobileOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('touchstart', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [mobileOpen])

  const hasItems = navItems.length > 0

  return (
    <nav ref={navRef} aria-label="Primary" className="site-nav z-[90] text-sm font-semibold">
      <div className="flex items-center gap-2">
        {hasItems && (
          <button
            type="button"
            className="icon-btn icon-btn-sm"
            aria-expanded={mobileOpen}
            aria-controls="mobile-primary-nav"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            title={mobileOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMobileOpen((previous) => !previous)}
          >
            {mobileOpen ? <FaTimes aria-hidden /> : <FaBars aria-hidden />}
          </button>
        )}
      </div>

      {mobileOpen ? (
        <div id="mobile-primary-nav" className="site-nav-mobile-panel">
          {navItems.map((item) => {
            const active = isActivePath(pathname, item.href)
            const Icon = resolveCmsIcon(item.icon, FaNewspaper)

            return (
              <CmsLink
                key={item.href}
                href={item.href}
                className={`nav-link nav-link-mobile ${active ? 'nav-link-active' : ''}`}
                aria-current={active ? 'page' : undefined}
                onClick={() => setMobileOpen(false)}
              >
                <Icon aria-hidden className="mr-2 inline-block" />
                {item.label}
              </CmsLink>
            )
          })}

          {/* Divider + theme toggle at the bottom of the menu */}
          <hr className="my-1 border-[color:var(--color-border)]" />
          <ThemeToggleMenuItem />
        </div>
      ) : null}
    </nav>
  )
}
