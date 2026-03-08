'use client'

import {useCallback, useEffect, useId, useMemo, useRef, useState} from 'react'

import {district, counties as geoCounties, stateOutline} from './indiana-district-map-coordinates'
import type {LonLat} from './indiana-district-map-coordinates'
import {MapPin} from './map-pin'

/**
 * Interactive animated SVG map of Indiana Senate District 48.
 *
 * Zoom is locked to 4 discrete levels: state → district → county → township.
 * Clicking a region zooms in and centers, then shows an info popup.
 * Popup content is passed in via props (editable in Sanity Studio).
 */

/* ── Projection: WGS84 → SVG (equirectangular cos(38.96°)) ───────── */

function toSvgX(lon: number) { return (lon + 88.097) * 90.47 + 10 }
function toSvgY(lat: number) { return (41.761 - lat) * 116.9 + 12.19 }

function ringToSvgPath(coords: LonLat[]): string {
  return coords
    .map((c, i) => `${i === 0 ? 'M' : 'L'}${toSvgX(c[0]).toFixed(1)} ${toSvgY(c[1]).toFixed(1)}`)
    .join(' ') + ' Z'
}

/* ── GIS paths (projected from coordinates file) ──────────────────── */

const INDIANA_STATE_PATH = stateOutline.rings.map(r => ringToSvgPath(r.coordinates)).join(' ')

const STATE_BOUNDS = {
  minX: toSvgX(stateOutline.bbox.minLon),
  maxX: toSvgX(stateOutline.bbox.maxLon),
  minY: toSvgY(stateOutline.bbox.maxLat),
  maxY: toSvgY(stateOutline.bbox.minLat),
}

const STATE_CENTER = {
  x: (STATE_BOUNDS.minX + STATE_BOUNDS.maxX) / 2,
  y: (STATE_BOUNDS.minY + STATE_BOUNDS.maxY) / 2,
}

const DISTRICT_48_PATH = district.rings.map(r => ringToSvgPath(r.coordinates)).join(' ')
const DISTRICT_CENTER = {x: toSvgX(district.centroid[0]), y: toSvgY(district.centroid[1])}

const COUNTY_COLORS: Record<string, string> = {
  Dubois: '#c8dfc8',
  Perry: '#c8d4e8',
  Spencer: '#e8d4c8',
  Crawford: '#e8e8c8',
  Gibson: '#f0d8c0',
  Pike: '#d8e0f0',
}

const COUNTIES = geoCounties.map(c => ({
  name: c.name,
  cx: toSvgX(c.centroid[0]),
  cy: toSvgY(c.centroid[1]),
  path: c.rings.map(r => ringToSvgPath(r.coordinates)).join(' '),
  color: COUNTY_COLORS[c.name] ?? '#ddd',
  bbox: c.bbox,
  townships: c.townships.map(t => ({
    name: t.name.replace(/\s*(Township|Twp)$/i, ''),
    cx: toSvgX(t.centroid[0]),
    cy: toSvgY(t.centroid[1]),
    path: t.rings.map(r => ringToSvgPath(r.coordinates)).join(' '),
  })),
}))

/* ── Animation constants ───────────────────────────────────────────── */

const INDIANA_LEN = 8000
const DISTRICT_LEN = 5000
const ARROW_LEN = 460

/* ── Zoom levels ──────────────────────────────────────────────────── */

type ZoomLevel = 'state' | 'district' | 'county' | 'township'

const PAD = 4

function bboxToVB(minX: number, minY: number, maxX: number, maxY: number, pad: number): number[] {
  return [minX - pad, minY - pad, maxX - minX + pad * 2, maxY - minY + pad * 2]
}

const VB_STATE = bboxToVB(STATE_BOUNDS.minX, STATE_BOUNDS.minY, STATE_BOUNDS.maxX, STATE_BOUNDS.maxY, PAD)
const VB_FULL = VB_STATE.join(' ')

const _dpad = 8
const VB_DISTRICT = bboxToVB(
  toSvgX(district.bbox.minLon), toSvgY(district.bbox.maxLat),
  toSvgX(district.bbox.maxLon), toSvgY(district.bbox.minLat), _dpad,
)

function countyVB(name: string): number[] {
  const c = geoCounties.find(gc => gc.name === name)
  if (!c) return VB_DISTRICT
  return bboxToVB(
    toSvgX(c.bbox.minLon), toSvgY(c.bbox.maxLat),
    toSvgX(c.bbox.maxLon), toSvgY(c.bbox.minLat), 4,
  )
}

