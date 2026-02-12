import {defineArrayMember, defineField, defineType} from 'sanity'

const sceneAnimationOptions = [
  {title: 'None', value: 'none'},
  {title: 'Fade Up', value: 'fade-up'},
  {title: 'Slide Left', value: 'slide-left'},
  {title: 'Slide Right', value: 'slide-right'},
  {title: 'Zoom Soft', value: 'zoom-soft'},
]

const sceneLayoutOptions = [
  {title: 'Text Focus', value: 'text'},
  {title: 'Split (Media Left)', value: 'split-left'},
  {title: 'Split (Media Right)', value: 'split-right'},
  {title: 'Highlight Panel', value: 'highlight'},
]

export const post = defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  groups: [
    {name: 'content', title: 'Article Content', default: true},
    {name: 'experience', title: 'Reading Experience'},
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
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'metadata',
      options: {source: 'title', maxLength: 96},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      group: ['content', 'metadata'],
      rows: 3,
      validation: (Rule) => Rule.max(200),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      group: 'metadata',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      group: ['content', 'metadata'],
      options: {hotspot: true},
    }),
    defineField({
      name: 'body',
      title: 'Body (Base Article Content)',
      type: 'array',
      group: 'content',
      description:
        'Primary article text and inline images. For cinematic scroll moments, use Reading Experience sections.',
      of: [
        defineArrayMember({type: 'block'}),
        defineArrayMember({
          type: 'image',
          options: {hotspot: true},
          fields: [
            defineField({
              name: 'alt',
              title: 'Alt text',
              type: 'string',
              validation: (Rule) => Rule.max(160),
            }),
          ],
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'storyTimeline',
      title: 'Reading Experience Sections',
      type: 'array',
      group: 'experience',
      description:
        'Add cinematic sections readers encounter while scrolling. Each section has its own layout and animation controls.',
      of: [
        defineArrayMember({
          name: 'storyScene',
          title: 'Story Scene',
          type: 'object',
          fields: [
            defineField({
              name: 'sceneTitle',
              title: 'Scene Title',
              type: 'string',
              description: 'Optional section heading displayed in the article.',
              validation: (Rule) => Rule.max(120),
            }),
            defineField({
              name: 'layout',
              title: 'Layout',
              type: 'string',
              initialValue: 'text',
              options: {
                list: sceneLayoutOptions,
                layout: 'radio',
              },
            }),
            defineField({
              name: 'animationPreset',
              title: 'Animation Preset',
              type: 'string',
              initialValue: 'fade-up',
              description: 'Controls how this scene enters as readers scroll.',
              options: {
                list: sceneAnimationOptions,
              },
            }),
            defineField({
              name: 'animationDelayMs',
              title: 'Animation Delay (ms)',
              type: 'number',
              initialValue: 0,
              validation: (Rule) => Rule.min(0).max(900).precision(0),
            }),
            defineField({
              name: 'animationDurationMs',
              title: 'Animation Duration (ms)',
              type: 'number',
              initialValue: 720,
              validation: (Rule) => Rule.min(300).max(1600).precision(0),
            }),
            defineField({
              name: 'body',
              title: 'Scene Content',
              type: 'array',
              of: [defineArrayMember({type: 'block'})],
              validation: (Rule) => Rule.required().min(1),
            }),
            defineField({
              name: 'media',
              title: 'Scene Media',
              type: 'image',
              options: {hotspot: true},
            }),
            defineField({
              name: 'mediaAlt',
              title: 'Scene Media Alt Text',
              type: 'string',
              hidden: ({parent}) => !parent?.media,
              validation: (Rule) => Rule.max(160),
            }),
          ],
          preview: {
            select: {
              title: 'sceneTitle',
              subtitle: 'animationPreset',
              media: 'media',
            },
            prepare({title, subtitle, media}) {
              return {
                title: title || 'Story Scene',
                subtitle: subtitle ? `Animation: ${subtitle}` : 'Animation: fade-up',
                media,
              }
            },
          },
        }),
        defineArrayMember({
          name: 'statCallout',
          title: 'Stat Callout',
          type: 'object',
          fields: [
            defineField({
              name: 'headline',
              title: 'Headline',
              type: 'string',
              validation: (Rule) => Rule.required().max(120),
            }),
            defineField({
              name: 'animationPreset',
              title: 'Animation Preset',
              type: 'string',
              initialValue: 'fade-up',
              options: {
                list: sceneAnimationOptions,
              },
            }),
            defineField({
              name: 'animationDelayMs',
              title: 'Animation Delay (ms)',
              type: 'number',
              initialValue: 80,
              validation: (Rule) => Rule.min(0).max(900).precision(0),
            }),
            defineField({
              name: 'animationDurationMs',
              title: 'Animation Duration (ms)',
              type: 'number',
              initialValue: 820,
              validation: (Rule) => Rule.min(300).max(1600).precision(0),
            }),
            defineField({
              name: 'items',
              title: 'Statistic Items',
              type: 'array',
              validation: (Rule) => Rule.required().min(1).max(4),
              of: [
                defineArrayMember({
                  type: 'object',
                  fields: [
                    defineField({
                      name: 'value',
                      title: 'Value',
                      type: 'string',
                      validation: (Rule) => Rule.required().max(32),
                    }),
                    defineField({
                      name: 'label',
                      title: 'Label',
                      type: 'string',
                      validation: (Rule) => Rule.required().max(80),
                    }),
                    defineField({
                      name: 'note',
                      title: 'Optional Note',
                      type: 'string',
                      validation: (Rule) => Rule.max(120),
                    }),
                  ],
                  preview: {
                    select: {
                      title: 'value',
                      subtitle: 'label',
                    },
                  },
                }),
              ],
            }),
          ],
          preview: {
            select: {
              title: 'headline',
              subtitle: 'animationPreset',
            },
            prepare({title, subtitle}) {
              return {
                title: title || 'Stat Callout',
                subtitle: subtitle ? `Animation: ${subtitle}` : 'Animation: fade-up',
              }
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      group: 'metadata',
      of: [{type: 'string'}],
    }),
  ],
  orderings: [
    {
      title: 'Published date, new',
      name: 'publishedAtDesc',
      by: [{field: 'publishedAt', direction: 'desc'}],
    },
  ],
})
