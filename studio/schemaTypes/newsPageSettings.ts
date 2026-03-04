import {defineField, defineType} from 'sanity'

/**
 * News page settings — visual controls for the news listing and detail pages.
 * Detail visuals cascade: detail page uses `detailVisuals` if set, else inherits `visuals`.
 */
export const newsPageSettings = defineType({
  name: 'newsPageSettings',
  title: 'News Page',
  type: 'document',
  groups: [
    {name: 'visuals', title: 'Listing Visuals', default: true},
    {name: 'detailVisuals', title: 'Detail Visuals'},
  ],
  fields: [
    defineField({
      name: 'visuals',
      title: 'News Listing Visuals',
      type: 'pageVisuals',
      group: 'visuals',
      description: 'Visual settings for the /news listing page.',
    }),
    defineField({
      name: 'detailVisuals',
      title: 'News Detail Visuals (Override)',
      type: 'pageVisuals',
      group: 'detailVisuals',
      description:
        'Optional overrides for individual article pages. Leave empty to inherit listing visuals.',
    }),
  ],
  preview: {
    prepare() {
      return {title: 'News Page Settings'}
    },
  },
})