function zoomLevelForWidth(w: number): ZoomLevel {
  const stateW = VB_STATE[2]
  const districtW = VB_DISTRICT[2]
  const avgCountyW = COUNTIES.reduce((s, c) => {
    const vb = countyVB(c.name)
    return s + vb[2]
  }, 0) / COUNTIES.length

  if (w > (stateW + districtW) / 2) return 'state'
  if (w > (districtW + avgCountyW) / 2) return 'district'
  if (w > avgCountyW * 0.5) return 'county'
  return 'township'
}

const ARROW_PATH = `M ${STATE_CENTER.x.toFixed(0)} ${(STATE_BOUNDS.minY + 40).toFixed(0)} C ${(STATE_CENTER.x - 10).toFixed(0)} ${STATE_CENTER.y.toFixed(0)} ${(DISTRICT_CENTER.x + 30).toFixed(0)} ${(DISTRICT_CENTER.y - 60).toFixed(0)} ${DISTRICT_CENTER.x.toFixed(0)} ${(DISTRICT_CENTER.y - 8).toFixed(0)}`

/* ── Helpers ───────────────────────────────────────────────────────── */

function easeInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
}

function clampViewBox(vb: number[]): number[] {
  let [x, y, w, h] = vb
  if (w > VB_STATE[2]) { w = VB_STATE[2]; h = VB_STATE[3] }
  const minW = VB_STATE[2] * 0.04
  if (w < minW) { const ratio = h / w; w = minW; h = w * ratio }
  const bx = STATE_BOUNDS.minX - PAD
  const by = STATE_BOUNDS.minY - PAD
  const bw = STATE_BOUNDS.maxX - STATE_BOUNDS.minX + PAD * 2
  const bh = STATE_BOUNDS.maxY - STATE_BOUNDS.minY + PAD * 2
  if (x < bx) x = bx
  if (y < by) y = by
  if (x + w > bx + bw) x = bx + bw - w
  if (y + h > by + bh) y = by + bh - h
  return [x, y, w, h]
}

/* ── Popup content types ──────────────────────────────────────────── */

export type MapRegion =
  | {type: 'state'; name: 'Indiana'}
  | {type: 'district'; name: string; number: number}
  | {type: 'county'; name: string}
  | {type: 'township'; name: string; county: string}

export interface MapRegionPopup {
  key: string
  title: string
  body?: unknown[]
  linkLabel?: string
  linkUrl?: string
}

/* ── Component ─────────────────────────────────────────────────────── */

