/**
 * seed-homepage-blueprint.ts
 *
 * Populates Sanity siteSettings with all homepage content from
 * HOMEPAGE_BLUEPRINT.md (Sections 5 & 6). Overwrites existing values
 * so the document matches the blueprint exactly.
 *
 * Usage:
 *   cd studio
 *   npx sanity exec scripts/seed-homepage-blueprint.ts --with-user-token
 *
 * To target a specific dataset:
 *   SANITY_STUDIO_DATASET=development npx sanity exec scripts/seed-homepage-blueprint.ts --with-user-token
 */

import {getCliClient} from 'sanity/cli'

const DATASET = process.env.SANITY_STUDIO_DATASET ?? 'production'
const PROJECT_ID = process.env.SANITY_STUDIO_PROJECT_ID ?? 'n2oyijjv'
const API_VERSION = '2025-02-19'
const SITE_SETTINGS_ID = 'siteSettings'

const client = getCliClient({apiVersion: API_VERSION}).withConfig({
  projectId: PROJECT_ID,
  dataset: DATASET,
  useCdn: false,
})

// ---------------------------------------------------------------------------
// Portable-text helper — converts plain paragraphs to Sanity block array
// ---------------------------------------------------------------------------
function portableText(paragraphs: string[]) {
  return paragraphs.map((text, index) => ({
    _key: `block-${index + 1}`,
    _type: 'block',
    style: 'normal',
    children: [
      {
        _key: `span-${index + 1}`,
        _type: 'span',
        text,
        marks: [],
      },
    ],
    markDefs: [],
  }))
}

// ---------------------------------------------------------------------------
// Section 5.3 — Hero Actions
// ---------------------------------------------------------------------------
const HERO_ACTIONS = [
  {
    _key: 'hero-action-donate',
    label: 'Donate',
    url: 'https://secure.actblue.com/donate/brad-hochgesang-1',
    icon: 'donate',
    style: 'accent',
  },
  {
    _key: 'hero-action-volunteer',
    label: 'Volunteer',
    url: 'https://www.ngpvan.com/',
    icon: 'hands-helping',
    style: 'primary',
  },
]

// ---------------------------------------------------------------------------
// Section 5.3 — Hero Badges (proof strip)
// ---------------------------------------------------------------------------
const HERO_BADGES = [
  {
    _key: 'hero-badge-poll',
    label: '81% of Dubois County said no to MSC',
    icon: 'chart-bar',
    placement: 'proof',
  },
  {
    _key: 'hero-badge-town-halls',
    label: '8 Town Halls organized',
    icon: 'users',
    placement: 'proof',
  },
  {
    _key: 'hero-badge-polls-commissioned',
    label: '2 Professional Polls commissioned',
    icon: 'clipboard-check',
    placement: 'proof',
  },
  {
    _key: 'hero-badge-engineering',
    label: '15+ years software engineering',
    icon: 'laptop',
    placement: 'proof',
  },
]

// ---------------------------------------------------------------------------
// Section 5.3 — Focus Items (hero bullet list)
// ---------------------------------------------------------------------------
const FOCUS_ITEMS = [
  'Property taxes & government spending',
  'Infrastructure done right — roads, bridges, broadband',
  'Housing families can afford',
  'Jobs & small business — keeping young people here',
  'Government accountability & transparency',
  'Utility costs — your electric bill matters',
]

// ---------------------------------------------------------------------------
// Section 5.5 — Priority Cards (homeSectionCards)
// ---------------------------------------------------------------------------
const SECTION_CARDS = [
  {
    _key: 'card-property-taxes',
    title: 'Property Taxes & Spending',
    copy: 'Your taxes should fund your community — not billion-dollar boondoggles. I\u2019ll fight for transparent budgets and accountable spending.',
    href: '/platform#property-taxes',
    icon: 'receipt',
    ctaLabel: 'Read more',
  },
  {
    _key: 'card-infrastructure',
    title: 'Infrastructure Done Right',
    copy: 'Our roads, bridges, and broadband need real investment — not political pet projects. Data should drive where every dollar goes.',
    href: '/platform#infrastructure',
    icon: 'road',
    ctaLabel: 'Read more',
  },
  {
    _key: 'card-housing',
    title: 'Housing Affordability',
    copy: 'Young families can\u2019t stay if there\u2019s nowhere to live. We need smart housing policy that builds communities, not just developments.',
    href: '/platform#housing',
    icon: 'home',
    ctaLabel: 'Read more',
  },
  {
    _key: 'card-jobs',
    title: 'Jobs & Small Business',
    copy: 'I\u2019m a small business owner. I know what it takes. We need to keep young people here with real opportunity, not empty promises.',
    href: '/platform#jobs',
    icon: 'store',
    ctaLabel: 'Read more',
  },
  {
    _key: 'card-accountability',
    title: 'Government Accountability',
    copy: '81% of Dubois County opposed the Mid-States Corridor. They built it anyway. That\u2019s why I\u2019m running. Accountability starts with showing up.',
    href: '/platform#accountability',
    icon: 'clipboard-check',
    ctaLabel: 'Read more',
  },
  {
    _key: 'card-utilities',
    title: 'Utility Costs',
    copy: 'Indiana has the steepest electric rate increases in the country. Utility CEOs earn $18 million while 174,000 households get disconnected. That stops.',
    href: '/platform#utilities',
    icon: 'lightbulb',
    ctaLabel: 'Read more',
  },
]

