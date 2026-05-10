import Chrome from '../components/Chrome'
import Controls from '../components/Controls'
import Img from '../components/Img'
import SectionHeader from '../components/common/SectionHeader'
import { useNav } from '../navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Plus, ArrowRight } from 'lucide-react'
import { useState, useEffect } from 'react'
import api, { ENDPOINTS } from '../api'

export default function Dashboard() {
  const { navigate } = useNav()
  const [trips, setTrips] = useState([])
  const [user, setUser] = useState(null)
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const storedUser = localStorage.getItem('user')
        if (storedUser) setUser(JSON.parse(storedUser))
        
        const res = await api.get(ENDPOINTS.TRIPS)
        setTrips(res.data)
      } catch (err) {
        console.error('Failed to fetch dashboard data', err)
      }
    }
    fetchDashboardData()
  }, [])

  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  
  const upcoming = trips.filter(t => new Date(t.startDate) >= today).sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
  const previous = trips.filter(t => new Date(t.endDate) < today).sort((a, b) => new Date(b.endDate) - new Date(a.endDate))
  
  const nextTrip = upcoming[0]
  
  const formatDates = (start, end) => {
    const s = new Date(start).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
    const e = new Date(end).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
    return `${s} → ${e}`
  }
  
  const formatBudget = (trip) => {
    if (!trip.budgetLimit) return 'No budget set'
    const spent = trip.expenses?.reduce((acc, curr) => acc + curr.amount, 0) || 0
    return `₹${spent.toLocaleString()} / ₹${trip.budgetLimit.toLocaleString()}`
  }

  const getDaysUntil = (date) => {
    const diffTime = new Date(date) - now
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }
  return (
    <div className="flex flex-col min-h-screen lg:h-screen bg-[var(--bg-page)] text-[var(--text-primary)] font-body lg:overflow-hidden">
      <Chrome active="Discover" />
      <div className="flex-1 lg:overflow-auto">

        {/* ===== HERO BANNER ===== */}
        <div className="relative h-48 sm:h-64 md:h-72 border-b border-[var(--border-subtle)] shrink-0">
          <Img label="Banner · Cinque Terre" className="absolute inset-0 rounded-none border-0 h-full w-full" style={{ aspectRatio: undefined }} />
          <div className="absolute inset-x-4 sm:inset-x-8 bottom-4 sm:bottom-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <Card className="max-w-xs sm:max-w-md py-0">
              <CardHeader className="p-4 sm:p-6">
                <Badge variant="accent" className="w-fit mb-2">May 2026</Badge>
                <CardTitle className="text-xl sm:text-3xl">Where to, {user?.firstName || 'Explorer'}?</CardTitle>
                <CardDescription className="hidden sm:block">
                  {upcoming.length > 0 ? `${upcoming.length} trips on the horizon.` : 'No upcoming trips planned yet.'} 
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

        {/* Controls */}
        <Controls q="Lisbon, paragliding, slow trains in Japan…" />

        {/* ===== MAIN CONTENT GRID ===== */}
        {/* Desktop: 2fr 1fr | Mobile: single column */}
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4 sm:gap-8 p-4 sm:p-8">

          {/* LEFT COLUMN */}
          <div>
            <SectionHeader
              title="Top regional selections"
              trailing={<span className="text-xs text-[var(--text-tertiary)]">5 of 24</span>}
            />
            {/* Destination cards: 2 cols mobile → 3 tablet → 5 desktop */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {[['Lisbon', 'PT'], ['Kyoto', 'JP'], ['Marrakesh', 'MA'], ['Reykjavík', 'IS'], ['Oaxaca', 'MX']].map(([n, c]) => (
                <Card key={n} className="overflow-hidden cursor-pointer hover:shadow-[var(--shadow-md)] transition-shadow py-0">
                  <Img ratio="1/1" label={c} className="rounded-none border-0" />
                  <div className="p-3">
                    <div className="font-medium text-sm">{n}</div>
                    <div className="text-xs text-[var(--text-tertiary)]">{c}</div>
                  </div>
                </Card>
              ))}
            </div>

            <SectionHeader
              title="Previous trips"
              trailing={<Button variant="link" size="sm">View all <ArrowRight size={14} /></Button>}
              className="mt-6 sm:mt-8"
            />
            {/* Previous trip cards: 1 col mobile → 2 tablet → 3 desktop */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {previous.length === 0 ? (
                <div className="text-[var(--text-tertiary)] col-span-1 sm:col-span-2 lg:col-span-3 text-sm">No previous trips found.</div>
              ) : (
                previous.slice(0, 3).map((trip) => {
                  const duration = Math.max(1, Math.ceil((new Date(trip.endDate) - new Date(trip.startDate)) / (1000 * 60 * 60 * 24)))
                  const spent = trip.expenses?.reduce((acc, curr) => acc + curr.amount, 0) || 0
                  
                  return (
                    <Card key={trip.id} className="py-0 cursor-pointer" onClick={() => navigate(`build-itinerary/${trip.id}`)}>
                      <Img ratio="16/10" label={trip.coverPhotoUrl || 'placeholder'} className="rounded-b-none border-0 border-b rounded-t-[var(--radius-xl)]" />
                      <CardHeader className="p-4">
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-base truncate mr-2">{trip.title}</CardTitle>
                          <Badge variant="outline" className="shrink-0">{new Date(trip.startDate).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}</Badge>
                        </div>
                        <CardDescription>{duration} days {spent > 0 && `· ₹${spent.toLocaleString()}`}</CardDescription>
                      </CardHeader>
                    </Card>
                  )
                })
              )}
            </div>
          </div>

          {/* RIGHT ASIDE — stacks below on mobile */}
          <aside>
            <SectionHeader title="Up next" />
            {nextTrip ? (
              <Card className="py-0 cursor-pointer" onClick={() => navigate(`build-itinerary/${nextTrip.id}`)}>
                <CardHeader className="p-5">
                  <Badge variant="accent" className="w-fit">In {getDaysUntil(nextTrip.startDate)} days</Badge>
                  <CardTitle className="text-2xl mt-2">{nextTrip.title}</CardTitle>
                  <CardDescription>{formatDates(nextTrip.startDate, nextTrip.endDate)} · {nextTrip._count?.stops || 0} stops</CardDescription>
                </CardHeader>
                <CardContent className="px-5 pb-5">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-[var(--text-tertiary)]">Budget</span>
                    <span className="font-medium">{formatBudget(nextTrip)}</span>
                  </div>
                  {nextTrip.budgetLimit && (
                    <Progress value={Math.min(100, ((nextTrip.expenses?.reduce((acc, curr) => acc + curr.amount, 0) || 0) / nextTrip.budgetLimit) * 100)} />
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card className="py-0">
                <CardContent className="p-5 flex flex-col items-center text-center">
                  <CardDescription className="mb-4">No upcoming trips</CardDescription>
                  <Button size="sm" onClick={() => navigate('create-trip')}><Plus size={14} className="mr-2"/> Plan a Trip</Button>
                </CardContent>
              </Card>
            )}

            <h3 className="text-xs font-semibold mt-6 mb-3 text-[var(--text-tertiary)] uppercase tracking-wider">From the community</h3>
            <div className="space-y-3">
              {[
                'Three days in Naples — by mouth',
                'A walking guide to Hanoi at dawn',
                'Patagonia in the off-season',
              ].map(t => (
                <Card key={t} className="cursor-pointer hover:bg-[var(--bg-muted)] transition-colors py-0" onClick={() => navigate('community')}>
                  <CardContent className="p-4">
                    <div className="text-sm font-medium">{t}</div>
                    <div className="text-xs text-[var(--text-tertiary)] mt-1">Shared 2d ago</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </aside>
        </div>

      </div>
    </div>
  )
}
