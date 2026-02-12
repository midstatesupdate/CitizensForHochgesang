const SANITY_PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? 'scos8zjw'
const SANITY_DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'citizens-for-hochgesang'
const SANITY_API_VERSION = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? '2025-02-19'

type QueryParam = string | number | boolean

type QueryOptions = {
  revalidateSeconds?: number
}

const IS_PRODUCTION_BUILD = process.env.NEXT_PHASE === 'phase-production-build'

type SanityResponse<T> = {
  result: T
}

function buildQueryUrl(query: string, params?: Record<string, QueryParam>): string {
  const url = new URL(
    `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/query/${SANITY_DATASET}`
  )

  url.searchParams.set('query', query)
  url.searchParams.set('perspective', 'published')

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(`$${key}`, JSON.stringify(value))
    }
  }

  return url.toString()
}

export async function sanityQuery<T>(
  query: string,
  params?: Record<string, QueryParam>,
  options?: QueryOptions
): Promise<T | null> {
  try {
    const revalidateSeconds = options?.revalidateSeconds ?? 60
    const fetchOptions =
      revalidateSeconds <= 0
        ? IS_PRODUCTION_BUILD
          ? ({next: {revalidate: 60}} as const)
          : {cache: 'no-store' as const}
        : ({next: {revalidate: revalidateSeconds}} as const)

    const response = await fetch(buildQueryUrl(query, params), fetchOptions)

    if (!response.ok) {
      return null
    }

    const data = (await response.json()) as SanityResponse<T>
    return data.result
  } catch {
    return null
  }
}