// ---------------------------------------------------------------------------
// Section 5.4 — "Why I'm Running" (portable text body)
// ---------------------------------------------------------------------------
const WHY_RUNNING_BODY = portableText([
  'I moved back to Jasper in 2023. Within months, I learned a billion-dollar highway was being pushed through our county \u2014 and almost nobody knew about it. The more I dug, the worse it got: no real public input, manipulated polling, costs that didn\u2019t add up.',
  'So I did what I do. I pulled the data. I commissioned a real poll \u2014 636 registered voters, conducted by a professional firm. The result: 81% of Dubois County opposed the project. Not a slim margin. Not ambiguous. Eighty-one percent.',
  'I organized eight town halls across the county. I spoke at council meetings. I presented the numbers and asked for a vote.',
  'Somewhere along the way, I realized this wasn\u2019t just about one highway. It was about a pattern. Decisions being made without the people who live here. Representatives who stopped representing. A government that forgot who it works for.',
  'That\u2019s why I\u2019m running. Not because I\u2019ve always wanted to be a politician \u2014 I haven\u2019t. Because the people of District 48 deserve someone who will do the homework, ask the hard questions, and fight for their answer. I intend to prove it.',
])

// ---------------------------------------------------------------------------
// Section 5.6 — Proof Stats
// ---------------------------------------------------------------------------
const PROOF_STATS = [
  {
    _key: 'proof-stat-81',
    value: '81%',
    label: 'of Dubois County voters oppose the Mid-States Corridor',
  },
  {
    _key: 'proof-stat-town-halls',
    value: '8',
    label: 'public town halls organized across the county',
  },
  {
    _key: 'proof-stat-cost',
    value: '$65M',
    label: 'per percentage point \u2014 the real cost of highway polling accuracy',
  },
  {
    _key: 'proof-stat-braun',
    value: '18%',
    label: "Governor Braun's approval rating in our district",
  },
]

// ---------------------------------------------------------------------------
// Social Links
// ---------------------------------------------------------------------------
const SOCIAL_LINKS = [
  {
    _key: 'social-facebook',
    _type: 'object',
    label: 'Facebook',
    url: 'https://www.facebook.com/bradhochesangforindianastatesenate',
  },
  // YouTube URL pending — placeholder omitted to keep data clean
]

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  console.log(`Seeding homepage blueprint content → ${PROJECT_ID}/${DATASET}`)

  // Ensure the document exists
  await client.createIfNotExists({
    _id: SITE_SETTINGS_ID,
    _type: 'siteSettings',
  })

  // Apply all content in one patch
  await client
    .patch(SITE_SETTINGS_ID)
    .set({
      // --- Header ---
      siteTitle: 'Brad Hochgesang',
      homeLinkMarkup:
        '<span class="home-link-line">Brad Hochgesang</span><span class="home-link-line">For State Senate</span>',

      // --- Hero ---
      tagline:
        'Do the homework. Ask the people. Fight for their answer. I intend to prove it.',
      homeDistrictLabel: 'Indiana State Senate \u00B7 District 48',
      homeHeroSummary:
        'Software engineer. Small business owner. Your neighbor. Running to bring data-driven, constituent-first representation to southwest Indiana.',
      homeHeroLayout: 'clean-split',
      candidatePortraitAlt:
        'Brad Hochgesang, candidate for Indiana State Senate District 48',
      candidatePortraitCaption: 'Jasper, Indiana',
      homeHeroActions: HERO_ACTIONS,
      homeHeroBadges: HERO_BADGES,
      homeFocusItems: FOCUS_ITEMS,

      // --- "Why I'm Running" ---
      homeWhyRunningHeading: "Why I'm Running",
      homeWhyRunningBody: WHY_RUNNING_BODY,

      // --- Priority Cards ---
      homeSectionCards: SECTION_CARDS,

      // --- Proof / Credibility ---
      homeProofHeading:
        "I didn't wait to run for office to start fighting for you.",
      homeProofStats: PROOF_STATS,
      homeProofBody:
        "Before I asked for a single vote, I spent two years doing the work: commissioning professional polls, organizing town halls, presenting data to county councils, and holding officials accountable. The Mid-States Corridor fight proved what constituent-first representation looks like. Now I\u2019m bringing that same approach to every issue that matters to District 48.",

      // --- Mid-Page CTA ---
      homeMidCtaHeading: 'Ready to help?',
      homeMidCtaCopy:
        'This campaign runs on people, not PACs. Every dollar and every door knock makes a difference.',

      // --- Links ---
      donateUrl: 'https://secure.actblue.com/donate/brad-hochgesang-1',
      volunteerUrl: 'https://www.ngpvan.com/',
      socialLinks: SOCIAL_LINKS,
    })
    .commit()

  console.log('✓ Homepage blueprint content seeded successfully.')
  console.log('')
  console.log('Fields set:')
  console.log('  Header: siteTitle, homeLinkMarkup')
  console.log('  Hero: tagline, homeDistrictLabel, homeHeroSummary, homeHeroLayout,')
  console.log('        candidatePortraitAlt, candidatePortraitCaption,')
  console.log('        homeHeroActions (2), homeHeroBadges (4), homeFocusItems (6)')
  console.log('  Why I\'m Running: homeWhyRunningHeading, homeWhyRunningBody (5 paragraphs)')
  console.log('  Priority Cards: homeSectionCards (6 cards)')
  console.log('  Proof: homeProofHeading, homeProofStats (4), homeProofBody')
  console.log('  Mid-CTA: homeMidCtaHeading, homeMidCtaCopy')
  console.log('  Links: donateUrl, volunteerUrl, socialLinks (Facebook)')
  console.log('')
  console.log('Still pending (Brad to provide):')
  console.log('  - candidatePortrait (upload photo in Studio)')
  console.log('  - homeWhyRunningImage (optional)')
  console.log('  - contactEmail')
  console.log('  - YouTube social link')
}

main().catch((error) => {
  console.error('Seed failed:', error)
  process.exit(1)
})
