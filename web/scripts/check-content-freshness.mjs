const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? 'n2oyijjv'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production'
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? '2025-02-19'

const query = `{
  "events": *[_type=="event"]{_id, title, startDate, endDate},
  "posts": *[_type=="post"]{_id, title, publishedAt, excerpt}
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
const now = Date.now()
let failures = 0

for (const event of result.events ?? []) {
  const endDate = event.endDate ? Date.parse(event.endDate) : Date.parse(event.startDate)
  if (Number.isNaN(endDate)) {
    console.log(`FAIL invalid event date: ${event._id} (${event.title ?? 'untitled'})`)
    failures += 1
    continue
  }

  if (endDate < now - 7 * 24 * 60 * 60 * 1000) {
    console.log(`WARN stale event older than 7 days: ${event._id} (${event.title ?? 'untitled'})`)
  }
}

for (const post of result.posts ?? []) {
  if (!post.excerpt || post.excerpt.trim().length < 20) {
    console.log(`WARN short/missing excerpt: ${post._id} (${post.title ?? 'untitled'})`)
  }

  const publishedAt = Date.parse(post.publishedAt)
  if (Number.isNaN(publishedAt)) {
    console.log(`FAIL invalid post date: ${post._id} (${post.title ?? 'untitled'})`)
    failures += 1
  }
}

if (failures > 0) {
  console.error(`Freshness check finished with ${failures} hard failure(s).`)
  process.exit(1)
}

console.log('Freshness check completed with no hard failures.')
