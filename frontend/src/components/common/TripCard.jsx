import { Badge } from '@/components/ui/badge'

/**
 * TripCard — Domain-specific trip card per the design system.
 * Used on Dashboard, MyTrips, and any trip listing.
 *
 * @param {string} title — Trip name
 * @param {string} dates — Date range string
 * @param {string} budget — Budget display string (e.g. "$2,400")
 * @param {'on-budget'|'near-limit'|'over-budget'|'draft'} status — Budget status
 * @param {string|number} cities — Number of cities
 * @param {string} gradient — CSS gradient for the card image area
 * @param {Function} onClick — Click handler
 * @param {string} className — Additional classes
 */
const STATUS_MAP = {
  'on-budget': { label: 'On Budget', variant: 'success' },
  'near-limit': { label: 'Near Limit', variant: 'warning' },
  'over-budget': { label: 'Over Budget', variant: 'destructive' },
  'draft': { label: 'Draft', variant: 'outline' },
}

export default function TripCard({
  title,
  dates,
  budget,
  status = 'draft',
  cities,
  gradient = 'linear-gradient(135deg, var(--brand-primary) 0%, var(--brand-primary-hover) 100%)',
  onClick,
  className = '',
}) {
  const statusInfo = STATUS_MAP[status] || STATUS_MAP.draft

  return (
    <div
      className={`bg-[var(--bg-surface)] rounded-[var(--radius-xl)] border border-[var(--border-subtle)]
        overflow-hidden shadow-[var(--shadow-sm)] cursor-pointer
        transition-all duration-200 ease
        hover:translate-y-[-3px] hover:shadow-[var(--shadow-lg)]
        ${className}`}
      onClick={onClick}
    >
      {/* Image Area */}
      <div
        className="h-[110px] flex items-end p-3 relative"
        style={{ background: gradient }}
      >
        {cities && (
          <span className="inline-flex items-center text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-white/25 text-white">
            {cities} {typeof cities === 'number' && cities === 1 ? 'City' : 'Cities'}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-3 px-4 pb-4">
        <div className="font-bold text-sm text-[var(--text-primary)] mb-0.5">
          {title}
        </div>
        <div className="text-xs text-[var(--text-tertiary)]">
          {dates}
        </div>
        {(status || budget) && (
          <div className="mt-3 flex justify-between items-center">
            <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
            {budget && (
              <span className="text-[13px] font-semibold text-[var(--brand-primary)]">
                {budget}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
