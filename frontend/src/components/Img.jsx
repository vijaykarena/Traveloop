import { cn } from '@/lib/utils'

export default function Img({ label, ratio = '4 / 3', className = '', style }) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--bg-muted)]',
        className
      )}
      style={{ aspectRatio: ratio, ...style }}
    >
      <div className="absolute inset-0 tl-img-pattern" />
      {label && (
        <div className="absolute bottom-2 left-2 text-[10px] uppercase tracking-wider font-medium bg-[var(--bg-surface)]/80 backdrop-blur px-2 py-0.5 rounded-[var(--radius-sm)] text-[var(--text-tertiary)] border border-[var(--border-subtle)]">
          {label}
        </div>
      )}
    </div>
  )
}
