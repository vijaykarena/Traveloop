import { useState, useEffect, useRef } from 'react'
import { useNav } from '../navigation'
import { Button } from '@/components/ui/button'
import ThemeToggle from './common/ThemeToggle'
import { Bell, Settings, Compass, Calendar, PlaneTakeoff, Users, Menu, X } from 'lucide-react'
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
  const [menuOpen, setMenuOpen] = useState(false)
  const panelRef = useRef(null)

  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') setMenuOpen(false) }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  // Close on route change (resize etc)
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const handler = () => { if (mq.matches) setMenuOpen(false) }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  // Navigate and close mobile menu
  const handleNav = (page) => {
    navigate(page)
    setMenuOpen(false)
  }

  return (
    <>
      {/* ===== HEADER BAR ===== */}
      <header className="flex items-center justify-between px-4 sm:px-8 h-14 sm:h-16 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] shrink-0 relative z-[200]">

        {/* Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => handleNav('dashboard')}
        >
          <div className="h-8 w-8 rounded-[var(--radius-md)] bg-[var(--brand-primary)] text-white flex items-center justify-center font-display font-bold text-sm">
            T
          </div>
          <span className="font-display text-lg font-bold tracking-tight text-[var(--brand-primary)]">
            Traveloop
          </span>
        </div>

        {/* Desktop Nav — hidden below lg */}
        <nav className="hidden lg:flex items-center gap-1">
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

        {/* Desktop Right Icons — hidden below lg */}
        <div className="hidden lg:flex items-center gap-2">
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

        {/* Mobile Right — avatar + hamburger, hidden on lg+ */}
        <div className="flex lg:hidden items-center gap-2">
          <Avatar
            className="h-8 w-8 cursor-pointer"
            onClick={() => handleNav('profile')}
          >
            <AvatarFallback className="bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] font-display text-xs font-bold">
              {user}
            </AvatarFallback>
          </Avatar>
          <button
            onClick={() => setMenuOpen(prev => !prev)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            className="h-10 w-10 flex items-center justify-center rounded-[var(--radius-md)] text-[var(--text-secondary)] hover:bg-[var(--bg-muted)] hover:text-[var(--text-primary)] transition-all duration-[120ms]"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* ===== MOBILE BACKDROP ===== */}
      {menuOpen && (
        <div
          className="lg:hidden fixed inset-0 top-14 sm:top-16 z-[150] bg-black/25 backdrop-blur-[2px]"
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ===== MOBILE DROPDOWN PANEL ===== */}
      <div
        ref={panelRef}
        className={cn(
          'lg:hidden fixed top-14 sm:top-16 left-0 right-0 z-[160]',
          'bg-[var(--bg-surface)] border-b border-[var(--border-subtle)] shadow-[var(--shadow-lg)]',
          'transition-all duration-300 ease-in-out',
          menuOpen
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 -translate-y-2 pointer-events-none'
        )}
      >
        {/* Nav Links */}
        <nav className="p-3 space-y-1">
          {NAV_ITEMS.map(([label, Icon, page]) => (
            <button
              key={label}
              onClick={() => handleNav(page)}
              className={cn(
                'w-full flex items-center gap-3 px-4 h-12 rounded-[var(--radius-lg)] text-[15px] font-medium text-left',
                'transition-all duration-[120ms] ease',
                label === active
                  ? 'bg-[var(--bg-muted)] text-[var(--text-primary)]'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--bg-muted)] hover:text-[var(--brand-primary)]'
              )}
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
        </nav>

        {/* Bottom strip: Theme toggle + icon actions */}
        <div className="px-4 pb-4 pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between gap-2">
          <ThemeToggle />
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-10 w-10">
              <Bell size={16} />
            </Button>
            <Button variant="ghost" size="icon" className="h-10 w-10" onClick={() => handleNav('admin')}>
              <Settings size={16} />
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
