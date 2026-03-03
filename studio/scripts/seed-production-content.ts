import {getCliClient} from 'sanity/cli'

/**
 * seed-production-content.ts
 *
 * STEP 1: Deletes all seed/placeholder post, event, mediaLink, and aboutPriorities documents.
 * STEP 2: Patches siteSettings with real campaign content, nav, badges, cards, and countdown timers.
 * STEP 3: Creates 12 real events (2 upcoming, 10 past).
 * STEP 4: Creates 10 real news posts.
 * STEP 5: Creates/replaces aboutPriorities with real bio, values, and 6 priorities.
 * STEP 6: Creates/updates the ActBlue fundraisingLink.
 * STEP 7: Creates 10 real media/press links.
 *
 * Run: pnpm --filter studio seed:production
 */

const DATASET = process.env.SANITY_STUDIO_DATASET ?? 'production'
const PROJECT_ID = process.env.SANITY_STUDIO_PROJECT_ID ?? 'n2oyijjv'
const API_VERSION = '2025-02-19'

const client = getCliClient({apiVersion: API_VERSION}).withConfig({
  projectId: PROJECT_ID,
  dataset: DATASET,
  useCdn: false,
})

// ---------------------------------------------------------------------------
// Helpers
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

function ctaButton(
  key: string,
  label: string,
  url: string,
  style: 'primary' | 'outline' | 'accent' = 'primary',
) {
  return {_key: key, _type: 'ctaButton', label, url, style}
}

// ---------------------------------------------------------------------------
// STEP 1 — Delete all seed documents
// ---------------------------------------------------------------------------

async function deleteAllSeedDocuments() {
  const ids = await client.fetch<string[]>(
    `*[_type in ["post", "event", "mediaLink", "aboutPriorities"]]._id`,
  )
  if (!ids.length) {
    console.log('No seed documents found — nothing to delete.')
    return
  }
  const tx = client.transaction()
  for (const id of ids) {
    tx.delete(id)
  }
  await tx.commit()
  console.log(`Deleted ${ids.length} seed documents.`)
}

// ---------------------------------------------------------------------------
// STEP 2 — Patch siteSettings
// ---------------------------------------------------------------------------

async function patchSiteSettings() {
  await client.createIfNotExists({_id: 'siteSettings', _type: 'siteSettings'})

  await client
    .patch('siteSettings')
    .set({
      siteTitle: 'Brad Hochgesang',
      tagline: 'Do the homework. Ask the people. Fight for their answer. I intend to prove it.',
      homeDistrictLabel: 'Indiana State Senate · District 48',
      homeHeroSummary:
        'Software engineer. Small business owner. Your neighbor. Running to bring data-driven, constituent-first representation to southwest Indiana.',
      homeHeroLayout: 'clean-split',
      candidatePortraitAlt: 'Brad Hochgesang, candidate for Indiana State Senate District 48',
      candidatePortraitCaption: 'Jasper, Indiana',
      contactEmail: 'brad@citizensforhochgesang.org',
      donateUrl: 'https://secure.actblue.com/donate/brad-hochgesang-1',
      volunteerUrl: 'https://www.ngpvan.com/',
      socialLinks: [
        {
          _key: 'social-facebook',
          _type: 'object',
          label: 'Facebook',
          url: 'https://www.facebook.com/bradhochesangforindianastatesenate',
        },
        {
          _key: 'social-youtube',
          _type: 'object',
          label: 'YouTube',
          url: 'https://www.youtube.com/',
        },
      ],
      homeHeroActions: [
        {
          _key: 'action-donate',
          label: 'Donate',
          url: 'https://secure.actblue.com/donate/brad-hochgesang-1',
          icon: 'donate',
          style: 'accent',
        },
        {
          _key: 'action-volunteer',
          label: 'Volunteer',
          url: 'https://www.ngpvan.com/',
          icon: 'hands-helping',
          style: 'primary',
        },
      ],
      homeHeroBadges: [
        {
          _key: 'badge-poll-dubois',
          label: '81% of Dubois County said no to MSC',
          icon: 'chart-bar',
          placement: 'proof',
        },
        {
          _key: 'badge-town-halls',
          label: '8 Town Halls organized',
          icon: 'users',
          placement: 'proof',
        },
        {
          _key: 'badge-polls',
          label: '2 Professional Polls commissioned',
          icon: 'clipboard-check',
          placement: 'proof',
        },
        {
          _key: 'badge-software',
          label: '15+ years software engineering',
          icon: 'laptop',
          placement: 'proof',
        },
      ],
      homeFocusItems: [
        'Property taxes & government spending',
        'Infrastructure done right — roads, bridges, broadband',
        'Housing families can afford',
        'Jobs & small business — keeping young people here',
        'Government accountability & transparency',
        'Utility costs — your electric bill matters',
      ],
      homeSectionCards: [
        {
          _key: 'card-property-taxes',
          title: 'Property Taxes & Spending',
          copy: 'Your taxes should fund your community — not billion-dollar boondoggles. I\'ll fight for transparent budgets and accountable spending.',
          href: '/platform',
          icon: 'receipt',
          ctaLabel: 'Read more',
        },
        {
          _key: 'card-infrastructure',
          title: 'Infrastructure Done Right',
          copy: 'Our roads, bridges, and broadband need real investment — not political pet projects. Data should drive where every dollar goes.',
          href: '/platform',
          icon: 'road',
          ctaLabel: 'Read more',
        },
        {
          _key: 'card-housing',
          title: 'Housing Affordability',
          copy: 'Young families can\'t stay if there\'s nowhere to live. We need smart housing policy that builds communities, not just developments.',
          href: '/platform',
          icon: 'home',
          ctaLabel: 'Read more',
        },
        {
          _key: 'card-jobs',
          title: 'Jobs & Small Business',
          copy: 'I\'m a small business owner. I know what it takes. We need to keep young people here with real opportunity, not empty promises.',
          href: '/platform',
          icon: 'store',
          ctaLabel: 'Read more',
        },
        {
          _key: 'card-accountability',
          title: 'Government Accountability',
          copy: '81% of Dubois County opposed the Mid-States Corridor. They built it anyway. That\'s why I\'m running. Accountability starts with showing up.',
          href: '/platform',
          icon: 'clipboard-check',
          ctaLabel: 'Read more',
        },
        {
          _key: 'card-utilities',
          title: 'Utility Costs',
          copy: 'Indiana has the steepest electric rate increases in the country. Utility CEOs earn $18 million while 174,000 households get disconnected. That stops.',
          href: '/platform',
          icon: 'lightbulb',
          ctaLabel: 'Read more',
        },
      ],
      headerNavItems: [
        {_key: 'nav-news', label: 'News', href: '/news', icon: 'newspaper'},
        {_key: 'nav-events', label: 'Events', href: '/events', icon: 'calendar'},
        {_key: 'nav-platform', label: 'About & Priorities', href: '/platform', icon: 'user-friends'},
        {_key: 'nav-media', label: 'Media & Press', href: '/media', icon: 'video'},
        {_key: 'nav-support', label: 'Support', href: '/support', icon: 'hands-helping'},
      ],
      pageVisibility: {
        news: true,
        events: true,
        platform: true,
        media: true,
        support: true,
        faq: false,
      },
      countdownTimers: [
        // Timer 1: Primary Voter Registration Deadline
        {
          _key: 'timer-primary-reg',
          enabled: true,
          heading: 'Primary Registration Deadline',
          targetDate: '2026-04-06T23:59:00-04:00',
          body: [
            ...portableText([
              'You must be registered by April 6 to vote in the May 5 primary. Check your registration or register today — it takes 2 minutes online.',
            ]).map((b, i) => ({...b, _key: `timer-primary-reg-body-${i + 1}`})),
            ctaButton(
              'timer-primary-reg-cta',
              'Check Registration',
              'https://indianavoters.in.gov/',
              'primary',
            ),
          ],
        },
        // Timer 2: Primary Early Voting Opens
        {
          _key: 'timer-primary-early',
          enabled: true,
          heading: 'Primary Early Voting Is Open',
          targetDate: '2026-04-07T06:00:00-04:00',
          body: [
            ...portableText([
              'Early voting is now open at your county clerk\'s office and runs through noon on May 4. Don\'t wait — vote early and make sure your voice counts.',
            ]).map((b, i) => ({...b, _key: `timer-primary-early-body-${i + 1}`})),
            ctaButton(
              'timer-primary-early-cta',
              'Find Your Voting Location',
              'https://indianavoters.in.gov/',
              'primary',
            ),
          ],
        },
        // Timer 3: Primary Election Day
        {
          _key: 'timer-primary-day',
          enabled: true,
          heading: 'Primary Election Day',
          targetDate: '2026-05-05T06:00:00-04:00',
          body: [
            ...portableText([
              'Polls are open from 6 AM to 6 PM local time. Bring your photo ID. If you\'re in line by 6 PM, you WILL get to vote. Every vote matters in a district race.',
            ]).map((b, i) => ({...b, _key: `timer-primary-day-body-${i + 1}`})),
            ctaButton(
              'timer-primary-day-cta',
              'Find Your Polling Place',
              'https://indianavoters.in.gov/',
              'primary',
            ),
          ],
        },
        // Timer 4: General Voter Registration Deadline
        {
          _key: 'timer-general-reg',
          enabled: true,
          heading: 'General Election Registration Deadline',
          targetDate: '2026-10-05T23:59:00-04:00',
          body: [
            ...portableText([
              'You must be registered by October 5 to vote in the November 3 general election. It takes 2 minutes online — check your registration now.',
            ]).map((b, i) => ({...b, _key: `timer-general-reg-body-${i + 1}`})),
            ctaButton(
              'timer-general-reg-cta',
              'Check Registration',
              'https://indianavoters.in.gov/',
              'primary',
            ),
          ],
        },
        // Timer 5: General Early Voting Opens
        {
          _key: 'timer-general-early',
          enabled: true,
          heading: 'General Election Early Voting Is Open',
          targetDate: '2026-10-06T06:00:00-04:00',
          body: [
            ...portableText([
              'Early voting is now open at your county clerk\'s office through noon on November 2. Don\'t wait until Election Day — vote early.',
            ]).map((b, i) => ({...b, _key: `timer-general-early-body-${i + 1}`})),
            ctaButton(
              'timer-general-early-cta',
              'Find Your Voting Location',
              'https://indianavoters.in.gov/',
              'primary',
            ),
          ],
        },
        // Timer 6: General Election Day (last timer — has expiredTitle/expiredBody)
        {
          _key: 'timer-general-day',
          enabled: true,
          heading: 'General Election Day',
          targetDate: '2026-11-03T06:00:00-05:00',
          body: [
            ...portableText([
              'Polls are open from 6 AM to 6 PM local time. Bring your photo ID. If you\'re in line by 6 PM, you WILL get to vote.',
            ]).map((b, i) => ({...b, _key: `timer-general-day-body-${i + 1}`})),
            ctaButton(
              'timer-general-day-cta',
              'Find Your Polling Place',
              'https://indianavoters.in.gov/',
              'primary',
            ),
          ],
          expiredTitle: 'Thank You for Voting',
          expiredBody: portableText([
            'Election Day is over. Thank you to everyone who voted, volunteered, and fought for a government that listens. Results will be posted as they come in.',
          ]).map((b, i) => ({...b, _key: `timer-expired-body-${i + 1}`})),
        },
      ],
    })
    .commit()

  console.log('siteSettings patched.')
}

