/**
 * PortableText block-type renderer for `mapEmbed`.
 *
 * Exported separately from sharedBlockTypes to avoid a circular dependency
 * (InteractiveMapEmbed imports sharedBlockTypes for popup rendering).
 *
 * NOT marked 'use client' — this is a server component that renders the
 * client-side InteractiveMapEmbed. If marked 'use client', the exported
 * object becomes a client module reference that can't be spread into the
 * PortableText types object in server components.
 *
 * Usage:
 * ```
 * types: { ...sharedBlockTypes, ...mapEmbedBlockType }
 * ```
 */

import type {PortableTextTypeComponentProps} from '@portabletext/react'

import type {MapEmbedData} from '@/lib/cms/types'

import {InteractiveMapEmbed} from './interactive-map-embed'

function MapEmbedRenderer({value}: PortableTextTypeComponentProps<MapEmbedData>) {
  if (!value?.map) return null

  return (
    <InteractiveMapEmbed
      mapData={value.map}
      caption={value.caption}
      heightOverride={value.heightOverride}
    />
  )
}

export const mapEmbedBlockType = {
  mapEmbed: MapEmbedRenderer,
} as const
