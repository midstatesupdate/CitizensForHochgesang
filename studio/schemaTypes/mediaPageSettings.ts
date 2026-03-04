import {defineField, defineType} from 'sanity'

/**
 * Media page settings — visual controls for the /media page.
 */
export const mediaPageSettings = defineType({
  name: 'mediaPageSettings',
  title: 'Media Page',
  type: 'document',
  fields: [
    defineField({
      name: 'visuals',
      title: 'Page Visual Settings',
      type: 'pageVisuals',
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Media Page Settings'}
    },
  },
})
