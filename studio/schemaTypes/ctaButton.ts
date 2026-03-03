import {defineType, defineField} from 'sanity'

/**
 * Inline call-to-action button block for any rich-text array.
 * Renders a styled button inside body content (donate, volunteer, RSVP, etc.).
 */
export const ctaButton = defineType({
  name: 'ctaButton',
  title: 'CTA Button',
  type: 'object',
  icon: () => '🔘',
  fields: [
    defineField({
      name: 'label',
      title: 'Button Label',
      type: 'string',
      validation: (Rule) => Rule.required().max(60),
      description: 'Text shown on the button.',
    }),
    defineField({
      name: 'url',
      title: 'Link URL',
      type: 'url',
      validation: (Rule) =>
        Rule.required().uri({allowRelative: true, scheme: ['http', 'https', 'mailto', 'tel']}),
      description: 'Destination URL. Supports absolute URLs and relative paths like /support.',
    }),
    defineField({
      name: 'style',
      title: 'Style',
      type: 'string',
      options: {
        list: [
          {title: 'Primary (filled)', value: 'primary'},
          {title: 'Outline', value: 'outline'},
          {title: 'Accent (highlight)', value: 'accent'},
        ],
        layout: 'radio',
      },
      initialValue: 'primary',
    }),
  ],
  preview: {
    select: {label: 'label', url: 'url', style: 'style'},
    prepare({label, url, style}) {
      return {
        title: label || '(no label)',
        subtitle: `CTA Button · ${style ?? 'primary'} → ${url ?? ''}`,
      }
    },
  },
})
