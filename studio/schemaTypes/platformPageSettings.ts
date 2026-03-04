import {defineField, defineType} from 'sanity'

/**
 * Platform page settings — visual controls for the platform listing and detail pages.
 * Detail visuals cascade: detail page uses `detailVisuals` if set, else inherits `visuals`.
 */
export const platformPageSettings = defineType({
  name: 'platformPageSettings',
  title: 'Platform Page',
  type: 'document',
  groups: [
    {name: 'visuals', title: 'Listing Visuals', default: true},
    {name: 'detailVisuals', title: 'Detail Visuals'},
  ],
  fields: [
    defineField({
      name: 'visuals',
      title: 'Platform Listing Visuals',
      type: 'pageVisuals',
      group: 'visuals',
      description: 'Visual settings for the /platform listing page.',
    }),
    defineField({
      name: 'detailVisuals',
      title: 'Platform Detail Visuals (Override)',
      type: 'pageVisuals',
      group: 'detailVisuals',
      description:
        'Optional overrides for individual priority pages. Leave empty to inherit listing visuals.',
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Platform Page Settings'}
    },
  },
})
