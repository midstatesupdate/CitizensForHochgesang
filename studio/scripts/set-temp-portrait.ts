import fs from 'node:fs'
import path from 'node:path'

import {getCliClient} from 'sanity/cli'

const DATASET = process.env.SANITY_STUDIO_DATASET ?? 'development'
const PROJECT_ID = process.env.SANITY_STUDIO_PROJECT_ID ?? 'n2oyijjv'
const API_VERSION = '2025-02-19'
const SITE_SETTINGS_ID = 'siteSettings'

const filePath = path.resolve(__dirname, 'assets', 'temp-candidate-portrait.svg')

const client = getCliClient({apiVersion: API_VERSION}).withConfig({
  projectId: PROJECT_ID,
  dataset: DATASET,
})

async function main() {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Temp portrait not found at ${filePath}`)
  }

  const uploaded = await client.assets.upload('image', fs.createReadStream(filePath), {
    filename: 'temp-candidate-portrait.svg',
  })

  await client
    .transaction()
    .createIfNotExists({_id: SITE_SETTINGS_ID, _type: 'siteSettings'})
    .patch(SITE_SETTINGS_ID, {
      set: {
        candidatePortrait: {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: uploaded._id,
          },
        },
        candidatePortraitAlt: 'Temporary candidate portrait placeholder image',
      },
    })
    .commit()

  console.log('Temporary candidate portrait set in siteSettings.')
  console.log(`Asset: ${uploaded._id}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
