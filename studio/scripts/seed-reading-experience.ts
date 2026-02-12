import {getCliClient} from 'sanity/cli'

const DATASET = 'citizens-for-hochgesang'
const PROJECT_ID = 'scos8zjw'
const API_VERSION = '2025-02-19'

const client = getCliClient({apiVersion: API_VERSION}).withConfig({
  projectId: PROJECT_ID,
  dataset: DATASET,
})

function block(text: string, key: string) {
  return {
    _key: key,
    _type: 'block',
    style: 'normal',
    children: [
      {
        _key: `${key}-span`,
        _type: 'span',
        text,
        marks: [],
      },
    ],
    markDefs: [],
  }
}

function paragraphBlocks(paragraphs: string[], prefix: string) {
  return paragraphs.map((text, index) => block(text, `${prefix}-${index + 1}`))
}

function imageRef(assetRef: string | undefined, key: string) {
  if (!assetRef) {
    return null
  }

  return {
    _key: key,
    _type: 'image',
    asset: {
      _type: 'reference',
      _ref: assetRef,
    },
    alt: 'Campaign visual sample',
  }
}

async function main() {
  const settings = await client.fetch<{campaignLogo?: {asset?: {_ref?: string}}} | null>(
    `*[_type == "siteSettings"][0]{campaignLogo{asset->{_id}}}`
  )

  const logoAssetRef = settings?.campaignLogo?.asset?._ref

  const now = new Date()
  const daysAgo = (days: number) => new Date(now.getTime() - days * 24 * 60 * 60 * 1000).toISOString()

  const longIntroA = [
    'District 48 deserves infrastructure that is dependable, transparent, and planned with long-term community impact in mind.',
    'This sample article demonstrates an interactive reading flow where key moments appear as the user scrolls, blending narrative sections with visual and statistical callouts.',
    'The goal is not flashy distraction; the goal is to create momentum and curiosity so voters keep reading to the end and leave with clarity.',
    'Our campaign communication model emphasizes plain language, measurable outcomes, and practical timelines that local families can evaluate for themselves.',
    'When we discuss roads, utilities, and digital access, we are discussing the daily reliability people feel when getting to work, school, appointments, and community events.',
    'As you continue down this article, each scene demonstrates a different way to tell policy stories with rhythm and structure.',
  ]

  const longIntroB = [
    'Constituent service can be responsive without becoming chaotic, especially when teams have structured workflows and clear accountability.',
    'This sample focuses on an AI-assisted service model where technology supports staff decisions instead of replacing local judgment.',
    'Residents should be able to ask for help, receive status updates, and understand next steps without getting lost in fragmented systems.',
    'In this reading experience, scenes appear at strategic moments to help readers absorb one concept at a time while maintaining narrative pace.',
    'The article structure below is intentionally long-form so campaign managers and student contributors can experiment with pacing and presentation.',
    'Use it as a template for future posts that combine policy, operations, and community stories in a clear sequence.',
  ]

  await client
    .transaction()
    .createOrReplace({
      _id: 'post-reading-experience-infrastructure-blueprint',
      _type: 'post',
      title: 'Sample Experience: District 48 Infrastructure Blueprint',
      slug: {_type: 'slug', current: 'sample-experience-district-48-infrastructure-blueprint'},
      excerpt:
        'A long-form sample article showcasing scene-driven storytelling, fly-in sections, and stat callouts for policy communication.',
      publishedAt: daysAgo(3),
      coverImage: logoAssetRef
        ? {
            _type: 'image',
            asset: {_type: 'reference', _ref: logoAssetRef},
          }
        : undefined,
      tags: ['sample', 'reading experience', 'infrastructure'],
      body: [
        ...paragraphBlocks(longIntroA, 'infra-intro'),
        ...(imageRef(logoAssetRef, 'infra-image-1') ? [imageRef(logoAssetRef, 'infra-image-1')] : []),
        ...paragraphBlocks(
          [
            'Modern campaign publishing should make complex policy readable, memorable, and verifiable. Scene blocks and data callouts provide that scaffolding.',
            'By mixing narrative context with measured highlights, readers experience progress as they scroll instead of facing a wall of text.',
            'This pattern helps volunteers, students, and campaign staff collaborate on high-quality public communication with less friction.',
          ],
          'infra-outro'
        ),
      ],
      storyTimeline: [
        {
          _key: 'infra-scene-1',
          _type: 'storyScene',
          sceneTitle: 'Scene 1: Reliability as a daily quality-of-life issue',
          layout: 'split-right',
          animationPreset: 'fade-up',
          animationDelayMs: 0,
          animationDurationMs: 720,
          body: paragraphBlocks(
            [
              'When infrastructure fails, it is families and small businesses who absorb the uncertainty first. Our policy framing starts with daily reliability.',
              'This scene uses a split layout to pair context and visual identity while keeping the reading pace calm and focused.',
            ],
            'infra-scene-1-body'
          ),
          media: logoAssetRef
            ? {_type: 'image', asset: {_type: 'reference', _ref: logoAssetRef}}
            : undefined,
          mediaAlt: 'Infrastructure planning sample visual',
        },
        {
          _key: 'infra-stats-1',
          _type: 'statCallout',
          headline: 'Program Design Principles',
          animationPreset: 'zoom-soft',
          animationDelayMs: 90,
          animationDurationMs: 860,
          items: [
            {_key: 'infra-stat-1', value: '3', label: 'Planning phases', note: 'Audit, prioritize, execute'},
            {_key: 'infra-stat-2', value: '4', label: 'Public update windows', note: 'Monthly scorecard rhythm'},
            {_key: 'infra-stat-3', value: '1', label: 'Shared dashboard model', note: 'Single source of truth'},
            {_key: 'infra-stat-4', value: '100%', label: 'Open status visibility', note: 'No hidden queue work'},
          ],
        },
        {
          _key: 'infra-scene-2',
          _type: 'storyScene',
          sceneTitle: 'Scene 2: Transparency without overload',
          layout: 'highlight',
          animationPreset: 'slide-left',
          animationDelayMs: 60,
          animationDurationMs: 900,
          body: paragraphBlocks(
            [
              'Voters do not need every internal detail; they need clear milestones, current status, and expected next actions.',
              'Highlight panels work well for policy pivots where you want readers to pause and absorb a key message.',
            ],
            'infra-scene-2-body'
          ),
        },
        {
          _key: 'infra-scene-3',
          _type: 'storyScene',
          sceneTitle: 'Scene 3: Building the implementation cadence',
          layout: 'split-left',
          animationPreset: 'slide-right',
          animationDelayMs: 120,
          animationDurationMs: 980,
          body: paragraphBlocks(
            [
              'Long-form communication can mirror implementation cadence: define scope, track progress, and report outcomes at predictable intervals.',
              'This final scene demonstrates stronger lateral motion while still staying subtle and readable on mobile and desktop.',
            ],
            'infra-scene-3-body'
          ),
          media: logoAssetRef
            ? {_type: 'image', asset: {_type: 'reference', _ref: logoAssetRef}}
            : undefined,
          mediaAlt: 'Execution cadence sample visual',
        },
      ],
    })
    .createOrReplace({
      _id: 'post-reading-experience-ai-service-model',
      _type: 'post',
      title: 'Sample Experience: AI-Assisted Constituent Service Model',
      slug: {_type: 'slug', current: 'sample-experience-ai-assisted-constituent-service-model'},
      excerpt:
        'A long-form sample showing how scene storytelling can explain service operations, response flow, and accountability.',
      publishedAt: daysAgo(2),
      coverImage: logoAssetRef
        ? {
            _type: 'image',
            asset: {_type: 'reference', _ref: logoAssetRef},
          }
        : undefined,
      tags: ['sample', 'reading experience', 'constituent services', 'ai'],
      body: [
        ...paragraphBlocks(longIntroB, 'service-intro'),
        ...(imageRef(logoAssetRef, 'service-image-1') ? [imageRef(logoAssetRef, 'service-image-1')] : []),
        ...paragraphBlocks(
          [
            'This structure gives campaign managers a repeatable framework for publishing deep-dive articles without overwhelming readers.',
            'Student contributors can adjust animation presets and layout scene-by-scene to test readability and engagement.',
            'As your editorial team matures, these same patterns can power issue explainers, event recaps, and accountability updates.',
          ],
          'service-outro'
        ),
      ],
      storyTimeline: [
        {
          _key: 'service-scene-1',
          _type: 'storyScene',
          sceneTitle: 'Scene 1: Intake clarity and first response',
          layout: 'text',
          animationPreset: 'fade-up',
          animationDelayMs: 0,
          animationDurationMs: 700,
          body: paragraphBlocks(
            [
              'Every request should enter one queue with a clear timestamp and category so teams can prioritize fairly and communicate clearly.',
              'This text-focused scene keeps the experience lightweight while introducing operational structure.',
            ],
            'service-scene-1-body'
          ),
        },
        {
          _key: 'service-stats-1',
          _type: 'statCallout',
          headline: 'Service Flow Benchmarks',
          animationPreset: 'slide-right',
          animationDelayMs: 100,
          animationDurationMs: 900,
          items: [
            {_key: 'service-stat-1', value: '24h', label: 'First response target', note: 'Initial acknowledgement'},
            {_key: 'service-stat-2', value: '72h', label: 'Status update rhythm', note: 'Progress communication'},
            {_key: 'service-stat-3', value: '1', label: 'Unified issue queue', note: 'No duplicate threads'},
          ],
        },
        {
          _key: 'service-scene-2',
          _type: 'storyScene',
          sceneTitle: 'Scene 2: Human review with AI assistance',
          layout: 'split-right',
          animationPreset: 'zoom-soft',
          animationDelayMs: 70,
          animationDurationMs: 860,
          body: paragraphBlocks(
            [
              'AI can summarize constituent history, suggest response drafts, and flag urgency signals while staff remain accountable for final decisions.',
              'This scene demonstrates a media-supported narrative section that can evolve into infographics later.',
            ],
            'service-scene-2-body'
          ),
          media: logoAssetRef
            ? {_type: 'image', asset: {_type: 'reference', _ref: logoAssetRef}}
            : undefined,
          mediaAlt: 'AI-assisted workflow sample visual',
        },
        {
          _key: 'service-scene-3',
          _type: 'storyScene',
          sceneTitle: 'Scene 3: Publish outcomes, not just promises',
          layout: 'highlight',
          animationPreset: 'slide-left',
          animationDelayMs: 120,
          animationDurationMs: 980,
          body: paragraphBlocks(
            [
              'The strongest trust signal is routine publication of outcomes: what was requested, what was resolved, and what remains in progress.',
              'Use this closing scene pattern for accountability-focused posts where transparency is the central message.',
            ],
            'service-scene-3-body'
          ),
        },
      ],
    })
    .commit()

  console.log('Reading experience sample posts created/updated successfully.')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
