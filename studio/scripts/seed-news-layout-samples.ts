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
      newsBodyPreviewChars: 900,
      tags: ['layout-sample', 'feature-split'],
      body: portableText([
        'This sample article demonstrates the feature split layout with a widescreen 16:9 image and intentionally long body text so card truncation behavior is easy to evaluate at larger desktop widths.',
        'Use this to verify card rhythm, spacing, typography consistency, and visual balance against portrait-driven cards when the text column has significantly more content than the available vertical space.',
        'The crop and hotspot controls on the image can still fine-tune framing while preserving a consistent card ratio, which means editors can adjust focal points without breaking list alignment or page rhythm.',
        'In campaign publishing workflows, this allows one article to carry context-heavy detail while another remains concise, yet both still render in a unified system that is readable, accessible, and visually predictable.',
        'Additional filler copy is included here specifically to ensure six-line clamps are exceeded at wide breakpoints and that native ellipsis rendering appears at the end of the final visible line.',
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
      newsBodyPreviewChars: 900,
      tags: ['layout-sample', 'image-left'],
      body: portableText([
        'This sample validates portrait media in a left-hand layout while the body preview remains visually balanced against the image and intentionally exceeds the visible card copy area.',
        'When editors adjust crop and hotspot, the 4:5 ratio remains stable for consistent list design, allowing tightly framed portraits and event photography to coexist in the same feed.',
        'Animation is configured per article so this card can move differently without harming page cohesion, preserving consistency while still giving the content team meaningful per-post creative control.',
        'Long-form body text in this sample is deliberate: it confirms that truncation is handled by layout overflow rules rather than ad hoc punctuation or artificial hard-stop rendering.',
        'That behavior is especially important for responsive layouts where line length changes substantially between tablet and desktop experiences.',
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
      newsBodyPreviewChars: 900,
      tags: ['layout-sample', 'image-right'],
      body: portableText([
        'This card verifies right-side media alignment and demonstrates how DSLR-friendly imagery behaves in list context when the text column contains substantially more copy than can be displayed.',
        'Spacing, metadata, tags, and call-to-action placement remain consistent with other card variants despite layout differences, reinforcing a cohesive design system for campaign readers.',
        'The preview section is designed to truncate naturally at the final line boundary and should show native ellipsis behavior once available card space is consumed.',
        'This extended paragraph ensures truncation remains visible in wide desktop contexts where shorter copy might fully fit and therefore not visually demonstrate overflow treatment.',
        'By keeping this sample intentionally verbose, you can quickly verify truncation consistency across browser widths and layout options.',
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
      newsBodyPreviewChars: 900,
      tags: ['layout-sample', 'stacked'],
      body: portableText([
        'This stacked variant checks tall mobile-style imagery in a standard top-image card structure and intentionally uses long copy to force overflow in desktop and tablet breakpoints.',
        'Editors can use this when they want strong portrait framing while retaining predictable vertical rhythm in the list, even when article context is dense and requires additional body text.',
        'With a larger preview character limit, truncation depends on available space rather than aggressive early slicing, producing more natural previews for long-form campaign updates.',
        'This extra paragraph keeps the sample sufficiently verbose to prove line-clamp behavior in environments where card width increases and ordinary excerpts might otherwise render in full.',
        'The goal of this sample is visual QA confidence, not editorial brevity, so each line is purposely extended for overflow testing.',
      ]),
    })
    .commit()

  console.log(`News layout samples seeded in ${PROJECT_ID}/${DATASET}.`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
