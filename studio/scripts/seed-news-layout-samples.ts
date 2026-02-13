import {getCliClient} from 'sanity/cli'

const DATASET = process.env.SANITY_STUDIO_DATASET ?? 'development'
const PROJECT_ID = process.env.SANITY_STUDIO_PROJECT_ID ?? 'n2oyijjv'
const API_VERSION = '2025-02-19'

const client = getCliClient({apiVersion: API_VERSION}).withConfig({
  projectId: PROJECT_ID,
  dataset: DATASET,
  useCdn: false,
})

function portableText(paragraphs: string[]) {
  return paragraphs.map((text, index) => ({
    _key: `block-${index + 1}`,
    _type: 'block',
    style: 'normal',
    children: [
      {
        _key: `span-${index + 1}`,
        _type: 'span',
        text,
        marks: [],
      },
    ],
    markDefs: [],
  }))
}

function sampleSvg(width: number, height: number, title: string, subtitle: string, gradientA: string, gradientB: string) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${gradientA}"/>
      <stop offset="100%" stop-color="${gradientB}"/>
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#g)"/>
  <circle cx="${Math.round(width * 0.78)}" cy="${Math.round(height * 0.23)}" r="${Math.round(Math.min(width, height) * 0.16)}" fill="#f2c45a" opacity="0.28"/>
  <text x="${Math.round(width * 0.06)}" y="${Math.round(height * 0.68)}" fill="#ffffff" font-size="${Math.round(Math.min(width, height) * 0.075)}" font-family="Arial, sans-serif" font-weight="700">${title}</text>
  <text x="${Math.round(width * 0.06)}" y="${Math.round(height * 0.76)}" fill="#efe6ff" font-size="${Math.round(Math.min(width, height) * 0.04)}" font-family="Arial, sans-serif">${subtitle}</text>
</svg>`
}

async function uploadSvgImage(filename: string, svg: string) {
  const file = Buffer.from(svg, 'utf8')
  return client.assets.upload('image', file, {
    filename,
    contentType: 'image/svg+xml',
  })
}

async function main() {
  const now = new Date()
  const daysAgo = (days: number) => new Date(now.getTime() - days * 24 * 60 * 60 * 1000).toISOString()

  const assets = await Promise.all([
    uploadSvgImage(
      'news-layout-landscape-3x2.svg',
      sampleSvg(1500, 1000, 'DSLR Landscape 3:2', 'Layout sample', '#4a2778', '#b896ff')
    ),
    uploadSvgImage(
      'news-layout-landscape-16x9.svg',
      sampleSvg(1600, 900, 'Widescreen 16:9', 'Layout sample', '#1a1229', '#5f3d99')
    ),
    uploadSvgImage(
      'news-layout-portrait-4x5.svg',
      sampleSvg(1000, 1250, 'Portrait 4:5', 'Layout sample', '#3a245f', '#b896ff')
    ),
    uploadSvgImage(
      'news-layout-portrait-9x16.svg',
      sampleSvg(900, 1600, 'Phone Portrait 9:16', 'Layout sample', '#24163d', '#7a52bf')
    ),
  ])

  await client
    .transaction()
    .createOrReplace({
      _id: 'post-news-layout-feature-split',
      _type: 'post',
      title: 'News Layout Sample: Feature Split with 16:9 Image',
      slug: {_type: 'slug', current: 'news-layout-feature-split-16-9'},
      excerpt: 'Feature split layout with widescreen media and fade-up animation.',
      publishedAt: daysAgo(1),
      coverImage: {_type: 'image', asset: {_type: 'reference', _ref: assets[1]._id}},
      newsCardLayout: 'feature-split',
      newsImageOrientation: 'landscape',
      newsImageAspectRatio: '16:9',
      newsCardAnimation: 'fade-up',
      newsBodyPreviewChars: 460,
      tags: ['layout-sample', 'feature-split'],
      body: portableText([
        'This sample article demonstrates the feature split layout with a widescreen 16:9 image and a longer body preview block.',
        'Use this to verify card rhythm, spacing, and typography consistency next to other layout combinations.',
        'The crop/hotspot controls on the image can still fine-tune framing while preserving a consistent card ratio.',
      ]),
    })
    .createOrReplace({
      _id: 'post-news-layout-image-left-4-5',
      _type: 'post',
      title: 'News Layout Sample: Image Left with Portrait 4:5',
      slug: {_type: 'slug', current: 'news-layout-image-left-4-5'},
      excerpt: 'Image-left layout with portrait framing and left-slide animation.',
      publishedAt: daysAgo(2),
      coverImage: {_type: 'image', asset: {_type: 'reference', _ref: assets[2]._id}},
      newsCardLayout: 'image-left',
      newsImageOrientation: 'portrait',
      newsImageAspectRatio: '4:5',
      newsCardAnimation: 'slide-left',
      newsBodyPreviewChars: 430,
      tags: ['layout-sample', 'image-left'],
      body: portableText([
        'This sample validates portrait media in a left-hand layout while the body preview remains visually balanced against the image.',
        'When editors adjust crop and hotspot, the 4:5 ratio remains stable for consistent list design.',
        'Animation is configured per article so this card can move differently without harming page cohesion.',
      ]),
    })
    .createOrReplace({
      _id: 'post-news-layout-image-right-3-2',
      _type: 'post',
      title: 'News Layout Sample: Image Right with DSLR 3:2',
      slug: {_type: 'slug', current: 'news-layout-image-right-3-2'},
      excerpt: 'Image-right layout with DSLR ratio and right-slide animation.',
      publishedAt: daysAgo(3),
      coverImage: {_type: 'image', asset: {_type: 'reference', _ref: assets[0]._id}},
      newsCardLayout: 'image-right',
      newsImageOrientation: 'landscape',
      newsImageAspectRatio: '3:2',
      newsCardAnimation: 'slide-right',
      newsBodyPreviewChars: 420,
      tags: ['layout-sample', 'image-right'],
      body: portableText([
        'This card verifies right-side media alignment and demonstrates how DSLR-friendly imagery behaves in list context.',
        'Spacing, metadata, tags, and CTA remain consistent with other card variants despite layout differences.',
        'The preview section should fade and ellipsize once it reaches the available card space.',
      ]),
    })
    .createOrReplace({
      _id: 'post-news-layout-stacked-9-16',
      _type: 'post',
      title: 'News Layout Sample: Stacked with Phone Portrait 9:16',
      slug: {_type: 'slug', current: 'news-layout-stacked-9-16'},
      excerpt: 'Stacked layout with tall media and slide-up animation.',
      publishedAt: daysAgo(4),
      coverImage: {_type: 'image', asset: {_type: 'reference', _ref: assets[3]._id}},
      newsCardLayout: 'stacked',
      newsImageOrientation: 'portrait',
      newsImageAspectRatio: '9:16',
      newsCardAnimation: 'slide-up',
      newsBodyPreviewChars: 480,
      tags: ['layout-sample', 'stacked'],
      body: portableText([
        'This stacked variant checks tall mobile-style imagery in a standard top-image card structure.',
        'Editors can use this when they want strong portrait framing while retaining predictable vertical rhythm in the list.',
        'With the larger preview character limit, the body text reliably transitions to fade and ellipsis.',
      ]),
    })
    .commit()

  console.log(`News layout samples seeded in ${PROJECT_ID}/${DATASET}.`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
