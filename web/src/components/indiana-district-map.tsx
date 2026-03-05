'use client'

import {useEffect, useId, useRef, useState} from 'react'

/**
 * 7-phase animated SVG map.
 *
 * Phase 1 – Indiana outline draws (stroke-dashoffset)
 * Phase 2 – Indiana fills with subtle color
 * Phase 3 – District label types out; arrow draws toward district
 * Phase 4 – (gap — arrow finishes)
 * Phase 5 – District 48 outline draws
 * Phase 6 – ViewBox zooms into district
 * Phase 7 – Counties appear one by one with labels
 *
 * Triggers on scroll via IntersectionObserver.
 * Respects prefers-reduced-motion by jumping to final state.
 */

/* ── GIS paths ─────────────────────────────────────────────────────── */

const INDIANA_STATE_PATH =
  'M200.59 12.19 L309.5 12.19 L310 163.08 L308.49 330.36 L301.43 335.61 ' +
  'L308.99 368.41 L292.86 369.07 L275.71 380.22 L252.02 374.97 L253.03 398.59 ' +
  'L237.39 408.43 L231.34 423.52 L215.21 429.42 L206.64 459.6 L196.05 467.47 ' +
  'L175.38 456.32 L171.85 442.54 L151.68 457.63 L153.19 470.75 L132.52 475.34 ' +
  'L126.47 463.54 L103.28 475.34 L95.71 487.81 L72.52 470.1 L60.42 474.03 ' +
  'L52.35 465.5 L44.79 474.03 L21.6 475.34 L13.03 486.5 L10 478.62 ' +
  'L15.55 450.42 L22.61 444.51 L20.08 429.42 L30.67 427.45 L47.31 401.87 ' +
  'L50.34 386.13 L61.93 369.07 L60.42 348.08 L48.82 322.49 L58.91 300.84 ' +
  'L59.41 18.1 L68.49 25.97 L96.72 25.97 L123.95 12.19 L200.59 12.19 Z'

const DISTRICT_48_PATH =
  'M16.65 431.81 L17.05 434.94 L34.04 435.15 L34 438.34 L44.26 438.45 ' +
  'L44.24 442.36 L64.6 442.72 L64.65 438.42 L78.43 438.36 L78.44 433.05 ' +
  'L80.16 433.06 L80.14 434.78 L100.89 434.67 L100.88 438.12 L106 438.14 ' +
  'L106.01 448.36 L100.96 448.36 L98.6 455.42 L99.47 456.58 L96.13 457.28 ' +
  'L93.94 455.48 L92.3 458.93 L93.51 460.14 L90.77 461.26 L91.42 462.21 ' +
  'L82.94 471.51 L82.85 477.14 L87.39 480.65 L92.73 481.72 L95.72 488.19 ' +
  'L97.46 488.59 L101.62 485.52 L104.5 473.73 L109.81 470.78 L115.14 470.06 ' +
  'L124.13 462.6 L126.49 463.82 L132.28 475.16 L137.04 472.7 L140.1 473.46 ' +
  'L139.14 481.25 L143.98 479.54 L145.52 471.94 L150.46 472.46 L153.01 470.89 ' +
  'L151.35 466.54 L151.35 458.97 L152.18 457.37 L157.13 456.84 L159.73 454.66 ' +
  'L159.87 452.37 L156.9 450.26 L157.21 448.04 L159.87 447.4 L162.7 450.03 ' +
  'L164.63 447.07 L169.74 446.2 L169.67 444.08 L165.3 442.69 L164.94 439.97 ' +
  'L166.89 438.75 L170.66 441.24 L171.35 438.38 L173 438.33 L173.85 428.44 ' +
  'L174.88 429.18 L176.41 427.33 L175.34 425.59 L174.11 426.43 L173.22 423.02 ' +
  'L174.5 424.07 L174.72 419.27 L176.92 420.67 L175.63 416.9 L177.07 416.06 ' +
  'L175.57 415.15 L176.19 411.9 L171.26 411.88 L171.24 415.33 L136.94 415.24 ' +
  'L136.86 399.48 L122.58 399.47 L118.76 403.25 L113.78 402 L112.22 403.79 ' +
  'L108.02 401.01 L101.85 402.51 L97.7 398.12 L93.67 400.74 L88.98 396.39 ' +
  'L87.27 397.99 L84.82 397.42 L84.07 399.45 L79.88 401.41 L74.93 397.43 ' +
  'L73.56 397.94 L73.58 401.18 L72.28 398.11 L70.24 397.78 L69.55 399.45 ' +
  'L68.42 397.77 L67.67 399.18 L63.5 399.35 L64 401.11 L61.97 403.34 ' +
  'L58.69 402.78 L58.83 400.91 L57.42 400.56 L57.89 403.5 L53.79 402.79 ' +
  'L52.44 408.54 L49.13 409.56 L47.15 407.59 L45.61 409.05 L46.47 410.92 ' +
  'L39.15 412.89 L31.81 421.09 L29.74 429.39 L28.16 428.97 L27.47 425.13 ' +
  'L23.83 430.41 L23.88 427.07 L21.55 427.18 L19.22 434.13 L16.65 431.81 Z'

