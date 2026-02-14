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
    {
      id: 'event-senior-services-roundtable',
      title: 'Senior Services Roundtable',
      startOffsetDays: 60,
      durationHours: 1.5,
      location: 'New Albany Senior Center',
      description:
        'Conversation with seniors and caregivers about property taxes, transportation access, and aging-in-place support.',
      eventCardLayout: 'image-left',
      eventImageOrientation: 'portrait',
      eventImageAspectRatio: '4:5',
      eventCardAnimation: 'slide-left',
      eventDescriptionPreviewChars: 480,
      tags: ['seniors', 'caregivers', 'transportation', 'property taxes'],
    },
    {
      id: 'event-riverfront-cleanup-day',
      title: 'Riverfront Cleanup Day',
      startOffsetDays: 63,
      durationHours: 2.5,
      location: 'Jeffersonville Riverfront Park',
      description:
        'Volunteer cleanup and neighborhood beautification event focused on practical community stewardship.',
      eventCardLayout: 'stacked',
      eventImageOrientation: 'landscape',
      eventImageAspectRatio: '3:2',
      eventCardAnimation: 'fade-up',
      eventDescriptionPreviewChars: 440,
      tags: ['volunteer', 'environment', 'community', 'riverfront'],
    },
    {
      id: 'event-rural-roads-listening-session',
      title: 'Rural Roads Listening Session',
      startOffsetDays: 67,
      durationHours: 1.75,
      location: 'Borden Town Hall',
      description:
        'Residents and local leaders review road maintenance priorities, winter readiness, and safety concerns.',
      eventCardLayout: 'feature-split',
      eventImageOrientation: 'landscape',
      eventImageAspectRatio: '16:9',
      eventCardAnimation: 'slide-up',
      eventDescriptionPreviewChars: 500,
      tags: ['infrastructure', 'rural roads', 'public safety', 'winter readiness'],
    },
    {
      id: 'event-school-board-community-night',
      title: 'School Board Community Night',
      startOffsetDays: 71,
      durationHours: 2,
      location: 'Silver Creek High School',
      description:
        'Open forum with parents, educators, and students on classroom resources and post-grad pathways.',
      eventCardLayout: 'image-right',
      eventImageOrientation: 'landscape',
      eventImageAspectRatio: '4:3',
      eventCardAnimation: 'slide-right',
      eventDescriptionPreviewChars: 520,
      tags: ['education', 'parents', 'teachers', 'students'],
    },
    {
      id: 'event-neighborhood-public-safety-walk',
      title: 'Neighborhood Public Safety Walk',
      startOffsetDays: 75,
      durationHours: 1.25,
      location: 'Clarksville Main Street Corridor',
      description:
        'Walking audit focused on lighting, traffic calming, and practical safety partnerships in neighborhood corridors.',
      eventCardLayout: 'no-photo',
      eventImageOrientation: 'landscape',
      eventImageAspectRatio: '3:2',
      eventCardAnimation: 'none',
      eventDescriptionPreviewChars: 740,
      tags: ['public safety', 'neighborhoods', 'lighting', 'traffic calming'],
    },
    {
      id: 'event-small-town-business-coffee-hour',
      title: 'Small-Town Business Coffee Hour',
      startOffsetDays: 78,
      durationHours: 1.5,
      location: 'Sellersburg Commerce Office',
      description:
        'Local entrepreneurs discuss permitting timelines, hiring challenges, and practical support ideas.',
      eventCardLayout: 'image-left',
      eventImageOrientation: 'portrait',
      eventImageAspectRatio: '4:5',
      eventCardAnimation: 'slide-left',
      eventDescriptionPreviewChars: 470,
      tags: ['small business', 'jobs', 'local economy', 'permits'],
    },
    {
      id: 'event-community-health-resource-fair',
      title: 'Community Health Resource Fair',
      startOffsetDays: 82,
      durationHours: 2.25,
      location: 'Charlestown Family Wellness Center',
      description:
        'Connect families with preventive care, mental health support, and local health access resources.',
      eventCardLayout: 'feature-split',
      eventImageOrientation: 'landscape',
      eventImageAspectRatio: '16:9',
      eventCardAnimation: 'fade-up',
      eventDescriptionPreviewChars: 520,
      tags: ['healthcare', 'mental health', 'families', 'community services'],
    },
    {
      id: 'event-youth-leadership-forum',
      title: 'Youth Leadership Forum',
      startOffsetDays: 86,
      durationHours: 1.5,
      location: 'IUS Civic Engagement Hall',
      description:
        'Student-led policy forum covering civic education, internships, and local service opportunities.',
      eventCardLayout: 'stacked',
      eventImageOrientation: 'portrait',
      eventImageAspectRatio: '9:16',
      eventCardAnimation: 'slide-up',
      eventDescriptionPreviewChars: 620,
      tags: ['youth', 'students', 'civic engagement', 'internships'],
    },
    {
      id: 'event-transportation-future-roundtable',
      title: 'Transportation Future Roundtable',
      startOffsetDays: 90,
      durationHours: 2,
      location: 'New Albany Transit Hub',
      description:
        'Roundtable on commuter reliability, pedestrian safety, and long-term district transportation priorities.',
      eventCardLayout: 'image-right',
      eventImageOrientation: 'landscape',
      eventImageAspectRatio: '4:3',
      eventCardAnimation: 'slide-right',
      eventDescriptionPreviewChars: 540,
      tags: ['transportation', 'commuters', 'pedestrian safety', 'infrastructure'],
    },
    {
      id: 'event-fall-district-wrap-up',
      title: 'Fall District Wrap-Up Meeting',
      startOffsetDays: 95,
      durationHours: 2,
      location: 'Jeffersonville Community Center',
      description:
        'Campaign-wide wrap-up on district feedback themes and next-step commitments before election season.',
      eventCardLayout: 'no-photo',
      eventImageOrientation: 'landscape',
      eventImageAspectRatio: '3:2',
      eventCardAnimation: 'fade-up',
      eventDescriptionPreviewChars: 760,
      tags: ['district priorities', 'accountability', 'community', 'campaign updates'],
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
        headerLogoSmall: logoImage,
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
          {label: 'About & Priorities', href: '/platform', icon: 'user-friends'},
          {label: 'FAQ', href: '/faq', icon: 'question-circle'},
          {label: 'Media & Press', href: '/media', icon: 'video'},
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
      _id: 'aboutPriorities',
      _type: 'aboutPriorities',
      pageEyebrow: 'About & Priorities',
      pageTitle: 'Who Brad is and what this campaign stands for',
      pageIntro:
        'A practical, community-first campaign for Indiana State Senate District 48 focused on everyday issues voters feel directly.',
      bioHeading: 'Candidate bio',
      bioBody: portableText([
        'Brad Hochgesang is running to bring practical, transparent leadership to District 48. This campaign is built on direct conversations with neighbors, clear public updates, and policy priorities grounded in day-to-day realities for Indiana families.',
        'The focus is simple: listen first, act with accountability, and deliver measurable progress in jobs, education, public safety, and constituent service.',
      ]),
      valuesHeading: 'Campaign values',
      values: [
        'Community-first decision making',
        'Honest communication and transparency',
        'Practical policy over partisan noise',
      ],
      prioritiesHeading: 'Core priorities',
      priorities: [
        {
          _key: 'jobs-growth',
          title: 'Jobs and local economic growth',
          slug: {_type: 'slug', current: 'jobs-and-local-economic-growth'},
          summary:
            'Support small businesses, strengthen workforce training pipelines, and focus state policy on practical growth for local families.',
          body: portableText([
            'District 48 deserves practical economic policy that supports workers and local employers at the same time.',
            'This campaign prioritizes workforce partnerships, reduced bottlenecks for small businesses, and measurable outcomes families can feel in paychecks and opportunity.',
          ]),
          links: [
            {label: 'See upcoming business-focused events', url: '/events'},
            {label: 'Read campaign updates', url: '/news'},
          ],
        },
        {
          _key: 'safe-services',
          title: 'Safe communities and responsive services',
          slug: {_type: 'slug', current: 'safe-communities-and-responsive-services'},
          summary:
            'Invest in prevention, emergency readiness, and constituent services that are transparent, fast, and accountable.',
          body: portableText([
            'Public safety is strongest when prevention, preparedness, and neighborhood trust are all funded and coordinated.',
            'Constituent services should be clear, timely, and easy to navigate so residents can get help when they need it.',
          ]),
          links: [
            {label: 'Attend a public safety event', url: '/events'},
            {label: 'Volunteer with the campaign', url: '/support'},
          ],
        },
        {
          _key: 'education-opportunity',
          title: 'Education and opportunity',
          slug: {_type: 'slug', current: 'education-and-opportunity'},
          summary:
            'Back strong schools, career-ready pathways, and family-focused education choices that prepare students for real-world success.',
          body: portableText([
            'Education policy should expand options for families while supporting educators and students with practical resources.',
            'From strong K-12 foundations to career training and internships, this campaign supports pathways that lead to long-term opportunity.',
          ]),
          links: [
            {label: 'Read education updates', url: '/news'},
            {label: 'Join the next forum', url: '/events'},
          ],
        },
      ],
      ctaHeading: 'Get involved',
      ctaCopy:
        'Want to help shape these priorities and move them forward? Join the campaign, attend events, and share your input directly.',
      primaryCtaLabel: 'Volunteer & donate',
      primaryCtaUrl: '/support',
      secondaryCtaLabel: 'Attend an event',
      secondaryCtaUrl: '/events',
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
      _id: 'post-public-safety-community-briefing',
      _type: 'post',
      title: 'Public Safety Community Briefing Recap',
      slug: {_type: 'slug', current: 'public-safety-community-briefing-recap'},
      excerpt:
        'Key takeaways from neighborhood safety leaders on prevention, response coordination, and trust-building.',
      publishedAt: daysFromNow(-3),
      coverImage: logoImage,
      tags: ['public safety', 'community'],
      body: portableText([
        'Residents asked for practical public safety improvements that focus on prevention and strong local partnerships.',
        'The campaign heard consistent requests for better communication with first responders and clear accountability metrics.',
        'Future events will include follow-up updates with progress milestones.',
      ]),
    })
    .createOrReplace({
      _id: 'post-education-forum-next-steps',
      _type: 'post',
      title: 'Education Forum: Next Steps for District 48',
      slug: {_type: 'slug', current: 'education-forum-next-steps-district-48'},
      excerpt:
        'Parents, students, and teachers shared priorities around resources, classroom focus, and career pathways.',
      publishedAt: daysFromNow(-4),
      coverImage: logoImage,
      tags: ['education', 'students', 'families'],
      body: portableText([
        'Participants asked for steady investment in classroom fundamentals and practical pathways into skilled careers.',
        'District conversations highlighted the need for transparent school funding and local workforce alignment.',
        'Campaign planning now includes recurring education-focused feedback sessions.',
      ]),
    })
    .createOrReplace({
      _id: 'post-healthcare-access-town-notes',
      _type: 'post',
      title: 'Healthcare Access Town Notes',
      slug: {_type: 'slug', current: 'healthcare-access-town-notes'},
      excerpt: 'Community members outlined practical steps to improve affordability, preventive care, and local access.',
      publishedAt: daysFromNow(-5),
      coverImage: logoImage,
      tags: ['healthcare', 'families'],
      body: portableText([
        'Caregivers and families emphasized faster access to primary care and predictable out-of-pocket costs.',
        'Residents also asked for stronger local coordination between clinics, schools, and support services.',
        'These notes will guide upcoming policy drafts and listening sessions.',
      ]),
    })
    .createOrReplace({
      _id: 'post-transportation-priority-check-in',
      _type: 'post',
      title: 'Transportation Priority Check-In',
      slug: {_type: 'slug', current: 'transportation-priority-check-in'},
      excerpt: 'A district update on roads, sidewalks, and commuter reliability priorities raised by residents.',
      publishedAt: daysFromNow(-6),
      coverImage: logoImage,
      tags: ['transportation', 'infrastructure'],
      body: portableText([
        'Neighbors continue to prioritize safer corridors, sidewalk continuity, and predictable commute routes.',
        'Conversations also focused on practical maintenance scheduling and transparent project timelines.',
        'The campaign will publish a corridor-by-corridor feedback summary soon.',
      ]),
    })
    .createOrReplace({
      _id: 'post-veterans-resources-update',
      _type: 'post',
      title: 'Veterans Resources Update',
      slug: {_type: 'slug', current: 'veterans-resources-update'},
      excerpt: 'New district conversations on benefits navigation, service access, and veteran family support.',
      publishedAt: daysFromNow(-7),
      coverImage: logoImage,
      tags: ['veterans', 'community services'],
      body: portableText([
        'Veterans and families requested simpler pathways to local support, benefits information, and employment resources.',
        'Campaign outreach teams are compiling a district resource checklist for upcoming fairs and forums.',
        'Additional veteran-focused listening events are scheduled through the season.',
      ]),
    })
    .createOrReplace({
      _id: 'post-housing-neighborhood-feedback',
      _type: 'post',
      title: 'Housing and Neighborhood Feedback',
      slug: {_type: 'slug', current: 'housing-and-neighborhood-feedback'},
      excerpt:
        'Residents discussed rent pressure, first-time buyer barriers, and neighborhood stability priorities.',
      publishedAt: daysFromNow(-8),
      coverImage: logoImage,
      tags: ['housing', 'neighborhoods'],
      body: portableText([
        'Community input centered on predictable housing costs and practical support for first-time buyers.',
        'Participants also raised concerns about zoning clarity and neighborhood infrastructure capacity.',
        'The campaign will continue collecting examples to shape actionable proposals.',
      ]),
    })
    .createOrReplace({
      _id: 'post-youth-engagement-recap',
      _type: 'post',
      title: 'Youth Engagement Forum Recap',
      slug: {_type: 'slug', current: 'youth-engagement-forum-recap'},
      excerpt: 'Students shared ideas on civic learning, internships, and practical pathways into public service.',
      publishedAt: daysFromNow(-9),
      coverImage: logoImage,
      tags: ['youth', 'education', 'civic engagement'],
      body: portableText([
        'Student leaders emphasized early civic education and clearer bridges between school and local service opportunities.',
        'Participants asked for internship pathways that connect classrooms with real district needs.',
        'Future updates will track youth-led recommendations and implementation milestones.',
      ]),
    })
    .createOrReplace({
      _id: 'post-fall-campaign-roadmap',
      _type: 'post',
      title: 'Fall Campaign Roadmap',
      slug: {_type: 'slug', current: 'fall-campaign-roadmap'},
      excerpt: 'A planning update outlining upcoming events, publishing cadence, and district feedback checkpoints.',
      publishedAt: daysFromNow(-10),
      coverImage: logoImage,
      tags: ['campaign updates', 'roadmap'],
      body: portableText([
        'The next campaign phase will expand district events while keeping regular public updates and transparent follow-through.',
        'Teams are prioritizing practical publishing workflows so residents can track plans and outcomes clearly.',
        'The roadmap will be reviewed monthly with updates from each focus area.',
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
          slug: {
            _type: 'slug',
            current: event.id.replace(/^event-/, ''),
          },
          startDate,
          endDate,
          location: event.location,
          description: event.description,
          detailBody: portableText([
            event.description,
            'This event is part of our district-wide listening and action agenda. Bring your questions, ideas, and priorities so we can build practical policy together.',
          ]),
          detailLinks: [
            {label: 'View all events', url: '/events'},
            {label: 'Support the campaign', url: '/support'},
          ],
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
