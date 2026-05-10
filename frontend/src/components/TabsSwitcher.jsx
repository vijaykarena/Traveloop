import { cn } from '@/lib/utils'

export default function TabsSwitcher({ tabs, active, onChange, className = '' }) {
  return (
    <div className={cn('inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground', className)}>
      {tabs.map(t => (
        <button
          key={t}
          onClick={() => onChange?.(t)}
          className={cn(
            'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all',
            t === active ? 'bg-background text-foreground shadow-sm' : 'hover:text-foreground/80'
          )}
        >
          {t}
        </button>
      ))}
    </div>
  )
}
