import {defineField, defineType} from 'sanity'

const iconOptions = [
  {title: 'Balance Scale (policy, justice)', value: 'balance-scale'},
  {title: 'Bicycle (transportation)', value: 'bicycle'},
  {title: 'Book (education)', value: 'book'},
  {title: 'Book Open (curriculum)', value: 'book-open'},
  {title: 'Briefcase (jobs)', value: 'briefcase'},
  {title: 'Bullhorn', value: 'bullhorn'},
  {title: 'Bullseye (priorities)', value: 'bullseye'},
  {title: 'Bus (transit)', value: 'bus'},
  {title: 'Calendar', value: 'calendar'},
  {title: 'Calendar Check (scheduled)', value: 'calendar-check'},
  {title: 'Camera (media)', value: 'camera'},
  {title: 'Chart Bar (metrics)', value: 'chart-bar'},
  {title: 'Chart Line (growth)', value: 'chart-line'},
  {title: 'Chart Pie (budget)', value: 'chart-pie'},
  {title: 'Check Circle (approved)', value: 'check-circle'},
  {title: 'Chalkboard Teacher (schools)', value: 'chalkboard-teacher'},
  {title: 'Clipboard Check (accountability)', value: 'clipboard-check'},
  {title: 'Clock (timelines)', value: 'clock'},
  {title: 'Cloud Sun (energy/weather)', value: 'cloud-sun'},
  {title: 'Coins (funding)', value: 'coins'},
  {title: 'Comment Dots (community input)', value: 'comment-dots'},
  {title: 'Comments (conversation)', value: 'comments'},
  {title: 'Dollar Sign (economy)', value: 'dollar-sign'},
  {title: 'Donate (contribute)', value: 'donate'},
  {title: 'Envelope (contact)', value: 'envelope'},
  {title: 'Exclamation Triangle (alert)', value: 'exclamation-triangle'},
  {title: 'File Alt (documents)', value: 'file-alt'},
  {title: 'Flag (district, civic)', value: 'flag'},
  {title: 'Gavel (legislation)', value: 'gavel'},
  {title: 'Globe Americas (global, trade)', value: 'globe-americas'},
  {title: 'Graduation Cap (higher ed)', value: 'graduation-cap'},
  {title: 'Hammer (construction)', value: 'hammer'},
  {title: 'Hand Holding Heart (care)', value: 'hand-holding-heart'},
  {title: 'Hands Helping', value: 'hands-helping'},
  {title: 'Handshake (partnership)', value: 'handshake'},
  {title: 'Hard Hat (infrastructure)', value: 'hard-hat'},
  {title: 'Heartbeat (health)', value: 'heartbeat'},
  {title: 'Home (housing)', value: 'home'},
  {title: 'Hospital (healthcare)', value: 'hospital'},
  {title: 'Image (gallery)', value: 'image'},
  {title: 'Info Circle (information)', value: 'info-circle'},
  {title: 'Landmark (government)', value: 'landmark'},
  {title: 'Laptop (technology)', value: 'laptop'},
  {title: 'Leaf (environment)', value: 'leaf'},
  {title: 'Lightbulb (ideas)', value: 'lightbulb'},
  {title: 'Map Marker Alt (location)', value: 'map-marker-alt'},
  {title: 'Map Marked Alt (district map)', value: 'map-marked-alt'},
  {title: 'Microphone (speech)', value: 'microphone'},
  {title: 'Newspaper', value: 'newspaper'},
  {title: 'Paw (animal welfare)', value: 'paw'},
  {title: 'Phone (call)', value: 'phone'},
  {title: 'Piggy Bank (savings)', value: 'piggy-bank'},
  {title: 'Play Circle (video play)', value: 'play-circle'},
  {title: 'Podcast (audio)', value: 'podcast'},
  {title: 'Question Circle', value: 'question-circle'},
  {title: 'Receipt (expenses)', value: 'receipt'},
  {title: 'Recycle (sustainability)', value: 'recycle'},
  {title: 'Newspaper (Outline)', value: 'reg-newspaper'},
  {title: 'Road (transport)', value: 'road'},
  {title: 'Route (planning)', value: 'route'},
  {title: 'School (K-12)', value: 'school'},
  {title: 'Shield Alt (public safety)', value: 'shield-alt'},
  {title: 'Solar Panel (clean energy)', value: 'solar-panel'},
  {title: 'Store (small business)', value: 'store'},
  {title: 'Tools (maintenance)', value: 'tools'},
  {title: 'Tree (parks)', value: 'tree'},
  {title: 'Video', value: 'video'},
  {title: 'Vote Yea', value: 'vote-yea'},
  {title: 'Walking (pedestrian)', value: 'walking'},
  {title: 'Water (utilities)', value: 'water'},
  {title: 'Wifi (internet access)', value: 'wifi'},
  {title: 'Wrench (repairs)', value: 'wrench'},
  {title: 'User Friends (families)', value: 'user-friends'},
  {title: 'User Graduate (students)', value: 'user-graduate'},
  {title: 'Users (community)', value: 'users'},
]

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  groups: [
    {name: 'header', title: 'Header', default: true},
    {name: 'navigation', title: 'Navigation'},
    {name: 'pages', title: 'Page Visibility'},
    {name: 'hero', title: 'Home Hero'},
    {name: 'homeCards', title: 'Home Cards'},
    {name: 'campaignMeta', title: 'Campaign Meta'},
    {name: 'contact', title: 'Contact & Social'},
  ],
  fields: [
    defineField({
      name: 'siteTitle',
      title: 'Site Title',
      type: 'string',
      group: ['header', 'hero', 'campaignMeta'],
      validation: (Rule) => Rule.required().max(120),
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      group: ['hero', 'campaignMeta'],
      validation: (Rule) => Rule.max(160),
    }),
    defineField({
      name: 'homeLinkMarkup',
      title: 'Header Home Link Markup (HTML)',
      type: 'text',
      group: 'header',
      rows: 6,
      initialValue:
        '<span class="home-link-line">Brad Hochgesang</span><span class="home-link-line">For State Senate</span>',
      description:
        'Raw HTML for the clickable header lockup. Use simple tags like span, br, strong, and em.',
      validation: (Rule) => Rule.required().max(2000),
    }),
    defineField({
      name: 'headerNavItems',
      title: 'Header Navigation Items',
      type: 'array',
      group: 'navigation',
      description: 'Controls top navigation labels, links, and icons.',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              validation: (Rule) => Rule.required().max(40),
            }),
            defineField({
              name: 'href',
              title: 'Href',
              type: 'string',
              validation: (Rule) => Rule.required().custom((value) => {
                if (!value) {
                  return 'Href is required'
                }

                return value.startsWith('/') || value.startsWith('http')
                  ? true
                  : 'Use an internal path (/news) or full URL (https://...)'
              }),
            }),
            defineField({
              name: 'icon',
              title: 'Icon',
              type: 'string',
              options: {
                list: iconOptions,
                layout: 'dropdown',
              },
              initialValue: 'newspaper',
            }),
          ],
          preview: {
            select: {
              title: 'label',
              subtitle: 'href',
            },
          },
        },
      ],
    }),
    defineField({
      name: 'pageVisibility',
      title: 'Page Visibility',
      type: 'object',
      group: 'pages',
      description:
        'Enable or disable each page section. Disabled pages return 404 and are hidden from navigation. Home page is always visible.',
      fields: [
        defineField({
          name: 'news',
          title: 'News',
          type: 'boolean',
          initialValue: false,
          description: 'Show the /news page and all individual news articles.',
        }),
        defineField({
          name: 'events',
          title: 'Events',
          type: 'boolean',
          initialValue: false,
          description: 'Show the /events page and event detail pages.',
        }),
        defineField({
          name: 'faq',
          title: 'FAQ',
          type: 'boolean',
          initialValue: false,
          description: 'Show the /faq page.',
        }),
        defineField({
          name: 'platform',
          title: 'About & Priorities',
          type: 'boolean',
          initialValue: false,
          description: 'Show the /platform page and priority detail pages.',
        }),
        defineField({
          name: 'media',
          title: 'Media & Press',
          type: 'boolean',
          initialValue: false,
          description: 'Show the /media page.',
        }),
        defineField({
          name: 'support',
          title: 'Support',
          type: 'boolean',
          initialValue: false,
          description: 'Show the /support page.',
        }),
      ],
    }),
    defineField({
      name: 'campaignLogo',
      title: 'Campaign Logo',
      type: 'image',
      group: ['header', 'campaignMeta'],
      options: {hotspot: true},
      description: 'Upload the full-size primary campaign logo.',
    }),
    defineField({
      name: 'headerLogoSmall',
      title: 'Header Logo (Small Optimized)',
      type: 'image',
      group: 'header',
      options: {hotspot: true},
      description:
        'Optional optimized small-format logo for the header circle. If empty, the main campaign logo is used.',
    }),
    defineField({
      name: 'campaignLogoAlt',
      title: 'Campaign Logo Alt Text',
      type: 'string',
      group: ['header', 'campaignMeta'],
      validation: (Rule) => Rule.max(160),
    }),
    defineField({
      name: 'candidatePortrait',
      title: 'Candidate Portrait (Hero)',
      type: 'image',
      group: 'hero',
      options: {hotspot: true},
      description: 'Primary homepage portrait image. Recommended portrait orientation (4:5).',
    }),
    defineField({
      name: 'candidatePortraitAlt',
      title: 'Candidate Portrait Alt Text',
      type: 'string',
      group: 'hero',
      validation: (Rule) => Rule.max(160),
    }),
    defineField({
      name: 'candidatePortraitCaption',
      title: 'Candidate Portrait Caption',
      type: 'string',
      group: 'hero',
      validation: (Rule) => Rule.max(180),
    }),
    defineField({
      name: 'homeHeroLayout',
      title: 'Home Hero Layout',
      type: 'string',
      group: 'hero',
      initialValue: 'clean-split',
      options: {
        list: [
          {title: 'Clean Split (Text Left, Portrait Right)', value: 'clean-split'},
          {title: 'Portrait Left (Text Right)', value: 'portrait-left'},
          {title: 'Immersive Overlay (Text on Portrait)', value: 'immersive-overlay'},
        ],
        layout: 'radio',
        direction: 'vertical',
      },
      description: 'Controls the visual composition of the homepage hero section.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'homeDistrictLabel',
      title: 'Home Hero District Label',
      type: 'string',
      group: 'hero',
      initialValue: 'Indiana State Senate District 48',
      validation: (Rule) => Rule.max(120),
    }),
    defineField({
      name: 'homeHeroSummary',
      title: 'Home Hero Summary',
      type: 'text',
      group: 'hero',
      rows: 3,
      description: 'Optional paragraph shown under the hero title/tagline.',
      validation: (Rule) => Rule.max(280),
    }),
    defineField({
      name: 'homeHeroActions',
      title: 'Home Hero Actions',
      type: 'array',
      group: 'hero',
      description: 'Buttons near the hero title/photo.',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              validation: (Rule) => Rule.required().max(40),
            }),
            defineField({
              name: 'url',
              title: 'URL',
              type: 'string',
              validation: (Rule) => Rule.required().custom((value) => {
                if (!value) {
                  return 'URL is required'
                }

                return value.startsWith('/') || value.startsWith('http')
                  ? true
                  : 'Use an internal path (/support) or full URL (https://...)'
              }),
            }),
            defineField({
              name: 'icon',
              title: 'Icon',
              type: 'string',
              options: {
                list: iconOptions,
                layout: 'dropdown',
              },
              initialValue: 'vote-yea',
            }),
            defineField({
              name: 'style',
              title: 'Style',
              type: 'string',
              options: {
                list: [
                  {title: 'Primary', value: 'primary'},
                  {title: 'Outline', value: 'outline'},
                  {title: 'Accent', value: 'accent'},
                ],
                layout: 'radio',
              },
              initialValue: 'primary',
            }),
          ],
          preview: {
            select: {
              title: 'label',
              subtitle: 'url',
            },
          },
        },
      ],
    }),
    defineField({
      name: 'homeHeroBadges',
      title: 'Home Hero Bubbles',
      type: 'array',
      group: 'hero',
      description: 'Badge-style items that can appear by text, near portrait, or in proof strip.',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              validation: (Rule) => Rule.required().max(80),
            }),
            defineField({
              name: 'url',
              title: 'Optional URL',
              type: 'string',
              validation: (Rule) => Rule.custom((value) => {
                if (!value) {
                  return true
                }

                return value.startsWith('/') || value.startsWith('http')
                  ? true
                  : 'Use an internal path (/support) or full URL (https://...)'
              }),
            }),
            defineField({
              name: 'icon',
              title: 'Icon',
              type: 'string',
              options: {
                list: iconOptions,
                layout: 'dropdown',
                layout: 'dropdown',
              },
            }),
            defineField({
              name: 'placement',
              title: 'Placement',
              type: 'string',
              options: {
                list: [
                  {title: 'Near Text', value: 'text'},
                  {title: 'Near Portrait', value: 'media'},
                  {title: 'Bottom Proof Strip', value: 'proof'},
                ],
                layout: 'radio',
              },
              initialValue: 'proof',
            }),
          ],
        },
      ],
    }),
    defineField({
      name: 'homeFocusItems',
      title: 'Home Hero Focus List',
      type: 'array',
      group: 'hero',
      of: [{type: 'string'}],
      description: 'Bullet list shown with the hero text.',
      validation: (Rule) => Rule.max(8),
    }),
    defineField({
      name: 'homeSectionCards',
      title: 'Home Section Cards',
      type: 'array',
      group: 'homeCards',
      description: 'Large cards below the hero (title, copy, link, icon).',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (Rule) => Rule.required().max(80),
            }),
            defineField({
              name: 'copy',
              title: 'Copy',
              type: 'text',
              rows: 2,
              validation: (Rule) => Rule.required().max(160),
            }),
            defineField({
              name: 'href',
              title: 'Href',
              type: 'string',
              validation: (Rule) => Rule.required().custom((value) => {
                if (!value) {
                  return 'Href is required'
                }

                return value.startsWith('/') || value.startsWith('http')
                  ? true
                  : 'Use an internal path (/news) or full URL (https://...)'
              }),
            }),
            defineField({
              name: 'ctaLabel',
              title: 'CTA Label',
              type: 'string',
              initialValue: 'View',
              validation: (Rule) => Rule.max(50),
            }),
            defineField({
              name: 'icon',
              title: 'Icon',
              type: 'string',
              options: {
                list: iconOptions,
              },
              initialValue: 'newspaper',
            }),
          ],
        },
      ],
    }),
    defineField({
      name: 'pressUpdatedAt',
      title: 'Press Resources Updated At',
      type: 'datetime',
      group: 'campaignMeta',
      description: 'Use this to communicate the latest refresh date for press-facing assets.',
    }),
    defineField({
      name: 'donateUrl',
      title: 'Donate URL',
      type: 'url',
      group: ['hero', 'campaignMeta', 'contact'],
    }),
    defineField({
      name: 'volunteerUrl',
      title: 'Volunteer URL',
      type: 'url',
      group: ['hero', 'campaignMeta', 'contact'],
    }),
    defineField({
      name: 'contactEmail',
      title: 'Contact Email',
      type: 'string',
      group: 'contact',
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'array',
      group: 'contact',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'label', title: 'Label', type: 'string'},
            {name: 'url', title: 'URL', type: 'url'},
          ],
        },
      ],
    }),
  ],
})
