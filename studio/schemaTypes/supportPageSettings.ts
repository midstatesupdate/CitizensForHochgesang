import {defineField, defineType} from 'sanity'

/**
 * Support page settings — visual controls for the /support page.
 */
export const supportPageSettings = defineType({
  name: 'supportPageSettings',
  title: 'Support Page',
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
      return {title: 'Support Page Settings'}
    },
  },
})