// ---------------------------------------------------------------------------
// STEP 3 — Create Events
// ---------------------------------------------------------------------------

async function createEvents() {
  const tx = client.transaction()

  // --- UPCOMING EVENTS ---

  tx.createOrReplace({
    _id: 'event-property-rights-alliance-march-2026',
    _type: 'event',
    title: 'Property Rights Alliance Meeting',
    slug: {_type: 'slug', current: 'property-rights-alliance-march-2026'},
    startDate: '2026-03-05T18:00:00-05:00',
    endDate: '2026-03-05T20:00:00-05:00',
    location: 'The Schnitzelbank Restaurant, Jasper, IN',
    description:
      'Join us for the Property Rights Alliance monthly meeting at the Schnitzelbank in Jasper. Just come on in and tell them you\'re there for the PRA meeting. Open to all residents concerned about property rights, land use, and government accountability across Dubois County and District 48.',
    detailBody: portableText([
      'The Property Rights Alliance meets regularly to discuss issues affecting property owners across southwest Indiana — from the Mid-States Corridor to property tax policy to local land use decisions.',
      'Brad Hochgesang works closely with the PRA and has supported their efforts to protect property owners in Dubois County. All are welcome at this meeting.',
      'When you arrive at the Schnitzelbank, just come on in and let them know you\'re there for the PRA meeting. No RSVP required.',
    ]),
    eventCardLayout: 'stacked',
    eventImageOrientation: 'landscape',
    eventImageAspectRatio: '3:2',
    eventCardAnimation: 'fade-up',
    eventDescriptionPreviewChars: 2000,
    tags: ['property-rights', 'dubois-county', 'community'],
  })

  tx.createOrReplace({
    _id: 'event-dubois-county-council-rda-vote-march-2026',
    _type: 'event',
    title: 'Dubois County Council — RDA Withdrawal Vote',
    slug: {_type: 'slug', current: 'dubois-county-council-rda-vote-march-2026'},
    startDate: '2026-03-30T16:30:00-04:00',
    endDate: '2026-03-30T19:00:00-04:00',
    location: 'Dubois County Courthouse Annex, Jasper, IN',
    description:
      'The Dubois County Council is scheduled to hold a formal vote on whether to withdraw from the Mid-States Corridor Regional Development Authority. This follows months of public pressure, professional polling showing 81% opposition, and Brad\'s presentation of a withdrawal resolution at the February meeting. Public comment expected. Show up and be heard.',
    detailBody: portableText([
      'On February 23, 2026, Brad Hochgesang presented a resolution to the Dubois County Council requesting they withdraw from the Mid-States Corridor Regional Development Authority. The council deferred a formal vote to their regular March meeting.',
      'This follows months of organized opposition: eight town halls across Dubois County, a professional poll of 636 registered voters showing 81% oppose the project, a statewide poll showing 74% of Hoosiers want it canceled, and growing fiscal concerns from county commissioners about the project\'s cost burden.',
      'The March 30 meeting is expected to include public comment. If you care about property rights, transparent government, and how your tax dollars are spent, this is the meeting to attend.',
    ]),
    eventCardLayout: 'stacked',
    eventImageOrientation: 'landscape',
    eventImageAspectRatio: '3:2',
    eventCardAnimation: 'fade-up',
    eventDescriptionPreviewChars: 2000,
    tags: ['mid-states-corridor', 'dubois-county', 'county-council', 'accountability'],
  })

  // --- PAST EVENTS ---

  tx.createOrReplace({
    _id: 'event-town-hall-st-anthony-oct-2025',
    _type: 'event',
    title: 'Mid-States Corridor Town Hall — St. Anthony',
    slug: {_type: 'slug', current: 'town-hall-st-anthony-oct-2025'},
    startDate: '2025-10-13T19:00:00-04:00',
    endDate: '2025-10-13T20:30:00-04:00',
    location: 'St. Anthony Community Center, 4665 S. Cross St., St. Anthony, IN',
    description:
      'First of seven community town halls organized by Mid-States Update, Property Rights Alliance, and the Coalition Against the Mid-States Corridor. Residents heard updates on road access issues, tax implications, costs, and community impacts.',
    detailBody: portableText([
      'First of seven community town halls organized by Mid-States Update, Property Rights Alliance, and the Coalition Against the Mid-States Corridor. Residents heard updates on road access issues, tax implications, costs, and community impacts.',
    ]),
    eventCardLayout: 'stacked',
    eventImageOrientation: 'landscape',
    eventImageAspectRatio: '3:2',
    eventCardAnimation: 'fade-up',
    eventDescriptionPreviewChars: 2000,
    tags: ['mid-states-corridor', 'town-hall', 'st-anthony'],
  })

  tx.createOrReplace({
    _id: 'event-town-hall-celestine-oct-2025',
    _type: 'event',
    title: 'Mid-States Corridor Town Hall — Celestine',
    slug: {_type: 'slug', current: 'town-hall-celestine-oct-2025'},
    startDate: '2025-10-14T19:00:00-04:00',
    endDate: '2025-10-14T20:30:00-04:00',
    location: 'Celestine Community Club, 7742 E. Ellsworth Rd., Celestine, IN',
    description:
      'Community town hall with updates on the Mid-States Corridor\'s impact on Dubois County. Open Q&A followed the presentation.',
    detailBody: portableText([
      'Community town hall with updates on the Mid-States Corridor\'s impact on Dubois County. Open Q&A followed the presentation.',
    ]),
    eventCardLayout: 'stacked',
    eventImageOrientation: 'landscape',
    eventImageAspectRatio: '3:2',
    eventCardAnimation: 'fade-up',
    eventDescriptionPreviewChars: 2000,
    tags: ['mid-states-corridor', 'town-hall', 'celestine'],
  })

  tx.createOrReplace({
    _id: 'event-town-hall-holland-oct-2025',
    _type: 'event',
    title: 'Mid-States Corridor Town Hall — Holland',
    slug: {_type: 'slug', current: 'town-hall-holland-oct-2025'},
    startDate: '2025-10-15T19:00:00-04:00',
    endDate: '2025-10-15T20:30:00-04:00',
    location: 'Holland American Legion, 508 W. Main St., Holland, IN',
    description:
      'Community town hall focused on how the proposed four-lane highway would affect Holland and surrounding areas.',
    detailBody: portableText([
      'Community town hall focused on how the proposed four-lane highway would affect Holland and surrounding areas.',
    ]),
    eventCardLayout: 'stacked',
    eventImageOrientation: 'landscape',
    eventImageAspectRatio: '3:2',
    eventCardAnimation: 'fade-up',
    eventDescriptionPreviewChars: 2000,
    tags: ['mid-states-corridor', 'town-hall', 'holland'],
  })

  tx.createOrReplace({
    _id: 'event-town-hall-dubois-oct-2025',
    _type: 'event',
    title: 'Mid-States Corridor Town Hall — Dubois',
    slug: {_type: 'slug', current: 'town-hall-dubois-oct-2025'},
    startDate: '2025-10-16T19:00:00-04:00',
    endDate: '2025-10-16T20:30:00-04:00',
    location: 'Dubois Ruritan Park, 5430 E. Jasper Dubois Rd., Dubois, IN',
    description:
      'Community town hall at Ruritan Park covering tax implications, property impacts, and the proposed highway route through the Dubois area.',
    detailBody: portableText([
      'Community town hall at Ruritan Park covering tax implications, property impacts, and the proposed highway route through the Dubois area.',
    ]),
    eventCardLayout: 'stacked',
    eventImageOrientation: 'landscape',
    eventImageAspectRatio: '3:2',
    eventCardAnimation: 'fade-up',
    eventDescriptionPreviewChars: 2000,
    tags: ['mid-states-corridor', 'town-hall', 'dubois'],
  })

  tx.createOrReplace({
    _id: 'event-town-hall-jasper-outdoor-rec-oct-2025',
    _type: 'event',
    title: 'Mid-States Corridor Town Hall — Jasper',
    slug: {_type: 'slug', current: 'town-hall-jasper-outdoor-rec-oct-2025'},
    startDate: '2025-10-17T19:00:00-04:00',
    endDate: '2025-10-17T20:30:00-04:00',
    location: 'Jasper Outdoor Recreation Center, 559 W. 500 N., Jasper, IN',
    description:
      'Community town hall at the Jasper Outdoor Recreation Center. Updates on the Mid-States Corridor Tier 2 study, costs, and community impact.',
    detailBody: portableText([
      'Community town hall at the Jasper Outdoor Recreation Center. Updates on the Mid-States Corridor Tier 2 study, costs, and community impact.',
    ]),
    eventCardLayout: 'stacked',
    eventImageOrientation: 'landscape',
    eventImageAspectRatio: '3:2',
    eventCardAnimation: 'fade-up',
    eventDescriptionPreviewChars: 2000,
    tags: ['mid-states-corridor', 'town-hall', 'jasper'],
  })

  tx.createOrReplace({
    _id: 'event-town-hall-huntingburg-oct-2025',
    _type: 'event',
    title: 'Mid-States Corridor Town Hall — Huntingburg',
    slug: {_type: 'slug', current: 'town-hall-huntingburg-oct-2025'},
    startDate: '2025-10-20T19:00:00-04:00',
    endDate: '2025-10-20T20:30:00-04:00',
    location: 'Huntingburg Team Outback, 507 N. Main St., Huntingburg, IN',
    description:
      'Community town hall in Huntingburg covering the Mid-States Corridor\'s impact on local businesses, farms, and property values.',
    detailBody: portableText([
      'Community town hall in Huntingburg covering the Mid-States Corridor\'s impact on local businesses, farms, and property values.',
    ]),
    eventCardLayout: 'stacked',
    eventImageOrientation: 'landscape',
    eventImageAspectRatio: '3:2',
    eventCardAnimation: 'fade-up',
    eventDescriptionPreviewChars: 2000,
    tags: ['mid-states-corridor', 'town-hall', 'huntingburg'],
  })

  tx.createOrReplace({
    _id: 'event-town-hall-klubhaus-jasper-oct-2025',
    _type: 'event',
    title: 'Mid-States Corridor Town Hall — Jasper KlubHaus61',
    slug: {_type: 'slug', current: 'town-hall-klubhaus-jasper-oct-2025'},
    startDate: '2025-10-21T19:00:00-04:00',
    endDate: '2025-10-21T20:30:00-04:00',
    location: 'KlubHaus61, 2031 N. Newton St., Jasper, IN',
    description:
      'Final town hall in the October series. Local residents packed the venue to voice opposition to the proposed Mid-States Corridor.',
    detailBody: portableText([
      'Final town hall in the October series. Local residents packed the venue to voice opposition to the proposed Mid-States Corridor.',
    ]),
    eventCardLayout: 'stacked',
    eventImageOrientation: 'landscape',
    eventImageAspectRatio: '3:2',
    eventCardAnimation: 'fade-up',
    eventDescriptionPreviewChars: 2000,
    tags: ['mid-states-corridor', 'town-hall', 'jasper'],
  })

  tx.createOrReplace({
    _id: 'event-town-hall-ferdinand-nov-2025',
    _type: 'event',
    title: 'Mid-States Corridor Town Hall — Ferdinand',
    slug: {_type: 'slug', current: 'town-hall-ferdinand-nov-2025'},
    startDate: '2025-11-11T19:00:00-05:00',
    endDate: '2025-11-11T20:00:00-05:00',
    location: 'Ferdinand Community Center, Mobel Room, Ferdinand, IN',
    description:
      'Eighth community town hall. Updates on road access issues, tax implications, costs, and the proposed highway\'s impact on Dubois County communities. Doors opened at 6 PM, meeting at 7 PM.',
    detailBody: portableText([
      'Eighth community town hall. Updates on road access issues, tax implications, costs, and the proposed highway\'s impact on Dubois County communities. Doors opened at 6 PM, meeting at 7 PM.',
    ]),
    eventCardLayout: 'stacked',
    eventImageOrientation: 'landscape',
    eventImageAspectRatio: '3:2',
    eventCardAnimation: 'fade-up',
    eventDescriptionPreviewChars: 2000,
    tags: ['mid-states-corridor', 'town-hall', 'ferdinand'],
  })

  tx.createOrReplace({
    _id: 'event-poll-results-courthouse-steps-dec-2025',
    _type: 'event',
    title: 'Poll Results Press Conference — Dubois County Courthouse',
    slug: {_type: 'slug', current: 'poll-results-courthouse-steps-dec-2025'},
    startDate: '2025-12-22T12:15:00-05:00',
    endDate: '2025-12-22T13:00:00-05:00',
    location: 'Dubois County Courthouse Steps, 1 Courthouse Square, Jasper, IN',
    description:
      'Press conference announcing results of the first professional poll of Dubois County voters on the Mid-States Corridor. Phil Mundy (Jasper City Council President Pro Tempore), Chad Lueken, and Vince Helming joined Brad Hochgesang to present the findings: 81% oppose, 77% less likely to re-elect officials who support it.',
    detailBody: portableText([
      'Press conference announcing results of the first professional poll of Dubois County voters on the Mid-States Corridor. Phil Mundy (Jasper City Council President Pro Tempore), Chad Lueken, and Vince Helming joined Brad Hochgesang to present the findings: 81% oppose, 77% less likely to re-elect officials who support it.',
    ]),
    eventCardLayout: 'stacked',
    eventImageOrientation: 'landscape',
    eventImageAspectRatio: '3:2',
    eventCardAnimation: 'fade-up',
    eventDescriptionPreviewChars: 2000,
    tags: ['mid-states-corridor', 'poll-results', 'press-conference', 'jasper'],
  })

  tx.createOrReplace({
    _id: 'event-county-council-rda-withdrawal-feb-2026',
    _type: 'event',
    title: 'Dubois County Council — RDA Withdrawal Presentation',
    slug: {_type: 'slug', current: 'county-council-rda-withdrawal-feb-2026'},
    startDate: '2026-02-23T16:30:00-05:00',
    endDate: '2026-02-23T19:30:00-05:00',
    location: 'Dubois County Courthouse Annex, Jasper, IN',
    description:
      'Standing-room-only crowd as Brad Hochgesang presented a resolution to withdraw Dubois County from the Mid-States Corridor Regional Development Authority. Also announced results of a statewide poll: 74% of Indiana voters want the project canceled. Meeting lasted over 3 hours. Formal vote deferred to March 30.',
    detailBody: portableText([
      'Standing-room-only crowd as Brad Hochgesang presented a resolution to withdraw Dubois County from the Mid-States Corridor Regional Development Authority. Also announced results of a statewide poll: 74% of Indiana voters want the project canceled. Meeting lasted over 3 hours. Formal vote deferred to March 30.',
    ]),
    eventCardLayout: 'stacked',
    eventImageOrientation: 'landscape',
    eventImageAspectRatio: '3:2',
    eventCardAnimation: 'fade-up',
    eventDescriptionPreviewChars: 2000,
    tags: ['mid-states-corridor', 'county-council', 'rda-withdrawal', 'dubois-county'],
  })

  await tx.commit()
  console.log('Created 12 events.')
}

