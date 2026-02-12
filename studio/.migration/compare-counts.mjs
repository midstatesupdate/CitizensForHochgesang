const query = `{
  "total": count(*),
  "post": count(*[_type=="post"]),
  "event": count(*[_type=="event"]),
  "media": count(*[_type=="mediaLink"]),
  "fundraising": count(*[_type=="fundraisingLink"]),
  "siteSettings": count(*[_type=="siteSettings"])
}`

async function getCounts(projectId, dataset) {
  const url = new URL(`https://${projectId}.api.sanity.io/v2025-02-19/data/query/${dataset}`)
  url.searchParams.set('query', query)
  url.searchParams.set('perspective', 'published')

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed ${projectId}/${dataset}: ${response.status} ${await response.text()}`)
  }

  const payload = await response.json()
  return payload.result
}

const source = await getCounts('scos8zjw', 'citizens-for-hochgesang')
const target = await getCounts('n2oyijjv', 'production')

console.log(JSON.stringify({
  source: {projectId: 'scos8zjw', dataset: 'citizens-for-hochgesang', counts: source},
  target: {projectId: 'n2oyijjv', dataset: 'production', counts: target},
}, null, 2))
