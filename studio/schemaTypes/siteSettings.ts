import {defineField, defineType} from 'sanity'
import {iconOptions} from './iconOptions'

/**
 * Site-wide settings — branding, navigation, contact, and page visibility.
 * Home-specific content has moved to `homePageSettings`.
 * Per-page visual settings are embedded in each page settings document.
 */
export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  groups: [
    {name: 'header', title: 'Header', default: true},
    {name: 'navigation', title: 'Navigation'},
    {name: 'pages', title: 'Page Visibility'},
    {name: 'campaignMeta', title: 'Campaign Meta'},
    {name: 'contact', title: 'Contact & Social'},
  ],
  fields: [
    defineField({
      name: 'siteTitle',
      title: 'Site Title',
      type: 'string',
      group: ['header', 'campaignMeta'],
      validation: (Rule) => Rule.required().max(120),
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      group: 'campaignMeta',
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
              validation: (Rule) =>
                Rule.required().custom((value) => {
                  if (!value) return 'Href is required'
                  return value.startsWith('/') || value.startsWith('http')
                    ? true
                    : 'Use an internal path (/news) or full URL (https://...)'
                }),
            }),
            defineField({
              name: 'icon',
              title: 'Icon',
              type: 'string',
              options: {list: iconOptions, layout: 'dropdown'},
              initialValue: 'newspaper',
            }),
          ],
          preview: {select: {title: 'label', subtitle: 'href'}},
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
        defineField({name: 'news', title: 'News', type: 'boolean', initialValue: false, description: 'Show the /news page and all individual news articles.'}),
        defineField({name: 'events', title: 'Events', type: 'boolean', initialValue: false, description: 'Show the /events page and event detail pages.'}),
        defineField({name: 'faq', title: 'FAQ', type: 'boolean', initialValue: false, description: 'Show the /faq page.'}),
        defineField({name: 'platform', title: 'About & Priorities', type: 'boolean', initialValue: false, description: 'Show the /platform page and priority detail pages.'}),
        defineField({name: 'media', title: 'Media & Press', type: 'boolean', initialValue: false, description: 'Show the /media page.'}),
        defineField({name: 'support', title: 'Support', type: 'boolean', initialValue: false, description: 'Show the /support page.'}),
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
      group: ['campaignMeta', 'contact'],
    }),
    defineField({
      name: 'volunteerUrl',
      title: 'Volunteer URL',
      type: 'url',
      group: ['campaignMeta', 'contact'],
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
