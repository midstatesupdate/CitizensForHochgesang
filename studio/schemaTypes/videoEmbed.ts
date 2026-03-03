import {defineType, defineField} from 'sanity'

/**
 * Inline YouTube / video embed block for any rich-text array.
 * Paste a YouTube or Vimeo URL and it renders as a responsive embed.
 */
export const videoEmbed = defineType({
  name: 'videoEmbed',
  title: 'Video Embed',
  type: 'object',
  icon: () => '▶',
  fields: [
    defineField({
      name: 'url',
      title: 'Video URL',
      type: 'url',
      description: 'YouTube or Vimeo URL (e.g. https://www.youtube.com/watch?v=...).',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
      description: 'Optional caption displayed below the video.',
      validation: (Rule) => Rule.max(200),
    }),
  ],
  preview: {
    select: {url: 'url', caption: 'caption'},
    prepare({url, caption}) {
      return {
        title: caption || url || '(no URL)',
        subtitle: 'Video Embed',
      }
    },
  },
})
