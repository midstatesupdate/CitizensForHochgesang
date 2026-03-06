import {defineField, defineType} from 'sanity'

/**
 * mapEmbed — lightweight portable text block for embedding an interactive map.
 * References an `interactiveMap` document by ID so coordinate data stays out of
 * the host document.
 */
export const mapEmbed = defineType({
  name: 'mapEmbed',
  title: 'Map Embed',
  type: 'object',
  fields: [
    defineField({
      name: 'map',
      title: 'Map',
      type: 'reference',
      to: [{type: 'interactiveMap'}],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
      description: 'Optional caption displayed below the map.',
      validation: (Rule) => Rule.max(200),
    }),
    defineField({
      name: 'heightOverride',
      title: 'Height Override (px)',
      type: 'number',
      description: 'Override the default map height for this embed.',
    }),
  ],
  preview: {
    select: {title: 'map.title', subtitle: 'caption'},
    prepare({title, subtitle}) {
      return {
        title: title ? `Map: ${title}` : 'Map Embed',
        subtitle: subtitle || '',
      }
    },
  },
})
