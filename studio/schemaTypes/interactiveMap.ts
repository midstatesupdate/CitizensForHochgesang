import {defineArrayMember, defineField, defineType} from 'sanity'

const strokeStyleOptions = [
  {title: 'Solid', value: 'solid'},
  {title: 'Dashed', value: 'dashed'},
  {title: 'Dotted', value: 'dotted'},
]

const pinSizeOptions = [
  {title: 'Small', value: 'sm'},
  {title: 'Medium', value: 'md'},
  {title: 'Large', value: 'lg'},
]

const animationPresetOptions = [
  {title: 'None', value: 'none'},
  {title: 'District 48 (animated intro)', value: 'district48'},
  {title: 'Fade In', value: 'fadeIn'},
  {title: 'Draw Outline', value: 'drawOutline'},
]

/** Reusable inline popup fields shared by regions, overlays, and pins. */
const popupFields = [
  defineField({
    name: 'popupTitle',
    title: 'Popup Title',
    type: 'string',
    validation: (Rule) => Rule.max(120),
  }),
  defineField({
    name: 'popupBody',
    title: 'Popup Body',
    type: 'array',
    of: [
      {type: 'block'},
      {type: 'ctaButton'},
      {type: 'infoBox'},
    ],
  }),
  defineField({
    name: 'popupLinkLabel',
    title: 'Popup Link Label',
    type: 'string',
    validation: (Rule) => Rule.max(50),
  }),
  defineField({
    name: 'popupLinkUrl',
    title: 'Popup Link URL',
    type: 'string',
    validation: (Rule) =>
      Rule.custom((value) => {
        if (!value) return true
        return value.startsWith('/') || value.startsWith('http')
          ? true
          : 'Use an internal path (/about) or full URL (https://...)'
      }),
  }),
]

/** Validates that a string is parseable JSON array. */
function validateJson(value: string | undefined) {
  if (!value) return true
  try {
    const parsed = JSON.parse(value)
    if (!Array.isArray(parsed)) return 'Must be a JSON array'
    return true
  } catch {
    return 'Invalid JSON'
  }
}

