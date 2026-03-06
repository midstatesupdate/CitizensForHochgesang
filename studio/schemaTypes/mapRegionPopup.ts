import {defineField, defineType} from 'sanity'

/**
 * Map Region Popup — editable info cards that appear when clicking
 * regions on the Indiana District 48 interactive map.
 *
 * Each document maps to a region key like "county:Dubois",
 * "district:District 48", "state:Indiana", or "township:Dubois:German".
 */
export const mapRegionPopup = defineType({
  name: 'mapRegionPopup',
  title: 'Map Region Popup',
  type: 'document',
  fields: [
    defineField({
      name: 'regionKey',
      title: 'Region Key',
      type: 'string',
      description:
        'Identifier matching the map region. Examples: "state:Indiana", "district:District 48", "county:Dubois", "township:Dubois:German"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Popup Title',
      type: 'string',
      validation: (Rule) => Rule.required().max(120),
    }),
    defineField({
      name: 'body',
      title: 'Popup Body',
      type: 'array',
      description: 'Rich text shown in the popup when this region is clicked.',
      of: [
        {type: 'block'},
        {type: 'ctaButton'},
        {type: 'infoBox'},
      ],
    }),
    defineField({
      name: 'linkLabel',
      title: 'Link Button Label',
      type: 'string',
      description: 'Text for the action button (e.g. "Learn more", "View county info").',
      validation: (Rule) => Rule.max(50),
    }),
    defineField({
      name: 'linkUrl',
      title: 'Link URL',
      type: 'string',
      description: 'Where the button links to. Internal (/path) or external (https://...).',
      validation: (Rule) =>
        Rule.custom((value) => {
          if (!value) return true
          return value.startsWith('/') || value.startsWith('http')
            ? true
            : 'Use an internal path (/about) or full URL (https://...)'
        }),
    }),
  ],
  preview: {
    select: {title: 'title', subtitle: 'regionKey'},
  },
})
