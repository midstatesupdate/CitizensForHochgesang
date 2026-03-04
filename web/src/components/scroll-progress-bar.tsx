'use client'

import {useEffect, useRef} from 'react'

/**
 * Thin accent-colored bar fixed at the top of the viewport.
 * Fills left→right as the user scrolls down the page.
 * Uses a single scroll listener with rAF throttle for buttery performance.
 * Width is driven by a CSS custom property so the bar itself is pure CSS.
 */
export function ScrollProgressBar() {
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const bar = barRef.current
    if (!bar) return

    let ticking = false

    function update() {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const pct = docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0
      bar!.style.transform = `scaleX(${pct})`
      ticking = false
    }

    function onScroll() {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(update)
      }
    }

    window.addEventListener('scroll', onScroll, {passive: true})
    // Set initial position
    update()

    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      ref={barRef}
      aria-hidden="true"
      className="scroll-progress-bar"
      style={{transform: 'scaleX(0)'}}
    />
  )
}
