'use client'

/**
 * Shared teardrop map pin component used by both the Indiana District 48 map
 * and the generic CMS-driven interactive map.
 */
export function MapPin({
  cx, cy, size, color, hovered,
  onMouseEnter, onMouseLeave, onClick,
}: {
  cx: number; cy: number; size: number; color: string; hovered: boolean
  onMouseEnter: () => void; onMouseLeave: () => void; onClick: (e: React.MouseEvent) => void
}) {
  const s = hovered ? size * 1.25 : size
  const r = s * 0.45
  return (
    <g
      style={{cursor: 'pointer', pointerEvents: 'all'}}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
    >
      <ellipse cx={cx} cy={cy + 0.5} rx={r * 0.5} ry={r * 0.2} fill="rgba(0,0,0,0.2)" />
      <path
        d={`M${cx} ${cy} C${cx - r} ${cy - r * 0.6} ${cx - r} ${cy - s + r * 0.3} ${cx} ${cy - s} C${cx + r} ${cy - s + r * 0.3} ${cx + r} ${cy - r * 0.6} ${cx} ${cy} Z`}
        fill={color}
        stroke="#fff"
        strokeWidth={s * 0.08}
        style={{transition: 'transform 0.15s'}}
      />
      <circle cx={cx} cy={cy - s * 0.55} r={r * 0.35} fill="#fff" opacity={0.9} />
    </g>
  )
}