/** District 48 centroid (Census INTPTLAT/INTPTLON projected to SVG coords) */
const DISTRICT_CENTER = {x: 97, y: 442}

/* ── Animation constants ───────────────────────────────────────────── */

// Overestimates of path lengths — safe for stroke-dasharray
const INDIANA_LEN = 2200
const DISTRICT_LEN = 1600
const ARROW_LEN = 460

// Full Indiana view
const VB_FULL = '0 0 320 500'
// Zoomed district view — tightly frames the 4 counties with ~15px padding
// x: 35–200 covers Spencer (51) → Crawford (188); y: 378–493 covers all rivers
const VB_DISTRICT = [35, 378, 165, 115] as const

// Arrow from label area down to district
const ARROW_PATH = `M 160 52 C 150 200 120 320 ${DISTRICT_CENTER.x} ${DISTRICT_CENTER.y - 8}`

/**
 * County boundaries projected into SVG space using:
 *   x = (lon + 88.097) × 90.47 + 10
 *   y = (41.761 − lat) × 116.9 + 12.19
 *
 * Source: Census county boundaries (lat/lon) projected to match the
 * equirectangular cos(38.96°) projection used by INDIANA_STATE_PATH.
 *
 * Orange County is excluded — District 48's northern boundary runs at
 * ~38.47°N inside Crawford, which falls short of Orange's southern edge
 * (~38.51°N).  Districts: Dubois (full), Perry (full), Spencer (full),
 * Crawford (full minus a thin northern strip ~0.04°).
 */
const COUNTIES: {name: string; cx: number; cy: number; path: string}[] = [
  {
    name: 'Dubois',
    cx: 121, cy: 412,
    path: 'M104.4 392.3 L138.0 392.3 L138.0 428.3 L104.4 428.3 Z',
  },
  {
    name: 'Perry',
    cx: 136, cy: 456,
    path:
      'M104.5 428.3 L152.2 428.3 L156.3 434.4 L161.3 441.4 L165.3 447.8 ' +
      'L168.9 453.6 L172.1 457.7 L173.5 461.2 L170.8 464.7 L163.5 468.2 ' +
      'L156.3 472.9 L149.0 476.4 L141.8 478.5 L121.0 478.5 ' +
      'L113.7 475.2 L108.3 470.6 L104.5 464.7 Z',
  },
  {
    name: 'Spencer',
    cx: 78, cy: 456,
    path:
      'M104.5 428.3 L104.5 478.5 L93.0 478.5 L83.9 478.5 L76.7 478.3 ' +
      'L70.3 477.1 L64.0 475.2 L58.6 472.9 L54.1 470.6 L51.3 467.0 ' +
      'L51.3 462.4 L54.1 457.7 L56.7 453.0 L60.4 447.2 L64.9 441.4 ' +
      'L71.2 434.4 L76.7 428.3 Z',
  },
  {
    name: 'Crawford',
    cx: 163, cy: 420,
    path:
      'M138.0 392.3 L177.5 392.3 L188.4 419.1 L187.1 428.3 ' +
      'L184.4 434.4 L177.1 439.0 L160.8 442.5 L152.2 440.2 ' +
      'L152.2 428.3 L138.0 428.3 Z',
  },
]

/* ── Helpers ───────────────────────────────────────────────────────── */

function easeInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
}

/* ── Component ─────────────────────────────────────────────────────── */