// ---------------------------------------------------------------------------
// STEP 4 — Create News Posts
// ---------------------------------------------------------------------------

async function createPosts() {
  const tx = client.transaction()

  tx.createOrReplace({
    _id: 'post-why-im-running-for-state-senate',
    _type: 'post',
    title: 'Why I\'m Running for State Senate',
    slug: {_type: 'slug', current: 'why-im-running-for-state-senate'},
    excerpt:
      'I didn\'t set out to run for office. But when 81% of Dubois County opposed a billion-dollar highway project and nobody in Indianapolis listened, I decided it was time to show up.',
    publishedAt: '2026-03-01T12:00:00-05:00',
    newsCardLayout: 'stacked',
    newsImageOrientation: 'landscape',
    newsImageAspectRatio: '3:2',
    newsCardAnimation: 'fade-up',
    newsBodyPreviewChars: 2000,
    tags: ['campaign announcement', "why I'm running", 'district 48'],
    body: portableText([
      'I moved back to Jasper in 2023. Within months, I learned a billion-dollar highway was being pushed through our county — and almost nobody knew about it. The more I dug, the worse it got: no real public input, manipulated polling, costs that didn\'t add up.',
      'So I did what I do. I pulled the data. I commissioned a real poll — 636 registered voters, conducted by Public Policy Polling. The result: 81% of Dubois County opposed the project. Not a slim margin. Not ambiguous. Eighty-one percent.',
      'I organized eight town halls across the county. I spoke at council meetings. I presented the numbers and asked for a vote.',
      'Somewhere along the way, I realized this wasn\'t just about one highway. It was about a pattern. Decisions being made without the people who live here. Representatives who stopped representing. A government that forgot who it works for.',
      'That\'s why I\'m running for Indiana State Senate, District 48. Not because I\'ve always wanted to be a politician — I haven\'t. Because the people of this district deserve someone who will do the homework, ask the hard questions, and fight for their answer. I intend to prove it.',
    ]),
  })

  tx.createOrReplace({
    _id: 'post-dubois-county-poll-results-81-percent-oppose',
    _type: 'post',
    title: '81% of Dubois County Opposes the Mid-States Corridor',
    slug: {_type: 'slug', current: 'dubois-county-poll-results-81-percent-oppose'},
    excerpt:
      'We commissioned a professional poll of 636 registered Dubois County voters. The results aren\'t ambiguous: 81% oppose the Mid-States Corridor, with 72% strongly opposing. 77% say they\'d be less likely to re-elect officials who support it.',
    publishedAt: '2025-12-22T17:00:00-05:00',
    newsCardLayout: 'stacked',
    newsImageOrientation: 'landscape',
    newsImageAspectRatio: '3:2',
    newsCardAnimation: 'fade-up',
    newsBodyPreviewChars: 2000,
    tags: ['mid-states-corridor', 'poll-results', 'dubois-county', 'data'],
    body: portableText([
      'On December 22, 2025, we stood on the steps of the Dubois County Courthouse and released the results of a professional poll that changed the conversation about the Mid-States Corridor.',
      'The poll was conducted December 16-17 by Public Policy Polling, surveying 636 registered Dubois County voters with a margin of error under 4 percent. The topline: 81% of voters oppose the Mid-States Corridor, with 72% strongly opposing. Only 14% support it.',
      'But the numbers went deeper. 77% said they\'d be less likely to re-elect an official who publicly supports the project — 67% said much less likely. 84% oppose using local tax dollars to maintain US-231 if responsibility shifts to local government. And 87% say local officials should clearly state where they stand.',
      'You don\'t make big decisions on gut feelings. You make them on data. This project is big, permanent, and it deserves public scrutiny.',
      'The poll was funded by donations from residents and members of the Property Rights Alliance and the Coalition Against the Mid-States Corridor. The opposition crosses party lines — strong among Republicans, Democrats, and Independents alike.',
      'Phil Mundy, Jasper City Council President Pro Tempore, said he\'d fielded hundreds — possibly thousands — of calls, texts, and conversations. He could count the supporters on one hand. The data confirmed what every kitchen table conversation in Dubois County has been saying.',
    ]),
  })

  tx.createOrReplace({
    _id: 'post-courthouse-steps-poll-announcement',
    _type: 'post',
    title: 'On the Courthouse Steps: Announcing What Dubois County Already Knew',
    slug: {_type: 'slug', current: 'courthouse-steps-poll-announcement'},
    excerpt:
      'Phil Mundy, Jasper City Council President Pro Tempore, joined us at the Dubois County Courthouse to present professional polling data. Jasper City Council members Chad Lueken and Vince Helming also stood with the community.',
    publishedAt: '2025-12-23T12:00:00-05:00',
    newsCardLayout: 'stacked',
    newsImageOrientation: 'landscape',
    newsImageAspectRatio: '3:2',
    newsCardAnimation: 'fade-up',
    newsBodyPreviewChars: 2000,
    tags: ['mid-states-corridor', 'press-conference', 'jasper', 'elected-officials'],
    body: portableText([
      'December 22, 2025, 12:15 PM. Dubois County Courthouse steps. Phil Mundy, President Pro Tempore of the Jasper Common Council, stepped up to present the results of an independent public opinion poll on the Mid-States Corridor.',
      'He was joined by Jasper City Council members Chad Lueken and Vince Helming, along with community members who\'d spent months organizing, fundraising, and demanding transparency.',
      'Mundy put it simply: in the last six to eight months, he\'d fielded hundreds — possibly thousands — of phone calls, text messages, and conversations. He could count the supporters of the project on one hand.',
      'For farmer Tom Bartelt, standing among the crowd, the stakes were personal. His family farm sits along the proposed route. Multiple generations built on that land, and he intends to pass it down.',
      'That\'s what this fight has always been about. Not politics. Families, farms, and the right of communities to have a say in what happens to the place they call home.',
    ]),
  })

  tx.createOrReplace({
    _id: 'post-eight-town-halls-one-message',
    _type: 'post',
    title: 'Eight Town Halls, One Message: We Don\'t Want This Highway',
    slug: {_type: 'slug', current: 'eight-town-halls-one-message'},
    excerpt:
      'From October 13 to November 11, 2025, we organized eight community town halls across Dubois County — St. Anthony, Celestine, Holland, Dubois, Jasper, Huntingburg, KlubHaus61, and Ferdinand. The message was the same everywhere.',
    publishedAt: '2025-11-12T12:00:00-05:00',
    newsCardLayout: 'stacked',
    newsImageOrientation: 'landscape',
    newsImageAspectRatio: '3:2',
    newsCardAnimation: 'fade-up',
    newsBodyPreviewChars: 2000,
    tags: ['mid-states-corridor', 'town-halls', 'dubois-county', 'community'],
    body: portableText([
      'Between October 13 and November 11, 2025, we held eight public town halls across Dubois County. Each one was hosted by Mid-States Update, the Property Rights Alliance, and the Coalition Against the Mid-States Corridor.',
      'The schedule covered every corner of the county: St. Anthony Community Center (Oct 13), Celestine Community Club (Oct 14), Holland American Legion (Oct 15), Dubois Ruritan Park (Oct 16), Jasper Outdoor Recreation Center (Oct 17), Huntingburg Team Outback (Oct 20), Jasper KlubHaus61 (Oct 21), and Ferdinand Community Center (Nov 11).',
      'At each meeting, residents heard updates about road access issues, tax implications, construction costs, and how the proposed highway would affect their communities. Every meeting included open Q&A.',
      'The KlubHaus61 meeting in Jasper was packed. At another session, attorney Russel Sipes answered questions from about 100 attendees who wanted to understand their legal rights.',
      'The message was the same in every community: this highway was being pushed through without real public input, at costs that don\'t add up, by an authority that most residents didn\'t even know existed.',
      'These weren\'t political rallies. They were community meetings — organized by neighbors, attended by families, driven by a simple belief: the people who live here should have a say in what happens here.',
    ]),
  })

  tx.createOrReplace({
    _id: 'post-dubois-county-council-speech-withdraw-from-rda',
    _type: 'post',
    title: 'My Speech to the Dubois County Council: Withdraw from the RDA',
    slug: {_type: 'slug', current: 'dubois-county-council-speech-withdraw-from-rda'},
    excerpt:
      'On February 23, I presented a resolution to the Dubois County Council requesting they withdraw from the Mid-States Corridor Regional Development Authority. The meeting lasted over three hours. A formal vote is now scheduled for March 30.',
    publishedAt: '2026-02-24T12:00:00-05:00',
    newsCardLayout: 'stacked',
    newsImageOrientation: 'landscape',
    newsImageAspectRatio: '3:2',
    newsCardAnimation: 'fade-up',
    newsBodyPreviewChars: 2000,
    tags: ['mid-states-corridor', 'county-council', 'rda-withdrawal', 'accountability'],
    body: portableText([
      'On February 23, 2026, I stood in front of the Dubois County Council in a standing-room-only chamber that stretched into the hallway and presented a resolution to withdraw Dubois County from the Mid-States Corridor Regional Development Authority.',
      'I came with data. The Dubois County poll: 81% opposition among 636 registered voters. A brand-new statewide poll of 554 Indiana voters: 74% want the project canceled, 41% strongly. Both conducted by Public Policy Polling with margins of error under 4 percent.',
      'I reminded the council what the RDA\'s own legal counsel said at the December meeting: there\'s \'virtually nothing left for the RDA to do.\' No revenue source. No taxing authority. In his own words, a \'paper tiger.\' So why does it still exist?',
      'The withdrawal process is straightforward. Indiana Code 36-7.6-2-5: adopt an ordinance, provide written notice to the RDA, have the RDA notify the Indiana Economic Development Corporation. I handed them the resolution and asked for a roll call vote.',
      'Council President Kluesner deferred to the regular March meeting. Councilman Doug Uebelhor tried to start a conversation, but no other members joined him.',
      'So I said what needed to be said: \'If you vote yes tonight, we can work together. We can fix real problems. We move on. If you don\'t, we\'re still here at every meeting. In every district talking to your voters. Not because we\'re vindictive, but because this is personal for us. This is about our homes. It\'s about our families. It\'s about our county and our quality of life. We\'re not going anywhere.\'',
      'A formal vote is now scheduled for March 30. Show up. Be heard.',
    ]),
  })

  tx.createOrReplace({
    _id: 'post-statewide-poll-74-percent-oppose',
    _type: 'post',
    title: 'Statewide Poll: 74% of Indiana Voters Want the Mid-States Corridor Canceled',
    slug: {_type: 'slug', current: 'statewide-poll-74-percent-oppose'},
    excerpt:
      'It\'s not just Dubois County. A statewide survey of 554 Indiana registered voters found 74% want the Mid-States Corridor canceled. 41% strongly oppose it. The opposition is statewide and bipartisan.',
    publishedAt: '2026-02-23T20:00:00-05:00',
    newsCardLayout: 'stacked',
    newsImageOrientation: 'landscape',
    newsImageAspectRatio: '3:2',
    newsCardAnimation: 'fade-up',
    newsBodyPreviewChars: 2000,
    tags: ['mid-states-corridor', 'statewide-poll', 'data', 'indiana'],
    body: portableText([
      'We always knew the opposition to the Mid-States Corridor ran deep in Dubois County. But we suspected it went further. So we commissioned a second poll — this time statewide.',
      'Public Policy Polling surveyed 554 registered Indiana voters. The results: 74% want the Mid-States Corridor canceled, with 41% strongly opposing. The margin of error was approximately 4 percent.',
      'I announced these results at the Dubois County Council meeting on February 23, alongside the Dubois County data. The combined picture is clear: opposition to this project isn\'t a local quirk. It\'s a statewide consensus.',
      'This data arrived as the Indiana legislature was considering an amendment to Senate Bill 27 that would create oversight of INDOT projects costing more than $250 million — directly inspired by the Mid-States Corridor controversy.',
      'Two polls. Nearly 1,200 respondents combined. Professional methodology. Bipartisan opposition. The data doesn\'t lie. The question is whether the people making decisions will listen to it.',
    ]),
  })

  tx.createOrReplace({
    _id: 'post-your-electric-bill-is-not-an-accident',
    _type: 'post',
    title: 'Your Electric Bill Is Not an Accident',
    slug: {_type: 'slug', current: 'your-electric-bill-is-not-an-accident'},
    excerpt:
      'Indiana residential electric bills jumped 17.5% in a single year — the steepest increase in two decades. CenterPoint Energy now charges the highest bills in the state. Here\'s what happened and what we can do about it.',
    publishedAt: '2026-02-28T12:00:00-05:00',
    newsCardLayout: 'stacked',
    newsImageOrientation: 'landscape',
    newsImageAspectRatio: '3:2',
    newsCardAnimation: 'fade-up',
    newsBodyPreviewChars: 2000,
    tags: ['utility costs', 'electric bills', 'centerpoint energy', 'district 48'],
    body: portableText([
      'If your electric bill has been climbing, you\'re not imagining it. Indiana residential rates jumped 17.5% in a single year — the steepest increase in two decades. And CenterPoint Energy, which serves most of District 48, now charges the highest residential electric bills in the entire state.',
      'Here\'s what happened: utilities spent over $500 million installing pollution controls on aging coal plants, then retired those same plants. Ratepayers are now repaying that investment — plus profit margins — for power stations generating zero watts. The IURC approved an $80 million annual revenue increase for CenterPoint in February 2025. Average residential bills rose about $44 per month.',
      'Meanwhile, the CenterPoint CEO earns approximately $18 million in total compensation. And 174,015 Indiana households were disconnected from electricity in a single year.',
      'Even Governor Braun — not exactly a consumer advocate — said in September 2025: \'We can\'t take it anymore.\' When the governor says rates are too high, you know it\'s bad.',
      'This is one of the core issues I\'ll fight for in the State Senate. Utility companies should not be allowed to charge ratepayers for investments in plants they then shut down. Executive compensation should be disclosed and scrutinized in every rate case. And our district — home to three of the nation\'s largest coal plants — deserves a real energy transition plan, not just corporate press releases.',
    ]),
  })

  tx.createOrReplace({
    _id: 'post-property-tax-relief-fine-print',
    _type: 'post',
    title: 'Property Tax Relief Sounds Great — Until You Read the Fine Print',
    slug: {_type: 'slug', current: 'property-tax-relief-fine-print'},
    excerpt:
      'Indiana\'s new property tax reform gives homeowners up to $300 in relief. But it also freezes local operating levies and could force rural communities to cut services or raise income taxes.',
    publishedAt: '2026-02-25T12:00:00-05:00',
    newsCardLayout: 'stacked',
    newsImageOrientation: 'landscape',
    newsImageAspectRatio: '3:2',
    newsCardAnimation: 'fade-up',
    newsBodyPreviewChars: 2000,
    tags: ['property taxes', 'SB 1', 'rural communities', 'district 48'],
    body: portableText([
      'Senate Enrolled Act 1, signed by Governor Braun in April 2025, promises $1.3 billion in homeowner property tax relief over three years. That includes a 10% credit up to $300 per homestead, an additional $150 for seniors, and adjusted agricultural land assessments that save farmers an estimated $116 million.',
      'On the surface, that sounds like good news. Senator Schmitt promoted it as a win for District 48. But here\'s what the press release doesn\'t mention: the law also freezes local operating levies in 2026 and caps future growth at 1-2%. For rural communities with small tax bases, that means service cuts.',
      'Worse, the bill authorizes cities over 3,500 to impose new local income taxes up to 1.2%. Rural officials across southern Indiana have warned that this effectively trades property tax relief for income tax increases and reduced local services.',
      'The stakes are especially high in Spencer County, where the Rockport coal plant\'s $7 million annual tax contribution disappears when the plant closes in 2028. And in Gibson County, where the Toyota TIF district expired in December 2025 after funding $45.7 million in community projects.',
      'I\'ll be clear about what good tax policy looks like: transparent, fair, and honest about trade-offs. Don\'t hand voters a $300 check and then gut the services their communities depend on. Do the homework. Ask the people. Fight for their answer.',
    ]),
  })

  tx.createOrReplace({
    _id: 'post-three-counties-zero-hospitals',
    _type: 'post',
    title: 'Three Counties, Zero Hospitals',
    slug: {_type: 'slug', current: 'three-counties-zero-hospitals'},
    excerpt:
      'Crawford, Pike, and Spencer counties have no hospital. Perry County lost its obstetric services. If you\'re having a baby or a heart attack in District 48, geography might determine the outcome.',
    publishedAt: '2026-02-22T12:00:00-05:00',
    newsCardLayout: 'stacked',
    newsImageOrientation: 'landscape',
    newsImageAspectRatio: '3:2',
    newsCardAnimation: 'fade-up',
    newsBodyPreviewChars: 2000,
    tags: ['healthcare', 'rural hospitals', 'district 48'],
    body: portableText([
      'Three of the six counties in District 48 — Crawford, Pike, and Spencer — have no hospital. Crawford County residents face a 45-minute drive to the nearest emergency room. Spencer County residents must cross into adjacent counties or into Kentucky for emergency care.',
      'Perry County Memorial Hospital in Tell City — a 25-bed critical access facility — stopped providing obstetric and delivery services at the end of 2023 after delivering only 38 babies that year. Expectant mothers now drive up to an hour. Statewide, 14 OB units have closed in five years, and Indiana ranks 7th nationally in infant mortality.',
      'In Gibson County, Deaconess Gibson Hospital in Princeton has a primary care provider ratio of 3,040 to 1 and a mental health provider ratio of 4,210 to 1 — roughly 3.5 times worse than the Indiana average.',
      'The federal picture is getting worse. New Medicaid work-reporting requirements threaten coverage losses for our most vulnerable residents. Indiana hospitals already absorb $2.7 billion annually in unpaid care, and the Indiana Hospital Association estimates up to 12 rural hospitals are at risk of closure.',
      'Healthcare access in rural Indiana isn\'t a political talking point — it\'s a matter of life and death. We need a state senator who will fight for rural hospital funding, telehealth expansion, and provider recruitment incentives. Our families shouldn\'t have to gamble on geography.',
    ]),
  })

  tx.createOrReplace({
    _id: 'post-gibson-county-lost-1-5-million',
    _type: 'post',
    title: 'Gibson County Lost $1.5 Million Because Someone Forgot to Sign a Form',
    slug: {_type: 'slug', current: 'gibson-county-lost-1-5-million'},
    excerpt:
      'Gibson County became the only Tri-State county denied an INDOT Community Crossings grant because final signatures were left blank. That\'s $2.6 million in road projects covering 18+ miles — gone.',
    publishedAt: '2026-02-19T12:00:00-05:00',
    newsCardLayout: 'stacked',
    newsImageOrientation: 'landscape',
    newsImageAspectRatio: '3:2',
    newsCardAnimation: 'fade-up',
    newsBodyPreviewChars: 2000,
    tags: ['infrastructure', 'gibson county', 'roads', 'accountability'],
    body: portableText([
      'In 2025, Gibson County became the only Tri-State county denied INDOT\'s Community Crossings Matching Grant — not because the projects weren\'t needed, but because the final signatures on the application were left blank.',
      'That clerical error cost the county $1.5 million in matching funds and $2.6 million in planned road projects covering more than 18 miles. Gibson County maintains 1,200 miles of roads — 300 of them unimproved — and 260 bridges, with roughly 40 employees.',
      'This is what happens when government doesn\'t do the basics. Nobody was held accountable. The roads still need fixing. And the residents of Gibson County are the ones who pay the price.',
      'Across District 48, the infrastructure picture is similar. Spencer County secured $5 million in INDOT grants but is still maintaining a former state highway the state transferred because it couldn\'t afford to keep it. Crawford County\'s hilly terrain makes every mile more expensive. Broadband is improving but still incomplete.',
      'Infrastructure isn\'t glamorous. But it\'s the foundation everything else depends on. You deserve leaders who don\'t drop the ball on the basics.',
    ]),
  })

  await tx.commit()
  console.log('Created 10 posts.')
}

