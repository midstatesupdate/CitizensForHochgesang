'use client'

import {useEffect} from 'react'

export function ArticleSceneObserver() {
  useEffect(() => {
    const scenes = Array.from(document.querySelectorAll<HTMLElement>('[data-story-scene="true"]'))

    if (scenes.length === 0) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) {
            continue
          }

          entry.target.classList.add('scene-visible')
          observer.unobserve(entry.target)
        }
      },
      {
        threshold: 0.24,
        rootMargin: '0px 0px -12% 0px',
      }
    )

    for (const scene of scenes) {
      observer.observe(scene)
    }

    return () => {
      observer.disconnect()
    }
  }, [])

  return null
}
