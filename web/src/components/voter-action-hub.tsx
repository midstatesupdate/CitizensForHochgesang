'use client'

import {useState} from 'react'
import {FaCheckCircle, FaMapMarkedAlt, FaRegCircle, FaVoteYea, FaUsers} from 'react-icons/fa'

const CHECKLIST_STORAGE_KEY = 'cfh-voter-checklist'

const checklistItems = [
  {
    id: 'confirm-district',
    label: 'Confirm district and polling location',
    href: 'https://indianavoters.in.gov/',
  },
  {
    id: 'check-registration',
    label: 'Check or update voter registration',
    href: 'https://indianavoters.in.gov/',
  },
  {
    id: 'join-volunteer',
    label: 'Sign up for campaign volunteer opportunities',
    href: '/support',
  },
]

export function VoterActionHub() {
  const [completed, setCompleted] = useState<Record<string, boolean>>(() => {
    if (typeof window === 'undefined') {
      return {}
    }

    const saved = window.localStorage.getItem(CHECKLIST_STORAGE_KEY)

    if (!saved) {
      return {}
    }

    try {
      return JSON.parse(saved) as Record<string, boolean>
    } catch {
      return {}
    }
  })

  const toggleItem = (itemId: string) => {
    setCompleted((previous) => {
      const next = {
        ...previous,
        [itemId]: !previous[itemId],
      }

      window.localStorage.setItem(CHECKLIST_STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }

  const completedCount = Object.values(completed).filter(Boolean).length

  return (
    <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <article className="card flex flex-col gap-4">
        <p className="eyebrow">District Map</p>
        <h2 className="section-title">Find your district and polling info</h2>
        <p className="text-sm text-[color:var(--color-muted)]">
          Use this map and Indiana voter tools to verify district boundaries, registration, and polling location.
        </p>
        <div className="map-frame">
          <iframe
            title="Indiana Senate District 48 map search"
            src="https://www.google.com/maps?q=Indiana+Senate+District+48&output=embed"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-full w-full"
          />
        </div>
        <div className="flex flex-wrap gap-3">
          <a className="btn btn-outline" href="https://iga.in.gov/legislative/districts" target="_blank" rel="noreferrer">
            <FaMapMarkedAlt aria-hidden />
            Indiana district map
          </a>
          <a className="btn btn-primary" href="https://indianavoters.in.gov/" target="_blank" rel="noreferrer">
            <FaVoteYea aria-hidden />
            Indiana voter portal
          </a>
        </div>
      </article>

      <article className="card flex flex-col gap-4">
        <p className="eyebrow">Get Involved</p>
        <h2 className="section-title">Personal voter action checklist</h2>
        <p className="text-sm text-[color:var(--color-muted)]">
          Save your progress in this browser and complete steps to stay engaged.
        </p>
        <p className="pill-badge w-fit pill-badge-active">
          <FaUsers aria-hidden />
          <span>
            {completedCount} of {checklistItems.length} complete
          </span>
        </p>
        <ul className="grid gap-2">
          {checklistItems.map((item) => {
            const isComplete = Boolean(completed[item.id])

            return (
              <li key={item.id} className="rounded-2xl border border-[color:var(--color-border)] p-3">
                <div className="flex items-start justify-between gap-4">
                  <a
                    href={item.href}
                    className="text-sm font-semibold text-[color:var(--color-ink)] hover:text-[color:var(--color-accent)]"
                    target={item.href.startsWith('http') ? '_blank' : undefined}
                    rel={item.href.startsWith('http') ? 'noreferrer' : undefined}
                  >
                    {item.label}
                  </a>
                  <button
                    type="button"
                    onClick={() => toggleItem(item.id)}
                    className="icon-btn icon-btn-sm"
                    aria-label={isComplete ? 'Mark as incomplete' : 'Mark as complete'}
                    title={isComplete ? 'Mark as incomplete' : 'Mark as complete'}
                  >
                    {isComplete ? <FaCheckCircle aria-hidden /> : <FaRegCircle aria-hidden />}
                  </button>
                </div>
              </li>
            )
          })}
        </ul>
      </article>
    </section>
  )
}
