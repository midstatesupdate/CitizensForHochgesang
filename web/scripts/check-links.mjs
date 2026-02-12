const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? 'scos8zjw'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'citizens-for-hochgesang'
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? '2025-02-19'

const query = `{
  "site": *[_type=="siteSettings"][0]{donateUrl, volunteerUrl, socialLinks[]{label,url}},
  "events": *[_type=="event"]{_id, title, rsvpLink},
  "media": *[_type=="mediaLink"]{_id, title, url},
  "fundraising": *[_type=="fundraisingLink"]{_id, title, url}
}`

const apiUrl = new URL(`https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}`)
apiUrl.searchParams.set('perspective', 'published')
apiUrl.searchParams.set('query', query)

const response = await fetch(apiUrl)
if (!response.ok) {
  console.error(`Failed to fetch content (${response.status})`)
  process.exit(1)
}

const payload = await response.json()
const result = payload.result

const knownInternalPrefixes = ['/', '/news', '/events', '/faq', '/media', '/press', '/support']

const links = []

if (result.site?.donateUrl) {
  links.push({source: 'siteSettings.donateUrl', label: 'Donate URL', url: result.site.donateUrl})
}
if (result.site?.volunteerUrl) {
  links.push({source: 'siteSettings.volunteerUrl', label: 'Volunteer URL', url: result.site.volunteerUrl})
}
for (const social of result.site?.socialLinks ?? []) {
  if (social?.url) {
    links.push({source: 'siteSettings.socialLinks', label: social.label ?? 'Social', url: social.url})
  }
}
for (const event of result.events ?? []) {
  if (event?.rsvpLink) {
    links.push({source: `event:${event._id}`, label: event.title ?? 'Event', url: event.rsvpLink})
  }
}
for (const media of result.media ?? []) {
  if (media?.url) {
    links.push({source: `mediaLink:${media._id}`, label: media.title ?? 'Media', url: media.url})
  }
}
for (const donation of result.fundraising ?? []) {
  if (donation?.url) {
    links.push({source: `fundraisingLink:${donation._id}`, label: donation.title ?? 'Fundraising', url: donation.url})
  }
}

const unique = Array.from(new Map(links.map((item) => [`${item.source}:${item.url}`, item])).values())
let failures = 0

console.log(`Checking ${unique.length} published links...`)

for (const item of unique) {
  const url = item.url

  if (url.startsWith('/')) {
    const isKnown = knownInternalPrefixes.some((prefix) => url === prefix || url.startsWith(`${prefix}/`))
    if (isKnown) {
      console.log(`OK internal ${item.source} -> ${url}`)
    } else {
      console.log(`FAIL unknown-internal ${item.source} -> ${url}`)
      failures += 1
    }
    continue
  }

  if (url.startsWith('#')) {
    console.log(`FAIL hash-only ${item.source} -> ${url}`)
    failures += 1
    continue
  }

  let parsed
  try {
    parsed = new URL(url)
  } catch {
    console.log(`FAIL invalid-url ${item.source} -> ${url}`)
    failures += 1
    continue
  }

  if (!['http:', 'https:'].includes(parsed.protocol)) {
    console.log(`SKIP non-http ${item.source} -> ${url}`)
    continue
  }

  try {
    const check = await fetch(url, {method: 'HEAD', redirect: 'follow'})
    if (check.ok || (check.status >= 300 && check.status < 400)) {
      console.log(`OK ${check.status} ${item.source} -> ${url}`)
    } else {
      console.log(`FAIL ${check.status} ${item.source} -> ${url}`)
      failures += 1
    }
  } catch {
    console.log(`FAIL network ${item.source} -> ${url}`)
    failures += 1
  }
}

if (failures > 0) {
  console.error(`Link check finished with ${failures} failure(s).`)
  process.exit(1)
}

console.log('Link check passed.')
