import {getCliClient} from 'sanity/cli'

const DATASET = process.env.SANITY_STUDIO_DATASET ?? 'development'
const PROJECT_ID = process.env.SANITY_STUDIO_PROJECT_ID ?? 'n2oyijjv'
const API_VERSION = '2025-02-19'

const client = getCliClient({apiVersion: API_VERSION}).withConfig({
  projectId: PROJECT_ID,
  dataset: DATASET,
  useCdn: false,
})

const RESET_TYPES = ['post', 'event', 'mediaLink', 'fundraisingLink', 'aboutPriorities', 'siteSettings'] as const

async function main() {
  if (DATASET !== 'development') {
    throw new Error(`Refusing reset: dataset is "${DATASET}". This script is development-only.`)
  }

  const ids = await client.fetch<string[]>(
    `*[_type in $types]._id`,
    {types: RESET_TYPES},
  )

  if (!ids.length) {
    console.log('No matching development content docs found. Nothing to delete.')
    return
  }

  const transaction = client.transaction()
  for (const id of ids) {
    transaction.delete(id)
  }

  await transaction.commit()
  console.log(`Deleted ${ids.length} development content documents.`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
