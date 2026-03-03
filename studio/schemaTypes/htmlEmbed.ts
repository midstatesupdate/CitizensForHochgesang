import {defineType, defineField} from 'sanity'

/**
 * Reusable inline HTML block for any rich-text array.
 * Use sparingly — for badge snippets, embedded widgets, or markup
 * that can't be expressed with standard block content.
 */
export const htmlEmbed = defineType({
  name: 'htmlEmbed',
  title: 'HTML Embed',
  type: 'object',
  icon: () => '</>',
  fields: [
    defineField({
      name: 'html',
      title: 'HTML',
      type: 'text',
      rows: 6,
      description: 'Raw HTML rendered on the site. Use for badges, buttons, or embedded widgets.',
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: {title: 'html'},
    prepare({title}) {
      const trimmed = (title ?? '').replace(/<[^>]*>/g, '').slice(0, 60)
      return {title: trimmed || '(empty HTML)', subtitle: 'HTML Embed'}
    },
  },
})