// ---------------------------------------------------------------------------
// STEP 5 — Create About & Priorities
// ---------------------------------------------------------------------------

async function createAboutPriorities() {
  await client.createOrReplace({
    _id: 'aboutPriorities',
    _type: 'aboutPriorities',
    pageEyebrow: 'About & Priorities',
    pageTitle: 'Who Brad Is and What This Campaign Stands For',
    pageIntro:
      'A data-driven, constituent-first campaign for Indiana State Senate District 48. I\'m not asking for your trust — I\'m asking for the chance to earn it.',
    bioHeading: 'About Brad',
    bioBody: portableText([
      'I\'m Brad Hochgesang. I\'m 46, I live in Jasper with my wife Maggie, and I\'ve spent 15+ years as a software engineer and small business owner. I run a company called Ninja Mojo LLC. I\'m not a career politician — I\'m a neighbor who got mad enough to do something about it.',
      'In 2023, I learned a billion-dollar highway project — the Mid-States Corridor — was being pushed through Dubois County with almost no real public input. The polling behind it was suspicious. The costs didn\'t add up. So I did what I do for a living: I pulled the data.',
      'I commissioned two professional polls. The first, of 636 Dubois County registered voters, found 81% opposed the project. The second, a statewide survey, found 74% of Hoosiers opposed it. I organized 8 town halls, presented a withdrawal resolution to the county council, and spent two years holding officials accountable.',
      'That fight taught me something: the problem isn\'t one highway. It\'s a pattern. Decisions made without the people. Representatives who stopped representing. A government that forgot who it works for. That\'s why I\'m running — to bring the same data-driven, constituent-first approach to every issue that matters to District 48.',
    ]),
    valuesHeading: 'Campaign Values',
    values: [
      'Do the homework — every decision backed by data and evidence',
      'Ask the people — real public input, not rubber-stamp hearings',
      'Fight for their answer — represent constituents, not party bosses',
      'Transparency — if I can\'t explain it, I won\'t vote for it',
      'Accountability — track my votes, hold me to my word',
    ],
    prioritiesHeading: 'What I\'ll Fight For',
    priorities: [
      {
        _key: 'priority-property-taxes',
        title: 'Property Taxes & Government Spending',
        slug: {_type: 'slug', current: 'property-taxes'},
        summary:
          'Your taxes should fund your community — not billion-dollar boondoggles. I\'ll fight for transparent budgets and accountable spending.',
        body: portableText([
          'Indiana\'s new property tax reform — Senate Enrolled Act 1 — promises $1.3 billion in homeowner relief over three years. That sounds great until you read the fine print: it freezes local operating levies, caps future growth, and authorizes new local income taxes up to 1.2%.',
          'For rural communities with small tax bases, this could mean service cuts, school funding pressure, and a shell game where property tax relief gets replaced by income tax increases.',
          'I\'ll fight for tax policy that\'s transparent about trade-offs, protects rural services, and doesn\'t hand voters a $300 check while gutting the community institutions they depend on.',
        ]),
        links: [
          {
            _key: 'link-property-taxes-1',
            label: 'Read: Property Tax Fine Print',
            url: '/news/property-tax-relief-fine-print',
          },
        ],
      },
      {
        _key: 'priority-infrastructure',
        title: 'Infrastructure Done Right',
        slug: {_type: 'slug', current: 'infrastructure'},
        summary:
          'Our roads, bridges, and broadband need real investment — not political pet projects. Data should drive where every dollar goes.',
        body: portableText([
          'Gibson County lost $1.5 million in road funding because someone forgot to sign a form. Spencer County is maintaining a highway the state dumped on them. Crawford County\'s terrain makes every mile more expensive than the state formula accounts for.',
          'Broadband is improving — Crawford County went from zero residential fiber in 2019 to projected 79.6% coverage by 2027 — but gaps persist and the expiration of the federal Affordable Connectivity Program means low-income households now pay full price.',
          'I\'ll fight for infrastructure funding that reaches rural communities, accountability for grant applications, and broadband completion — not just press releases about deployment.',
        ]),
        links: [
          {
            _key: 'link-infrastructure-1',
            label: 'Read: Gibson County Lost $1.5M',
            url: '/news/gibson-county-lost-1-5-million',
          },
        ],
      },
      {
        _key: 'priority-housing',
        title: 'Housing Affordability',
        slug: {_type: 'slug', current: 'housing'},
        summary:
          'Young families can\'t stay if there\'s nowhere to live. We need smart housing policy that builds communities, not just developments.',
        body: portableText([
          'Pike County hadn\'t built a new single-family subdivision in Petersburg in over 35 years until the Meadows at Parkview project broke ground in 2024. Holiday World in Spencer County built its own employee housing because workers couldn\'t find places to live. Crawford County held its first-ever housing summit.',
          'Gibson County Council member Bill McConnell put it plainly: \'We don\'t need jobs — what we need is residents in this county.\' Many of the 7,000+ Toyota employees commute from outside Gibson County because housing and amenities are insufficient.',
          'Housing is both a cause and consequence of population decline. Every county except Dubois is losing people. I\'ll push for state-level tools that help rural communities build starter homes, reduce regulatory barriers, and attract families who want to put down roots.',
        ]),
        links: [],
      },
      {
        _key: 'priority-jobs',
        title: 'Jobs & Small Business',
        slug: {_type: 'slug', current: 'jobs'},
        summary:
          'I\'m a small business owner. I know what it takes. We need to keep young people here with real opportunity, not empty promises.',
        body: portableText([
          'I run Ninja Mojo LLC. I know what it\'s like to make payroll, navigate regulations, and compete for talent. Small businesses are the backbone of every community in District 48.',
          'But we\'re losing young people. All five non-Dubois counties are declining in population. Median ages are well above the state average. When young families leave, they take their spending, their energy, and their future with them.',
          'I\'ll fight for workforce training aligned with actual employer needs, reduced friction for small business permitting, and economic development that builds on what our communities already have — not imported mega-projects that benefit outside investors.',
        ]),
        links: [],
      },
      {
        _key: 'priority-accountability',
        title: 'Government Accountability & Transparency',
        slug: {_type: 'slug', current: 'accountability'},
        summary:
          '81% of Dubois County opposed the Mid-States Corridor. They built it anyway. That\'s why I\'m running. Accountability starts with showing up.',
        body: portableText([
          'I spent two years fighting the Mid-States Corridor — not because I had a personal stake, but because the process was broken. A billion-dollar project pushed through with manipulated polling, no real public input, and costs that didn\'t survive scrutiny.',
          'I commissioned two professional polls, organized eight town halls, and presented the results to the county council. The data was clear: the people didn\'t want this. But the process wasn\'t designed to listen.',
          'This isn\'t just about one highway. It\'s about how government works — or doesn\'t — in Indiana. I\'ll publish my votes, explain my reasoning, and hold regular town halls in every county. Accountability isn\'t a slogan — it\'s a practice.',
        ]),
        links: [],
      },
      {
        _key: 'priority-utilities',
        title: 'Utility Costs',
        slug: {_type: 'slug', current: 'utilities'},
        summary:
          'Indiana has the steepest electric rate increases in the country. Utility CEOs earn $18 million while 174,000 households get disconnected. That stops.',
        body: portableText([
          'Indiana residential electric bills jumped 17.5% in a single year. CenterPoint Energy, which serves most of District 48, now charges the highest residential bills in the state. After the IURC approved an $80 million annual revenue increase, average bills rose about $44 per month.',
          'Three of the nation\'s largest coal plants sit in our district: Gibson Generating Station, Rockport in Spencer County, and Petersburg in Pike County. Workers face job losses while ratepayers foot the bill for coal-to-gas conversions.',
          'I\'ll fight for real utility rate oversight, mandatory disclosure of executive compensation in every rate case, a genuine workforce transition plan for energy workers, and consumer protections that prevent utilities from charging ratepayers for dead investments.',
        ]),
        links: [
          {
            _key: 'link-utilities-1',
            label: 'Read: Your Electric Bill Is Not an Accident',
            url: '/news/your-electric-bill-is-not-an-accident',
          },
        ],
      },
    ],
    ctaHeading: 'Ready to help?',
    ctaCopy:
      'This campaign runs on people, not PACs. Every dollar and every door knock makes a difference.',
    primaryCtaLabel: 'Donate',
    primaryCtaUrl: 'https://secure.actblue.com/donate/brad-hochgesang-1',
    secondaryCtaLabel: 'Volunteer',
    secondaryCtaUrl: 'https://www.ngpvan.com/',
  })

  console.log('Created aboutPriorities.')
}

