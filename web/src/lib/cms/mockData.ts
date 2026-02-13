import {
  type CampaignEvent,
  type FundraisingLink,
  type MediaLink,
  type PostDetail,
  type SiteSettings,
} from './types'

export const mockSiteSettings: SiteSettings = {
  siteTitle: 'Citizens For Hochgesang',
  tagline: 'Practical leadership for Indiana State Senate District 48.',
  homeDistrictLabel: 'Indiana State Senate District 48',
  homeHeroSummary: 'Practical leadership for Indiana State Senate District 48.',
  homeLinkMarkup:
    '<span class="home-link-line">Brad Hochgesang</span><span class="home-link-line">For State Senate</span>',
  campaignLogoAlt: 'Brad Hochgesang for State Senate campaign logo',
  candidatePortraitCaption: 'Listening to neighbors and building practical solutions for District 48.',
  homeHeroLayout: 'clean-split',
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
  donateUrl: 'https://secure.actblue.com/donate/brad-hochgesang-1',
  volunteerUrl: 'https://www.ngpvan.com/',
  contactEmail: 'team@citizensforhochgesang.com',
  socialLinks: [
    {label: 'Facebook', url: 'https://www.facebook.com/bradhochesangforindianastatesenate'},
    {label: 'YouTube', url: 'https://www.youtube.com/'},
  ],
}

