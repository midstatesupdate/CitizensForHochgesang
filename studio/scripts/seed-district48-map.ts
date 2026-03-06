/**
 * Seeds the "Indiana Senate District 48" interactive map document.
 *
 * Run from the studio directory:
 *   npx sanity exec scripts/seed-district48-map.ts --with-user-token
 */
import {getCliClient} from 'sanity/cli'

const DATASET = process.env.SANITY_STUDIO_DATASET ?? 'development'
const PROJECT_ID = process.env.SANITY_STUDIO_PROJECT_ID ?? 'n2oyijjv'
const API_VERSION = '2025-02-19'

const client = getCliClient({apiVersion: API_VERSION}).withConfig({
  projectId: PROJECT_ID,
  dataset: DATASET,
  useCdn: false,
})

// ── Helpers ──

function key(prefix: string, name: string): string {
  return `${prefix}-${name.toLowerCase().replace(/\s+/g, '-')}`
}

function portableText(paragraphs: string[]) {
  return paragraphs.map((text, index) => ({
    _key: `block-${index + 1}`,
    _type: 'block' as const,
    style: 'normal' as const,
    children: [{_key: `span-${index + 1}`, _type: 'span' as const, text, marks: []}],
    markDefs: [],
  }))
}

// ── Projection constants (must match indiana-district-map.tsx) ──

function toSvgX(lon: number) { return (lon + 88.097) * 90.47 + 10 }
function toSvgY(lat: number) { return (41.761 - lat) * 116.9 + 12.19 }

// State bbox
const STATE_BBOX = { minLon: -88.097892, maxLon: -84.784579, minLat: 37.771742, maxLat: 41.760512 }
const stateVBWidth = (toSvgX(STATE_BBOX.maxLon) - toSvgX(STATE_BBOX.minLon)) + 8  // ~308

// District bbox
const DISTRICT_BBOX = { minLon: -87.988037, maxLon: -86.245581, minLat: 37.782354, maxLat: 38.552220 }
const districtVBWidth = (toSvgX(DISTRICT_BBOX.maxLon) - toSvgX(DISTRICT_BBOX.minLon)) + 16  // ~174

// Midpoints for zoom level thresholds
const showCountiesBelow = Math.round((stateVBWidth + districtVBWidth) / 2)  // ~241
const showTownshipsBelow = Math.round(districtVBWidth * 0.5)  // ~87

// ── County data (coordinates imported inline from the coordinate file) ──
// We read the coordinate file at runtime to extract JSON arrays.

import * as fs from 'fs'
import * as path from 'path'

const COORD_FILE = path.resolve(__dirname, '../../web/src/components/indiana-district-map-coordinates.tsx')

// We'll use a brute-force approach: eval the TS file as JS after stripping types
function loadCoordinateData() {
  let src = fs.readFileSync(COORD_FILE, 'utf-8')

  // Strip TypeScript-only syntax
  src = src
    // Remove type imports/exports
    .replace(/export type [^;]+;/g, '')
    .replace(/export interface [\s\S]*?^}/gm, '')
    // Remove type annotations from consts
    .replace(/: District48Data/g, '')
    .replace(/: District(?!\d)/g, '')
    .replace(/: StateOutline/g, '')
    .replace(/: County\[\]/g, '')
    .replace(/: LonLat/g, '')
    .replace(/: BoundingBox/g, '')
    .replace(/: GeoRing\[\]/g, '')
    .replace(/: Township/g, '')
    // Remove export statements
    .replace(/export default [^;]+;/g, '')
    .replace(/export \{[^}]*\};?/g, '')
    // Remove export keyword from type declarations
    .replace(/^export /gm, '')

  // Wrap in a module-like scope and extract
  const fn = new Function(`
    ${src}
    return { district, counties, stateOutline };
  `)
  return fn()
}

const geo = loadCoordinateData()

// ── County descriptions ──

