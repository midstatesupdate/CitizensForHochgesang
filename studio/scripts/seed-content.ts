import {getCliClient} from 'sanity/cli'

const DATASET = process.env.SANITY_STUDIO_DATASET ?? 'development'
const PROJECT_ID = process.env.SANITY_STUDIO_PROJECT_ID ?? 'n2oyijjv'
const API_VERSION = '2025-02-19'

const client = getCliClient({apiVersion: API_VERSION}).withConfig({
  projectId: PROJECT_ID,
  dataset: DATASET,
})

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

async function main() {
  const settings = await client.fetch<{campaignLogo?: {_type: 'image'; asset?: {_type: 'reference'; _ref: string}}} | null>(
    `*[_type == "siteSettings"][0]{campaignLogo}`
  )

  const logoImage = settings?.campaignLogo

  const now = new Date()
  const daysFromNow = (days: number) => new Date(now.getTime() + days * 24 * 60 * 60 * 1000).toISOString()

  await client
    .transaction()
    .createIfNotExists({
      _id: 'siteSettings',
      _type: 'siteSettings',
    })
    .patch('siteSettings', {
      set: {
        siteTitle: 'Citizens For Hochgesang',
        tagline: 'Practical leadership for Indiana State Senate District 48.',
        homeHeroLayout: 'clean-split',
        homeDistrictLabel: 'Indiana State Senate District 48',
        homeHeroSummary: 'Practical leadership for Indiana State Senate District 48.',
        homeLinkMarkup:
          '<span class="home-link-line">Brad Hochgesang</span><span class="home-link-line">For State Senate</span>',
        donateUrl: 'https://secure.actblue.com/donate/brad-hochgesang-1',
        volunteerUrl: 'https://www.ngpvan.com/',
        socialLinks: [
          {
            _key: 'facebook',
            _type: 'object',
            label: 'Facebook',
            url: 'https://www.facebook.com/bradhochesangforindianastatesenate',
          },
          {
            _key: 'youtube',
            _type: 'object',
            label: 'YouTube',
            url: 'https://www.youtube.com/',
          },
        ],
        headerNavItems: [
          {label: 'News', href: '/news', icon: 'newspaper'},
          {label: 'Events', href: '/events', icon: 'calendar'},
          {label: 'FAQ', href: '/faq', icon: 'question-circle'},
          {label: 'Media', href: '/media', icon: 'video'},
          {label: 'Press', href: '/press', icon: 'reg-newspaper'},
          {label: 'Support', href: '/support', icon: 'hands-helping'},
        ],
        homeHeroActions: [
          {label: 'Volunteer', url: '/support', icon: 'hands-helping', style: 'primary'},
          {label: 'Donate', url: 'https://secure.actblue.com/donate/brad-hochgesang-1', icon: 'vote-yea', style: 'outline'},
        ],
        homeHeroBadges: [
          {label: 'Community-first platform', icon: 'bullhorn', placement: 'text'},
          {label: 'Transparent updates', icon: 'newspaper', placement: 'text'},
          {label: 'District listening sessions', placement: 'proof'},
          {label: 'Neighborhood town halls', placement: 'proof'},
          {label: 'Volunteer-powered outreach', placement: 'proof'},
        ],
        homeFocusItems: [
          'Strengthening local jobs, small businesses, and workforce training.',
          'Supporting safe communities through partnerships and smart policy.',
          'Protecting quality education and practical pathways for families.',
        ],
        homeSectionCards: [
          {
            title: 'News & Updates',
            copy: 'Campaign announcements and policy updates.',
            href: '/news',
            icon: 'newspaper',
            ctaLabel: 'View News & Updates',
          },
          {
            title: 'Events',
            copy: 'Town halls, meetups, and district listening sessions.',
            href: '/events',
            icon: 'calendar',
            ctaLabel: 'View Events',
          },
          {
            title: 'Media',
            copy: 'Video, interviews, and social coverage in one feed.',
            href: '/media',
            icon: 'video',
            ctaLabel: 'View Media',
          },
        ],
      },
    })
    .createOrReplace({
      _id: 'post-launch-district-48',
      _type: 'post',
      title: 'Launching a District 48 Listening Tour',
      slug: {_type: 'slug', current: 'launching-district-48-listening-tour'},
      excerpt:
        'Our campaign is expanding direct conversations with voters across Jeffersonville, Charlestown, and surrounding communities.',
      publishedAt: daysFromNow(-2),
      coverImage: logoImage,
      tags: ['community', 'campaign updates'],
      body: portableText([
        'This week we begin a district-wide listening tour focused on practical priorities for families and small businesses.',
        'Residents can share ideas on transportation, public safety, education, and local economic development.',
        'The campaign will publish summary updates and next-step priorities after each stop.',
      ]),
    })
    .createOrReplace({
      _id: 'post-small-business-roundtable',
      _type: 'post',
      title: 'Small Business Roundtable Priorities',
      slug: {_type: 'slug', current: 'small-business-roundtable-priorities'},
      excerpt:
        'Local employers and entrepreneurs shared policy ideas to support growth, workforce development, and predictable regulations.',
      publishedAt: daysFromNow(-1),
      coverImage: logoImage,
      tags: ['economy', 'small business'],
      body: portableText([
        'District 48 business owners highlighted workforce needs and permitting friction as top concerns.',
        'Our policy approach centers on reducing unnecessary delays while keeping communities safe and competitive.',
        'Additional roundtables will be scheduled in the coming weeks to keep this feedback loop active.',
      ]),
    })
    .createOrReplace({
      _id: 'event-jeffersonville-townhall',
      _type: 'event',
      title: 'Jeffersonville Community Town Hall',
      startDate: daysFromNow(7),
      location: 'Jeffersonville Public Library',
      description:
        'Open Q&A with district residents focused on transportation priorities, local jobs, and constituent services.',
      rsvpLink: 'https://www.ngpvan.com/',
      scheduleImage: logoImage,
    })
    .createOrReplace({
      _id: 'event-charlestown-coffee-chat',
      _type: 'event',
      title: 'Coffee and Conversation in Charlestown',
      startDate: daysFromNow(11),
      location: 'Charlestown Civic Center',
      description:
        'Informal community conversation with campaign volunteers and neighbors from across District 48.',
      rsvpLink: 'https://www.ngpvan.com/',
      scheduleImage: logoImage,
    })
    .createOrReplace({
      _id: 'media-kickoff-address',
      _type: 'mediaLink',
      title: 'Campaign Kickoff Address',
      mediaType: 'youtube',
      url: 'https://www.youtube.com/',
      publishedAt: daysFromNow(-2),
      thumbnail: logoImage,
    })
    .createOrReplace({
      _id: 'media-facebook-community-update',
      _type: 'mediaLink',
      title: 'Community Update on Facebook',
      mediaType: 'facebook',
      url: 'https://www.facebook.com/bradhochesangforindianastatesenate',
      publishedAt: daysFromNow(-1),
      thumbnail: logoImage,
    })
    .createOrReplace({
      _id: 'fund-actblue-main',
      _type: 'fundraisingLink',
      title: 'Donate with ActBlue',
      url: 'https://secure.actblue.com/donate/brad-hochgesang-1',
      description: 'Secure online contribution for campaign operations and voter outreach.',
      priority: 100,
      image: logoImage,
    })
    .commit()

  console.log('Seed content created/updated successfully.')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
