'use client'

import {useEffect} from 'react'

/**
 * Adds a "magnetic" pull effect to CTA buttons on desktop.
 * When the cursor is within ~60px of a `.btn` or `.sticky-action-btn`,
 * the button translates a few pixels toward the pointer.
 * On mouse leave it springs back smoothly.
 *
 * The component auto-discovers buttons by selector and adds the
 * `.magnetic-target` class for CSS transition support.
 *
 * Touch devices are ignored (no `mousemove` fires on tap).
 * Respects prefers-reduced-motion.
 */
export function MagneticButtons() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    // Only enable on devices with fine pointer (desktop)
    const hasFinePointer = window.matchMedia('(pointer: fine)').matches
    if (!hasFinePointer) return

    const PULL_RADIUS = 60 // px — activation distance from button edge
    const MAX_SHIFT = 6 // px — max translation toward cursor
    const SELECTOR = '.btn, .sticky-action-btn'

    // Tag discovered buttons so the CSS transition rule applies
    function tagButtons() {
      document.querySelectorAll<HTMLElement>(SELECTOR).forEach((el) => {
        el.classList.add('magnetic-target')
      })
    }

    tagButtons()

    // Re-tag after DOM mutations (e.g. client-side navigations)
    const observer = new MutationObserver(tagButtons)
    observer.observe(document.body, {childList: true, subtree: true})

    function handleMouseMove(e: MouseEvent) {
      const targets = document.querySelectorAll<HTMLElement>('.magnetic-target')
      targets.forEach((btn) => {
        const rect = btn.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        const distX = e.clientX - centerX
        const distY = e.clientY - centerY
        const dist = Math.sqrt(distX * distX + distY * distY)
        const activationDist = Math.max(rect.width, rect.height) / 2 + PULL_RADIUS

        if (dist < activationDist) {
          const strength = 1 - dist / activationDist
          const tx = distX * strength * (MAX_SHIFT / activationDist) * 2
          const ty = distY * strength * (MAX_SHIFT / activationDist) * 2
          // Use custom properties so CSS hover transforms compose instead of fighting
          btn.style.setProperty('--magnetic-tx', `${tx.toFixed(1)}px`)
          btn.style.setProperty('--magnetic-ty', `${ty.toFixed(1)}px`)
        } else {
          btn.style.removeProperty('--magnetic-tx')
          btn.style.removeProperty('--magnetic-ty')
        }
      })
    }

    function handleMouseLeave() {
      const targets = document.querySelectorAll<HTMLElement>('.magnetic-target')
      targets.forEach((btn) => {
        btn.style.removeProperty('--magnetic-tx')
        btn.style.removeProperty('--magnetic-ty')
      })
    }

    document.addEventListener('mousemove', handleMouseMove, {passive: true})
    document.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
      observer.disconnect()
      // Clean up inline transforms and added classes
      const targets = document.querySelectorAll<HTMLElement>('.magnetic-target')
      targets.forEach((btn) => {
        btn.style.removeProperty('--magnetic-tx')
        btn.style.removeProperty('--magnetic-ty')
        btn.classList.remove('magnetic-target')
      })
    }
  }, [])

  return null
}
