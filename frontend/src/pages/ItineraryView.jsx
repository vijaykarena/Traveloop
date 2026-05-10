import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Chrome from '../components/Chrome'
import Controls from '../components/Controls'
import { useNav } from '../navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Download, Share, Plus, MapPin } from 'lucide-react'
import { cn } from '@/lib/utils'
import api, { ENDPOINTS } from '../api'

const TYPE_VARIANT = { ADVENTURE: 'accent', FOOD: 'secondary', SIGHTSEEING: 'info', CULTURE: 'success', SHOPPING: 'outline', OTHER: 'outline' }
const TYPE_LABEL = { SIGHTSEEING: 'Sightseeing', FOOD: 'Food', ADVENTURE: 'Adventure', CULTURE: 'Culture', SHOPPING: 'Shopping', OTHER: 'Other' }
const TRANSPORT_LABEL = { FLIGHT: 'Flight', TRAIN: 'Train', BUS: 'Bus', CAR: 'Car', FERRY: 'Ferry', OTHER: 'Transport' }

function fmtDate(iso) {
  return new Date(iso).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
}

function fmtDuration(hours) {
  if (!hours) return null
  if (hours < 1) return `${Math.round(hours * 60)}m`
  return `${hours}h`
}

export default function ItineraryView() {
  const { id } = useParams()
  const { navigate } = useNav()

  const [trip, setTrip] = useState(null)
  const [budget, setBudget] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) { setLoading(false); return }
    async function load() {
      try {
        const [tripRes, budgetRes] = await Promise.all([
          api.get(ENDPOINTS.TRIP_BY_ID(id)),
          api.get(ENDPOINTS.TRIP_BUDGET(id)).catch(() => ({ data: null })),
        ])
        setTrip(tripRes.data)
        setBudget(budgetRes.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  if (loading) return <div className="p-10 text-[var(--text-secondary)]">Loading itinerary…</div>

  if (!id || !trip) {
    return (
      <div className="flex flex-col min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)] font-body">
        <Chrome active="My Trips" />
        <div className="p-10 text-center">
          <p className="text-[var(--text-tertiary)] mb-4">No trip selected.</p>
          <Button onClick={() => navigate('my-trips')}>Go to My Trips</Button>
        </div>
      </div>
    )
  }

  const durationDays = Math.max(1, Math.ceil((new Date(trip.endDate) - new Date(trip.startDate)) / (1000 * 60 * 60 * 24)))
  const budgetPct = budget?.budgetLimit && budget?.total > 0
    ? Math.min(100, Math.round((budget.total / budget.budgetLimit) * 100))
    : 0

  const stops = trip.stops ?? []

  return (
    <div className="flex flex-col min-h-screen lg:h-screen bg-[var(--bg-page)] text-[var(--text-primary)] font-body lg:overflow-hidden">
      <Chrome active="My Trips" />
      <Controls q="Search this itinerary…" />

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 px-4 sm:px-8 py-4 sm:py-6 border-b border-[var(--border-subtle)] shrink-0 bg-[var(--bg-surface)]">
        <div>
          <Badge variant="secondary" className="mb-2">Itinerary · {durationDays} days · {stops.length} stops</Badge>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">{trip.title}</h1>
          {trip.destination && (
            <p className="text-[var(--text-secondary)] mt-1 flex items-center gap-1 text-sm"><MapPin size={13} />{trip.destination}</p>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm"><Download size={14} /> Export</Button>
          <Button variant="outline" size="sm"><Share size={14} /> Share</Button>
          <Button size="sm" onClick={() => navigate(`build-itinerary/${id}`)}><Plus size={14} /> Edit</Button>
        </div>
      </div>

      {/* Main grid */}
      <div className="flex flex-col lg:grid lg:grid-cols-[1fr_320px] gap-4 sm:gap-8 p-4 sm:p-8 flex-1 lg:overflow-auto">

        {/* ===== STOP SECTIONS ===== */}
        <div className="space-y-6">
          {stops.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-[var(--text-tertiary)] mb-4">No stops added yet.</p>
              <Button onClick={() => navigate(`build-itinerary/${id}`)}><Plus size={14} /> Add stops</Button>
            </div>
          ) : (
            stops.map((stop, idx) => (
              <div key={stop.id}>
                <div className="flex items-baseline gap-3 mb-3">
                  <h2 className="font-display text-xl font-bold">Stop {stop.order ?? idx + 1}</h2>
                  <span className="text-sm text-[var(--text-tertiary)]">
                    {fmtDate(stop.arrivalDate)} → {fmtDate(stop.departureDate)}
                  </span>
                </div>

                <Card className="py-0">
                  {/* City header */}
                  <div className="px-4 sm:px-5 py-3 border-b border-[var(--border-subtle)] flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-base">{stop.city?.name}</span>
                      {stop.city?.description && (
                        <p className="text-xs text-[var(--text-tertiary)] mt-0.5 line-clamp-1">{stop.city.description}</p>
                      )}
                    </div>
                    <Badge variant="secondary">{stop.activities?.length ?? 0} activities</Badge>
                  </div>

                  <CardContent className="p-0">
                    {/* Accommodation */}
                    {stop.accommodation && (
                      <div className={cn('px-4 sm:px-5 py-3 border-b border-[var(--border-subtle)]')}>
                        <div className="hidden sm:grid sm:grid-cols-[80px_1fr_100px_80px] sm:items-center sm:gap-4">
                          <span className="font-mono text-xs text-[var(--text-tertiary)]">Stay</span>
                          <div>
                            <div className="font-medium">{stop.accommodation.name}</div>
                            {stop.accommodation.address && <div className="text-xs text-[var(--text-tertiary)]">{stop.accommodation.address}</div>}
                          </div>
                          <span className="text-right font-medium">₹{stop.accommodation.costPerNight.toLocaleString()}/night</span>
                          <div />
                        </div>
                        <div className="sm:hidden">
                          <div className="flex items-start justify-between">
                            <div>
                              <Badge variant="secondary" className="mb-1">Stay</Badge>
                              <div className="font-medium text-sm">{stop.accommodation.name}</div>
                            </div>
                            <span className="font-medium text-sm">₹{stop.accommodation.costPerNight.toLocaleString()}/night</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Activities */}
                    {(stop.activities ?? []).map((ta, i) => {
                      const act = ta.activity
                      const cost = ta.actualCost ?? act?.estimatedCost ?? 0
                      return (
                        <div key={ta.id} className={cn('px-4 sm:px-5 py-3', (i > 0 || stop.accommodation) && 'border-t border-[var(--border-subtle)]')}>
                          <div className="hidden sm:grid sm:grid-cols-[80px_1fr_100px_80px] sm:items-center sm:gap-4">
                            <span className="font-mono text-xs text-[var(--text-tertiary)]">
                              {ta.scheduledDate ? new Date(ta.scheduledDate).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : '—'}
                            </span>
                            <div>
                              <div className="font-medium">{act?.name}</div>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant={TYPE_VARIANT[act?.type] ?? 'outline'}>{TYPE_LABEL[act?.type] ?? act?.type}</Badge>
                                {act?.durationHours && <span className="text-xs text-[var(--text-tertiary)]">{fmtDuration(act.durationHours)}</span>}
                              </div>
                            </div>
                            <span className={cn('text-right font-medium', cost === 0 ? 'text-[var(--color-success)]' : '')}>
                              {cost === 0 ? 'Free' : `₹${cost.toLocaleString()}`}
                            </span>
                            <div />
                          </div>
                          <div className="sm:hidden">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-0.5">
                                  <Badge variant={TYPE_VARIANT[act?.type] ?? 'outline'}>{TYPE_LABEL[act?.type] ?? act?.type}</Badge>
                                </div>
                                <div className="font-medium text-sm">{act?.name}</div>
                              </div>
                              <span className={cn('font-medium text-sm shrink-0', cost === 0 ? 'text-[var(--color-success)]' : '')}>
                                {cost === 0 ? 'Free' : `₹${cost.toLocaleString()}`}
                              </span>
                            </div>
                          </div>
                        </div>
                      )
                    })}

                    {!stop.accommodation && (stop.activities ?? []).length === 0 && (
                      <div className="px-5 py-4 text-sm text-[var(--text-tertiary)]">No activities or accommodation added for this stop.</div>
                    )}
                  </CardContent>
                </Card>

                {/* Transport after this stop */}
                {(trip.transports ?? [])
                  .filter(t => t.fromStopId === stop.id)
                  .map(t => (
                    <div key={t.id} className="flex items-center gap-3 mt-3 px-2 text-sm text-[var(--text-tertiary)]">
                      <div className="flex-1 h-px bg-[var(--border-subtle)]" />
                      <Badge variant="info">{TRANSPORT_LABEL[t.mode] ?? t.mode}</Badge>
                      {t.carrier && <span>{t.carrier}</span>}
                      {t.cost > 0 && <span>₹{t.cost.toLocaleString()}</span>}
                      <div className="flex-1 h-px bg-[var(--border-subtle)]" />
                    </div>
                  ))}
              </div>
            ))
          )}
        </div>

        {/* ===== BUDGET ASIDE ===== */}
        <aside>
          <Card className="py-0">
            <CardHeader className="p-5 pb-3">
              <CardDescription>Trip budget</CardDescription>
              <CardTitle className="text-3xl">
                {budget ? `₹${budget.total.toLocaleString()}` : '—'}
              </CardTitle>
              <CardDescription>
                {budget?.budgetLimit
                  ? `of ₹${budget.budgetLimit.toLocaleString()} · ${budgetPct}% spent`
                  : 'No budget limit set'}
              </CardDescription>
            </CardHeader>
            <CardContent className="px-5 pb-5">
              {budget?.budgetLimit && <Progress value={budgetPct} className="mb-6" />}

              {budget?.breakdown && Object.entries(budget.breakdown).map(([k, v]) => {
                const pct = budget.total > 0 ? Math.round((v / budget.total) * 100) : 0
                return (
                  <div key={k} className="mb-3">
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="capitalize">{k}</span>
                      <span className="font-medium">
                        ₹{v.toLocaleString()} <span className="text-[var(--text-tertiary)] text-xs">· {pct}%</span>
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-[var(--bg-muted)] overflow-hidden">
                      <div className="h-full bg-[var(--brand-primary)]" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )
              })}

              {budget?.overBudget && (
                <div className="mt-4 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-[var(--radius-md)] text-xs text-red-700 dark:text-red-300">
                  Over budget by ₹{(budget.total - budget.budgetLimit).toLocaleString()}
                </div>
              )}

              <Button variant="outline" size="sm" className="w-full mt-4" onClick={() => navigate(`invoice/${id}`)}>View invoice</Button>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  )
}
