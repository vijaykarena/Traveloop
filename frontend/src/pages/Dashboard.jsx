import { useState, useEffect } from 'react'
import Chrome from '../components/Chrome'
import Controls from '../components/Controls'
import Img from '../components/Img'
import SectionHeader from '../components/common/SectionHeader'
import { useNav } from '../navigation'
import { useUser } from '../context/UserContext'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { MapPin, Plus, ArrowRight } from 'lucide-react'
import api, { ENDPOINTS } from '../api'

function fmtDateRange(start, end) {
  const s = new Date(start).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
  const e = new Date(end).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
  return `${s} → ${e}`
}

export default function Dashboard() {
  const { navigate } = useNav()
  const { user } = useUser()

  const [trips, setTrips] = useState([])
  const [cities, setCities] = useState([])
  const [publicTrips, setPublicTrips] = useState([])

  useEffect(() => {
    async function load() {
      try {
        const [tripsRes, citiesRes, pubRes] = await Promise.all([
          api.get(ENDPOINTS.TRIPS),
          api.get(`${ENDPOINTS.CITIES}?limit=5&sortBy=popularity`),
          api.get(ENDPOINTS.PUBLIC_TRIPS),
        ])
        setTrips(tripsRes.data)
        setCities(citiesRes.data.cities || [])
        setPublicTrips(pubRes.data.trips || [])
      } catch (err) {
        console.error('Failed to load dashboard', err)
      }
    }
    load()
  }, [])

  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const upcoming = trips.filter(t => new Date(t.startDate) >= today).sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
  const previous = trips.filter(t => new Date(t.endDate) < today).sort((a, b) => new Date(b.endDate) - new Date(a.endDate))
  const nextTrip = upcoming[0]

  const getDaysUntil = (date) => Math.ceil((new Date(date) - now) / (1000 * 60 * 60 * 24))

  const formatBudget = (trip) => {
    if (!trip.budgetLimit) return 'No budget set'
    const spent = trip.expenses?.reduce((acc, curr) => acc + curr.amount, 0) || 0
    return `₹${spent.toLocaleString()} / ₹${trip.budgetLimit.toLocaleString()}`
  }

  return (
    <div className="flex flex-col min-h-screen lg:h-screen bg-[var(--bg-page)] text-[var(--text-primary)] font-body lg:overflow-hidden">
      <Chrome active="Discover" />
      <div className="flex-1 lg:overflow-auto">

        {/* ===== HERO BANNER ===== */}
        <div className="relative h-48 sm:h-64 md:h-72 border-b border-[var(--border-subtle)] shrink-0">
          <Img label="Banner" className="absolute inset-0 rounded-none border-0 h-full w-full" style={{ aspectRatio: undefined }} />
          <div className="absolute inset-x-4 sm:inset-x-8 bottom-4 sm:bottom-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <Card className="max-w-xs sm:max-w-md py-0">
              <CardHeader className="p-4 sm:p-6">
                <Badge variant="accent" className="w-fit mb-2">
                  {new Date().toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
                </Badge>
                <CardTitle className="text-xl sm:text-3xl">Where to, {user?.firstName || 'Explorer'}?</CardTitle>
                <CardDescription className="hidden sm:block">
                  {upcoming.length > 0
                    ? `${upcoming.length} trip${upcoming.length > 1 ? 's' : ''} on the horizon.`
                    : 'No upcoming trips planned yet.'}
                  {nextTrip && ` ${getDaysUntil(nextTrip.startDate)} days until ${nextTrip.title}.`}
                </CardDescription>
              </CardHeader>
            </Card>
            <Button size="sm" className="sm:hidden self-start" onClick={() => navigate('create-trip')}>
              <Plus size={14} /> New Trip
            </Button>
            <Button size="lg" className="hidden sm:flex" onClick={() => navigate('create-trip')}>
              <Plus size={16} /> Plan a New Trip
            </Button>
          </div>
        </div>

        <Controls q="Search cities, activities…" />

        {/* ===== MAIN CONTENT GRID ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4 sm:gap-8 p-4 sm:p-8">

          {/* LEFT COLUMN */}
          <div>
            <SectionHeader
              title="Top destinations"
              trailing={<span className="text-xs text-[var(--text-tertiary)]">{cities.length} loaded</span>}
            />
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {cities.length === 0
                ? Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-32 bg-[var(--bg-muted)] rounded-[var(--radius-xl)] animate-pulse" />
                  ))
                : cities.map(c => (
                    <Card key={c.id} className="overflow-hidden cursor-pointer hover:shadow-[var(--shadow-md)] transition-shadow py-0" onClick={() => navigate('search')}>
                      {c.imageUrl
                        ? <img src={c.imageUrl} alt={c.name} className="w-full aspect-square object-cover" />
                        : <Img ratio="1/1" label={c.name} className="rounded-none border-0" />
                      }
                      <div className="p-3">
                        <div className="font-medium text-sm truncate">{c.name}</div>
                        <div className="text-xs text-[var(--text-tertiary)] flex items-center gap-1">
                          <MapPin size={10} /> {c._count?.activities ?? 0} activities
                        </div>
                      </div>
                    </Card>
                  ))}
            </div>

            <SectionHeader
              title="Previous trips"
              trailing={<Button variant="link" size="sm" onClick={() => navigate('my-trips')}>View all <ArrowRight size={14} /></Button>}
              className="mt-6 sm:mt-8"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {previous.length === 0 ? (
                <p className="text-sm text-[var(--text-tertiary)] col-span-3">No previous trips yet.</p>
              ) : (
                previous.slice(0, 3).map((trip) => {
                  const duration = Math.max(1, Math.ceil((new Date(trip.endDate) - new Date(trip.startDate)) / (1000 * 60 * 60 * 24)))
                  const spent = trip.expenses?.reduce((acc, curr) => acc + curr.amount, 0) || 0
                  return (
                    <Card key={trip.id} className="py-0 cursor-pointer" onClick={() => navigate(`build-itinerary/${trip.id}`)}>
                      {trip.coverPhotoUrl
                        ? <img src={trip.coverPhotoUrl} alt={trip.title} className="w-full aspect-[16/10] object-cover rounded-t-[var(--radius-xl)]" />
                        : <Img ratio="16/10" label="trip" className="rounded-b-none border-0 border-b rounded-t-[var(--radius-xl)]" />
                      }
                      <CardHeader className="p-4">
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-base truncate mr-2">{trip.title}</CardTitle>
                          <Badge variant="outline" className="shrink-0">{new Date(trip.startDate).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}</Badge>
                        </div>
                        <CardDescription>{duration} days{spent > 0 ? ` · ₹${spent.toLocaleString()}` : ''}</CardDescription>
                      </CardHeader>
                    </Card>
                  )
                })
              )}
            </div>
          </div>

          {/* RIGHT ASIDE */}
          <aside>
            <SectionHeader title="Up next" />
            {nextTrip ? (
              <Card className="py-0 cursor-pointer" onClick={() => navigate(`build-itinerary/${nextTrip.id}`)}>
                <CardHeader className="p-5">
                  <Badge variant="accent" className="w-fit">In {getDaysUntil(nextTrip.startDate)} days</Badge>
                  <CardTitle className="text-2xl mt-2">{nextTrip.title}</CardTitle>
                  <CardDescription>{fmtDateRange(nextTrip.startDate, nextTrip.endDate)} · {nextTrip._count?.stops || 0} stops</CardDescription>
                </CardHeader>
                <CardContent className="px-5 pb-5">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-[var(--text-tertiary)]">Budget</span>
                    <span className="font-medium">{formatBudget(nextTrip)}</span>
                  </div>
                  {nextTrip.budgetLimit && (
                    <Progress value={Math.min(100, ((nextTrip.expenses?.reduce((a, e) => a + e.amount, 0) || 0) / nextTrip.budgetLimit) * 100)} />
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card className="py-0">
                <CardContent className="p-5 flex flex-col items-center text-center">
                  <CardDescription className="mb-4">No upcoming trips</CardDescription>
                  <Button size="sm" onClick={() => navigate('create-trip')}><Plus size={14} className="mr-2" /> Plan a Trip</Button>
                </CardContent>
              </Card>
            )}

            <h3 className="text-xs font-semibold mt-6 mb-3 text-[var(--text-tertiary)] uppercase tracking-wider">From the community</h3>
            <div className="space-y-3">
              {publicTrips.length === 0 ? (
                <p className="text-xs text-[var(--text-tertiary)]">No public trips shared yet.</p>
              ) : (
                publicTrips.slice(0, 3).map(t => (
                  <Card key={t.id} className="cursor-pointer hover:bg-[var(--bg-muted)] transition-colors py-0" onClick={() => navigate('community')}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <Avatar className="h-6 w-6 shrink-0">
                          <AvatarFallback className="bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] text-xs font-bold">
                            {t.user?.firstName?.[0]}{t.user?.lastName?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-[var(--text-tertiary)]">{t.user?.firstName} {t.user?.lastName}</span>
                      </div>
                      <div className="text-sm font-medium">{t.title}</div>
                      {t.destination && <div className="text-xs text-[var(--text-tertiary)] mt-0.5 flex items-center gap-1"><MapPin size={10} />{t.destination}</div>}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </aside>
        </div>

      </div>
    </div>
  )
}
