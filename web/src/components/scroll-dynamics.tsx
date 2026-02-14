'use client'

import {useEffect} from 'react'
import {usePathname} from 'next/navigation'

function getRevealSelector() {
  return [
    'main section',
    'main article.card',
    'main li.article-card',
    'main .card > article',
  ].join(', ')
}

export function ScrollDynamics() {
  const pathname = usePathname()

  useEffect(() => {
    let observer: IntersectionObserver | null = null
    let timeoutId: number | null = null
    let rafId: number | null = null
    let cancelled = false

    const pageShell = document.querySelector('main.page-shell')

    if (!(pageShell instanceof HTMLElement)) {
      return
    }

    const mode = pageShell.dataset.scrollReveal

    if (!mode || mode === 'none') {
      return
    }

    const start = () => {
      if (cancelled) {
        return
      }

      const candidates = Array.from(document.querySelectorAll<HTMLElement>(getRevealSelector()))
        .filter((element) => !element.closest('header') && !element.closest('footer'))

      if (candidates.length === 0) {
        return
      }

      observer = new IntersectionObserver(
        (entries) => {
          if (!observer) {
            return
          }

          for (const entry of entries) {
            if (entry.isIntersecting) {
              entry.target.classList.add('scroll-dynamic-visible')
              observer.unobserve(entry.target)
            }
          }
        },
        {
          threshold: 0.1,
          rootMargin: '0px 0px -4% 0px',
        }
      )

      for (const element of candidates) {
        if (element.dataset.scrollDynamic === 'off') {
          continue
        }

        element.classList.remove('scroll-dynamic-item', 'scroll-dynamic-visible')
        element.classList.add('scroll-dynamic-item')

        const rect = element.getBoundingClientRect()
        const viewportHeight = window.innerHeight || document.documentElement.clientHeight
        const isInitiallyVisible = rect.bottom > 0 && rect.top < viewportHeight

        if (isInitiallyVisible) {
          element.classList.add('scroll-dynamic-visible')
          continue
        }

        observer.observe(element)
      }
    }

    const scheduleStart = () => {
      rafId = window.requestAnimationFrame(() => {
        timeoutId = window.setTimeout(start, 140)
      })
    }

    if (document.readyState === 'complete') {
      scheduleStart()
    } else {
      const onLoad = () => {
        window.removeEventListener('load', onLoad)
        scheduleStart()
      }

      window.addEventListener('load', onLoad)

      return () => {
        cancelled = true
        window.removeEventListener('load', onLoad)
        if (rafId !== null) {
          window.cancelAnimationFrame(rafId)
        }
        if (timeoutId !== null) {
          window.clearTimeout(timeoutId)
        }
        observer?.disconnect()
      }
    }

    return () => {
      cancelled = true
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId)
      }
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId)
      }
      observer?.disconnect()
    }
  }, [pathname])

  return null
}
