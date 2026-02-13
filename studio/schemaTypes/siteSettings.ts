import {defineField, defineType} from 'sanity'

const iconOptions = [
  {title: 'Bullhorn', value: 'bullhorn'},
  {title: 'Calendar', value: 'calendar'},
  {title: 'Hands Helping', value: 'hands-helping'},
  {title: 'Newspaper', value: 'newspaper'},
  {title: 'Question Circle', value: 'question-circle'},
  {title: 'Newspaper (Outline)', value: 'reg-newspaper'},
  {title: 'Video', value: 'video'},
  {title: 'Vote Yea', value: 'vote-yea'},
]

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  groups: [
    {name: 'header', title: 'Header', default: true},
    {name: 'navigation', title: 'Navigation'},
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
      name: 'campaignLogo',
      title: 'Campaign Logo',
      type: 'image',
      group: ['header', 'campaignMeta'],
      options: {hotspot: true},
      description: 'Upload the full-size primary campaign logo.',
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
