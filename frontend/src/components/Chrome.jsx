import { useNav } from '../navigation'
import { Button } from '@/components/ui/button'
import ThemeToggle from './common/ThemeToggle'
import { Bell, Settings, Compass, Calendar, PlaneTakeoff, Users } from 'lucide-react'
import { cn } from '@/lib/utils'
import { AvatarFallback, Avatar } from '@/components/ui/avatar'

const NAV_ITEMS = [
  ['Discover', Compass, 'dashboard'],
  ['Plan', Calendar, 'create-trip'],
  ['My Trips', PlaneTakeoff, 'my-trips'],
  ['Community', Users, 'community'],
]

export default function Chrome({ active = 'Plan', user = 'AS' }) {
  const { navigate } = useNav()
  return (
    <header className="flex items-center justify-between px-8 h-16 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] shrink-0">
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => navigate('dashboard')}
      >
        <div className="h-8 w-8 rounded-[var(--radius-md)] bg-[var(--brand-primary)] text-white flex items-center justify-center font-display font-bold text-sm">
          T
        </div>
        <span className="font-display text-lg font-bold tracking-tight text-[var(--brand-primary)]">
          Traveloop
        </span>
      </div>

      <nav className="flex items-center gap-1">
        {NAV_ITEMS.map(([label, Icon, page]) => (
          <button
            key={label}
            onClick={() => navigate(page)}
            className={cn(
              'flex items-center gap-2 px-3 h-9 rounded-[var(--radius-md)] text-[13px] font-medium whitespace-nowrap',
              'transition-all duration-[120ms] ease',
              label === active
                ? 'bg-[var(--bg-muted)] text-[var(--text-primary)]'
                : 'text-[var(--text-secondary)] hover:text-[var(--brand-primary)] hover:bg-[var(--bg-muted)]'
            )}
          >
            <Icon size={15} /> {label}
          </button>
        ))}
      </nav>

      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Button variant="ghost" size="icon">
          <Bell size={16} />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => navigate('admin')}>
          <Settings size={16} />
        </Button>
        <Avatar
          className="h-9 w-9 cursor-pointer bg-[var(--brand-primary)]/10"
          onClick={() => navigate('profile')}
        >
          <AvatarFallback className="bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] font-display text-sm font-bold">
            {user}
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}
