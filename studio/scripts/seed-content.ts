import {getCliClient} from 'sanity/cli'

const DATASET = 'citizens-for-hochgesang'
const PROJECT_ID = 'scos8zjw'
const API_VERSION = '2025-02-19'

const client = getCliClient({apiVersion: API_VERSION}).withConfig({
  projectId: PROJECT_ID,
  dataset: DATASET,
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

async function main() {
  const settings = await client.fetch<{campaignLogo?: {_type: 'image'; asset?: {_type: 'reference'; _ref: string}}} | null>(
    `*[_type == "siteSettings"][0]{campaignLogo}`
  )

  const logoImage = settings?.campaignLogo

  const now = new Date()
  const daysFromNow = (days: number) => new Date(now.getTime() + days * 24 * 60 * 60 * 1000).toISOString()

  await client
    .transaction()
    .createOrReplace({
      _id: 'post-launch-district-48',
      _type: 'post',
      title: 'Launching a District 48 Listening Tour',
      slug: {_type: 'slug', current: 'launching-district-48-listening-tour'},
      excerpt:
        'Our campaign is expanding direct conversations with voters across Jeffersonville, Charlestown, and surrounding communities.',
      publishedAt: daysFromNow(-2),
      coverImage: logoImage,
      tags: ['community', 'campaign updates'],
      body: portableText([
        'This week we begin a district-wide listening tour focused on practical priorities for families and small businesses.',
        'Residents can share ideas on transportation, public safety, education, and local economic development.',
        'The campaign will publish summary updates and next-step priorities after each stop.',
      ]),
    })
    .createOrReplace({
      _id: 'post-small-business-roundtable',
      _type: 'post',
      title: 'Small Business Roundtable Priorities',
      slug: {_type: 'slug', current: 'small-business-roundtable-priorities'},
      excerpt:
        'Local employers and entrepreneurs shared policy ideas to support growth, workforce development, and predictable regulations.',
      publishedAt: daysFromNow(-1),
      coverImage: logoImage,
      tags: ['economy', 'small business'],
      body: portableText([
        'District 48 business owners highlighted workforce needs and permitting friction as top concerns.',
        'Our policy approach centers on reducing unnecessary delays while keeping communities safe and competitive.',
        'Additional roundtables will be scheduled in the coming weeks to keep this feedback loop active.',
      ]),
    })
    .createOrReplace({
      _id: 'event-jeffersonville-townhall',
      _type: 'event',
      title: 'Jeffersonville Community Town Hall',
      startDate: daysFromNow(7),
      location: 'Jeffersonville Public Library',
      description:
        'Open Q&A with district residents focused on transportation priorities, local jobs, and constituent services.',
      rsvpLink: 'https://www.ngpvan.com/',
      scheduleImage: logoImage,
    })
    .createOrReplace({
      _id: 'event-charlestown-coffee-chat',
      _type: 'event',
      title: 'Coffee and Conversation in Charlestown',
      startDate: daysFromNow(11),
      location: 'Charlestown Civic Center',
      description:
        'Informal community conversation with campaign volunteers and neighbors from across District 48.',
      rsvpLink: 'https://www.ngpvan.com/',
      scheduleImage: logoImage,
    })
    .createOrReplace({
      _id: 'media-kickoff-address',
      _type: 'mediaLink',
      title: 'Campaign Kickoff Address',
      mediaType: 'youtube',
      url: 'https://www.youtube.com/',
      publishedAt: daysFromNow(-2),
      thumbnail: logoImage,
    })
    .createOrReplace({
      _id: 'media-facebook-community-update',
      _type: 'mediaLink',
      title: 'Community Update on Facebook',
      mediaType: 'facebook',
      url: 'https://www.facebook.com/bradhochesangforindianastatesenate',
      publishedAt: daysFromNow(-1),
      thumbnail: logoImage,
    })
    .commit()

  console.log('Seed content created/updated successfully.')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