export function IndianaDistrictMap({
  label = 'District 48',
  arrowColor = '#E2AD33',
  textColor = '#222',
}: {
  label?: string
  arrowColor?: string
  textColor?: string
} = {}) {
  const uid = useId().replace(/:/g, '-')
  const markerId = `arrowhead${uid}`

  const svgRef = useRef<SVGSVGElement>(null)
  const rafRef = useRef(0)
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([])
  const viewBoxRef = useRef(VB_FULL)
  const dragRef = useRef<{x: number; y: number; vb: number[]} | null>(null)

  const [phase, setPhase] = useState(0)
  const [typedLabel, setTypedLabel] = useState('')
  const [typingKey, setTypingKey] = useState(0)
  const [countiesShown, setCountiesShown] = useState(0)
  const [indiaOffset, setIndiaOffset] = useState(INDIANA_LEN)
  const [districtOffset, setDistrictOffset] = useState(DISTRICT_LEN)
  const [arrowOffset, setArrowOffset] = useState(ARROW_LEN)
  const [viewBox, setViewBox] = useState(VB_FULL)
  const [hoveredCounty, setHoveredCounty] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)

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

  /** Set viewBox in both state and ref so animations always read the live value. */
  function applyViewBox(vb: string) {
    viewBoxRef.current = vb
    setViewBox(vb)
  }

  /** Smoothly interpolate the viewBox from its current value to `to`. */
  function animateViewBox(to: number[], duration = 350) {
    cancelAnimationFrame(rafRef.current)
    const from = viewBoxRef.current.split(' ').map(Number)
    const start = performance.now()
    function tick(now: number) {
      const t = easeInOut(Math.min((now - start) / duration, 1))
      applyViewBox(from.map((v, i) => v + (to[i] - v) * t).join(' '))
      if (t < 1) rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
  }

  function zoomToDistrict() {
    animateViewBox([...VB_DISTRICT], 900)
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
    setPhase(0)
    setIndiaOffset(INDIANA_LEN)
    setDistrictOffset(DISTRICT_LEN)
    setArrowOffset(ARROW_LEN)
    setCountiesShown(0)
    setTypedLabel('')
    applyViewBox(VB_FULL)

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setPhase(7)
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

  // ── Zoom controls ──────────────────────────────────────────────────

  function zoomIn() {
    const [x, y, w, h] = viewBoxRef.current.split(' ').map(Number)
    const nw = w * 0.7, nh = h * 0.7
    animateViewBox([x + (w - nw) / 2, y + (h - nh) / 2, nw, nh])
  }

  function zoomOut() {
    const [x, y, w, h] = viewBoxRef.current.split(' ').map(Number)
    const nw = Math.min(w / 0.7, 320), nh = Math.min(h / 0.7, 500)
    const nx = Math.max(0, x - (nw - w) / 2), ny = Math.max(0, y - (nh - h) / 2)
    animateViewBox([nx, ny, nw, nh])
  }

  function resetZoom() {
    animateViewBox([...VB_DISTRICT])
  }

  // ── Pan (click-drag) ───────────────────────────────────────────────

  function handleMouseDown(e: React.MouseEvent<SVGSVGElement>) {
    cancelAnimationFrame(rafRef.current)
    const vb = viewBoxRef.current.split(' ').map(Number)
    dragRef.current = {x: e.clientX, y: e.clientY, vb}
    setIsDragging(true)
    e.preventDefault()
  }

  function handleMouseMove(e: React.MouseEvent<SVGSVGElement>) {
    if (!dragRef.current || !svgRef.current) return
    const rect = svgRef.current.getBoundingClientRect()
    const {x: sx, y: sy, vb} = dragRef.current
    const scaleX = vb[2] / rect.width
    const scaleY = vb[3] / rect.height
    const dx = (e.clientX - sx) * scaleX
    const dy = (e.clientY - sy) * scaleY
    applyViewBox(`${vb[0] - dx} ${vb[1] - dy} ${vb[2]} ${vb[3]}`)
  }

  function handleMouseUp() {
    dragRef.current = null
    setIsDragging(false)
  }

  // ── Render ─────────────────────────────────────────────────────────

  const showLabel = phase >= 3 && phase < 6

  return (
    <div className="w-full overflow-hidden rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] shadow-sm">
      <svg
        ref={svgRef}
        viewBox={viewBox}
        width="100%"
        height="auto"
        style={{display: 'block', cursor: isDragging ? 'grabbing' : 'grab'}}
        aria-label={`Map of Indiana showing ${label}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <defs>
          <marker id={markerId} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
            <path d="M1,1 L7,4 L1,7 Z" fill={arrowColor} />
          </marker>
        </defs>

        {/* ── Phase 1+: Indiana outline (draws via dashoffset) ── */}
        <path
          d={INDIANA_STATE_PATH}
          fill={phase >= 2 ? 'rgba(180,200,225,0.22)' : 'rgba(180,200,225,0)'}
          stroke="#aab"
          strokeWidth={2.5}
          strokeDasharray={INDIANA_LEN}
          strokeDashoffset={indiaOffset}
          style={{
            transition: phase >= 1
              ? 'stroke-dashoffset 1.5s ease-out, fill 0.9s ease-out'
              : 'none',
          }}
        />

        {/* ── Phase 5+: District 48 outline (draws via dashoffset) ── */}
        <path
          d={DISTRICT_48_PATH}
          fill={phase >= 6 ? `${arrowColor}4d` : `${arrowColor}00`}
          stroke={phase >= 5 ? arrowColor : 'none'}
          strokeWidth={2.5}
          strokeDasharray={DISTRICT_LEN}
          strokeDashoffset={districtOffset}
          style={{transition: 'stroke-dashoffset 1.2s ease-out, fill 0.8s ease-out 0.5s'}}
        />

        {/* ── Phase 7: County shapes + direct labels (sequential) ── */}
        {COUNTIES.slice(0, countiesShown).map((c) => {
          const isHovered = hoveredCounty === c.name
          return (
            <g
              key={c.name}
              style={{cursor: isDragging ? 'grabbing' : 'pointer'}}
              onMouseEnter={() => !isDragging && setHoveredCounty(c.name)}
              onMouseLeave={() => setHoveredCounty(null)}
            >
              <path
                d={c.path}
                fill={isHovered ? `${arrowColor}55` : `${arrowColor}22`}
                stroke={arrowColor}
                strokeWidth={isHovered ? 2 : 1.5}
                style={{transition: 'fill 0.15s, stroke-width 0.15s'}}
              />
              {/* County name inside shape */}
              <text
                x={c.cx}
                y={c.cy + 2.5}
                fontSize={7}
                fontWeight="bold"
                fill={textColor}
                textAnchor="middle"
                dominantBaseline="middle"
                style={{fontFamily: 'inherit', pointerEvents: 'none', userSelect: 'none'}}
              >
                {c.name}
              </text>
              {/* Hover tooltip — floats above the county */}
              {isHovered && (
                <g>
                  <rect
                    x={c.cx - 22}
                    y={c.cy - 22}
                    rx={3}
                    width={44}
                    height={13}
                    fill="white"
                    stroke={arrowColor}
                    strokeWidth={0.6}
                    opacity={0.95}
                  />
                  <text
                    x={c.cx}
                    y={c.cy - 15.5}
                    fontSize={7.5}
                    fontWeight="bold"
                    fill={textColor}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    style={{fontFamily: 'inherit', pointerEvents: 'none', userSelect: 'none'}}
                  >
                    {c.name} Co.
                  </text>
                </g>
              )}
            </g>
          )
        })}

        {/* ── Phases 3–5: Typewriter label + animated arrow ── */}
        {showLabel && (
          <>
            <rect x={6} y={16} rx={5} width={308} height={32} fill="rgba(255,255,255,0.88)" />
            <text
              x={14}
              y={38}
              fontSize={15}
              fontWeight="bold"
              fill={textColor}
              style={{fontFamily: 'inherit', letterSpacing: 0.3}}
            >
              {typedLabel}
            </text>
            <path
              d={ARROW_PATH}
              stroke={arrowColor}
              strokeWidth={3}
              fill="none"
              strokeDasharray={ARROW_LEN}
              strokeDashoffset={arrowOffset}
              markerEnd={`url(#${markerId})`}
              style={{transition: 'stroke-dashoffset 1.9s ease-in-out'}}
            />
          </>
        )}
      </svg>

      {/* ── Zoom controls (shown once counties are visible) ── */}
      {phase >= 7 && (
        <div className="flex items-center justify-end gap-1 border-t border-[color:var(--color-border)] px-2 py-1">
          <span className="mr-auto text-xs text-[color:var(--color-muted)]">District 48</span>
          <button
            onClick={zoomOut}
            aria-label="Zoom out"
            className="flex h-6 w-6 items-center justify-center rounded text-sm font-bold text-[color:var(--color-muted)] hover:bg-[color:var(--color-highlight)] hover:text-[color:var(--color-ink)]"
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
            onClick={zoomIn}
            aria-label="Zoom in"
            className="flex h-6 w-6 items-center justify-center rounded text-sm font-bold text-[color:var(--color-muted)] hover:bg-[color:var(--color-highlight)] hover:text-[color:var(--color-ink)]"
          >
            +
          </button>
        </div>
      )}
    </div>
  )
}
