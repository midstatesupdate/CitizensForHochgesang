import type {Metadata} from 'next'
import {FaqAccordion} from '@/components/faq-accordion'
import {getPageShellClasses, getPageShellDataAttributes} from '@/lib/cms/page-visuals'
import {assertPageEnabled, getPageVisualSettings} from '@/lib/cms/repository'

export const metadata: Metadata = {
  title: 'FAQ',
  description: 'Frequently asked questions about campaign website resources and participation.',
}

const faqItems = [
  {
    question: 'How can I volunteer?',
    answer:
      'Visit the Support page and use the volunteer sign-up link to join campaign outreach and event support.',
    category: 'Support' as const,
  },
  {
    question: 'Where can I find upcoming events?',
    answer: 'The Events page lists upcoming public events, locations, and RSVP links.',
    category: 'Events' as const,
  },
  {
    question: 'Where can press access campaign resources?',
    answer: 'The Press page includes media contact details, logo assets, and recent public updates.',
    category: 'Press' as const,
  },
  {
    question: 'How can I verify information posted on the website?',
    answer:
      'The campaign maintains source-oriented documentation in repository markdown files and updates content through Sanity Studio.',
    category: 'Trust' as const,
  },
  {
    question: 'How do I verify or update my voter registration?',
    answer:
      'Use the Indiana voter portal linked from the Support page to check registration status, find polling locations, and confirm district information.',
    category: 'Support' as const,
  },
  {
    question: 'How can I find district boundary information?',
    answer:
      'Visit the Support page for an embedded district map and official district lookup tools from Indiana resources.',
    category: 'Events' as const,
  },
]

export default async function FaqPage() {
  await assertPageEnabled('faq')
  const pageVisualSettings = await getPageVisualSettings('faq')

  return (
    <main className={getPageShellClasses(pageVisualSettings)} {...getPageShellDataAttributes(pageVisualSettings)}>
      <section className="reveal flex flex-col gap-4">
        <p className="eyebrow">FAQ</p>
        <h1 className="section-title">Frequently asked questions</h1>
        <p className="max-w-3xl text-sm text-[color:var(--color-muted)]">
          Quick answers for volunteers, supporters, constituents, and press.
        </p>
      </section>

      <FaqAccordion items={faqItems} />
    </main>
  )
}
