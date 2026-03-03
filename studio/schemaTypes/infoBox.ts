import {defineType, defineField} from 'sanity'

/**
 * Info / callout box block for any rich-text array.
 * Styled callout for tips, warnings, or key facts in policy articles.
 */
export const infoBox = defineType({
  name: 'infoBox',
  title: 'Info Box',
  type: 'object',
  icon: () => 'ℹ',
  fields: [
    defineField({
      name: 'tone',
      title: 'Tone',
      type: 'string',
      options: {
        list: [
          {title: 'Info (blue)', value: 'info'},
          {title: 'Tip (green)', value: 'tip'},
          {title: 'Warning (amber)', value: 'warning'},
          {title: 'Note (neutral)', value: 'note'},
        ],
        layout: 'radio',
      },
      initialValue: 'info',
    }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: (Rule) => Rule.max(80),
      description: 'Optional heading shown in bold above the body.',
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required().min(1),
      description: 'The callout message text.',
    }),
  ],
  preview: {
    select: {heading: 'heading', body: 'body', tone: 'tone'},
    prepare({heading, body, tone}) {
      const toneEmoji: Record<string, string> = {info: 'ℹ️', tip: '💡', warning: '⚠️', note: '📝'}
      const prefix = toneEmoji[tone ?? 'info'] ?? 'ℹ️'
      return {
        title: `${prefix} ${heading || (body ?? '').slice(0, 50) || '(empty)'}`,
        subtitle: 'Info Box',
      }
    },
  },
})
