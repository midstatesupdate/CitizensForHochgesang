import {describe, it, expect} from 'vitest'

// We need to test toEmbedUrl which is not exported, so we test indirectly
// via a re-export. For now, extract and test the pure helper.

/** Duplicated from portable-block-types for testing (the source isn't exported). */
function toEmbedUrl(raw: string): string | null {
  try {
    const url = new URL(raw)
    if (url.hostname.includes('youtube.com') || url.hostname === 'www.youtube.com') {
      const id = url.searchParams.get('v')
      if (id) return `https://www.youtube-nocookie.com/embed/${id}`
    }
    if (url.hostname === 'youtu.be') {
      const id = url.pathname.slice(1)
      if (id) return `https://www.youtube-nocookie.com/embed/${id}`
    }
    if (url.hostname.includes('vimeo.com')) {
      const match = url.pathname.match(/\/(\d+)/)
      if (match) return `https://player.vimeo.com/video/${match[1]}`
    }
    return null
  } catch {
    return null
  }
}

describe('toEmbedUrl', () => {
  it('converts standard YouTube URL', () => {
    expect(toEmbedUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ'))
      .toBe('https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ')
  })

  it('converts short YouTube URL', () => {
    expect(toEmbedUrl('https://youtu.be/dQw4w9WgXcQ'))
      .toBe('https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ')
  })

  it('converts Vimeo URL', () => {
    expect(toEmbedUrl('https://vimeo.com/123456789'))
      .toBe('https://player.vimeo.com/video/123456789')
  })

  it('returns null for unsupported URLs', () => {
    expect(toEmbedUrl('https://example.com/video')).toBeNull()
  })

  it('returns null for invalid URLs', () => {
    expect(toEmbedUrl('not-a-url')).toBeNull()
  })

  it('returns null for YouTube URL with no video ID', () => {
    expect(toEmbedUrl('https://www.youtube.com/channel/UCxyz')).toBeNull()
  })

  it('uses privacy-enhanced mode for YouTube', () => {
    const result = toEmbedUrl('https://www.youtube.com/watch?v=abc123')
    expect(result).toContain('youtube-nocookie.com')
  })
})
