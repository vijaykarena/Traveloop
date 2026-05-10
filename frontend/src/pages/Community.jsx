import { useState, useEffect } from 'react'
import Chrome from '../components/Chrome'
import Controls from '../components/Controls'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardTitle, CardDescription } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { MapPin, ArrowRight } from 'lucide-react'
import { useNav } from '../navigation'
import api, { ENDPOINTS } from '../api'

function fmtDateRange(start, end) {
  const s = new Date(start).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
  const e = new Date(end).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
  return `${s} – ${e}`
}

export default function Community() {
  const { navigate } = useNav()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get(ENDPOINTS.PUBLIC_TRIPS)
      .then(res => setPosts(res.data.trips || []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="flex flex-col min-h-screen lg:h-screen bg-[var(--bg-page)] text-[var(--text-primary)] font-body lg:overflow-hidden">
      <Chrome active="Community" />
      <Controls q="Search community trip plans…" hideFilters={true} />

      {/* Page Header */}
      <div className="px-4 sm:px-8 py-4 sm:py-6 border-b border-[var(--border-subtle)] shrink-0 bg-[var(--bg-surface)]">
        <Badge variant="secondary" className="mb-2">Community</Badge>
        <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">Trips, in other people's words</h1>
        <p className="text-[var(--text-secondary)] mt-1 max-w-xl text-sm sm:text-base">Browse public itineraries shared by other travelers.</p>
      </div>

      {/* Post cards */}
      <div className="p-4 sm:p-8 space-y-3 flex-1 lg:overflow-auto">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 bg-[var(--bg-muted)] rounded-[var(--radius-xl)] animate-pulse" />
          ))
        ) : posts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-[var(--text-tertiary)] mb-4">No public trips shared yet.</p>
            <p className="text-sm text-[var(--text-tertiary)]">Be the first — open a trip and toggle it public.</p>
          </div>
        ) : (
          posts.map(p => {
            const authorInitials = `${p.user?.firstName?.[0] ?? '?'}${p.user?.lastName?.[0] ?? ''}`
            const authorName = p.user ? `${p.user.firstName} ${p.user.lastName}` : 'Anonymous'
            const stops = p._count?.stops ?? 0

            return (
              <Card key={p.id} className="hover:shadow-[var(--shadow-md)] transition-shadow py-0">
                {/* Mobile */}
                <div className="block sm:hidden p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar className="h-10 w-10 shrink-0">
                      {p.user?.avatarUrl
                        ? <img src={p.user.avatarUrl} alt={authorName} className="h-full w-full object-cover rounded-full" />
                        : <AvatarFallback className="bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] text-sm font-bold">{authorInitials}</AvatarFallback>
                      }
                    </Avatar>
                    <div className="text-xs text-[var(--text-tertiary)] flex flex-wrap items-center gap-1.5">
                      <span className="font-medium text-[var(--text-primary)]">{authorName}</span>
                      {p.destination && <><span>·</span><span className="flex items-center gap-1"><MapPin size={11} />{p.destination}</span></>}
                      <span>·</span>
                      <span>{stops} stop{stops !== 1 ? 's' : ''}</span>
                    </div>
                  </div>
                  <CardTitle className="text-base mb-1">{p.title}</CardTitle>
                  {p.description && <CardDescription className="text-xs line-clamp-2">{p.description}</CardDescription>}
                  <div className="text-xs text-[var(--text-tertiary)] mt-2">
                    {fmtDateRange(p.startDate, p.endDate)}
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" className="flex-1" onClick={() => navigate(`itinerary/${p.id}`)}>
                      View trip <ArrowRight size={14} />
                    </Button>
                  </div>
                </div>

                {/* Desktop */}
                <div className="hidden sm:grid sm:grid-cols-[64px_1fr_140px] sm:items-center sm:gap-4 sm:p-5">
                  <Avatar className="h-14 w-14">
                    {p.user?.avatarUrl
                      ? <img src={p.user.avatarUrl} alt={authorName} className="h-full w-full object-cover rounded-full" />
                      : <AvatarFallback className="bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] text-base font-bold">{authorInitials}</AvatarFallback>
                    }
                  </Avatar>
                  <div>
                    <div className="text-xs text-[var(--text-tertiary)] flex items-center gap-2 mb-1">
                      <span className="font-medium text-[var(--text-primary)]">{authorName}</span>
                      {p.destination && <><span>·</span><span className="flex items-center gap-1"><MapPin size={11} />{p.destination}</span></>}
                      <span>·</span>
                      <span>{stops} stop{stops !== 1 ? 's' : ''}</span>
                    </div>
                    <CardTitle className="text-lg">{p.title}</CardTitle>
                    {p.description && <CardDescription className="mt-1 line-clamp-2">{p.description}</CardDescription>}
                    <div className="text-xs text-[var(--text-tertiary)] mt-2">{fmtDateRange(p.startDate, p.endDate)}</div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button size="sm" onClick={() => navigate(`itinerary/${p.id}`)}>
                      View trip <ArrowRight size={14} />
                    </Button>
                  </div>
                </div>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
