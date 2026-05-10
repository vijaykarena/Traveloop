import { useState, useRef, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, SlidersHorizontal, Filter, X } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Controls — Search + filter bar used across authenticated pages.
 * On mobile (< md): shows search + single "Filters" button with dropdown.
 * On md+: shows all buttons (Filter, Group by, Sort).
 * The `extra` slot is always visible regardless of breakpoint.
 */
export default function Controls({ q = 'Search destinations, activities, trips…', search, onSearch, hideFilters = false, extra }) {
  const [filtersOpen, setFiltersOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Close dropdown on outside click
  useEffect(() => {
    if (!filtersOpen) return
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setFiltersOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [filtersOpen])

  return (
    <div className="relative shrink-0">
      <div className="flex items-center gap-2 px-4 sm:px-8 py-3 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]">
        {/* Search — always visible, expands to fill space */}
        <div className="relative flex-1 max-w-2xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" size={16} />
          <Input 
            className="pl-10" 
            placeholder={q} 
            value={search !== undefined ? search : undefined}
            onChange={onSearch ? (e) => onSearch(e.target.value) : undefined}
          />
        </div>

        {!hideFilters && (
          <>
            {/* Full filter buttons — visible on md and above */}
            <div className="hidden md:flex items-center gap-2">
              <Button variant="outline" size="sm"><Filter size={14} /> Filter</Button>
              <Button variant="outline" size="sm">Group by</Button>
              <Button variant="outline" size="sm">Sort</Button>
            </div>

            {/* Single Filters button — visible on mobile only */}
            <div ref={dropdownRef} className="relative md:hidden">
              <Button
                variant={filtersOpen ? 'default' : 'outline'}
                size="sm"
                className="gap-1.5"
                onClick={() => setFiltersOpen(v => !v)}
              >
                {filtersOpen ? <X size={14} /> : <SlidersHorizontal size={14} />}
                <span>Filters</span>
              </Button>

              {/* Mobile Filters Dropdown */}
              <div className={cn(
                'absolute right-0 top-full mt-2 w-48 rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-[var(--shadow-lg)] z-50',
                'transition-all duration-200 ease-out',
                filtersOpen
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 -translate-y-1 pointer-events-none'
              )}>
                <div className="p-1.5 space-y-0.5">
                  <button className="w-full flex items-center gap-2 px-3 h-10 rounded-[var(--radius-md)] text-sm font-medium text-left hover:bg-[var(--bg-muted)] transition-colors">
                    <Filter size={14} className="text-[var(--text-tertiary)]" />
                    Filter
                  </button>
                  <button className="w-full flex items-center gap-2 px-3 h-10 rounded-[var(--radius-md)] text-sm font-medium text-left hover:bg-[var(--bg-muted)] transition-colors">
                    <SlidersHorizontal size={14} className="text-[var(--text-tertiary)]" />
                    Group by
                  </button>
                  <button className="w-full flex items-center gap-2 px-3 h-10 rounded-[var(--radius-md)] text-sm font-medium text-left hover:bg-[var(--bg-muted)] transition-colors">
                    <SlidersHorizontal size={14} className="text-[var(--text-tertiary)]" />
                    Sort
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Extra slot — always rendered (e.g. Export, Add note buttons) */}
        {extra}
      </div>
    </div>
  )
}