export const interactiveMap = defineType({
  name: 'interactiveMap',
  title: 'Interactive Map',
  type: 'document',
  groups: [
    {name: 'setup', title: 'Setup', default: true},
    {name: 'layers', title: 'Layers'},
    {name: 'overlays', title: 'Overlays'},
    {name: 'pins', title: 'Pins'},
    {name: 'display', title: 'Display'},
  ],
  fields: [
    // ── Setup ──
    defineField({
      name: 'title',
      title: 'Map Title',
      type: 'string',
      group: 'setup',
      validation: (Rule) => Rule.required().max(120),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'setup',
      options: {source: 'title', maxLength: 96},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      group: 'setup',
      rows: 2,
      description: 'Internal note about what this map shows.',
    }),
    defineField({
      name: 'projection',
      title: 'Map Projection',
      type: 'object',
      group: 'setup',
      description:
        'Equirectangular projection parameters. toSvgX(lon) = (lon - originLon) * scaleX + offsetX; toSvgY(lat) = (originLat - lat) * scaleY + offsetY',
      fields: [
        defineField({name: 'originLon', title: 'Origin Longitude', type: 'number', initialValue: -88.097}),
        defineField({name: 'originLat', title: 'Origin Latitude', type: 'number', initialValue: 41.761}),
        defineField({name: 'scaleX', title: 'Scale X', type: 'number', initialValue: 90.47}),
        defineField({name: 'scaleY', title: 'Scale Y', type: 'number', initialValue: 116.9}),
        defineField({name: 'offsetX', title: 'Offset X', type: 'number', initialValue: 10}),
        defineField({name: 'offsetY', title: 'Offset Y', type: 'number', initialValue: 12}),
      ],
    }),
    defineField({
      name: 'defaultViewport',
      title: 'Default Viewport (SVG viewBox)',
      type: 'object',
      group: 'setup',
      description: 'Initial SVG viewBox. Example: 0, 0, 320, 500 for Indiana state view.',
      fields: [
        defineField({name: 'x', title: 'X', type: 'number', initialValue: 0}),
        defineField({name: 'y', title: 'Y', type: 'number', initialValue: 0}),
        defineField({name: 'width', title: 'Width', type: 'number', initialValue: 320}),
        defineField({name: 'height', title: 'Height', type: 'number', initialValue: 500}),
      ],
    }),

    // ── Layers ──
    defineField({
      name: 'layers',
      title: 'Layers',
      type: 'array',
      group: 'layers',
      description: 'Ordered bottom-to-top. Each layer contains regions (polygons).',
      of: [
        defineArrayMember({
          type: 'object',
          title: 'Layer',
          fields: [
            defineField({
              name: 'label',
              title: 'Layer Label',
              type: 'string',
              validation: (Rule) => Rule.required().max(80),
            }),
            defineField({
              name: 'layerId',
              title: 'Layer ID',
              type: 'string',
              description: 'Unique identifier for this layer (e.g. "counties", "townships").',
              validation: (Rule) => Rule.required().max(40),
            }),
            defineField({
              name: 'visible',
              title: 'Visible by Default',
              type: 'boolean',
              initialValue: true,
            }),
            defineField({
              name: 'minZoomWidth',
              title: 'Min Zoom Width',
              type: 'number',
              description:
                'Only show this layer when the viewBox width is at or below this value. Leave empty to always show.',
            }),
            // Layer style defaults
            defineField({name: 'defaultFillColor', title: 'Default Fill Color', type: 'string', initialValue: '#e8d5b7'}),
            defineField({name: 'defaultStrokeColor', title: 'Default Stroke Color', type: 'string', initialValue: '#8B7355'}),
            defineField({name: 'defaultStrokeWidth', title: 'Default Stroke Width', type: 'number', initialValue: 0.5}),
            defineField({
              name: 'defaultStrokeStyle',
              title: 'Default Stroke Style',
              type: 'string',
              options: {list: strokeStyleOptions},
              initialValue: 'solid',
            }),
            // Regions
            defineField({
              name: 'regions',
              title: 'Regions',
              type: 'array',
              of: [
                defineArrayMember({
                  type: 'object',
                  title: 'Region',
                  fields: [
                    defineField({
                      name: 'name',
                      title: 'Name',
                      type: 'string',
                      validation: (Rule) => Rule.required().max(80),
                    }),
                    defineField({
                      name: 'regionKey',
                      title: 'Region Key',
                      type: 'string',
                      description: 'Unique key for popup lookup (e.g. "county:Dubois", "township:Dubois:German").',
                      validation: (Rule) => Rule.max(80),
                    }),
                    defineField({
                      name: 'coordinatesJson',
                      title: 'Coordinates (JSON)',
                      type: 'text',
                      rows: 6,
                      description:
                        'Paste coordinate data as JSON. Single polygon: [[lon,lat], ...]. Multi-ring: [[[lon,lat], ...], ...].',
                      validation: (Rule) => Rule.required().custom(validateJson),
                    }),
                    defineField({
                      name: 'centroid',
                      title: 'Centroid',
                      type: 'string',
                      description: 'Label position as "longitude, latitude". Computed from coordinates if omitted.',
                    }),
                    // Per-region style overrides
                    defineField({name: 'fillColor', title: 'Fill Color Override', type: 'string'}),
                    defineField({name: 'strokeColor', title: 'Stroke Color Override', type: 'string'}),
                    defineField({name: 'strokeWidth', title: 'Stroke Width Override', type: 'number'}),
                    defineField({
                      name: 'strokeStyle',
                      title: 'Stroke Style Override',
                      type: 'string',
                      options: {list: strokeStyleOptions},
                    }),
                    // Inline popup
                    ...popupFields,
                  ],
                  preview: {
                    select: {title: 'name', subtitle: 'regionKey'},
                  },
                }),
              ],
            }),
          ],
          preview: {
            select: {title: 'label', subtitle: 'layerId'},
          },
        }),
      ],
    }),

    // ── Overlays ──
    defineField({
      name: 'overlays',
      title: 'Overlays (Polylines)',
      type: 'array',
      group: 'overlays',
      description: 'Line overlays for roads, corridors, boundaries, etc.',
      of: [
        defineArrayMember({
          type: 'object',
          title: 'Overlay',
          fields: [
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              validation: (Rule) => Rule.required().max(80),
            }),
            defineField({
              name: 'coordinatesJson',
              title: 'Coordinates (JSON)',
              type: 'text',
              rows: 6,
              description: 'Polyline coordinates as JSON: [[lon,lat], [lon,lat], ...].',
              validation: (Rule) => Rule.required().custom(validateJson),
            }),
            defineField({name: 'strokeColor', title: 'Stroke Color', type: 'string', initialValue: '#ff4444'}),
            defineField({name: 'strokeWidth', title: 'Stroke Width', type: 'number', initialValue: 2}),
            defineField({
              name: 'strokeStyle',
              title: 'Stroke Style',
              type: 'string',
              options: {list: strokeStyleOptions},
              initialValue: 'solid',
            }),
            defineField({name: 'opacity', title: 'Opacity', type: 'number', initialValue: 1}),
            ...popupFields,
          ],
          preview: {
            select: {title: 'label'},
          },
        }),
      ],
    }),

    // ── Pins ──
    defineField({
      name: 'pins',
      title: 'Map Pins',
      type: 'array',
      group: 'pins',
      of: [
        defineArrayMember({
          type: 'object',
          title: 'Pin',
          fields: [
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              validation: (Rule) => Rule.required().max(80),
            }),
            defineField({
              name: 'longitude',
              title: 'Longitude',
              type: 'number',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'latitude',
              title: 'Latitude',
              type: 'number',
              validation: (Rule) => Rule.required(),
            }),
            defineField({name: 'color', title: 'Color', type: 'string', initialValue: '#c41e3a'}),
            defineField({
              name: 'size',
              title: 'Size',
              type: 'string',
              options: {list: pinSizeOptions},
              initialValue: 'md',
            }),
            ...popupFields,
          ],
          preview: {
            select: {title: 'label', subtitle: 'longitude'},
            prepare({title, subtitle}) {
              return {title: title || '(untitled pin)', subtitle: subtitle ? `lon: ${subtitle}` : ''}
            },
          },
        }),
      ],
    }),

    // ── Display ──
    defineField({
      name: 'height',
      title: 'Map Height (px)',
      type: 'number',
      group: 'display',
      initialValue: 500,
      description: 'Default rendered height in pixels.',
    }),
    defineField({
      name: 'accentColor',
      title: 'Accent Color',
      type: 'string',
      group: 'display',
      initialValue: '#c41e3a',
    }),
    defineField({
      name: 'enableZoom',
      title: 'Enable Zoom & Pan',
      type: 'boolean',
      group: 'display',
      initialValue: true,
    }),
    defineField({
      name: 'enableAnimation',
      title: 'Enable Animation',
      type: 'boolean',
      group: 'display',
      initialValue: false,
    }),
    defineField({
      name: 'animationPreset',
      title: 'Animation Preset',
      type: 'string',
      group: 'display',
      options: {list: animationPresetOptions},
      initialValue: 'none',
      description: 'Controls the map entrance animation. "District 48" uses the specialized animated component.',
    }),
  ],
  preview: {
    select: {title: 'title', subtitle: 'description'},
  },
})
