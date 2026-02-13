import fs from 'node:fs'
import path from 'node:path'

import {getCliClient} from 'sanity/cli'

const logoPathArg =
  process.env.LOGO_PATH ??
  process.argv
  .slice(2)
  .find((arg) => !arg.startsWith('-') && /\.(png|jpg|jpeg|webp|svg)$/i.test(arg))

if (!logoPathArg) {
  throw new Error('Usage: sanity exec scripts/apply-branding.ts --with-user-token -- "<logo-file-path>"')
}

const logoPath = path.resolve(logoPathArg)
if (!fs.existsSync(logoPath)) {
  throw new Error(`Logo file not found at: ${logoPath}`)
}

const DATASET = process.env.SANITY_STUDIO_DATASET ?? 'development'
const PROJECT_ID = process.env.SANITY_STUDIO_PROJECT_ID ?? 'n2oyijjv'
const API_VERSION = '2025-02-19'
const SITE_SETTINGS_ID = 'siteSettings'
const FUNDRAISING_ID = 'fund-actblue-main'

const DONATE_URL = 'https://secure.actblue.com/donate/brad-hochgesang-1'
const VOLUNTEER_URL = 'https://www.ngpvan.com/'

const client = getCliClient({apiVersion: API_VERSION}).withConfig({
  projectId: PROJECT_ID,
  dataset: DATASET,
})

async function main() {
  const uploadedLogo = await client.assets.upload('image', fs.createReadStream(logoPath), {
    filename: path.basename(logoPath),
  })

  await client
    .transaction()
    .createIfNotExists({
      _id: SITE_SETTINGS_ID,
      _type: 'siteSettings',
    })
    .patch(SITE_SETTINGS_ID, {
      set: {
        siteTitle: 'Brad Hochgesang for State Senate',
        tagline: 'Practical leadership for Indiana State Senate District 48.',
        campaignLogo: {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: uploadedLogo._id,
          },
        },
        campaignLogoAlt: 'Brad Hochgesang for State Senate campaign logo',
        pressUpdatedAt: new Date().toISOString(),
        donateUrl: DONATE_URL,
        volunteerUrl: VOLUNTEER_URL,
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
      },
    })
    .createOrReplace({
      _id: FUNDRAISING_ID,
      _type: 'fundraisingLink',
      title: 'Donate with ActBlue',
      url: DONATE_URL,
      description: 'Secure online contribution for campaign operations and voter outreach.',
      priority: 100,
      image: {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: uploadedLogo._id,
        },
      },
    })
    .commit()

  console.log('Branding and links applied successfully.')
  console.log(`Logo asset: ${uploadedLogo._id}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
