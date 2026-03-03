import {defineType, defineField} from 'sanity'

/**
 * Pull quote / testimonial block for any rich-text array.
 * Displays an attributed quote — ideal for endorsements or voter testimonials.
 */
export const pullQuote = defineType({
  name: 'pullQuote',
  title: 'Pull Quote',
  type: 'object',
  icon: () => '❝',
  fields: [
    defineField({
      name: 'quote',
      title: 'Quote',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required().min(1).max(500),
      description: 'The quoted text.',
    }),
    defineField({
      name: 'attribution',
      title: 'Attribution',
      type: 'string',
      validation: (Rule) => Rule.max(100),
      description: 'Who said it (e.g. "Jane Doe, District 48 Resident").',
    }),
  ],
  preview: {
    select: {quote: 'quote', attribution: 'attribution'},
    prepare({quote, attribution}) {
      const short = (quote ?? '').slice(0, 60)
      return {
        title: short ? `"${short}${quote.length > 60 ? '…' : ''}"` : '(empty)',
        subtitle: attribution ? `— ${attribution}` : 'Pull Quote',
      }
    },
  },
})
