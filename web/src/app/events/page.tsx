import {CmsLink} from '@/components/cms-link'
import {formatDateTime} from '@/lib/cms/format'
import {getPageShellClasses, getPageShellDataAttributes} from '@/lib/cms/page-visuals'
import {getPageVisualSettings, getUpcomingEvents} from '@/lib/cms/repository'
import Image from 'next/image'

export const metadata = {
  title: 'Events | Brad Hochgesang for State Senate',
  description: 'Upcoming campaign events, town halls, and community meetups.',
}

export default async function EventsPage() {
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

      <section className="grid gap-6">
        {events.map((event) => (
          <article key={event.id} className="card article-card">
            <div className="flex flex-col gap-3">
              {event.scheduleImageUrl ? (
                <div className="card-media">
                  <Image
                    src={event.scheduleImageUrl}
                    alt={`${event.title} event image`}
                    width={1200}
                    height={630}
                    className="h-52 w-full object-cover"
                    unoptimized
                  />
                </div>
              ) : null}
              <p className="article-meta text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--color-muted)]">
                {formatDateTime(event.startDate)}
              </p>
              <h2 className="article-title text-2xl font-semibold text-[color:var(--color-ink)]">{event.title}</h2>
              <p className="text-sm font-semibold text-[color:var(--color-ink)]">{event.location}</p>
              {event.description ? (
                <p className="text-sm text-[color:var(--color-muted)]">{event.description}</p>
              ) : null}
              {event.rsvpLink ? (
                <div>
                  <CmsLink
                    className="article-cta link-pill link-pill-events"
                    href={event.rsvpLink}
                  >
                    RSVP
                  </CmsLink>
                </div>
              ) : null}
            </div>
          </article>
        ))}
      </section>
    </main>
  )
}
