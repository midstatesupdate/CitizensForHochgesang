import {defineField, defineType} from 'sanity'

export const fundraisingLink = defineType({
  name: 'fundraisingLink',
  title: 'Fundraising Link',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required().max(120),
    }),
    defineField({
      name: 'url',
      title: 'URL',
      type: 'url',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'priority',
      title: 'Priority',
      type: 'number',
      validation: (Rule) => Rule.min(0).max(100),
    }),
  ],
})
