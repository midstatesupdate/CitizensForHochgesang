import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import { sanityQuery } from './client'

// client.ts exports one function: sanityQuery. It is tested here by stubbing
// the global `fetch` so no real network calls are made.
// buildQueryUrl is an internal helper (unexported) and is exercised indirectly
// through these tests.

describe('sanityQuery', () => {
  beforeEach(() => {
    // Replace the global fetch with a Vitest mock so each test controls the response
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    // Restore globals and env vars to avoid state leaking between tests
    vi.unstubAllGlobals()
    vi.unstubAllEnvs()
  })

  it('returns null when fetch throws an error', async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error('Network error'))
    const result = await sanityQuery('*[_type=="post"]')
    expect(result).toBeNull()
  })

  it('returns null when the response is not ok', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      json: vi.fn(),
    } as unknown as Response)
    const result = await sanityQuery('*[_type=="post"]')
    expect(result).toBeNull()
  })

  it('returns data.result on a successful response', async () => {
    const payload = [{ title: 'Hello' }]
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: vi.fn().mockResolvedValueOnce({ result: payload }),
    } as unknown as Response)
    const result = await sanityQuery<{ title: string }[]>('*[_type=="post"]')
    expect(result).toEqual(payload)
  })

  it('returns null when data.result is null', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: vi.fn().mockResolvedValueOnce({ result: null }),
    } as unknown as Response)
    const result = await sanityQuery('*[_type=="post"]')
    expect(result).toBeNull()
  })

  it('builds the Sanity API URL with the correct host', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: vi.fn().mockResolvedValueOnce({ result: null }),
    } as unknown as Response)
    await sanityQuery('*[_type=="post"]')
    // Inspect the first positional argument of the first fetch call
    const [url] = vi.mocked(fetch).mock.calls[0] as [string, ...unknown[]]
    expect(url).toMatch(/\.api\.sanity\.io\//)
  })

  it('includes query and perspective=published in the URL', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: vi.fn().mockResolvedValueOnce({ result: null }),
    } as unknown as Response)
    await sanityQuery('*[_type=="post"]')
    const [urlStr] = vi.mocked(fetch).mock.calls[0] as [string, ...unknown[]]
    // Parse the URL so we can inspect individual search params cleanly
    const parsed = new URL(urlStr)
    expect(parsed.searchParams.get('perspective')).toBe('published')
    expect(parsed.searchParams.get('query')).toBe('*[_type=="post"]')
  })

  it('serializes string params into the query URL as JSON values', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: vi.fn().mockResolvedValueOnce({ result: null }),
    } as unknown as Response)
    await sanityQuery('*[_type=="post" && slug.current==$slug]', { slug: 'my-post' })
    const [urlStr] = vi.mocked(fetch).mock.calls[0] as [string, ...unknown[]]
    const parsed = new URL(urlStr)
    // Params are stored as JSON.stringify(value) — string values get JSON quotes
    expect(parsed.searchParams.get('$slug')).toBe('"my-post"')
  })

  it('serializes numeric params correctly', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: vi.fn().mockResolvedValueOnce({ result: null }),
    } as unknown as Response)
    await sanityQuery('*[count==$n]', { n: 42 })
    const [urlStr] = vi.mocked(fetch).mock.calls[0] as [string, ...unknown[]]
    const parsed = new URL(urlStr)
    // Numbers serialize without quotes, e.g. 42 → "42"
    expect(parsed.searchParams.get('$n')).toBe('42')
  })

  it('uses next.revalidate=60 by default (no options)', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: vi.fn().mockResolvedValueOnce({ result: null }),
    } as unknown as Response)
    await sanityQuery('*[_type=="post"]')
    // The second argument to fetch carries Next.js cache options
    const [, opts] = vi.mocked(fetch).mock.calls[0] as [string, { next?: { revalidate?: number } }]
    expect(opts?.next?.revalidate).toBe(60)
  })

  it('uses the provided revalidateSeconds value', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: vi.fn().mockResolvedValueOnce({ result: null }),
    } as unknown as Response)
    await sanityQuery('*[_type=="post"]', undefined, { revalidateSeconds: 300 })
    // Confirm the custom TTL is forwarded to Next.js revalidation
    const [, opts] = vi.mocked(fetch).mock.calls[0] as [string, { next?: { revalidate?: number } }]
    expect(opts?.next?.revalidate).toBe(300)
  })

  it('uses cache:no-store when revalidateSeconds is 0 (non-production build)', async () => {
    // NEXT_PHASE is unset in the test environment → IS_PRODUCTION_BUILD is false;
    // revalidateSeconds: 0 on a non-production build maps to cache: 'no-store'
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: vi.fn().mockResolvedValueOnce({ result: null }),
    } as unknown as Response)
    await sanityQuery('*[_type=="siteSettings"]', undefined, { revalidateSeconds: 0 })
    const [, opts] = vi.mocked(fetch).mock.calls[0] as [string, { cache?: string; next?: unknown }]
    expect(opts?.cache).toBe('no-store')
  })
})
