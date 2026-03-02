import {notFound} from 'next/navigation'

import {EventsFeed} from '@/components/events-feed'
import {getPageShellClasses, getPageShellDataAttributes} from '@/lib/cms/page-visuals'
import {getPageVisualSettings, getSiteSettings, getUpcomingEvents, isPageEnabled} from '@/lib/cms/repository'

export const metadata = {
  title: 'Events | Brad Hochgesang for State Senate',
  description: 'Upcoming campaign events, town halls, and community meetups.',
}

export default async function EventsPage() {
  const settings = await getSiteSettings()
  if (!isPageEnabled(settings, 'events')) {
    notFound()
  }

  const [events, pageVisualSettings] = await Promise.all([getUpcomingEvents(), getPageVisualSettings('events')])

  return (
    <main className={getPageShellClasses(pageVisualSettings)} {...getPageShellDataAttributes(pageVisualSettings)}>
      <section className="flex flex-col gap-4">
        <p className="eyebrow">Events</p>
        <h1 className="section-title">Upcoming campaign events</h1>
        <p className="max-w-3xl text-sm text-[color:var(--color-muted)]">
          Join us at upcoming town halls, listening sessions, and community visits.
        </p>
      </section>

      <EventsFeed events={events} />
    </main>
  )
}
