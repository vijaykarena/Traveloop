import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import Chrome from '../components/Chrome'
import Img from '../components/Img'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardTitle, CardDescription } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { MapPin, SlidersHorizontal, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import api, { ENDPOINTS } from '../api'

const ACTIVITY_TYPES = ['SIGHTSEEING', 'FOOD', 'ADVENTURE', 'CULTURE', 'SHOPPING', 'OTHER']
const TYPE_LABEL = { SIGHTSEEING: 'Sightseeing', FOOD: 'Food & Drink', ADVENTURE: 'Adventure', CULTURE: 'Culture', SHOPPING: 'Shopping', OTHER: 'Other' }
const TYPE_VARIANT = { ADVENTURE: 'accent', FOOD: 'secondary', SIGHTSEEING: 'info', CULTURE: 'success', SHOPPING: 'outline', OTHER: 'outline' }

function fmtDuration(hours) {
  if (!hours) return '—'
  if (hours < 1) return `${Math.round(hours * 60)}m`
  if (hours % 1 === 0) return `${hours}h`
  return `${Math.floor(hours)}h ${Math.round((hours % 1) * 60)}m`
}

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams()

  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [activeTypes, setActiveTypes] = useState(new Set())
  const [maxCost, setMaxCost] = useState('')

  // City filter from URL params (set when navigating from Dashboard)
  const cityId = searchParams.get('cityId') || ''
  const cityName = searchParams.get('cityName') || ''

  const clearCityFilter = () => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev)
      next.delete('cityId')
      next.delete('cityName')
      return next
    })
  }

  const search = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (query.trim()) params.set('search', query.trim())
      if (activeTypes.size > 0) params.set('type', [...activeTypes][0])
      if (maxCost) params.set('maxCost', maxCost)
      if (cityId) params.set('cityId', cityId)
      params.set('limit', '20')

      const res = await api.get(`${ENDPOINTS.ACTIVITIES}?${params}`)
      setResults(res.data.activities || [])
      setTotal(res.data.total || 0)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [query, activeTypes, maxCost, cityId])

  useEffect(() => {
    search()
  }, [search])

  const toggleType = (t) => {
    setActiveTypes(prev => {
      const next = new Set(prev)
      next.has(t) ? next.delete(t) : next.add(t)
      return next
    })
  }

  const hasActiveFilters = activeTypes.size > 0 || cityId

  return (
    <div className="flex flex-col min-h-screen lg:h-screen bg-[var(--bg-page)] text-[var(--text-primary)] font-body lg:overflow-hidden">
      <Chrome active="Discover" />

      {/* Search bar */}
      <div className="px-4 sm:px-8 py-3 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] shrink-0 flex gap-3 items-center">
        <Input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search activities, cities…"
          className="max-w-sm"
        />
        {query && (
          <Button variant="ghost" size="icon" onClick={() => setQuery('')}><X size={16} /></Button>
        )}
      </div>

      {/* Mobile filter toggle */}
      <div className="lg:hidden flex items-center justify-between px-4 py-2 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] shrink-0">
        <span className="text-sm text-[var(--text-tertiary)]">
          {loading ? 'Searching…' : `${total} result${total !== 1 ? 's' : ''}${query ? ` · "${query}"` : ''}`}
        </span>
        <Button variant="outline" size="sm" onClick={() => setFiltersOpen(v => !v)}>
          {filtersOpen ? <><X size={14} /> Hide</> : <><SlidersHorizontal size={14} /> Filters</>}
        </Button>
      </div>

      <div className="flex flex-col lg:grid lg:grid-cols-[1fr_300px] gap-4 sm:gap-8 p-4 sm:p-8 flex-1 lg:overflow-auto">

        {/* ===== RESULTS ===== */}
        <div>
          <div className="flex flex-wrap items-baseline justify-between gap-2 mb-4">
            <div>
              <h2 className="font-display text-xl sm:text-2xl font-bold tracking-tight">
                {loading ? 'Searching…' : `${total} activit${total !== 1 ? 'ies' : 'y'}`}
              </h2>
              <div className="text-sm text-[var(--text-tertiary)] mt-1">
                {cityName ? `in ${cityName}` : query ? `matching "${query}"` : 'Browse all activities'}
                {activeTypes.size > 0 && ` · ${[...activeTypes].map(t => TYPE_LABEL[t]).join(', ')}`}
              </div>
            </div>
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2">
                {cityId && (
                  <Badge variant="info" className="cursor-pointer gap-1" onClick={clearCityFilter}>
                    <MapPin size={11} /> {cityName || `City #${cityId}`} ×
                  </Badge>
                )}
                {[...activeTypes].map(t => (
                  <Badge key={t} variant="accent" className="cursor-pointer" onClick={() => toggleType(t)}>
                    {TYPE_LABEL[t]} ×
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-24 bg-[var(--bg-muted)] rounded-[var(--radius-xl)] animate-pulse" />
              ))}
            </div>
          ) : results.length === 0 ? (
            <p className="text-sm text-[var(--text-tertiary)] py-10">No activities found. Try a different search.</p>
          ) : (
            <div className="space-y-3">
              {results.map((r, i) => (
                <Card key={r.id} className="hover:shadow-[var(--shadow-md)] transition-shadow cursor-pointer py-0">
                  {/* Mobile */}
                  <div className="block sm:hidden p-4">
                    <div className="flex items-start gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <CardTitle className="text-base">{r.name}</CardTitle>
                          <Badge variant={TYPE_VARIANT[r.type] ?? 'outline'}>{TYPE_LABEL[r.type] ?? r.type}</Badge>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--text-tertiary)]">
                          <span className="flex items-center gap-1"><MapPin size={11} /> {r.city?.name}</span>
                          <span>·</span>
                          <span>{fmtDuration(r.durationHours)}</span>
                          <span>·</span>
                          <span className="font-medium text-[var(--text-primary)]">
                            {r.estimatedCost === 0 ? 'Free' : `₹${r.estimatedCost.toLocaleString()}`}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Desktop */}
                  <div className="hidden sm:grid sm:grid-cols-[40px_140px_1fr] sm:items-center sm:gap-4 sm:p-4">
                    <span className="text-xs text-[var(--text-tertiary)] font-mono">{String(i + 1).padStart(2, '0')}</span>
                    {r.imageUrl
                      ? <img src={r.imageUrl} alt={r.name} className="w-full aspect-[4/3] object-cover rounded-[var(--radius-md)]" />
                      : <Img ratio="4/3" label={r.type?.toLowerCase()} className="w-full" />
                    }
                    <div>
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg">{r.name}</CardTitle>
                        <Badge variant={TYPE_VARIANT[r.type] ?? 'outline'}>{TYPE_LABEL[r.type] ?? r.type}</Badge>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-[var(--text-tertiary)] mt-1">
                        <span className="flex items-center gap-1"><MapPin size={12} /> {r.city?.name}</span>
                        <span>·</span>
                        <span>{fmtDuration(r.durationHours)}</span>
                        <span>·</span>
                        <span className="font-medium text-[var(--text-primary)]">
                          {r.estimatedCost === 0 ? 'Free' : `₹${r.estimatedCost.toLocaleString()}`}
                        </span>
                      </div>
                      {r.description && <CardDescription className="mt-2">{r.description}</CardDescription>}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* ===== FILTER ASIDE ===== */}
        <aside className={`space-y-4 ${filtersOpen ? 'block' : 'hidden'} lg:block`}>
          <Card className="py-0">
            <div className="p-4 pb-2 font-medium text-sm">Max cost (₹)</div>
            <div className="p-4 pt-2">
              <Input
                type="number"
                placeholder="e.g. 500"
                value={maxCost}
                onChange={e => setMaxCost(e.target.value)}
                min="0"
              />
              {maxCost && (
                <Button variant="ghost" size="sm" className="mt-2 px-0" onClick={() => setMaxCost('')}>Clear</Button>
              )}
            </div>
          </Card>

          <Card className="py-0">
            <div className="p-4 pb-2 font-medium text-sm">Activity type</div>
            <div className="p-4 pt-2 space-y-2">
              {ACTIVITY_TYPES.map(t => (
                <label key={t} className="flex items-center gap-2 text-sm cursor-pointer">
                  <Checkbox checked={activeTypes.has(t)} onCheckedChange={() => toggleType(t)} />
                  {TYPE_LABEL[t]}
                </label>
              ))}
            </div>
          </Card>
        </aside>
      </div>
    </div>
  )
}
