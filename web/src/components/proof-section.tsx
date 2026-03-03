import {SlotValue} from '@/components/slot-value'
import type {SlotValueConfig} from '@/components/slot-value'

type ProofStat = {
  value: string
  label: string
}

type ProofSectionProps = {
  heading?: string
  stats?: ProofStat[]
  body?: string
  /** Controls for the slot-machine scramble animation on stat values. */
  slotAnimation?: SlotValueConfig
}

/** Returns true when the section has content worth rendering. */
export function hasProofContent(heading?: string, stats?: ProofStat[], body?: string): boolean {
  return (
    (heading != null && heading.trim().length > 0) ||
    (stats != null && stats.length > 0) ||
    (body != null && body.trim().length > 0)
  )
}

/** Credibility / "receipts" section with large stat callouts. */
export function ProofSection({heading, stats, body, slotAnimation}: ProofSectionProps) {
  if (!hasProofContent(heading, stats, body)) {
    return null
  }

  return (
    <section className="proof-section">
      <div className="proof-inner">
        {heading ? <h2 className="proof-heading">{heading}</h2> : null}
        {stats && stats.length > 0 ? (
          <div className="proof-stats-grid">
            {stats.map((stat, index) => (
              <div key={`${stat.value}-${stat.label}`} className="proof-stat">
                <SlotValue
                  value={stat.value}
                  className="proof-stat-value"
                  startDelay={index * 150}
                  {...slotAnimation}
                />
                <span className="proof-stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
        ) : null}
        {body ? <p className="proof-body">{body}</p> : null}
      </div>
    </section>
  )
}
