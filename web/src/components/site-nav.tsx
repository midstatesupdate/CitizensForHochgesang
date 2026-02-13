'use client'

import {useState} from 'react'
import {usePathname} from 'next/navigation'
import {FaBars, FaNewspaper, FaTimes} from 'react-icons/fa'

import {CmsLink} from '@/components/cms-link'
import {ThemeToggle} from '@/components/theme-toggle'
import {resolveCmsIcon} from '@/lib/cms/icon-map'
import type {IconName} from '@/lib/cms/types'

type NavItem = {
  href: string
  label: string
  icon?: IconName
}

const defaultNavItems: NavItem[] = [
  {href: '/news', label: 'News', icon: 'newspaper'},
  {href: '/events', label: 'Events', icon: 'calendar'},
  {href: '/faq', label: 'FAQ', icon: 'question-circle'},
  {href: '/media', label: 'Media', icon: 'video'},
  {href: '/press', label: 'Press', icon: 'reg-newspaper'},
  {href: '/support', label: 'Support', icon: 'hands-helping'},
]

type SiteNavProps = {
  items?: NavItem[]
}

function isActivePath(pathname: string, href: string) {
  if (pathname === href) {
    return true
  }

  return pathname.startsWith(`${href}/`)
}

export function SiteNav({items}: SiteNavProps) {
  const pathname = usePathname() ?? '/'
  const [mobileOpen, setMobileOpen] = useState(false)
  const navItems = items && items.length > 0 ? items : defaultNavItems

  return (
    <nav aria-label="Primary" className="site-nav z-[90] text-sm font-semibold">
      <div className="hidden items-center gap-3 lg:flex">
        {navItems.map((item) => {
          const active = isActivePath(pathname, item.href)
          const Icon = resolveCmsIcon(item.icon, FaNewspaper)

          return (
            <CmsLink
              key={item.href}
              href={item.href}
              className={`nav-link ${active ? 'nav-link-active' : ''}`}
              aria-current={active ? 'page' : undefined}
            >
              <Icon aria-hidden className="mr-1 inline-block" />
              {item.label}
            </CmsLink>
          )
        })}
        <ThemeToggle />
      </div>

      <div className="flex items-center gap-2 lg:hidden">
        <ThemeToggle />
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
      </div>

      {mobileOpen ? (
        <div id="mobile-primary-nav" className="site-nav-mobile-panel lg:hidden">
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
        </div>
      ) : null}
    </nav>
  )
}