const COUNTY_INFO: Record<string, {color: string; desc: string}> = {
  Perry: {
    color: '#c8d4e8',
    desc: 'Perry County is home to Tell City and the Lincoln Heritage Trail. It borders the Ohio River and offers scenic beauty along the Hoosier National Forest.',
  },
  Spencer: {
    color: '#e8d4c8',
    desc: 'Spencer County is the boyhood home of Abraham Lincoln. The Lincoln Boyhood National Memorial and Holiday World & Splashin\' Safari are beloved local landmarks.',
  },
  Gibson: {
    color: '#f0d8c0',
    desc: 'Gibson County is the largest county in District 48 by area. Princeton, the county seat, anchors a community built on agriculture and energy production.',
  },
  Pike: {
    color: '#d8e0f0',
    desc: 'Pike County sits at the heart of the district. Petersburg, the county seat, serves as a gateway to Patoka Lake and surrounding recreation areas.',
  },
  Crawford: {
    color: '#e8e8c8',
    desc: 'Crawford County is known for its caves, forests, and the Blue River. Marengo Cave and the Wyandotte Caves draw visitors from across the state.',
  },
  Dubois: {
    color: '#c8dfc8',
    desc: 'Dubois County is the economic engine of the district. Jasper, the county seat, is home to major furniture manufacturers and a strong German-heritage community.',
  },
}

// ── Build the document ──

