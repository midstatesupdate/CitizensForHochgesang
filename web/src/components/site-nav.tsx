'use client'

import {useState} from 'react'
import Link from 'next/link'
import {usePathname} from 'next/navigation'
import {FaBars, FaCalendarAlt, FaHandsHelping, FaNewspaper, FaQuestionCircle, FaRegNewspaper, FaTimes, FaVideo} from 'react-icons/fa'
import type {IconType} from 'react-icons'

import {ThemeToggle} from '@/components/theme-toggle'

type NavItem = {
  href: string
  label: string
  icon: IconType
}

const navItems: NavItem[] = [
  {href: '/news', label: 'News', icon: FaNewspaper},
  {href: '/events', label: 'Events', icon: FaCalendarAlt},
  {href: '/faq', label: 'FAQ', icon: FaQuestionCircle},
  {href: '/media', label: 'Media', icon: FaVideo},
  {href: '/press', label: 'Press', icon: FaRegNewspaper},
  {href: '/support', label: 'Support', icon: FaHandsHelping},
]

function isActivePath(pathname: string, href: string) {
  if (pathname === href) {
    return true
  }

  return pathname.startsWith(`${href}/`)
}

export function SiteNav() {
  const pathname = usePathname() ?? '/'
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav aria-label="Primary" className="site-nav z-[90] text-sm font-semibold">
      <div className="hidden items-center gap-3 lg:flex">
        {navItems.map((item) => {
          const active = isActivePath(pathname, item.href)
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-link ${active ? 'nav-link-active' : ''}`}
              aria-current={active ? 'page' : undefined}
            >
              <Icon aria-hidden className="mr-1 inline-block" />
              {item.label}
            </Link>
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
            const Icon = item.icon

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-link nav-link-mobile ${active ? 'nav-link-active' : ''}`}
                aria-current={active ? 'page' : undefined}
                onClick={() => setMobileOpen(false)}
              >
                <Icon aria-hidden className="mr-2 inline-block" />
                {item.label}
              </Link>
            )
          })}
        </div>
      ) : null}
    </nav>
  )
}
