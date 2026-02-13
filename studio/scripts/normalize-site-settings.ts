import {getCliClient} from 'sanity/cli'

type PortableTextSpan = {
  _type?: string
  text?: string
}

type PortableTextBlock = {
  _type?: string
  children?: PortableTextSpan[]
}

type SiteSettingsDoc = {
  _id: string
  homeHeroLayout?: string | null
  homeLinkMarkup?: string | PortableTextBlock[] | null
}

const DATASET = process.env.SANITY_STUDIO_DATASET ?? 'production'
const PROJECT_ID = process.env.SANITY_STUDIO_PROJECT_ID ?? 'n2oyijjv'
const API_VERSION = '2025-02-19'
const DEFAULT_HTML =
  '<span class="home-link-line">Brad Hochgesang</span><span class="home-link-line">For State Senate</span>'

const client = getCliClient({apiVersion: API_VERSION}).withConfig({
  projectId: PROJECT_ID,
  dataset: DATASET,
})

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function toMarkup(value: SiteSettingsDoc['homeLinkMarkup']): string {
  if (typeof value === 'string') {
    const trimmed = value.trim()
    return trimmed.length > 0 ? trimmed : DEFAULT_HTML
  }

  if (Array.isArray(value)) {
    const lines = value
      .map((block) =>
        (block.children ?? [])
          .filter((child) => child?._type === 'span' && typeof child.text === 'string')
          .map((child) => child.text ?? '')
          .join('')
          .trim()
      )
      .filter((line) => line.length > 0)

    if (lines.length > 0) {
      return lines.map((line) => `<span class="home-link-line">${escapeHtml(line)}</span>`).join('')
    }
  }

  return DEFAULT_HTML
}

async function main() {
  const docs = await client.fetch<SiteSettingsDoc[]>(
    `*[_id in ["siteSettings", "drafts.siteSettings"]]{_id, homeHeroLayout, homeLinkMarkup}`
  )

  if (!docs.length) {
    await client.createIfNotExists({_id: 'siteSettings', _type: 'siteSettings'})
    await client.patch('siteSettings').set({homeHeroLayout: 'clean-split', homeLinkMarkup: DEFAULT_HTML}).commit()
    console.log(`Normalized siteSettings in ${PROJECT_ID}/${DATASET} (created missing document).`)
    return
  }

  for (const doc of docs) {
    await client
      .patch(doc._id)
      .set({
        homeHeroLayout: 'clean-split',
        homeLinkMarkup: toMarkup(doc.homeLinkMarkup),
      })
      .commit()
  }

  console.log(`Normalized ${docs.length} siteSettings document(s) in ${PROJECT_ID}/${DATASET}.`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
