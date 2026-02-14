import {getCliClient} from 'sanity/cli'

type PageVisualSeed = {
  id: string
  pageKey: string
  backgroundVariant: 'stately-gradient' | 'civic-fabric' | 'diagonal-wash' | 'signal-grid' | 'topo-lines'
  containerVariant: 'standard' | 'narrow' | 'wide'
  toneVariant: 'default' | 'news' | 'events' | 'media' | 'support'
  motionPreset: 'still' | 'calm' | 'balanced' | 'lively' | 'energetic'
  textLinkAnimation: 'none' | 'subtle' | 'sweep' | 'glint'
  pageBackgroundAnimation: 'none' | 'drift' | 'tracers' | 'drift-tracers' | 'pulse'
  scrollRevealAnimation: 'none' | 'soft' | 'dynamic' | 'cascade'
}

const visuals: PageVisualSeed[] = [
  {
    id: 'pageVisual.home',
    pageKey: 'home',
    backgroundVariant: 'stately-gradient',
    containerVariant: 'standard',
    toneVariant: 'default',
    motionPreset: 'calm',
    textLinkAnimation: 'sweep',
    pageBackgroundAnimation: 'drift',
    scrollRevealAnimation: 'soft',
  },
  {
    id: 'pageVisual.news',
    pageKey: 'news',
    backgroundVariant: 'topo-lines',
    containerVariant: 'standard',
    toneVariant: 'news',
    motionPreset: 'balanced',
    textLinkAnimation: 'glint',
    pageBackgroundAnimation: 'pulse',
    scrollRevealAnimation: 'dynamic',
  },
  {
    id: 'pageVisual.news-detail',
    pageKey: 'news-detail',
    backgroundVariant: 'civic-fabric',
    containerVariant: 'narrow',
    toneVariant: 'news',
    motionPreset: 'calm',
    textLinkAnimation: 'subtle',
    pageBackgroundAnimation: 'none',
    scrollRevealAnimation: 'soft',
  },
  {
    id: 'pageVisual.events',
    pageKey: 'events',
    backgroundVariant: 'diagonal-wash',
    containerVariant: 'standard',
    toneVariant: 'events',
    motionPreset: 'lively',
    textLinkAnimation: 'sweep',
    pageBackgroundAnimation: 'drift',
    scrollRevealAnimation: 'dynamic',
  },
  {
    id: 'pageVisual.events-detail',
    pageKey: 'events-detail',
    backgroundVariant: 'civic-fabric',
    containerVariant: 'narrow',
    toneVariant: 'events',
    motionPreset: 'calm',
    textLinkAnimation: 'subtle',
    pageBackgroundAnimation: 'none',
    scrollRevealAnimation: 'soft',
  },
  {
    id: 'pageVisual.faq',
    pageKey: 'faq',
    backgroundVariant: 'civic-fabric',
    containerVariant: 'standard',
    toneVariant: 'support',
    motionPreset: 'still',
    textLinkAnimation: 'none',
    pageBackgroundAnimation: 'none',
    scrollRevealAnimation: 'cascade',
  },
  {
    id: 'pageVisual.platform',
    pageKey: 'platform',
    backgroundVariant: 'stately-gradient',
    containerVariant: 'standard',
    toneVariant: 'support',
    motionPreset: 'balanced',
    textLinkAnimation: 'sweep',
    pageBackgroundAnimation: 'drift',
    scrollRevealAnimation: 'soft',
  },
  {
    id: 'pageVisual.platform-detail',
    pageKey: 'platform-detail',
    backgroundVariant: 'civic-fabric',
    containerVariant: 'narrow',
    toneVariant: 'support',
    motionPreset: 'calm',
    textLinkAnimation: 'subtle',
    pageBackgroundAnimation: 'none',
    scrollRevealAnimation: 'soft',
  },
  {
    id: 'pageVisual.media',
    pageKey: 'media',
    backgroundVariant: 'signal-grid',
    containerVariant: 'standard',
    toneVariant: 'media',
    motionPreset: 'lively',
    textLinkAnimation: 'glint',
    pageBackgroundAnimation: 'tracers',
    scrollRevealAnimation: 'dynamic',
  },
  {
    id: 'pageVisual.press',
    pageKey: 'press',
    backgroundVariant: 'signal-grid',
    containerVariant: 'standard',
    toneVariant: 'media',
    motionPreset: 'calm',
    textLinkAnimation: 'subtle',
    pageBackgroundAnimation: 'drift-tracers',
    scrollRevealAnimation: 'soft',
  },
  {
    id: 'pageVisual.support',
    pageKey: 'support',
    backgroundVariant: 'stately-gradient',
    containerVariant: 'standard',
    toneVariant: 'support',
    motionPreset: 'balanced',
    textLinkAnimation: 'glint',
    pageBackgroundAnimation: 'drift',
    scrollRevealAnimation: 'cascade',
  },
]

async function run() {
  const projectId = process.env.SANITY_STUDIO_PROJECT_ID ?? 'n2oyijjv'
  const dataset = process.env.SANITY_STUDIO_DATASET ?? 'development'

  const client = getCliClient({apiVersion: '2025-02-19'}).withConfig({
    projectId,
    dataset,
  })

  for (const item of visuals) {
    await client.createOrReplace({
      _id: item.id,
      _type: 'pageVisualSettings',
      pageKey: item.pageKey,
      backgroundVariant: item.backgroundVariant,
      containerVariant: item.containerVariant,
      toneVariant: item.toneVariant,
      motionPreset: item.motionPreset,
      textLinkAnimation: item.textLinkAnimation,
      pageBackgroundAnimation: item.pageBackgroundAnimation,
      scrollRevealAnimation: item.scrollRevealAnimation,
    })
  }

  await client
    .patch('siteSettings')
    .unset(['motionPreset', 'textLinkAnimation', 'pageBackgroundAnimation', 'scrollRevealAnimation'])
    .commit({autoGenerateArrayKeys: true})

  console.log(`Synced ${visuals.length} page visual setting documents and migrated animation settings to page-level controls.`)
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
