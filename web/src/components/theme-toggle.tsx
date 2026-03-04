'use client'

import {useEffect, useState} from 'react'
import {FaMoon, FaSun} from 'react-icons/fa'

type Theme = 'dark' | 'light'

const THEME_STORAGE_KEY = 'cfh-theme'
const THEME_COOKIE_KEY = 'cfh-theme'

function applyTheme(theme: Theme) {
  document.documentElement.setAttribute('data-theme', theme)
}

/** Shared hook for reading/toggling the current theme. */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>('dark')

  useEffect(() => {
    const current = document.documentElement.getAttribute('data-theme')
    const resolvedTheme: Theme = current === 'light' || current === 'dark' ? current : 'dark'
    applyTheme(resolvedTheme)
    document.documentElement.style.colorScheme = resolvedTheme
    window.localStorage.setItem(THEME_STORAGE_KEY, resolvedTheme)

    const frameId = window.requestAnimationFrame(() => {
      setTheme(resolvedTheme)
    })

    return () => {
      window.cancelAnimationFrame(frameId)
    }
  }, [])

  const nextTheme: Theme = theme === 'dark' ? 'light' : 'dark'

  const toggleTheme = () => {
    const updatedTheme: Theme = theme === 'dark' ? 'light' : 'dark'
    setTheme(updatedTheme)
    applyTheme(updatedTheme)
    document.documentElement.style.colorScheme = updatedTheme
    window.localStorage.setItem(THEME_STORAGE_KEY, updatedTheme)
    document.cookie = `${THEME_COOKIE_KEY}=${updatedTheme}; path=/; max-age=31536000; samesite=lax`
  }

  return {theme, nextTheme, toggleTheme}
}

/** Compact icon-only toggle (kept for potential reuse). */
export function ThemeToggle() {
  const {theme, nextTheme, toggleTheme} = useTheme()

  return (
    <button
      type="button"
      className="icon-btn icon-btn-sm"
      onClick={toggleTheme}
      aria-label={`Switch to ${nextTheme} mode`}
      title={`Switch to ${nextTheme} mode`}
    >
      {theme === 'dark' ? <FaSun aria-hidden /> : <FaMoon aria-hidden />}
    </button>
  )
}

/** Menu-item variant: icon + text label matching nav-link-mobile style. */
export function ThemeToggleMenuItem({onActivate}: {onActivate?: () => void}) {
  const {theme, nextTheme, toggleTheme} = useTheme()
  const label = theme === 'dark' ? 'Dark Mode' : 'Light Mode'

  return (
    <button
      type="button"
      className="nav-link nav-link-mobile w-full justify-start rounded-xl"
      onClick={() => {
        toggleTheme()
        onActivate?.()
      }}
      aria-label={`Switch to ${nextTheme} mode`}
    >
      {theme === 'dark' ? (
        <FaSun aria-hidden className="mr-2 inline-block" />
      ) : (
        <FaMoon aria-hidden className="mr-2 inline-block" />
      )}
      {label}
    </button>
  )
}
