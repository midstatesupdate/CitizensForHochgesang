import {getCliClient} from 'sanity/cli'

const DATASET = process.env.SANITY_STUDIO_DATASET ?? 'production'
const PROJECT_ID = process.env.SANITY_STUDIO_PROJECT_ID ?? 'n2oyijjv'
const API_VERSION = '2025-02-19'

const SITE_SETTINGS_ID = 'siteSettings'

const DEFAULT_HERO_ACTIONS = [
  {
    _key: 'hero-action-volunteer',
    label: 'Volunteer',
    url: '/support',
    icon: 'hands-helping',
    style: 'primary',
  },
  {
    _key: 'hero-action-donate',
    label: 'Donate',
    url: 'https://secure.actblue.com/donate/brad-hochgesang-1',
    icon: 'vote-yea',
    style: 'outline',
  },
]

const DEFAULT_HERO_BUBBLES = [
  {
    _key: 'hero-bubble-community-first',
    label: 'Community-first platform',
    icon: 'bullhorn',
    placement: 'text',
  },
  {
    _key: 'hero-bubble-updates',
    label: 'Transparent updates',
    icon: 'newspaper',
    placement: 'text',
  },
  {
    _key: 'hero-bubble-listening-sessions',
    label: 'District listening sessions',
    placement: 'proof',
  },
  {
    _key: 'hero-bubble-town-halls',
    label: 'Neighborhood town halls',
    placement: 'proof',
  },
  {
    _key: 'hero-bubble-volunteer-outreach',
    label: 'Volunteer-powered outreach',
    placement: 'proof',
  },
]

const DEFAULT_FOCUS_LIST = [
  'Strengthening local jobs, small businesses, and workforce training.',
  'Supporting safe communities through partnerships and smart policy.',
  'Protecting quality education and practical pathways for families.',
]

const DEFAULT_SECTION_CARDS = [
  {
    _key: 'home-card-news',
    title: 'News & Updates',
    copy: 'Campaign announcements and policy updates.',
    href: '/news',
    icon: 'newspaper',
    ctaLabel: 'View News & Updates',
  },
  {
    _key: 'home-card-events',
    title: 'Events',
    copy: 'Town halls, meetups, and district listening sessions.',
    href: '/events',
    icon: 'calendar',
    ctaLabel: 'View Events',
  },
  {
    _key: 'home-card-media',
    title: 'Media',
    copy: 'Video, interviews, and social coverage in one feed.',
    href: '/media',
    icon: 'video',
    ctaLabel: 'View Media',
  },
]

const client = getCliClient({apiVersion: API_VERSION}).withConfig({
  projectId: PROJECT_ID,
  dataset: DATASET,
})

async function main() {
  await client.createIfNotExists({_id: SITE_SETTINGS_ID, _type: 'siteSettings'})

  await client
    .patch(SITE_SETTINGS_ID)
    .setIfMissing({
      homeHeroActions: DEFAULT_HERO_ACTIONS,
      homeHeroBadges: DEFAULT_HERO_BUBBLES,
      homeFocusItems: DEFAULT_FOCUS_LIST,
      homeSectionCards: DEFAULT_SECTION_CARDS,
    })
    .commit()

  console.log(`Seeded missing siteSettings fields in ${PROJECT_ID}/${DATASET} without overwriting existing values.`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
