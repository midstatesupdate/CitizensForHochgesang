import {defineField, defineType} from 'sanity'

export const pageVisualSettings = defineType({
  name: 'pageVisualSettings',
  title: 'Page Visual Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'pageKey',
      title: 'Page',
      type: 'string',
      description: 'Select which route these visual settings apply to.',
      options: {
        list: [
          {title: 'Home (/)', value: 'home'},
          {title: 'News Listing (/news)', value: 'news'},
          {title: 'News Detail (/news/[slug])', value: 'news-detail'},
          {title: 'Events (/events)', value: 'events'},
          {title: 'Event Detail (/events/[slug])', value: 'events-detail'},
          {title: 'FAQ (/faq)', value: 'faq'},
          {title: 'About & Priorities (/platform)', value: 'platform'},
          {title: 'Priority Detail (/platform/[slug])', value: 'platform-detail'},
          {title: 'Media & Press (/media)', value: 'media'},
          {title: 'Press (/press)', value: 'press'},
          {title: 'Support (/support)', value: 'support'},
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
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
        'Adds subtle accent color family for headings and labels. Choose based on page narrative to keep visual consistency without overpowering content.',
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
        'Persistent page-level motion (not content containers). None: static. Drift: gentle atmospheric movement. Tracers: subtle moving signal lines. Drift + Tracers: both effects blended softly.',
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
      name: 'scrollRevealAnimation',
      title: 'Scroll Reveal Animation',
      type: 'string',
      description:
        'Controls how sections enter while scrolling, especially on touch devices. None: immediate display. Soft: light fade/slide. Dynamic: stronger motion. Cascade: staggered progressive reveal.',
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
  preview: {
    select: {
      title: 'pageKey',
      subtitle: 'backgroundVariant',
      mediaTone: 'toneVariant',
      container: 'containerVariant',
    },
    prepare(selection) {
      const subtitleParts = [selection.subtitle, selection.mediaTone, selection.container].filter(Boolean)
      return {
        title: selection.title ?? 'Page Visual Settings',
        subtitle: subtitleParts.join(' • '),
      }
    },
  },
})
