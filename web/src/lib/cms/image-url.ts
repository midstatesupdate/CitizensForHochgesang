import {createImageUrlBuilder} from '@sanity/image-url'

import type {SanityImageSource} from './types'

const SANITY_PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? 'n2oyijjv'
const SANITY_DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production'

const imageBuilder = createImageUrlBuilder({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
})

type ImageOptions = {
  width?: number
  height?: number
}

export function getSanityImageUrl(source: SanityImageSource | undefined, options?: ImageOptions): string | undefined {
  if (!source?.asset?._ref) {
    return undefined
  }

  let builder = imageBuilder.image(source).fit('crop').auto('format')

  if (options?.width) {
    builder = builder.width(options.width)
  }

  if (options?.height) {
    builder = builder.height(options.height)
  }

  return builder.url()
}