// ---------------------------------------------------------------------------
// STEP 6 — Update fundraisingLink
// ---------------------------------------------------------------------------

async function upsertFundraisingLink() {
  await client.createOrReplace({
    _id: 'fund-actblue-main',
    _type: 'fundraisingLink',
    title: 'Donate to Citizens For Hochgesang',
    url: 'https://secure.actblue.com/donate/brad-hochgesang-1',
    description:
      'Every dollar funds voter outreach, field organizing, and campaign events across District 48\'s six counties. This campaign runs on people, not PACs. Your contribution — any amount — helps us knock more doors, organize more town halls, and fight for the issues that matter to southwest Indiana.',
    priority: 100,
  })

  console.log('Updated fundraisingLink.')
}

// ---------------------------------------------------------------------------
// STEP 7 — Create Media Links
// ---------------------------------------------------------------------------

async function createMediaLinks() {
  const tx = client.transaction()

  tx.createOrReplace({
    _id: 'media-facebook-campaign',
    _type: 'mediaLink',
    title: 'Citizens For Hochgesang on Facebook',
    mediaType: 'facebook',
    url: 'https://www.facebook.com/bradhochesangforindianastatesenate',
    publishedAt: '2026-03-01T12:00:00-05:00',
  })

  tx.createOrReplace({
    _id: 'media-youtube-channel',
    _type: 'mediaLink',
    title: 'Campaign YouTube Channel',
    mediaType: 'youtube',
    url: 'https://www.youtube.com/',
    publishedAt: '2026-03-01T12:00:00-05:00',
  })

  tx.createOrReplace({
    _id: 'media-wfie-town-hall-oct-2025',
    _type: 'mediaLink',
    title: 'WFIE: Town Hall Meetings Against Mid-States Corridor Start Monday Night',
    mediaType: 'other',
    url: 'https://www.14news.com/2025/10/13/town-hall-meetings-against-mid-states-corridor-plan-start-monday-night/',
    publishedAt: '2025-10-13T15:00:00-05:00',
  })

  tx.createOrReplace({
    _id: 'media-wfie-poll-results-dec-2025',
    _type: 'mediaLink',
    title: 'WFIE: Jasper Leaders Share Results of Independent Poll on Mid-States Corridor',
    mediaType: 'other',
    url: 'https://www.14news.com/2025/12/22/jasper-leaders-share-results-independent-poll-regarding-mid-states-corridor/',
    publishedAt: '2025-12-22T12:00:00-05:00',
  })

  tx.createOrReplace({
    _id: 'media-wjts-poll-results-dec-2025',
    _type: 'mediaLink',
    title: '18 WJTS: Mid-States Corridor Public Interest Poll Results Announced',
    mediaType: 'other',
    url: 'https://wjts.tv/2025/12/mid-states-corridor-public-interest-poll-results-announced/',
    publishedAt: '2025-12-23T12:00:00-05:00',
  })

  tx.createOrReplace({
    _id: 'media-dcfp-poll-opposition-dec-2025',
    _type: 'mediaLink',
    title: 'Dubois County Free Press: Poll Results and Jasper Council Members Announce Opposition',
    mediaType: 'other',
    url: 'https://duboiscountyfreepress.com/jasper-councilmembers-announce-opposition-to-mid-states-corridor-in-light-of-new-poll/',
    publishedAt: '2025-12-23T12:00:00-05:00',
  })

  tx.createOrReplace({
    _id: 'media-dcfp-county-council-rda-feb-2026',
    _type: 'mediaLink',
    title: 'Dubois County Free Press: County Council Hears Opponents, Asked to Leave RDA',
    mediaType: 'other',
    url: 'https://duboiscountyfreepress.com/dubois-county-council-hears-from-opponents-to-the-corridor-asked-to-leave-rda/',
    publishedAt: '2026-02-25T12:00:00-05:00',
  })

  tx.createOrReplace({
    _id: 'media-wfie-msc-update-feb-2026',
    _type: 'mediaLink',
    title: 'WFIE: Update Monday Night on Mid-States Corridor Project',
    mediaType: 'other',
    url: 'https://www.14news.com/2026/02/23/update-monday-night-mid-states-corridor-project/',
    publishedAt: '2026-02-23T22:00:00-05:00',
  })

  tx.createOrReplace({
    _id: 'media-dch-rda-defends-role-jan-2026',
    _type: 'mediaLink',
    title: 'Dubois County Herald: Mid-States Corridor RDA Defends Role',
    mediaType: 'other',
    url: 'https://www.duboiscountyherald.com/news/local/mid-states-corridor-rda-defends-role-in-efforts-to-county-council/article_1a6cc9e4-647a-51a8-8b5e-9a018432fc3a.html',
    publishedAt: '2026-01-06T12:00:00-05:00',
  })

  tx.createOrReplace({
    _id: 'media-dcfp-pra-urges-withdrawal-dec-2025',
    _type: 'mediaLink',
    title: 'Dubois County Free Press: Property Rights Alliance Urges RDA Withdrawal',
    mediaType: 'other',
    url: 'https://duboiscountyfreepress.com/property-rights-alliance-urges-dubois-county-to-withdraw-from-mid-states-corridor-regional-development-authority/',
    publishedAt: '2025-12-16T12:00:00-05:00',
  })

  await tx.commit()
  console.log('Created 10 media links.')
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log(`\nRunning production content seed on: ${PROJECT_ID}/${DATASET}\n`)

  await deleteAllSeedDocuments()
  await patchSiteSettings()
  await createEvents()
  await createPosts()
  await createAboutPriorities()
  await upsertFundraisingLink()
  await createMediaLinks()

  console.log('\nAll production content seeded successfully.')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
