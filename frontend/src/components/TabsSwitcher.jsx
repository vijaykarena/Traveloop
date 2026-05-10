import { cn } from '@/lib/utils'

/**
 * TabsSwitcher — horizontally scrollable on mobile, inline-flex on desktop.
 * Tabs never wrap mid-word (whitespace-nowrap preserved).
 */
export default function TabsSwitcher({ tabs, active, onChange, className = '' }) {
  return (
    <div
      className={cn(
        'inline-flex h-10 items-center justify-start rounded-[var(--radius-lg)] bg-[var(--bg-muted)] p-1 text-[var(--text-tertiary)]',
        'max-w-full overflow-x-auto scrollbar-hide',
        className
      )}
    >
      {tabs.map(t => (
        <button
          key={t}
          onClick={() => onChange?.(t)}
          className={cn(
            'inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-[var(--radius-md)] px-3 py-1.5 text-sm font-medium transition-all duration-[120ms] ease',
            t === active
              ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-[var(--shadow-sm)]'
              : 'hover:text-[var(--text-primary)]'
          )}
        >
          {t}
        </button>
      ))}
    </div>
  )
}