export function IndianaDistrictMap({
  label = 'District 48',
  accentColor = '#8b1a1a',
  textColor = '#1a1a2e',
  width = '100%',
  height = 600,
  popups,
  renderPopupBody,
}: {
  label?: string
  accentColor?: string
  textColor?: string
  width?: string | number
  height?: number
  popups?: MapRegionPopup[]
  renderPopupBody?: (body: unknown[]) => React.ReactNode
} = {}) {
  const uid = useId().replace(/:/g, '-')
  const markerId = `arrowhead${uid}`
  const shadowId = `sh${uid}`

  const svgRef = useRef<SVGSVGElement>(null)
  const rafRef = useRef(0)
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([])
  const viewBoxRef = useRef(VB_FULL)
  const dragRef = useRef<{x: number; y: number; vb: number[]; moved: boolean} | null>(null)
  const justDraggedRef = useRef(false)

  const [phase, setPhase] = useState(0)
  const [typedLabel, setTypedLabel] = useState('')
  const [typingKey, setTypingKey] = useState(0)
  const [countiesShown, setCountiesShown] = useState(0)
  const [indiaOffset, setIndiaOffset] = useState(INDIANA_LEN)
  const [districtOffset, setDistrictOffset] = useState(DISTRICT_LEN)
  const [arrowOffset, setArrowOffset] = useState(ARROW_LEN)
  const [viewBox, setViewBox] = useState(VB_FULL)
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [activePopup, setActivePopup] = useState<MapRegionPopup | null>(null)
  const [popupPosition, setPopupPosition] = useState<{x: number; y: number} | null>(null)

  const currentWidth = useMemo(() => viewBox.split(' ').map(Number)[2], [viewBox])
  const currentZoom = useMemo(() => zoomLevelForWidth(currentWidth), [currentWidth])

  const showCountyFills = phase >= 7 && (currentZoom === 'district' || currentZoom === 'county' || currentZoom === 'township')
  const showTownships = phase >= 7 && (currentZoom === 'county' || currentZoom === 'township')
  const showTownshipLabels = phase >= 7 && currentZoom === 'township'
  const showCountyLabels = phase >= 7 && (currentZoom === 'district' || currentZoom === 'county' || currentZoom === 'township')
  const showIndianaLabel = phase >= 2 && currentZoom === 'state'
  const showDistrictLabel = phase >= 7
  // Show pins at district and county levels
  const showCountyPins = phase >= 7 && (currentZoom === 'district' || currentZoom === 'county')
  const showDistrictPin = phase >= 7 && currentZoom === 'state'
  const showTownshipPins = phase >= 7 && currentZoom === 'township'

  const popupMap = useMemo(() => {
    const map = new Map<string, MapRegionPopup>()
    popups?.forEach(p => map.set(p.key, p))
    return map
  }, [popups])

  // ── Pin size based on zoom ────────────────────────────────────────

  const pinSize = Math.max(3, Math.min(12, currentWidth * 0.035))

  // ── Popup helpers ──────────────────────────────────────────────────

  function regionKey(region: MapRegion): string {
    if (region.type === 'township') return `township:${region.county}:${region.name}`
    return `${region.type}:${region.name}`
  }

  function showPopupForRegion(region: MapRegion, svgX: number, svgY: number) {
    const key = regionKey(region)
    const popup = popupMap.get(key)
    if (!popup) {
      const title = region.type === 'township'
        ? `${region.name} Township — ${region.county} County`
        : region.type === 'county'
          ? `${region.name} County`
          : region.type === 'district'
            ? `Senate ${region.name}`
            : region.name
      setActivePopup({key, title})
    } else {
      setActivePopup(popup)
    }
    if (svgRef.current) {
      const rect = svgRef.current.getBoundingClientRect()
      const vb = viewBoxRef.current.split(' ').map(Number)
      const screenX = rect.left + ((svgX - vb[0]) / vb[2]) * rect.width
      const screenY = rect.top + ((svgY - vb[1]) / vb[3]) * rect.height
      setPopupPosition({x: screenX, y: screenY})
    }
  }

  function closePopup() {
    setActivePopup(null)
    setPopupPosition(null)
  }

  // ── Click handling — zoom to region + show popup ──────────────────

  const handleRegionClick = useCallback((region: MapRegion, svgX: number, svgY: number, e?: React.MouseEvent) => {
    e?.stopPropagation()
    closePopup()
    // No popup for Indiana — just zoom
    if (region.type === 'state') {
      animateViewBox([...VB_STATE], 700)
      return
    }
    if (region.type === 'district') {
      animateViewBox([...VB_DISTRICT], 700)
      setTimeout(() => showPopupForRegion(region, DISTRICT_CENTER.x, DISTRICT_CENTER.y), 750)
    } else if (region.type === 'county') {
      const vb = countyVB(region.name)
      animateViewBox(vb, 700)
      const c = COUNTIES.find(c => c.name === region.name)
      setTimeout(() => showPopupForRegion(region, c?.cx ?? svgX, c?.cy ?? svgY), 750)
    } else if (region.type === 'township') {
      const c = COUNTIES.find(c => c.name === region.county)
      const t = c?.townships.find(t => t.name === region.name)
      if (t) {
        const twpVb = clampViewBox([t.cx - 15, t.cy - 15, 30, 30])
        animateViewBox(twpVb, 700)
        setTimeout(() => showPopupForRegion(region, t.cx, t.cy), 750)
      }
    }
  }, [popupMap]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Background click to dismiss popup ──────────────────────────────

  function handleSvgClick() {
    // Close popup on background click (not after a drag)
    if (activePopup && !justDraggedRef.current) {
      closePopup()
    }
    justDraggedRef.current = false
  }

  // ── Utilities ──────────────────────────────────────────────────────

  function clear() {
    timersRef.current.forEach(clearTimeout)
    timersRef.current = []
    cancelAnimationFrame(rafRef.current)
  }

  function after(ms: number, fn: () => void) {
    const id = setTimeout(fn, ms)
    timersRef.current.push(id)
  }

  function applyViewBox(vb: string) {
    viewBoxRef.current = vb
    setViewBox(vb)
  }

  function animateViewBox(to: number[], duration = 350) {
    cancelAnimationFrame(rafRef.current)
    const from = viewBoxRef.current.split(' ').map(Number)
    const start = performance.now()
    function tick(now: number) {
      const t = easeInOut(Math.min((now - start) / duration, 1))
      const interp = from.map((v, i) => v + (to[i] - v) * t)
      applyViewBox(clampViewBox(interp).join(' '))
      if (t < 1) rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
  }

  function zoomToDistrict() { animateViewBox([...VB_DISTRICT], 900) }

  // ── Discrete zoom step functions ───────────────────────────────────

  function zoomInStep() {
    closePopup()
    if (currentZoom === 'state') {
      animateViewBox([...VB_DISTRICT], 600)
    } else if (currentZoom === 'district') {
      const vb = viewBoxRef.current.split(' ').map(Number)
      const cx = vb[0] + vb[2] / 2, cy = vb[1] + vb[3] / 2
      let nearest = COUNTIES[0]
      let minDist = Infinity
      for (const c of COUNTIES) {
        const d = Math.hypot(c.cx - cx, c.cy - cy)
        if (d < minDist) { minDist = d; nearest = c }
      }
      animateViewBox(countyVB(nearest.name), 600)
    } else if (currentZoom === 'county') {
      const vb = viewBoxRef.current.split(' ').map(Number)
      const nw = vb[2] * 0.4, nh = vb[3] * 0.4
      animateViewBox(clampViewBox([vb[0] + (vb[2] - nw) / 2, vb[1] + (vb[3] - nh) / 2, nw, nh]), 600)
    }
  }

  function zoomOutStep() {
    closePopup()
    if (currentZoom === 'township') {
      const vb = viewBoxRef.current.split(' ').map(Number)
      const cx = vb[0] + vb[2] / 2, cy = vb[1] + vb[3] / 2
      let nearest = COUNTIES[0]
      let minDist = Infinity
      for (const c of COUNTIES) {
        const d = Math.hypot(c.cx - cx, c.cy - cy)
        if (d < minDist) { minDist = d; nearest = c }
      }
      animateViewBox(countyVB(nearest.name), 600)
    } else if (currentZoom === 'county') {
      animateViewBox([...VB_DISTRICT], 600)
    } else if (currentZoom === 'district') {
      animateViewBox([...VB_STATE], 600)
    }
  }

  function resetZoom() {
    closePopup()
    animateViewBox([...VB_DISTRICT], 600)
  }

  // ── Animation sequence ─────────────────────────────────────────────

  function startAnimation() {
    clear()
    setPhase(1)
    setIndiaOffset(0)

    after(1700, () => setPhase(2))
    after(2600, () => { setPhase(3); setArrowOffset(0); setTypingKey(k => k + 1) })
    after(4900, () => { setPhase(5); setDistrictOffset(0) })
    after(6300, () => { setPhase(6); zoomToDistrict() })
    after(7300, () => {
      setPhase(7)
      let n = 0
      ;(function next() {
        if (n < COUNTIES.length) { setCountiesShown(++n); after(650, next) }
        else { after(300, () => setPhase(8)) }
      })()
    })
  }

  // ── Typewriter effect ──────────────────────────────────────────────

  useEffect(() => {
    if (!typingKey) return
    let i = 0
    setTypedLabel('')
    const iv = setInterval(() => {
      setTypedLabel(label.slice(0, ++i))
      if (i >= label.length) clearInterval(iv)
    }, 52)
    return () => clearInterval(iv)
  }, [typingKey, label])

  // ── Mount / IntersectionObserver ───────────────────────────────────

  useEffect(() => {
    clear()
    closePopup()
    setPhase(0)
    setIndiaOffset(INDIANA_LEN)
    setDistrictOffset(DISTRICT_LEN)
    setArrowOffset(ARROW_LEN)
    setCountiesShown(0)
    setTypedLabel('')
    applyViewBox(VB_FULL)

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setPhase(8)
      setTypedLabel(label)
      setCountiesShown(COUNTIES.length)
      setIndiaOffset(0)
      setDistrictOffset(0)
      setArrowOffset(0)
      applyViewBox(VB_DISTRICT.join(' '))
      return
    }

    const el = svgRef.current
    if (!el) return
    let fired = false
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !fired) {
          fired = true
          obs.disconnect()
          startAnimation()
        }
      },
      {threshold: 0.2},
    )
    obs.observe(el)
    return () => { obs.disconnect(); clear() }
  }, [label]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Wheel zoom (snaps to discrete levels) ──────────────────────────

  useEffect(() => {
    const el = svgRef.current
    if (!el || phase < 7) return
    let cooldown = false
    function onWheel(e: WheelEvent) {
      e.preventDefault()
      if (cooldown) return
      cooldown = true
      setTimeout(() => { cooldown = false }, 400)
      if (e.deltaY > 0) zoomOutStep()
      else zoomInStep()
    }
    el.addEventListener('wheel', onWheel, {passive: false})
    return () => el.removeEventListener('wheel', onWheel)
  }, [phase, currentZoom]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Pan (click-drag) ───────────────────────────────────────────────

  function handleMouseDown(e: React.MouseEvent<SVGSVGElement>) {
    if (phase < 7) return
    cancelAnimationFrame(rafRef.current)
    const vb = viewBoxRef.current.split(' ').map(Number)
    dragRef.current = {x: e.clientX, y: e.clientY, vb, moved: false}
    setIsDragging(true)
    e.preventDefault()
  }

  function handleMouseMove(e: React.MouseEvent<SVGSVGElement>) {
    if (!dragRef.current || !svgRef.current) return
    const rect = svgRef.current.getBoundingClientRect()
    const {x: sx, y: sy, vb} = dragRef.current
    const dx = e.clientX - sx
    const dy = e.clientY - sy
    // Track if user actually moved (to distinguish click from drag)
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) dragRef.current.moved = true
    const scaleX = vb[2] / rect.width
    const scaleY = vb[3] / rect.height
    const clamped = clampViewBox([vb[0] - dx * scaleX, vb[1] - dy * scaleY, vb[2], vb[3]])
    applyViewBox(clamped.join(' '))
  }

  function handleMouseUp() {
    justDraggedRef.current = dragRef.current?.moved ?? false
    dragRef.current = null
    setIsDragging(false)
  }

  function handleMouseLeave() {
    dragRef.current = null
    setIsDragging(false)
  }

  // ── Label font sizes based on zoom ─────────────────────────────────

  const countyFontSize = Math.max(5, Math.min(10, currentWidth * 0.04))
  const townshipFontSize = Math.max(3.5, Math.min(6, currentWidth * 0.025))

  // ── Render ─────────────────────────────────────────────────────────

  const showArrow = phase >= 3 && phase < 6
  const zoomLabel = currentZoom === 'state' ? 'State'
    : currentZoom === 'district' ? 'District'
    : currentZoom === 'county' ? 'County'
    : 'Township'

  return (
    <div
      className="relative w-full overflow-hidden rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] shadow-sm"
      style={{width, maxWidth: '100%'}}
    >
      <svg
        ref={svgRef}
        viewBox={viewBox}
        width="100%"
        height={height}
        style={{display: 'block', cursor: phase < 7 ? 'default' : isDragging ? 'grabbing' : 'grab'}}
        aria-label={`Map of Indiana showing ${label}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onClick={handleSvgClick}
      >
        <defs>
          <marker id={markerId} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
            <path d="M1,1 L7,4 L1,7 Z" fill={accentColor} />
          </marker>
          <filter id={shadowId}>
            <feDropShadow dx="0.5" dy="0.5" stdDeviation="1" floodColor="#00000018" />
          </filter>
        </defs>

        {/* ── Phase 1+: Indiana outline ── */}
        <path
          d={INDIANA_STATE_PATH}
          fill={phase >= 2 ? 'rgba(235,232,225,0.4)' : 'rgba(235,232,225,0)'}
          stroke="#1a1a2e"
          strokeWidth={1.8}
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeDasharray={INDIANA_LEN}
          strokeDashoffset={indiaOffset}
          style={{
            transition: phase >= 1
              ? 'stroke-dashoffset 1.5s ease-out, fill 0.9s ease-out'
              : 'none',
            pointerEvents: 'none',
          }}
        />

        {/* ── Phase 2+: Indiana label at centroid (at state zoom) ── */}
        {showIndianaLabel && (
          <text
            x={STATE_CENTER.x}
            y={STATE_CENTER.y}
            fontSize={18}
            fontWeight="bold"
            fill={textColor}
            textAnchor="middle"
            dominantBaseline="middle"
            letterSpacing="0.15em"
            style={{
              fontFamily: 'inherit',
              pointerEvents: 'none',
              userSelect: 'none',
              opacity: 0.6,
              textTransform: 'uppercase',
            }}
          >
            Indiana
          </text>
        )}

        {/* ── Phase 7+: County shapes ── */}
        {phase >= 7 && COUNTIES.slice(0, countiesShown).map((c) => {
          const isHovered = hoveredRegion === `county:${c.name}`
          return (
            <g key={c.name}>
              <path
                d={c.path}
                fill={showCountyFills ? (isHovered ? adjustAlpha(c.color, 0.9) : c.color) : 'transparent'}
                stroke={showCountyFills ? textColor : 'transparent'}
                strokeWidth={isHovered ? 1.5 : 1.0}
                strokeLinejoin="round"
                filter={showCountyFills ? `url(#${shadowId})` : undefined}
                style={{
                  transition: 'fill 0.3s, stroke 0.3s, stroke-width 0.15s',
                  cursor: isDragging ? 'grabbing' : 'pointer',
                }}
                onMouseEnter={() => !isDragging && setHoveredRegion(`county:${c.name}`)}
                onMouseLeave={() => setHoveredRegion(null)}
                onClick={(e) => handleRegionClick({type: 'county', name: c.name}, c.cx, c.cy, e)}
              />

              {/* Township shapes (zoom-dependent) */}
              {showTownships && c.townships.map((t) => {
                const isHoveredTwp = hoveredRegion === `twp:${c.name}:${t.name}`
                return (
                  <path
                    key={t.name}
                    d={t.path}
                    fill={isHoveredTwp ? `${accentColor}18` : 'transparent'}
                    stroke="#556"
                    strokeWidth={0.45}
                    strokeLinejoin="round"
                    strokeDasharray="3,2.5"
                    style={{
                      transition: 'fill 0.15s, opacity 0.5s',
                      cursor: isDragging ? 'grabbing' : 'pointer',
                      opacity: 0.8,
                    }}
                    onMouseEnter={() => !isDragging && setHoveredRegion(`twp:${c.name}:${t.name}`)}
                    onMouseLeave={() => setHoveredRegion(null)}
                    onClick={(e) => handleRegionClick({type: 'township', name: t.name, county: c.name}, t.cx, t.cy, e)}
                  />
                )
              })}
            </g>
          )
        })}

        {/* ── Phase 5+: District 48 outline (pointer-events: none so clicks reach counties) ── */}
        <path
          d={DISTRICT_48_PATH}
          fill={phase >= 6 ? `${accentColor}1a` : `${accentColor}00`}
          stroke={phase >= 5 ? accentColor : 'none'}
          strokeWidth={1.5}
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeDasharray={DISTRICT_LEN}
          strokeDashoffset={districtOffset}
          style={{
            transition: 'stroke-dashoffset 1.2s ease-out, fill 0.8s ease-out 0.5s',
            filter: phase >= 5 ? `drop-shadow(0 0 2px ${accentColor}44)` : 'none',
            pointerEvents: 'none',
          }}
        />

        {/* ── County labels at centroids ── */}
        {showCountyLabels && COUNTIES.slice(0, countiesShown).map((c) => (
          <text
            key={`label-${c.name}`}
            x={c.cx}
            y={c.cy}
            fontSize={countyFontSize}
            fontWeight="bold"
            fill={textColor}
            textAnchor="middle"
            dominantBaseline="middle"
            letterSpacing="0.06em"
            style={{
              fontFamily: 'inherit',
              pointerEvents: 'none',
              userSelect: 'none',
              textTransform: 'uppercase',
              opacity: 0.9,
            }}
          >
            {c.name}
          </text>
        ))}

        {/* ── Township labels at centroids ── */}
        {showTownshipLabels && COUNTIES.slice(0, countiesShown).map((c) =>
          c.townships.map((t) => (
            <text
              key={`twp-label-${c.name}-${t.name}`}
              x={t.cx}
              y={t.cy}
              fontSize={townshipFontSize}
              fill="#444"
              textAnchor="middle"
              dominantBaseline="middle"
              style={{
                fontFamily: 'inherit',
                fontStyle: 'italic',
                pointerEvents: 'none',
                userSelect: 'none',
                opacity: 0.85,
              }}
            >
              {t.name}
            </text>
          ))
        )}

        {/* ── District label at centroid ── */}
        {showDistrictLabel && (
          <text
            x={DISTRICT_CENTER.x}
            y={DISTRICT_CENTER.y + countyFontSize * 3}
            fontSize={countyFontSize * 0.85}
            fontWeight="bold"
            fill={accentColor}
            textAnchor="middle"
            letterSpacing="0.1em"
            style={{
              fontFamily: 'inherit',
              pointerEvents: 'none',
              userSelect: 'none',
              textTransform: 'uppercase',
            }}
          >
            Senate District 48
          </text>
        )}

        {/* ── Pins: District pin (at state zoom) ── */}
        {showDistrictPin && (
          <MapPin
            cx={DISTRICT_CENTER.x}
            cy={DISTRICT_CENTER.y}
            size={pinSize * 1.5}
            color={accentColor}
            hovered={hoveredRegion === 'pin:district'}
            onMouseEnter={() => setHoveredRegion('pin:district')}
            onMouseLeave={() => setHoveredRegion(null)}
            onClick={(e) => handleRegionClick({type: 'district', name: label, number: 48}, DISTRICT_CENTER.x, DISTRICT_CENTER.y, e)}
          />
        )}

        {/* ── Pins: County pins (at district/county zoom) ── */}
        {showCountyPins && COUNTIES.slice(0, countiesShown).map((c) => (
          <MapPin
            key={`pin-${c.name}`}
            cx={c.cx}
            cy={c.cy}
            size={pinSize}
            color={accentColor}
            hovered={hoveredRegion === `pin:county:${c.name}`}
            onMouseEnter={() => setHoveredRegion(`pin:county:${c.name}`)}
            onMouseLeave={() => setHoveredRegion(null)}
            onClick={(e) => handleRegionClick({type: 'county', name: c.name}, c.cx, c.cy, e)}
          />
        ))}

        {/* ── Pins: Township pins (at township zoom) ── */}
        {showTownshipPins && COUNTIES.slice(0, countiesShown).map((c) =>
          c.townships.map((t) => (
            <MapPin
              key={`pin-twp-${c.name}-${t.name}`}
              cx={t.cx}
              cy={t.cy}
              size={pinSize * 0.7}
              color="#556"
              hovered={hoveredRegion === `pin:twp:${c.name}:${t.name}`}
              onMouseEnter={() => setHoveredRegion(`pin:twp:${c.name}:${t.name}`)}
              onMouseLeave={() => setHoveredRegion(null)}
              onClick={(e) => handleRegionClick({type: 'township', name: t.name, county: c.name}, t.cx, t.cy, e)}
            />
          ))
        )}

        {/* ── Hover tooltip ── */}
        {hoveredRegion && !isDragging && (() => {
          const parts = hoveredRegion.replace(/^pin:/, '').split(':')
          let cx = 0, cy = 0, tooltipLabel = ''
          if (parts[0] === 'district') {
            cx = DISTRICT_CENTER.x; cy = DISTRICT_CENTER.y - pinSize * 2
            tooltipLabel = `Senate ${label}`
          } else if (parts[0] === 'county') {
            const c = COUNTIES.find(c => c.name === parts[1])
            if (!c) return null
            cx = c.cx; cy = c.cy - pinSize * 2
            tooltipLabel = `${c.name} County`
          } else if (parts[0] === 'twp') {
            const c = COUNTIES.find(c => c.name === parts[1])
            const t = c?.townships.find(t => t.name === parts[2])
            if (!t) return null
            cx = t.cx; cy = t.cy - pinSize * 1.5
            tooltipLabel = `${t.name} Twp — ${parts[1]} Co.`
          }
          if (!tooltipLabel) return null
          const fontSize = Math.max(4, currentWidth * 0.02)
          const padX = fontSize * 0.8
          const padY = fontSize * 0.5
          const estWidth = tooltipLabel.length * fontSize * 0.55
          return (
            <g style={{pointerEvents: 'none'}}>
              <rect
                x={cx - estWidth / 2 - padX}
                y={cy - fontSize / 2 - padY}
                rx={2}
                width={estWidth + padX * 2}
                height={fontSize + padY * 2}
                fill={textColor}
                opacity={0.9}
              />
              <text
                x={cx}
                y={cy + fontSize * 0.1}
                fontSize={fontSize}
                fontWeight="bold"
                fill="#f4f0e8"
                textAnchor="middle"
                dominantBaseline="middle"
                style={{fontFamily: 'inherit', userSelect: 'none'}}
              >
                {tooltipLabel}
              </text>
            </g>
          )
        })()}

        {/* ── Phases 3–5: Typewriter label + animated arrow ── */}
        {showArrow && (() => {
          const vb = viewBox.split(' ').map(Number)
          const labelX = vb[0] + vb[2] * 0.05
          const labelY = vb[1] + vb[2] * 0.07
          const labelFontSize = vb[2] * 0.045
          const bgW = vb[2] * 0.92
          const bgH = labelFontSize * 2.2
          return (
            <>
              <rect
                x={labelX - labelFontSize * 0.3}
                y={labelY - labelFontSize * 1.1}
                rx={3}
                width={bgW}
                height={bgH}
                fill="rgba(255,255,255,0.88)"
              />
              <text
                x={labelX}
                y={labelY}
                fontSize={labelFontSize}
                fontWeight="bold"
                fill={textColor}
                style={{fontFamily: 'inherit', letterSpacing: '0.03em'}}
              >
                {typedLabel}
              </text>
              <path
                d={ARROW_PATH}
                stroke={accentColor}
                strokeWidth={3}
                fill="none"
                strokeDasharray={ARROW_LEN}
                strokeDashoffset={arrowOffset}
                markerEnd={`url(#${markerId})`}
                style={{transition: 'stroke-dashoffset 1.9s ease-in-out'}}
              />
            </>
          )
        })()}
      </svg>

      {/* ── Info popup (Google Maps style — overlays the map) ── */}
      {activePopup && popupPosition && (
        <div
          className="absolute z-10 w-72 rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] shadow-xl"
          style={{
            left: Math.min(
              Math.max(8, popupPosition.x - (svgRef.current?.getBoundingClientRect().left ?? 0) - 144),
              (svgRef.current?.getBoundingClientRect().width ?? 300) - 296,
            ),
            top: Math.min(
              Math.max(8, popupPosition.y - (svgRef.current?.getBoundingClientRect().top ?? 0) - 20),
              height - 80,
            ),
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={closePopup}
            className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full text-xs text-[color:var(--color-muted)] hover:bg-[color:var(--color-highlight)] hover:text-[color:var(--color-ink)]"
            aria-label="Close popup"
          >
            ×
          </button>

          <div className="p-4">
            <h3 className="mb-2 pr-6 text-sm font-bold text-[color:var(--color-ink)]">
              {activePopup.title}
            </h3>

            {activePopup.body && renderPopupBody && (
              <div className="mb-3 text-xs leading-relaxed text-[color:var(--color-muted)]">
                {renderPopupBody(activePopup.body)}
              </div>
            )}

            {activePopup.linkUrl && (
              <a
                href={activePopup.linkUrl}
                className="inline-block rounded bg-[color:var(--color-accent)] px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90"
              >
                {activePopup.linkLabel ?? 'Learn more'}
              </a>
            )}
          </div>
        </div>
      )}

      {/* ── Zoom controls ── */}
      {phase >= 7 && (
        <div className="flex items-center justify-end gap-1 border-t border-[color:var(--color-border)] px-2 py-1">
          <span className="mr-auto text-xs text-[color:var(--color-muted)]">
            {zoomLabel} view — click regions to explore
          </span>
          <button
            onClick={zoomOutStep}
            disabled={currentZoom === 'state'}
            aria-label="Zoom out"
            className="flex h-6 w-6 items-center justify-center rounded text-sm font-bold text-[color:var(--color-muted)] hover:bg-[color:var(--color-highlight)] hover:text-[color:var(--color-ink)] disabled:opacity-30"
          >
            −
          </button>
          <button
            onClick={resetZoom}
            aria-label="Reset zoom"
            className="flex h-6 items-center justify-center rounded px-1.5 text-xs text-[color:var(--color-muted)] hover:bg-[color:var(--color-highlight)] hover:text-[color:var(--color-ink)]"
          >
            ↺
          </button>
          <button
            onClick={zoomInStep}
            disabled={currentZoom === 'township'}
            aria-label="Zoom in"
            className="flex h-6 w-6 items-center justify-center rounded text-sm font-bold text-[color:var(--color-muted)] hover:bg-[color:var(--color-highlight)] hover:text-[color:var(--color-ink)] disabled:opacity-30"
          >
            +
          </button>
        </div>
      )}
    </div>
  )
}

function adjustAlpha(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r},${g},${b},${alpha})`
}
