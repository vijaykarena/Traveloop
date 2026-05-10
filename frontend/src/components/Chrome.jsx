import { useNav } from '../navigation'
import { Button } from '@/components/ui/button'
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
    <header className="flex items-center justify-between px-8 h-16 border-b bg-background shrink-0">
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('dashboard')}>
        <div className="h-8 w-8 rounded-md bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">T</div>
        <span className="text-lg font-semibold tracking-tight">Traveloop</span>
      </div>

      <nav className="flex items-center gap-1">
        {NAV_ITEMS.map(([label, Icon, page]) => (
          <button
            key={label}
            onClick={() => navigate(page)}
            className={cn(
              'flex items-center gap-2 px-3 h-9 rounded-md text-sm font-medium transition-colors',
              label === active
                ? 'bg-secondary text-secondary-foreground'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            )}
          >
            <Icon size={15} /> {label}
          </button>
        ))}
      </nav>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon"><Bell size={16} /></Button>
        <Button variant="ghost" size="icon" onClick={() => navigate('admin')}><Settings size={16} /></Button>
        <Avatar
          className="h-9 w-9 bg-primary/10 text-primary cursor-pointer"
          onClick={() => navigate('profile')}
        >
          <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">{user}</AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}
