import {defineField, defineType} from 'sanity'

const eventCardLayoutOptions = [
  {title: 'Stacked (Image Top)', value: 'stacked'},
  {title: 'Image Left', value: 'image-left'},
  {title: 'Image Right', value: 'image-right'},
  {title: 'Feature Split', value: 'feature-split'},
  {title: 'No Photo (Text Only)', value: 'no-photo'},
]

const eventImageOrientationOptions = [
  {title: 'Landscape', value: 'landscape'},
  {title: 'Portrait', value: 'portrait'},
]

const eventImageAspectRatioOptions = [
  {title: 'DSLR Landscape (3:2)', value: '3:2'},
  {title: 'Standard Landscape (4:3)', value: '4:3'},
  {title: 'Widescreen (16:9)', value: '16:9'},
  {title: 'Square (1:1)', value: '1:1'},
  {title: 'Classic Portrait (4:5)', value: '4:5'},
  {title: 'Standard Portrait (3:4)', value: '3:4'},
  {title: 'DSLR Portrait (2:3)', value: '2:3'},
  {title: 'Phone Portrait (9:16)', value: '9:16'},
]

const eventCardAnimationOptions = [
  {title: 'Soft Fade Up', value: 'fade-up'},
  {title: 'Slide Up', value: 'slide-up'},
  {title: 'Slide In Left', value: 'slide-left'},
  {title: 'Slide In Right', value: 'slide-right'},
  {title: 'None', value: 'none'},
]

export const event = defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  groups: [
    {name: 'content', title: 'Event Content', default: true},
    {name: 'listCard', title: 'Events List Card'},
    {name: 'metadata', title: 'Metadata'},
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: ['content', 'metadata'],
      validation: (Rule) => Rule.required().max(120),
    }),
    defineField({
      name: 'startDate',
      title: 'Start Date',
      type: 'datetime',
      group: ['content', 'metadata'],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'endDate',
      title: 'End Date & Time',
      type: 'datetime',
      group: ['content', 'metadata'],
      description:
        'Optional. When set, the website automatically marks this event as passed after this timestamp (assume Eastern Time).',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          if (!value) {
            return true
          }

          const startDate = (context.document as {startDate?: string} | undefined)?.startDate
          if (!startDate) {
            return true
          }

          return Date.parse(value) >= Date.parse(startDate)
            ? true
            : 'End Date & Time must be equal to or after Start Date.'
        }),
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      group: ['content', 'metadata'],
      validation: (Rule) => Rule.required().max(160),
    }),
    defineField({
      name: 'scheduleImage',
      title: 'Schedule Image',
      type: 'image',
      group: ['content', 'listCard'],
      options: {hotspot: true},
    }),
    defineField({
      name: 'eventCardLayout',
      title: 'Events Card Layout',
      type: 'string',
      group: 'listCard',
      initialValue: 'stacked',
      options: {
        list: eventCardLayoutOptions,
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'eventImageOrientation',
      title: 'Events Card Image Orientation',
      type: 'string',
      group: 'listCard',
      initialValue: 'landscape',
      options: {
        list: eventImageOrientationOptions,
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'eventImageAspectRatio',
      title: 'Events Card Image Aspect Ratio',
      type: 'string',
      group: 'listCard',
      initialValue: '3:2',
      options: {
        list: eventImageAspectRatioOptions,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'eventCardAnimation',
      title: 'Events Card Animation',
      type: 'string',
      group: 'listCard',
      initialValue: 'fade-up',
      options: {
        list: eventCardAnimationOptions,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      group: ['content', 'listCard'],
      rows: 4,
    }),
    defineField({
      name: 'eventDescriptionPreviewChars',
      title: 'Description Preview Character Limit',
      type: 'number',
      group: 'listCard',
      initialValue: 420,
      validation: (Rule) => Rule.required().min(220).max(1200).precision(0),
    }),
    defineField({
      name: 'rsvpLink',
      title: 'RSVP Link',
      type: 'url',
      group: ['content', 'metadata'],
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      group: ['listCard', 'metadata'],
      of: [{type: 'string'}],
    }),
  ],
  orderings: [
    {
      title: 'Start date, soonest',
      name: 'startDateAsc',
      by: [{field: 'startDate', direction: 'asc'}],
    },
  ],
})
