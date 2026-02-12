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
  campaignLogoAlt: 'Brad Hochgesang for State Senate campaign logo',
  homeHeroLayout: 'clean-split',
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
