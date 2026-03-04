'use client'

import {useEffect, useRef, useState} from 'react'

/**
 * Animated SVG of Indiana's state outline with Senate District 48 highlighted.
 *
 * GIS data sources:
 * - State outline: PublicaMundi/MappingAPI us-states.json (simplified Natural Earth)
 * - District 48: US Census Bureau TIGERweb 2024, Layer 56
 *   "2024 State Legislative Districts - Upper", GEOID 18048
 *
 * Projection: equirectangular with cos(38.96°) correction.
 * Douglas-Peucker simplification: state ε=0.8, district ε=1.0.
 *
 * The state outline draws itself stroke-by-stroke when scrolled into view
 * using the classic stroke-dasharray / stroke-dashoffset technique.
 * District 48 fills in with accent color after the outline completes.
 * Respects prefers-reduced-motion by showing the final state immediately.
 */

/* ── Real GIS-derived SVG paths ─────────────────────────────────────── */

/** Indiana state outline — 45 pts, Natural Earth via PublicaMundi */
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

/**
 * Senate District 48 — 125 pts, Census TIGERweb 2024 SLDU (GEOID 18048).
 * Covers all of Dubois & Perry counties, parts of Spencer, Crawford & Orange.
 */
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

/** District 48 centroid from Census INTPTLAT/INTPTLON, projected to SVG */
const DISTRICT_CENTER = {x: 97, y: 442}

/* ── Component ──────────────────────────────────────────────────────── */

export function IndianaDistrictMap() {
  const svgRef = useRef<SVGSVGElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return

    // Respect reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      setIsVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      {threshold: 0.3, rootMargin: '-5%'},
    )

    observer.observe(svg)
    return () => observer.disconnect()
  }, [])

  return (
    <div className="indiana-district-map" aria-label="Map of Indiana highlighting Senate District 48">
      <svg
        ref={svgRef}
        viewBox="0 0 320 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`indiana-svg ${isVisible ? 'indiana-svg-visible' : ''}`}
        role="img"
      >
        <title>Indiana State Senate District 48</title>

        {/* State outline — Natural Earth via PublicaMundi (45 pts) */}
        <path
          className="indiana-outline"
          d={INDIANA_STATE_PATH}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* District 48 — Census TIGERweb 2024 SLDU boundary (125 pts) */}
        <path
          className="indiana-district-48"
          d={DISTRICT_48_PATH}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* District label */}
        <text
          className="indiana-district-label"
          x={DISTRICT_CENTER.x}
          y={DISTRICT_CENTER.y}
          textAnchor="middle"
          dominantBaseline="middle"
        >
          48
        </text>

        {/* Marker at Census-designated interior point of district */}
        <circle
          className="indiana-district-marker"
          cx={DISTRICT_CENTER.x}
          cy={DISTRICT_CENTER.y - 5}
          r="4"
        />
      </svg>
    </div>
  )
}