async function main() {
  console.log('Building District 48 interactive map document...')

  // Build state outline region
  const stateCoords = geo.stateOutline.rings.map((r: {coordinates: number[][]}) => r.coordinates)

  // Build district boundary region
  const districtCoords = geo.district.rings.map((r: {coordinates: number[][]}) => r.coordinates)

  // Build county regions
  const countyRegions = geo.counties.map((c: {
    name: string; centroid: number[]; rings: {coordinates: number[][]}[];
    townships: {name: string; county: string; centroid: number[]; rings: {coordinates: number[][]}[]}[]
  }) => {
    const info = COUNTY_INFO[c.name] ?? {color: '#ddd', desc: ''}
    return {
      _key: key('county', c.name),
      _type: 'object',
      name: c.name,
      regionKey: `county:${c.name}`,
      coordinatesJson: JSON.stringify(c.rings.map((r: {coordinates: number[][]}) => r.coordinates)),
      centroid: `${c.centroid[0]}, ${c.centroid[1]}`,
      fillColor: info.color,
      strokeColor: '#1a1a2e',
      strokeWidth: 1.0,
      popupTitle: `${c.name} County`,
      popupBody: portableText([info.desc]),
      popupLinkLabel: 'Learn more',
      popupLinkUrl: `/platform`,
    }
  })

  // Build township regions (nested inside a separate layer)
  const townshipRegions: Array<Record<string, unknown>> = []
  for (const c of geo.counties) {
    for (const t of c.townships) {
      const twpName = t.name.replace(/\s*(Township|Twp)$/i, '')
      townshipRegions.push({
        _key: key('twp', `${c.name}-${twpName}`),
        _type: 'object',
        name: twpName,
        regionKey: `township:${c.name}:${twpName}`,
        coordinatesJson: JSON.stringify(t.rings.map((r: {coordinates: number[][]}) => r.coordinates)),
        centroid: `${t.centroid[0]}, ${t.centroid[1]}`,
        fillColor: 'transparent',
        strokeColor: '#556',
        strokeWidth: 0.45,
        strokeStyle: 'dashed',
        popupTitle: `${twpName} Township — ${c.name} County`,
        popupBody: portableText([
          `${twpName} Township is part of ${c.name} County in Indiana Senate District 48.`,
        ]),
      })
    }
  }

  // Build pins for counties (visible at district zoom)
  const countyPins = geo.counties.map((c: {name: string; centroid: number[]}) => ({
    _key: key('pin-county', c.name),
    _type: 'object',
    label: `${c.name} County`,
    longitude: c.centroid[0],
    latitude: c.centroid[1],
    color: '#8b1a1a',
    size: 'md',
    popupTitle: `${c.name} County`,
    popupBody: portableText([
      (COUNTY_INFO[c.name]?.desc ?? `${c.name} County is part of Indiana Senate District 48.`),
    ]),
    popupLinkLabel: 'Learn more',
    popupLinkUrl: '/platform',
  }))

  // Build pin for the district itself (visible at state zoom)
  const districtPin = {
    _key: 'pin-district-48',
    _type: 'object',
    label: 'Senate District 48',
    longitude: geo.district.centroid[0],
    latitude: geo.district.centroid[1],
    color: '#8b1a1a',
    size: 'lg',
    popupTitle: 'Indiana Senate District 48',
    popupBody: portableText([
      'Indiana Senate District 48 spans six counties in southwestern Indiana: Dubois, Gibson, Pike, Spencer, Perry, and Crawford.',
      'This district is represented in the Indiana State Senate and encompasses a diverse mix of communities — from the furniture capital of Jasper to the historic Ohio River towns.',
    ]),
    popupLinkLabel: 'Meet Brad Hochgesang',
    popupLinkUrl: '/about',
  }

  const doc = {
    _id: 'interactiveMap-district48',
    _type: 'interactiveMap',
    title: 'Indiana Senate District 48',
    slug: {_type: 'slug', current: 'district-48'},
    description: 'Interactive map of Indiana showing Senate District 48 with county and township boundaries.',
    projection: {
      _type: 'object',
      originLon: -88.097,
      originLat: 41.761,
      scaleX: 90.47,
      scaleY: 116.9,
      offsetX: 10,
      offsetY: 12,
    },
    defaultViewport: {
      _type: 'object',
      x: 0,
      y: 0,
      width: 320,
      height: 500,
    },
    layers: [
      // Layer 1: State outline (always visible)
      {
        _key: 'layer-state',
        _type: 'object',
        label: 'Indiana State Outline',
        layerId: 'state',
        visible: true,
        defaultFillColor: 'rgba(235,232,225,0.4)',
        defaultStrokeColor: '#1a1a2e',
        defaultStrokeWidth: 1.8,
        defaultStrokeStyle: 'solid',
        regions: [
          {
            _key: 'region-indiana',
            _type: 'object',
            name: 'Indiana',
            regionKey: 'state:Indiana',
            coordinatesJson: JSON.stringify(stateCoords),
            fillColor: 'rgba(235,232,225,0.4)',
            strokeColor: '#1a1a2e',
            strokeWidth: 1.8,
          },
        ],
      },
      // Layer 2: County fills (visible at district level and below)
      {
        _key: 'layer-counties',
        _type: 'object',
        label: 'District 48 Counties',
        layerId: 'counties',
        visible: true,
        minZoomWidth: showCountiesBelow,
        defaultFillColor: '#e8d5b7',
        defaultStrokeColor: '#1a1a2e',
        defaultStrokeWidth: 1.0,
        defaultStrokeStyle: 'solid',
        regions: countyRegions,
      },
      // Layer 3: Township boundaries (visible at county level and below)
      {
        _key: 'layer-townships',
        _type: 'object',
        label: 'Townships',
        layerId: 'townships',
        visible: true,
        minZoomWidth: showTownshipsBelow,
        defaultFillColor: 'transparent',
        defaultStrokeColor: '#556',
        defaultStrokeWidth: 0.45,
        defaultStrokeStyle: 'dashed',
        regions: townshipRegions,
      },
      // Layer 4: District 48 boundary outline (always visible, on top)
      {
        _key: 'layer-district',
        _type: 'object',
        label: 'District 48 Boundary',
        layerId: 'district',
        visible: true,
        defaultFillColor: 'rgba(139,26,26,0.1)',
        defaultStrokeColor: '#8b1a1a',
        defaultStrokeWidth: 1.5,
        defaultStrokeStyle: 'solid',
        regions: [
          {
            _key: 'region-district48',
            _type: 'object',
            name: 'District 48',
            regionKey: 'district:District 48',
            coordinatesJson: JSON.stringify(districtCoords),
            centroid: `${geo.district.centroid[0]}, ${geo.district.centroid[1]}`,
            fillColor: 'rgba(139,26,26,0.1)',
            strokeColor: '#8b1a1a',
            strokeWidth: 1.5,
            popupTitle: 'Indiana Senate District 48',
            popupBody: portableText([
              'Senate District 48 covers six counties in southwestern Indiana: Dubois, Gibson, Pike, Spencer, Perry, and Crawford.',
            ]),
            popupLinkLabel: 'Meet the candidate',
            popupLinkUrl: '/about',
          },
        ],
      },
    ],
    overlays: [],
    pins: [districtPin, ...countyPins],
    height: 600,
    accentColor: '#8b1a1a',
    enableZoom: true,
    enableAnimation: false,
    animationPreset: 'none',
  }

  console.log(`Creating document with ${countyRegions.length} counties, ${townshipRegions.length} townships, ${countyPins.length + 1} pins...`)
  console.log(`Zoom thresholds: counties visible below width ${showCountiesBelow}, townships below ${showTownshipsBelow}`)

  await client.createOrReplace(doc)
  console.log('Done! Document ID:', doc._id)
}

main().catch((err) => {
  console.error('Failed:', err)
  process.exit(1)
})
