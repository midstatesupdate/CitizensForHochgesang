import {getCliClient} from 'sanity/cli'

const DATASET = 'citizens-for-hochgesang'
const PROJECT_ID = 'scos8zjw'
const API_VERSION = '2025-02-19'
const SITE_SETTINGS_ID = 'siteSettings'

const client = getCliClient({apiVersion: API_VERSION}).withConfig({
  projectId: PROJECT_ID,
  dataset: DATASET,
})

async function main() {
  await client
    .patch(SITE_SETTINGS_ID)
    .set({
      pressUpdatedAt: new Date().toISOString(),
      socialLinks: [
        {
          _key: 'facebook',
          _type: 'object',
          label: 'Facebook',
          url: 'https://www.facebook.com/bradhochesangforindianastatesenate',
        },
        {
          _key: 'youtube',
          _type: 'object',
          label: 'YouTube',
          url: 'https://www.youtube.com/',
        },
      ],
    })
    .commit()

  console.log('Updated siteSettings social links.')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
