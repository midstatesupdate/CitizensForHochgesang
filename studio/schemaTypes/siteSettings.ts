import {defineField, defineType} from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'siteTitle',
      title: 'Site Title',
      type: 'string',
      validation: (Rule) => Rule.required().max(120),
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      validation: (Rule) => Rule.max(160),
    }),
    defineField({
      name: 'campaignLogo',
      title: 'Campaign Logo',
      type: 'image',
      options: {hotspot: true},
      description: 'Upload the full-size primary campaign logo.',
    }),
    defineField({
      name: 'campaignLogoAlt',
      title: 'Campaign Logo Alt Text',
      type: 'string',
      validation: (Rule) => Rule.max(160),
    }),
    defineField({
      name: 'candidatePortrait',
      title: 'Candidate Portrait (Hero)',
      type: 'image',
      options: {hotspot: true},
      description: 'Primary homepage portrait image. Recommended portrait orientation (4:5).',
    }),
    defineField({
      name: 'candidatePortraitAlt',
      title: 'Candidate Portrait Alt Text',
      type: 'string',
      validation: (Rule) => Rule.max(160),
    }),
    defineField({
      name: 'homeHeroLayout',
      title: 'Home Hero Layout',
      type: 'string',
      initialValue: 'clean-split',
      options: {
        list: [
          {title: 'Clean Split (Text Left, Portrait Right)', value: 'clean-split'},
          {title: 'Portrait Left (Text Right)', value: 'portrait-left'},
          {title: 'Immersive Overlay (Text on Portrait)', value: 'immersive-overlay'},
        ],
        layout: 'radio',
        direction: 'vertical',
      },
      description: 'Controls the visual composition of the homepage hero section.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'pressUpdatedAt',
      title: 'Press Resources Updated At',
      type: 'datetime',
      description: 'Use this to communicate the latest refresh date for press-facing assets.',
    }),
    defineField({
      name: 'donateUrl',
      title: 'Donate URL',
      type: 'url',
    }),
    defineField({
      name: 'volunteerUrl',
      title: 'Volunteer URL',
      type: 'url',
    }),
    defineField({
      name: 'contactEmail',
      title: 'Contact Email',
      type: 'string',
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'label', title: 'Label', type: 'string'},
            {name: 'url', title: 'URL', type: 'url'},
          ],
        },
      ],
    }),
  ],
})
