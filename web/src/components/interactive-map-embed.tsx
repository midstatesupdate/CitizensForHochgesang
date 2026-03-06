'use client'

import {PortableText, type PortableTextComponents} from '@portabletext/react'

import type {InteractiveMapData} from '@/lib/cms/types'

import {IndianaDistrictMapWithPopups} from './indiana-district-map-with-popups'
import {InteractiveMap} from './interactive-map'
import {sharedBlockTypes} from './portable-block-types'

const popupPTComponents: PortableTextComponents = {
  types: {...sharedBlockTypes},
}

function renderBody(body: unknown[]) {
  return <PortableText value={body as never} components={popupPTComponents} />
}

/**
 * Renders a CMS-driven interactive map. If the map's animationPreset is
 * "district48", delegates to the specialized Indiana District 48 animated
 * component.
 */
export function InteractiveMapEmbed({
  mapData,
  caption,
  heightOverride,
}: {
  mapData: InteractiveMapData
  caption?: string
  heightOverride?: number
}) {
  // District 48 animated preset — delegate to specialized component
  if (mapData.animationPreset === 'district48') {
    // Collect popup data from inline map data
    const popups = [
      ...(mapData.layers ?? []).flatMap(l =>
        (l.regions ?? [])
          .filter(r => r.popupTitle)
          .map(r => ({
            key: r.regionKey ?? r.name,
            title: r.popupTitle!,
            body: r.popupBody,
            linkLabel: r.popupLinkLabel,
            linkUrl: r.popupLinkUrl,
          })),
      ),
      ...(mapData.pins ?? [])
        .filter(p => p.popupTitle)
        .map(p => ({
          key: p.label,
          title: p.popupTitle!,
          body: p.popupBody,
          linkLabel: p.popupLinkLabel,
          linkUrl: p.popupLinkUrl,
        })),
    ]

    return (
      <figure>
        <IndianaDistrictMapWithPopups
          label={mapData.title}
          popups={popups}
        />
        {caption && (
          <figcaption className="mt-2 text-center text-sm text-[color:var(--color-muted)]">
            {caption}
          </figcaption>
        )}
      </figure>
    )
  }

  return (
    <figure>
      <InteractiveMap
        mapData={mapData}
        renderPopupBody={renderBody}
        heightOverride={heightOverride}
      />
      {caption && (
        <figcaption className="mt-2 text-center text-sm text-[color:var(--color-muted)]">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
