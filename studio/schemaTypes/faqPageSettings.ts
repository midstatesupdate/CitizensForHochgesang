import {defineField, defineType} from 'sanity'

/**
 * FAQ page settings — visual controls for the /faq page.
 */
export const faqPageSettings = defineType({
  name: 'faqPageSettings',
  title: 'FAQ Page',
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
      return {title: 'FAQ Page Settings'}
    },
  },
})
