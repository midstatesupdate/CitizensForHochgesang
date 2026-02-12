import {getCliClient} from 'sanity/cli'

const DATASET = 'citizens-for-hochgesang'
const PROJECT_ID = 'scos8zjw'
const API_VERSION = '2025-02-19'

const client = getCliClient({apiVersion: API_VERSION}).withConfig({
  projectId: PROJECT_ID,
  dataset: DATASET,
})

type SiteSettingsDoc = {
  _id: string
  socialLinks?: Array<
    | {
        _key?: string
        _type?: string
        label?: string
        url?: string
      }
    | null
  >
}

function makeKey(label: string | undefined, index: number): string {
  const base = (label ?? `item-${index + 1}`)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  return `${base || `item-${index + 1}`}-${index + 1}`
}

async function main() {
  const docs = await client.fetch<SiteSettingsDoc[]>(
    `*[_type == "siteSettings"]{_id, socialLinks}`
  )

  if (!docs.length) {
    console.log('No siteSettings documents found.')
    return
  }

  let patchedCount = 0

  for (const doc of docs) {
    const socialLinks = doc.socialLinks ?? []
    const nextSocialLinks = socialLinks.map((item, index) => {
      const safeItem = item ?? {}

      return {
        _key: safeItem._key ?? makeKey(safeItem.label, index),
        _type: 'object',
        label: safeItem.label ?? '',
        url: safeItem.url ?? '',
      }
    })

    const missingAnyKey = socialLinks.some((item) => !item?._key)
    if (!missingAnyKey) {
      continue
    }

    await client.patch(doc._id).set({socialLinks: nextSocialLinks}).commit()
    patchedCount += 1
    console.log(`Patched missing keys in ${doc._id}`)
  }

  if (patchedCount === 0) {
    console.log('No missing keys found.')
    return
  }

  console.log(`Done. Patched ${patchedCount} document(s).`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
