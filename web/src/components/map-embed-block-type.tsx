'use client'

/**
 * PortableText block-type renderer for `mapEmbed`.
 *
 * Exported separately from sharedBlockTypes to avoid a circular dependency
 * (InteractiveMapEmbed imports sharedBlockTypes for popup rendering).
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
