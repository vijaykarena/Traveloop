import Chrome from '../components/Chrome'
import Controls from '../components/Controls'
import Img from '../components/Img'
import SectionHeader from '../components/common/SectionHeader'
import { useNav } from '../navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardTitle } from '@/components/ui/card'
import { ArrowRight } from 'lucide-react'

import { useState, useEffect } from 'react'
import api, { ENDPOINTS } from '../api'

export default function MyTrips() {
  const { navigate } = useNav()
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const res = await api.get(ENDPOINTS.TRIPS)
        setTrips(res.data)
      } catch (err) {
        console.error('Failed to fetch trips', err)
      } finally {
        setLoading(false)
      }
    }
    fetchTrips()
  }, [])

  const now = new Date()

  // Normalize dates to start of day for comparison
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  const filteredTrips = trips.filter(t => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    return (
      (t.title && t.title.toLowerCase().includes(q)) ||
      (t.destination && t.destination.toLowerCase().includes(q))
    )
  })

  const ongoing = filteredTrips.filter(t => new Date(t.startDate) <= today && new Date(t.endDate) >= today)
  const upcoming = filteredTrips.filter(t => new Date(t.startDate) > today)
  const completed = filteredTrips.filter(t => new Date(t.endDate) < today)

  const groups = [
    { label: 'Ongoing', count: ongoing.length, variant: 'success', items: ongoing },
    { label: 'Up-coming', count: upcoming.length, variant: 'info', items: upcoming },
    { label: 'Completed', count: completed.length, variant: 'outline', items: completed },
  ].filter(g => g.count > 0)

  const formatDateRange = (start, end) => {
    const s = new Date(start).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
    const e = new Date(end).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
    return `${s} → ${e}`
  }

  const formatBudget = (trip) => {
    if (!trip.budgetLimit) return 'No budget set'
    const spent = trip.expenses?.reduce((acc, curr) => acc + curr.amount, 0) || 0
    return `₹${spent.toLocaleString()} of ₹${trip.budgetLimit.toLocaleString()}`
  }

  return (
    <div className="flex flex-col min-h-screen lg:h-screen bg-[var(--bg-page)] text-[var(--text-primary)] font-body lg:overflow-hidden">
      <Chrome active="My Trips" />
      <Controls 
        q="Search your trips…" 
        search={searchQuery}
        onSearch={setSearchQuery}
        hideFilters={true}
      />
      <div className="px-4 sm:px-8 py-4 sm:py-6 space-y-6 flex-1 lg:overflow-auto">
        {loading ? (
          <div className="text-[var(--text-tertiary)] py-10">Loading trips...</div>
        ) : groups.length === 0 ? (
          <div className="text-[var(--text-tertiary)] py-10">No trips found. Create one to get started!</div>
        ) : (
          groups.map(g => (
            <div key={g.label} className="space-y-4">
              <SectionHeader
                title={g.label}
              >
                <Badge variant={g.variant} className="ml-2">{g.count}</Badge>
              </SectionHeader>

              {g.items.map(trip => (
                <Card key={trip.id} className="overflow-hidden py-0">
                  <div className="flex flex-col sm:grid sm:grid-cols-[160px_1fr_auto] lg:grid-cols-[200px_1fr_auto] sm:items-center">
                    <Img 
                      ratio="3/2" 
                      label={trip.coverPhotoUrl || 'placeholder'} 
                      className="rounded-none border-0 sm:border-r rounded-t-[var(--radius-xl)] sm:rounded-t-none sm:rounded-l-[var(--radius-xl)]" 
                      style={{ aspectRatio: undefined, height: '100%' }} 
                    />
                    <div className="p-4 sm:p-5">
                      <CardTitle className="text-lg sm:text-xl">{trip.title}</CardTitle>
                      <div className="text-sm text-[var(--text-tertiary)] mt-1">
                        {formatDateRange(trip.startDate, trip.endDate)} · {trip._count?.stops || 0} stops
                      </div>
                      <div className="flex flex-wrap gap-2 mt-3">
                        <Badge variant="accent">{formatBudget(trip)}</Badge>
                        <Badge variant="outline">Notes · {trip._count?.notes || 0}</Badge>
                        <Badge variant="outline">Activities · 0</Badge>
                      </div>
                    </div>
                    <div className="flex sm:flex-col gap-2 p-4 sm:p-5 border-t sm:border-t-0 sm:border-l border-[var(--border-subtle)]">
                      <Button size="sm" className="flex-1 sm:flex-none" onClick={() => navigate(`build-itinerary/${trip.id}`)}>Open <ArrowRight size={14} /></Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
