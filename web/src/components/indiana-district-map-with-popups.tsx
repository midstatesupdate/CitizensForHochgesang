'use client'

import {PortableText, type PortableTextComponents} from '@portabletext/react'

import {sharedBlockTypes} from './portable-block-types'
import {IndianaDistrictMap, type MapRegionPopup} from './indiana-district-map'

const popupPTComponents: PortableTextComponents = {
  types: {...sharedBlockTypes},
}

function renderBody(body: unknown[]) {
  return <PortableText value={body as never} components={popupPTComponents} />
}

export function IndianaDistrictMapWithPopups({
  label,
  popups,
}: {
  label?: string
  popups?: MapRegionPopup[]
}) {
  return (
    <IndianaDistrictMap
      label={label}
      popups={popups}
      renderPopupBody={renderBody}
    />
  )
}
