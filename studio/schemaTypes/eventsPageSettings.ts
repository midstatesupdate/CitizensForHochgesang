import {defineField, defineType} from 'sanity'

/**
 * Events page settings — visual controls for event listing and detail pages.
 * Detail visuals cascade: detail page uses `detailVisuals` if set, else inherits `visuals`.
 */
export const eventsPageSettings = defineType({
  name: 'eventsPageSettings',
  title: 'Events Page',
  type: 'document',
  groups: [
    {name: 'visuals', title: 'Listing Visuals', default: true},
    {name: 'detailVisuals', title: 'Detail Visuals'},
  ],
  fields: [
    defineField({
      name: 'visuals',
      title: 'Events Listing Visuals',
      type: 'pageVisuals',
      group: 'visuals',
      description: 'Visual settings for the /events listing page.',
    }),
    defineField({
      name: 'detailVisuals',
      title: 'Events Detail Visuals (Override)',
      type: 'pageVisuals',
      group: 'detailVisuals',
      description:
        'Optional overrides for individual event pages. Leave empty to inherit listing visuals.',
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Events Page Settings'}
    },
  },
})
