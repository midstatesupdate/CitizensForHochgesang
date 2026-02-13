import {getCliClient} from 'sanity/cli'

const DATASET = process.env.SANITY_STUDIO_DATASET ?? 'development'
const PROJECT_ID = process.env.SANITY_STUDIO_PROJECT_ID ?? 'n2oyijjv'
const API_VERSION = '2025-02-19'

const client = getCliClient({apiVersion: API_VERSION}).withConfig({
  projectId: PROJECT_ID,
  dataset: DATASET,
  useCdn: false,
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

function sampleSvg(
  width: number,
  height: number,
  title: string,
  subtitle: string,
  gradientA: string,
  gradientB: string,
) {
  const safeTitle = escapeXml(title)
  const safeSubtitle = escapeXml(subtitle)

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${gradientA}"/>
      <stop offset="100%" stop-color="${gradientB}"/>
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#g)"/>
  <circle cx="${Math.round(width * 0.78)}" cy="${Math.round(height * 0.24)}" r="${Math.round(Math.min(width, height) * 0.16)}" fill="#f2c45a" opacity="0.26"/>
  <text x="${Math.round(width * 0.07)}" y="${Math.round(height * 0.66)}" fill="#ffffff" font-size="${Math.round(Math.min(width, height) * 0.078)}" font-family="Arial, sans-serif" font-weight="700">${safeTitle}</text>
  <text x="${Math.round(width * 0.07)}" y="${Math.round(height * 0.75)}" fill="#efe6ff" font-size="${Math.round(Math.min(width, height) * 0.04)}" font-family="Arial, sans-serif">${safeSubtitle}</text>
</svg>`
}

async function uploadSvgImage(filename: string, svg: string) {
  const file = Buffer.from(svg, 'utf8')
  return client.assets.upload('image', file, {
    filename,
    contentType: 'image/svg+xml',
  })
}

function escapeXml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

async function main() {
  const settings = await client.fetch<{campaignLogo?: {_type: 'image'; asset?: {_type: 'reference'; _ref: string}}} | null>(
    `*[_type == "siteSettings"][0]{campaignLogo}`
  )

  const logoImage = settings?.campaignLogo

  const now = new Date()
  const daysFromNow = (days: number) => new Date(now.getTime() + days * 24 * 60 * 60 * 1000).toISOString()

  const eventImages = await Promise.all([
    uploadSvgImage('event-sample-3x2.svg', sampleSvg(1500, 1000, 'District Event', 'DSLR Landscape 3:2', '#332157', '#9e7bdd')),
    uploadSvgImage('event-sample-16x9.svg', sampleSvg(1600, 900, 'Community Town Hall', 'Widescreen 16:9', '#1d1838', '#5d56b8')),
    uploadSvgImage('event-sample-4x3.svg', sampleSvg(1440, 1080, 'Policy Briefing', 'Standard Landscape 4:3', '#2b294f', '#7d88df')),
    uploadSvgImage('event-sample-1x1.svg', sampleSvg(1200, 1200, 'Volunteer Hub', 'Square 1:1', '#3f245f', '#d47bb1')),
    uploadSvgImage('event-sample-4x5.svg', sampleSvg(1000, 1250, 'Meet & Greet', 'Classic Portrait 4:5', '#40235a', '#b892ff')),
    uploadSvgImage('event-sample-9x16.svg', sampleSvg(900, 1600, 'Campus Forum', 'Phone Portrait 9:16', '#23163e', '#7f56c6')),
  ])

  const eventImageByRatio: Record<string, string> = {
    '3:2': eventImages[0]._id,
    '16:9': eventImages[1]._id,
    '4:3': eventImages[2]._id,
    '1:1': eventImages[3]._id,
    '4:5': eventImages[4]._id,
    '9:16': eventImages[5]._id,
  }

  const eventSeeds = [
    {
      id: 'event-jeffersonville-townhall',
      title: 'Jeffersonville Community Town Hall',
      startOffsetDays: 4,
      durationHours: 2,
      location: 'Jeffersonville Public Library',
      description:
        'Open Q&A with district residents focused on transportation priorities, local jobs, and constituent services.',
      eventCardLayout: 'feature-split',
      eventImageOrientation: 'landscape',
      eventImageAspectRatio: '16:9',
      eventCardAnimation: 'fade-up',
      eventDescriptionPreviewChars: 520,
      tags: ['town hall', 'community', 'transportation', 'jobs'],
    },
    {
      id: 'event-charlestown-coffee-chat',
      title: 'Coffee and Conversation in Charlestown',
      startOffsetDays: 7,
      durationHours: 1.5,
      location: 'Charlestown Civic Center',
      description:
        'Informal neighborhood conversation with campaign volunteers and residents from across District 48.',
      eventCardLayout: 'image-left',
      eventImageOrientation: 'portrait',
      eventImageAspectRatio: '4:5',
      eventCardAnimation: 'slide-left',
      eventDescriptionPreviewChars: 460,
      tags: ['meet-and-greet', 'community', 'listening session', 'families'],
    },
    {
      id: 'event-new-albany-education-forum',
      title: 'New Albany Education Forum',
      startOffsetDays: 10,
      durationHours: 2,
      location: 'New Albany High School Auditorium',
      description: 'Parents, teachers, and students discuss classroom funding, safety, and career pathways.',
      eventCardLayout: 'image-right',
      eventImageOrientation: 'landscape',
      eventImageAspectRatio: '4:3',
      eventCardAnimation: 'slide-right',
      eventDescriptionPreviewChars: 480,
      tags: ['education', 'schools', 'parents', 'students', 'workforce'],
    },
    {
      id: 'event-clarksville-small-business-roundtable',
      title: 'Clarksville Small Business Roundtable',
      startOffsetDays: 13,
      durationHours: 1.75,
      location: 'Clarksville Town Hall Annex',
      description: 'Local employers share growth barriers and proposals for predictable, pro-main-street policy.',
      eventCardLayout: 'stacked',
      eventImageOrientation: 'landscape',
      eventImageAspectRatio: '3:2',
      eventCardAnimation: 'slide-up',
      eventDescriptionPreviewChars: 560,
      tags: ['small business', 'economy', 'main street', 'workforce'],
    },
    {
      id: 'event-sellersburg-public-safety-panel',
      title: 'Sellersburg Public Safety Panel',
      startOffsetDays: 16,
      durationHours: 2,
      location: 'Sellersburg Community Hall',
      description:
        'Moderated panel with local safety leaders on prevention, emergency response, and neighborhood trust.',
      eventCardLayout: 'feature-split',
      eventImageOrientation: 'landscape',
      eventImageAspectRatio: '16:9',
      eventCardAnimation: 'fade-up',
      eventDescriptionPreviewChars: 500,
      tags: ['public safety', 'first responders', 'neighborhoods', 'prevention'],
    },
    {
      id: 'event-floyds-knobs-farm-family-night',
      title: 'Floyds Knobs Farm & Family Night',
      startOffsetDays: 19,
      durationHours: 3,
      location: 'Floyd County Fairgrounds',
      description: 'Family-focused event centered on agriculture, local food systems, and youth opportunities.',
      eventCardLayout: 'image-left',
      eventImageOrientation: 'landscape',
      eventImageAspectRatio: '1:1',
      eventCardAnimation: 'slide-left',
      eventDescriptionPreviewChars: 430,
      tags: ['agriculture', 'families', 'youth', 'food access'],
    },
    {
      id: 'event-campus-civics-night',
      title: 'Campus Civics Night',
      startOffsetDays: 22,
      durationHours: 1.5,
      location: 'IUS Student Center',
      description:
        'Student-led conversation on civic engagement, internships, and creating pathways to public service.',
      eventCardLayout: 'stacked',
      eventImageOrientation: 'portrait',
      eventImageAspectRatio: '9:16',
      eventCardAnimation: 'slide-up',
      eventDescriptionPreviewChars: 600,
      tags: ['students', 'higher education', 'civics', 'internships', 'youth'],
    },
    {
      id: 'event-healthcare-listening-hour',
      title: 'Healthcare Listening Hour',
      startOffsetDays: 25,
      durationHours: 1,
      location: 'Jeffersonville Wellness Center',
      description: 'Nurses, caregivers, and families discuss access, affordability, and rural care coordination.',
      eventCardLayout: 'no-photo',
      eventImageOrientation: 'landscape',
      eventImageAspectRatio: '3:2',
      eventCardAnimation: 'none',
      eventDescriptionPreviewChars: 760,
      tags: ['healthcare', 'caregivers', 'seniors', 'affordability', 'rural access'],
    },
    {
      id: 'event-veterans-resource-fair',
      title: 'Veterans Resource Fair',
      startOffsetDays: 29,
      durationHours: 2.5,
      location: 'Clark Memorial Veterans Hall',
      description:
        'Connect veterans and military families with local services, benefits navigation, and job resources.',
      eventCardLayout: 'image-right',
      eventImageOrientation: 'portrait',
      eventImageAspectRatio: '4:5',
      eventCardAnimation: 'slide-right',
      eventDescriptionPreviewChars: 510,
      tags: ['veterans', 'military families', 'benefits', 'jobs'],
    },
    {
      id: 'event-greenway-bike-walk-audit',
      title: 'Greenway Bike & Walk Audit',
      startOffsetDays: 33,
      durationHours: 1.5,
      location: 'Jeffersonville Riverfront Greenway',
      description: 'Route walk-through focused on bike safety, sidewalks, and ADA improvements.',
      eventCardLayout: 'stacked',
      eventImageOrientation: 'landscape',
      eventImageAspectRatio: '3:2',
      eventCardAnimation: 'fade-up',
      eventDescriptionPreviewChars: 420,
      tags: ['transportation', 'bike safety', 'accessibility', 'infrastructure'],
    },
    {
      id: 'event-housing-affordability-workshop',
      title: 'Housing Affordability Workshop',
      startOffsetDays: 38,
      durationHours: 2,
      location: 'New Albany Housing Collaborative',
      description:
        'Interactive workshop on rental pressure, first-time buyers, zoning clarity, and neighborhood stability.',
      eventCardLayout: 'feature-split',
      eventImageOrientation: 'landscape',
      eventImageAspectRatio: '4:3',
      eventCardAnimation: 'slide-up',
      eventDescriptionPreviewChars: 570,
      tags: ['housing', 'renters', 'homeownership', 'zoning', 'neighborhoods'],
    },
    {
      id: 'event-climate-resilience-briefing',
      title: 'Climate Resilience Briefing',
      startOffsetDays: 43,
      durationHours: 1.5,
      location: 'Silver Creek Watershed Office',
      description:
        'Discussion on flood preparedness, stormwater planning, and practical community resilience steps.',
      eventCardLayout: 'image-left',
      eventImageOrientation: 'landscape',
      eventImageAspectRatio: '16:9',
      eventCardAnimation: 'slide-left',
      eventDescriptionPreviewChars: 470,
      tags: ['environment', 'flooding', 'resilience', 'stormwater', 'infrastructure'],
    },
    {
      id: 'event-faith-community-breakfast',
      title: 'Faith Community Breakfast',
      startOffsetDays: 49,
      durationHours: 1.25,
      location: 'St. Mary Fellowship Hall',
      description: 'Interfaith breakfast focused on service partnerships, food security, and youth mentorship.',
      eventCardLayout: 'image-right',
      eventImageOrientation: 'portrait',
      eventImageAspectRatio: '4:5',
      eventCardAnimation: 'none',
      eventDescriptionPreviewChars: 390,
      tags: ['faith community', 'service', 'food security', 'mentorship'],
    },
    {
      id: 'event-district-priorities-virtual-forum',
      title: 'District Priorities Virtual Forum',
      startOffsetDays: 56,
      durationHours: 2,
      location: 'Online Livestream',
      description:
        'Statewide-access virtual event to review top district priorities and gather final public input.',
      eventCardLayout: 'no-photo',
      eventImageOrientation: 'landscape',
      eventImageAspectRatio: '3:2',
      eventCardAnimation: 'fade-up',
      eventDescriptionPreviewChars: 720,
      tags: ['virtual', 'district priorities', 'transparency', 'livestream', 'Q&A'],
    },
  ]

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

  await Promise.all(
    eventSeeds.map((event) =>
      (() => {
        const startDate = daysFromNow(event.startOffsetDays)
        const startMs = Date.parse(startDate)
        const durationHours = event.durationHours ?? 2
        const endDate = new Date(startMs + durationHours * 60 * 60 * 1000).toISOString()

        return client.createOrReplace({
          _id: event.id,
          _type: 'event',
          title: event.title,
          startDate,
          endDate,
          location: event.location,
          description: event.description,
          rsvpLink: 'https://www.ngpvan.com/',
          ...(event.eventCardLayout === 'no-photo'
            ? {}
            : {
                scheduleImage: {
                  _type: 'image',
                  asset: {
                    _type: 'reference',
                    _ref: eventImageByRatio[event.eventImageAspectRatio] ?? eventImages[0]._id,
                  },
                },
              }),
          eventCardLayout: event.eventCardLayout,
          eventImageOrientation: event.eventImageOrientation,
          eventImageAspectRatio: event.eventImageAspectRatio,
          eventCardAnimation: event.eventCardAnimation,
          eventDescriptionPreviewChars: event.eventDescriptionPreviewChars,
          tags: event.tags,
        })
      })(),
    ),
  )

  console.log(`Seed content created/updated successfully with ${eventSeeds.length} sample events.`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