export const mockPosts: PostDetail[] = [
  {
    title: 'Launching an AI-First Campaign for District 48',
    slug: 'launching-an-ai-first-campaign',
    excerpt:
      'How we are using practical automation to communicate clearly, respond faster, and stay focused on local priorities.',
    publishedAt: '2026-02-10T12:00:00.000Z',
    coverImageUrl: '/news-samples/landscape-16x9.svg',
    bodyPreview:
      'This campaign is built on direct community engagement and modern tools. We use AI to accelerate drafting, content operations, and issue research while keeping people in control of every public message. Residents can quickly review where we stand, what we are hearing, and what policy actions we are prioritizing next.',
    newsCardLayout: 'feature-split',
    newsImageOrientation: 'landscape',
    newsImageAspectRatio: '16:9',
    newsCardAnimation: 'fade-up',
    newsBodyPreviewChars: 460,
    tags: ['campaign', 'technology'],
    body: [
      {
        _type: 'block',
        children: [
          {
            _type: 'span',
            text: 'This campaign is built on direct community engagement and modern tools.',
          },
        ],
      },
    ],
    storyTimeline: [
      {
        _type: 'storyScene',
        sceneTitle: 'Technology in service of people',
        layout: 'highlight',
        animationPreset: 'fade-up',
        animationDelayMs: 0,
        animationDurationMs: 760,
        body: [
          {
            _type: 'block',
            children: [
              {
                _type: 'span',
                text: 'We use AI to accelerate drafting, content operations, and issue research while keeping people in control of every public message.',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    title: 'Public Safety and Infrastructure Listening Tour',
    slug: 'public-safety-and-infrastructure-listening-tour',
    excerpt:
      'A district-wide effort to gather local concerns about roads, emergency response, and neighborhood safety.',
    publishedAt: '2026-02-08T16:00:00.000Z',
    coverImageUrl: '/news-samples/portrait-4x5.svg',
    bodyPreview:
      'Residents have shared practical ideas on traffic flow, road maintenance, and response times. We are collecting neighborhood-level feedback, identifying recurring safety themes, and publishing clear next-step priorities after each stop so supporters and undecided voters alike can follow progress without guesswork.',
    newsCardLayout: 'image-left',
    newsImageOrientation: 'portrait',
    newsImageAspectRatio: '4:5',
    newsCardAnimation: 'slide-left',
    newsBodyPreviewChars: 420,
    tags: ['public safety', 'infrastructure'],
    body: [
      {
        _type: 'block',
        children: [
          {
            _type: 'span',
            text: 'Residents have shared practical ideas on traffic flow, road maintenance, and response times.',
          },
        ],
      },
      {
        _type: 'block',
        children: [
          {
            _type: 'span',
            text: 'These comments are shaping our legislative priorities.',
          },
        ],
      },
    ],
  },
  {
    title: 'Economic Growth Through Small Business Support',
    slug: 'economic-growth-through-small-business-support',
    excerpt:
      'Policy priorities to reduce red tape, support local employers, and keep investment in District 48.',
    publishedAt: '2026-02-05T18:00:00.000Z',
    coverImageUrl: '/news-samples/landscape-3x2.svg',
    bodyPreview:
      'Small businesses are the engine of local growth. Our plan focuses on permitting improvements, workforce partnerships, and predictable state policy. We are also gathering concrete examples from district employers to prioritize legislation that reduces delays while improving hiring pathways for students and workers.',
    newsCardLayout: 'image-right',
    newsImageOrientation: 'landscape',
    newsImageAspectRatio: '3:2',
    newsCardAnimation: 'slide-right',
    newsBodyPreviewChars: 440,
    tags: ['economy', 'small business'],
    body: [
      {
        _type: 'block',
        children: [
          {
            _type: 'span',
            text: 'Small businesses are the engine of local growth.',
          },
        ],
      },
      {
        _type: 'block',
        children: [
          {
            _type: 'span',
            text: 'Our plan focuses on permitting improvements, workforce partnerships, and predictable state policy.',
          },
        ],
      },
    ],
  },
  {
    title: 'Education Roundtable Highlights from District Families',
    slug: 'education-roundtable-highlights',
    excerpt:
      'Parents, teachers, and students shared practical priorities around classroom focus, career pathways, and school support resources.',
    publishedAt: '2026-02-04T17:00:00.000Z',
    coverImageUrl: '/news-samples/portrait-9x16.svg',
    bodyPreview:
      'Family conversations highlighted a consistent theme: schools need stronger support systems and clearer career pathways. Participants requested practical collaboration between classrooms, local employers, and technical programs so graduates can move confidently into college or skilled work opportunities.',
    newsCardLayout: 'stacked',
    newsImageOrientation: 'portrait',
    newsImageAspectRatio: '9:16',
    newsCardAnimation: 'slide-up',
    newsBodyPreviewChars: 420,
    tags: ['education', 'families'],
    body: [
      {
        _type: 'block',
        children: [
          {
            _type: 'span',
            text: 'Family conversations highlighted a consistent theme: schools need stronger support systems and clearer career pathways.',
          },
        ],
      },
      {
        _type: 'block',
        children: [
          {
            _type: 'span',
            text: 'Participants requested practical collaboration between classrooms, local employers, and technical programs.',
          },
        ],
      },
    ],
  },
  {
    title: 'Volunteer Spotlight: Neighborhood Outreach Weekend',
    slug: 'volunteer-spotlight-neighborhood-outreach',
    excerpt:
      'Supporters coordinated canvassing, voter check-ins, and event signups across key neighborhoods in District 48.',
    publishedAt: '2026-02-03T19:00:00.000Z',
    coverImageUrl: '/news-samples/square-1x1.svg',
    bodyPreview:
      'Volunteer teams helped deliver campaign materials, shared event details, and answered questions from new voters. The outreach weekend reinforced that consistent neighborhood conversations are the best way to align campaign priorities with day-to-day concerns across Jeffersonville and surrounding communities.',
    newsCardLayout: 'image-left',
    newsImageOrientation: 'landscape',
    newsImageAspectRatio: '1:1',
    newsCardAnimation: 'none',
    newsBodyPreviewChars: 430,
    tags: ['volunteer', 'community'],
    body: [
      {
        _type: 'block',
        children: [
          {
            _type: 'span',
            text: 'Volunteer teams helped deliver campaign materials, shared event details, and answered questions from new voters.',
          },
        ],
      },
      {
        _type: 'block',
        children: [
          {
            _type: 'span',
            text: 'The outreach weekend reinforced that consistent neighborhood conversations are the best way to align campaign priorities with day-to-day concerns.',
          },
        ],
      },
    ],
  },
]

export const mockEvents: CampaignEvent[] = [
  {
    id: 'event-town-hall-1',
    title: 'District 48 Community Town Hall',
    startDate: '2026-02-20T23:00:00.000Z',
    location: 'Jeffersonville Public Library',
    description: 'Open Q&A focused on local transportation, schools, and small business policy.',
    rsvpLink: '/support',
  },
  {
    id: 'event-meet-and-greet-1',
    title: 'Coffee and Conversation',
    startDate: '2026-02-24T14:30:00.000Z',
    location: 'Charlestown Civic Center',
    description: 'Informal meet-and-greet with campaign volunteers and supporters.',
  },
]

export const mockMediaLinks: MediaLink[] = [
  {
    id: 'media-youtube-1',
    title: 'Campaign Kickoff Address',
    mediaType: 'youtube',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    publishedAt: '2026-02-09T19:00:00.000Z',
  },
  {
    id: 'media-facebook-1',
    title: 'Volunteer Update on Facebook',
    mediaType: 'facebook',
    url: 'https://www.facebook.com/',
    publishedAt: '2026-02-07T20:00:00.000Z',
  },
]

export const mockFundraisingLinks: FundraisingLink[] = [
  {
    id: 'fund-actblue-main',
    title: 'Donate with ActBlue',
    url: 'https://secure.actblue.com/donate/brad-hochgesang-1',
    description: 'Secure online contribution for campaign operations and voter outreach.',
    priority: 100,
  },
]
