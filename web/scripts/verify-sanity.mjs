const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? 'n2oyijjv'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production'
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? '2025-02-19'

const query = `{
  "siteSettingsCount": count(*[_type=="siteSettings"]),
  "siteSettingsWithLogoCount": count(*[_type=="siteSettings" && defined(campaignLogo.asset)]),
  "postCount": count(*[_type=="post"]),
  "postsWithCoverImageCount": count(*[_type=="post" && defined(coverImage.asset)]),
  "eventCount": count(*[_type=="event"]),
  "eventsWithScheduleImageCount": count(*[_type=="event" && defined(scheduleImage.asset)]),
  "mediaCount": count(*[_type=="mediaLink"]),
  "mediaWithThumbnailCount": count(*[_type=="mediaLink" && defined(thumbnail.asset)]),
  "fundraisingCount": count(*[_type=="fundraisingLink"]),
  "fundraisingWithImageCount": count(*[_type=="fundraisingLink" && defined(image.asset)])
}`

const url = new URL(
  `https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}`
)
url.searchParams.set('perspective', 'published')
url.searchParams.set('query', query)

const response = await fetch(url)

if (!response.ok) {
  console.error(`Sanity query failed (${response.status})`)
  console.error(await response.text())
  process.exit(1)
}

const payload = await response.json()
const counts = payload.result

console.log('Sanity published content counts:')
for (const [key, value] of Object.entries(counts)) {
  console.log(`- ${key}: ${value}`)
}

const hasPublishedContent = Object.values(counts).some((value) => Number(value) > 0)

if (!hasPublishedContent) {
  console.log('No published content found; web app will use mock fallback data.')
}
