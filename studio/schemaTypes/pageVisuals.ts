import {defineField, defineType} from 'sanity'

/**
 * Reusable object type containing all per-page visual controls.
 * Embedded as a field in each page settings document (homePageSettings,
 * newsPageSettings, etc.) rather than stored as a standalone document.
 */
export const pageVisuals = defineType({
  name: 'pageVisuals',
  title: 'Visual Settings',
  type: 'object',
  fields: [
    defineField({
      name: 'backgroundVariant',
      title: 'Background Texture',
      type: 'string',
      description:
        'Controls subtle page texture. Stately Gradient: polished civic glow. Civic Fabric: woven heritage texture. Diagonal Wash: directional motion feel. Signal Grid: structured modern grid. Topographic Lines: layered contour lines.',
      options: {
        list: [
          {title: 'Stately Gradient', value: 'stately-gradient'},
          {title: 'Civic Fabric', value: 'civic-fabric'},
          {title: 'Diagonal Wash', value: 'diagonal-wash'},
          {title: 'Signal Grid', value: 'signal-grid'},
          {title: 'Topographic Lines', value: 'topo-lines'},
        ],
        layout: 'radio',
      },
      initialValue: 'stately-gradient',
    }),
    defineField({
      name: 'containerVariant',
      title: 'Container Width',
      type: 'string',
      options: {
        list: [
          {title: 'Standard', value: 'standard'},
          {title: 'Narrow', value: 'narrow'},
          {title: 'Wide', value: 'wide'},
        ],
        layout: 'radio',
      },
      initialValue: 'standard',
    }),
    defineField({
      name: 'toneVariant',
      title: 'Color Tone',
      type: 'string',
      description:
        'Adds subtle accent color family for headings and labels.',
      options: {
        list: [
          {title: 'Civic Neutral', value: 'default'},
          {title: 'Policy Brief Blue', value: 'news'},
          {title: 'Community Action Green', value: 'events'},
          {title: 'Media Spotlight Magenta', value: 'media'},
          {title: 'Volunteer Gold', value: 'support'},
        ],
        layout: 'radio',
      },
      initialValue: 'default',
    }),
    defineField({
      name: 'motionPreset',
      title: 'Interaction Motion Preset',
      type: 'string',
      description:
        'Controls hover and movement intensity. Still: almost no motion. Calm: very subtle. Balanced: recommended default. Lively: noticeable but restrained. Energetic: strongest movement.',
      options: {
        list: [
          {title: 'Still', value: 'still'},
          {title: 'Calm', value: 'calm'},
          {title: 'Balanced', value: 'balanced'},
          {title: 'Lively', value: 'lively'},
          {title: 'Energetic', value: 'energetic'},
        ],
        layout: 'radio',
      },
      initialValue: 'balanced',
    }),
    defineField({
      name: 'textLinkAnimation',
      title: 'Text Link Animation',
      type: 'string',
      description:
        'Controls plain text link behavior. None: static links. Subtle: low-key underline fade. Sweep: clean underline travel. Glint: soft highlight pass.',
      options: {
        list: [
          {title: 'None', value: 'none'},
          {title: 'Sweep', value: 'sweep'},
          {title: 'Subtle', value: 'subtle'},
          {title: 'Glint', value: 'glint'},
        ],
        layout: 'radio',
      },
      initialValue: 'sweep',
    }),
    defineField({
      name: 'pageBackgroundAnimation',
      title: 'Page Background Animation',
      type: 'string',
      description:
        'Persistent page-level motion. None: static. Drift: gentle atmospheric movement. Tracers: subtle moving signal lines. Drift + Tracers: both effects blended softly.',
      options: {
        list: [
          {title: 'None', value: 'none'},
          {title: 'Drift', value: 'drift'},
          {title: 'Grid Tracers', value: 'tracers'},
          {title: 'Drift + Tracers', value: 'drift-tracers'},
          {title: 'Pulse Field', value: 'pulse'},
        ],
        layout: 'radio',
      },
      initialValue: 'drift',
    }),
    defineField({
      name: 'scrollProgressBar',
      title: 'Scroll Progress Bar',
      type: 'boolean',
      description:
        'Show a thin accent-colored progress bar at the top of the viewport that fills as the visitor scrolls.',
      initialValue: false,
    }),
    defineField({
      name: 'magneticButtons',
      title: 'Magnetic CTA Buttons',
      type: 'boolean',
      description:
        'CTA buttons subtly pull toward the cursor on hover. Desktop only — ignored on touch devices.',
      initialValue: false,
    }),
    defineField({
      name: 'scrollRevealAnimation',
      title: 'Scroll Reveal Animation',
      type: 'string',
      description:
        'Controls how sections enter while scrolling. None: immediate. Soft: light fade/slide. Dynamic: stronger motion. Cascade: staggered progressive reveal.',
      options: {
        list: [
          {title: 'None', value: 'none'},
          {title: 'Soft', value: 'soft'},
          {title: 'Dynamic', value: 'dynamic'},
          {title: 'Cascade', value: 'cascade'},
        ],
        layout: 'radio',
      },
      initialValue: 'soft',
    }),
  ],
})
