/**
 * migrate-to-page-settings.ts
 *
 * Copies home-specific fields from the `siteSettings` document to a new
 * `homePageSettings` singleton and optionally migrates `pageVisualSettings`
 * visuals into the embedded `visuals` object on the home page settings doc.
 *
 * Run with:
 *   npx sanity exec scripts/migrate-to-page-settings.ts --with-user-token
 *
 * Safe to run multiple times — skips fields that already exist on the target.
 */
import {getCliClient} from 'sanity/cli'

const DATASET = process.env.SANITY_STUDIO_DATASET ?? 'production'
const PROJECT_ID = process.env.SANITY_STUDIO_PROJECT_ID ?? 'n2oyijjv'
const API_VERSION = '2025-02-19'

const client = getCliClient({apiVersion: API_VERSION}).withConfig({
  projectId: PROJECT_ID,
  dataset: DATASET,
  useCdn: false,
})

const SITE_SETTINGS_ID = 'siteSettings'
const HOME_PAGE_SETTINGS_ID = 'homePageSettings'

/**
 * Maps old siteSettings field names → new homePageSettings field names.
 * Image/file fields that contain asset references are handled as-is (deep copy).
 */
const FIELD_MAP: Record<string, string> = {
  // Hero group
  homeHeroLayout: 'heroLayout',
  candidatePortrait: 'candidatePortrait',
  candidatePortraitAlt: 'candidatePortraitAlt',
  candidatePortraitCaption: 'candidatePortraitCaption',
  homeDistrictLabel: 'districtLabel',
  homeHeroSummary: 'heroSummary',
  enableDistrictMap: 'enableDistrictMap',
  homeHeroActions: 'heroActions',
  homeHeroBadges: 'heroBadges',
  homeFocusItems: 'focusItems',

  // Why Running group
  homeWhyRunningHeading: 'whyRunningHeading',
  homeWhyRunningBody: 'whyRunningBody',
  homeWhyRunningImage: 'whyRunningImage',

  // Cards & CTA group
  homeMidCtaHeading: 'midCtaHeading',
  homeMidCtaCopy: 'midCtaCopy',
  homeSectionCards: 'sectionCards',

  // Proof group
  homeProofHeading: 'proofHeading',
  homeProofStats: 'proofStats',
  homeProofBody: 'proofBody',

  // Countdown group
  countdownTimers: 'countdownTimers',
}

async function migrate() {
  console.log(`\n🔄 Migrating home fields from siteSettings → homePageSettings (${DATASET})…\n`)

  // ── 1. Fetch existing siteSettings ──
  const site = await client.fetch(`*[_id == $id][0]`, {id: SITE_SETTINGS_ID})
  if (!site) {
    console.log('⚠️  No siteSettings document found — nothing to migrate.')
    return
  }

  // ── 2. Check if homePageSettings already exists ──
  const existing = await client.fetch(`*[_id == $id][0]`, {id: HOME_PAGE_SETTINGS_ID})

  // ── 3. Build the fields to copy ──
  const homeFields: Record<string, unknown> = {}
  let copied = 0
  let skipped = 0

  for (const [oldKey, newKey] of Object.entries(FIELD_MAP)) {
    const value = site[oldKey]
    if (value === undefined || value === null) {
      console.log(`   skip ${oldKey} → (not set in siteSettings)`)
      skipped++
      continue
    }

    // If target doc already has a value for this field, skip it (idempotent)
    if (existing && existing[newKey] !== undefined && existing[newKey] !== null) {
      console.log(`   skip ${oldKey} → ${newKey} (already exists on target)`)
      skipped++
      continue
    }

    homeFields[newKey] = value
    console.log(`   copy ${oldKey} → ${newKey}`)
    copied++
  }

  // ── 4. Migrate pageVisualSettings "home" visuals if they exist ──
  const pvs = await client.fetch(
    `*[_type == "pageVisualSettings" && pageKey == "home"][0]{
      backgroundVariant, containerVariant, toneVariant,
      motionPreset, textLinkAnimation, pageBackgroundAnimation,
      scrollProgressBar, magneticButtons, scrollRevealAnimation
    }`,
  )

  if (pvs && (!existing || !existing.visuals)) {
    const visualFields: Record<string, unknown> = {}
    let hasAny = false
    for (const [key, val] of Object.entries(pvs)) {
      if (val !== undefined && val !== null && !key.startsWith('_')) {
        visualFields[key] = val
        hasAny = true
      }
    }
    if (hasAny) {
      homeFields.visuals = {_type: 'pageVisuals', ...visualFields}
      console.log('   copy pageVisualSettings(home) → visuals')
      copied++
    }
  }

  if (copied === 0) {
    console.log('\n✅ Nothing new to migrate. Target document is already up to date.')
    return
  }

  // ── 5. Create or patch the homePageSettings document ──
  const tx = client.transaction()

  if (existing) {
    tx.patch(HOME_PAGE_SETTINGS_ID, (p) => p.set(homeFields))
  } else {
    tx.createIfNotExists({
      _id: HOME_PAGE_SETTINGS_ID,
      _type: 'homePageSettings',
      ...homeFields,
    })
  }

  await tx.commit()

  console.log(`\n✅ Migration complete: ${copied} field(s) copied, ${skipped} skipped.`)
  console.log(`   Document: ${HOME_PAGE_SETTINGS_ID}`)
  console.log('\n📌 Remember to publish the homePageSettings document in Studio.')
}

migrate().catch((err) => {
  console.error('❌ Migration failed:', err)
  process.exit(1)
})
