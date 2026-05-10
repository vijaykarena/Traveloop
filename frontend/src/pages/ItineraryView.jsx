import Chrome from '../components/Chrome'
import Controls from '../components/Controls'
import { useNav } from '../navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { MoreHorizontal, Download, Share, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

const days = [
  { day: 'Day 1', date: 'Mon, 18 May', items: [
    { time: '09:30', name: 'Train · Lisbon → Rome (via Madrid)', dur: '12h', cost: '₹220', type: 'Travel' },
    { time: '21:40', name: 'Check-in · Trastevere apartment', dur: '—', cost: '₹140', type: 'Stay' },
  ]},
  { day: 'Day 2', date: 'Tue, 19 May', items: [
    { time: '08:00', name: "Espresso at Sant'Eustachio", dur: '30m', cost: '₹4', type: 'Food' },
    { time: '10:00', name: 'Pantheon & Piazza Navona walk', dur: '3h', cost: 'free', type: 'Walk' },
    { time: '13:30', name: 'Lunch · Roscioli', dur: '2h', cost: '₹60', type: 'Food' },
    { time: '17:00', name: "Aperitivo · Campo de' Fiori", dur: '2h', cost: '₹18', type: 'Food' },
  ]},
  { day: 'Day 3', date: 'Wed, 20 May', items: [
    { time: '06:30', name: 'Vatican at dawn (private)', dur: '3h', cost: '₹96', type: 'Tour' },
    { time: '14:00', name: 'Borghese Gardens · picnic', dur: '3h', cost: '₹22', type: 'Walk' },
  ]},
]

const typeVariant = { Travel: 'info', Stay: 'secondary', Food: 'accent', Walk: 'outline', Tour: 'success' }

export default function ItineraryView() {
  const { navigate } = useNav()
  return (
    <div className="flex flex-col min-h-screen lg:h-screen bg-[var(--bg-page)] text-[var(--text-primary)] font-body lg:overflow-hidden">
      <Chrome active="My Trips" />
      <Controls q="Search this itinerary…" />

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 px-4 sm:px-8 py-4 sm:py-6 border-b border-[var(--border-subtle)] shrink-0 bg-[var(--bg-surface)]">
        <div>
          <Badge variant="secondary" className="mb-2">Itinerary · 16 days</Badge>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">Rome &amp; the Amalfi</h1>
          <p className="text-[var(--text-secondary)] mt-1">Day-by-day plan with cost breakdown</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm"><Download size={14} /> Export</Button>
          <Button variant="outline" size="sm"><Share size={14} /> Share</Button>
          <Button size="sm"><Plus size={14} /> Add stop</Button>
        </div>
      </div>

      {/* Main grid: stacked on mobile, 2-col on lg+ */}
      <div className="flex flex-col lg:grid lg:grid-cols-[1fr_320px] gap-4 sm:gap-8 p-4 sm:p-8 flex-1 lg:overflow-auto">

        {/* ===== ITINERARY DAYS ===== */}
        <div className="space-y-6">
          {days.map(d => (
            <div key={d.day}>
              <div className="flex items-baseline gap-3 mb-3">
                <h2 className="font-display text-xl font-bold">{d.day}</h2>
                <span className="text-sm text-[var(--text-tertiary)]">{d.date}</span>
              </div>
              <Card className="py-0">
                <CardContent className="p-0">
                  {d.items.map((it, i) => (
                    <div key={i} className={cn('px-4 py-3 sm:px-5 sm:py-4', i > 0 && 'border-t border-[var(--border-subtle)]')}>
                      {/* Mobile: time + name + cost row, then badges */}
                      {/* Desktop: 4-col grid */}
                      <div className="hidden sm:grid sm:grid-cols-[80px_1fr_100px_80px] sm:items-center sm:gap-4">
                        <span className="font-mono text-sm text-[var(--text-tertiary)]">{it.time}</span>
                        <div>
                          <div className="font-medium">{it.name}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant={typeVariant[it.type]}>{it.type}</Badge>
                            <span className="text-xs text-[var(--text-tertiary)]">{it.dur}</span>
                          </div>
                        </div>
                        <span className={cn('text-right font-medium', it.cost === 'free' ? 'text-[var(--color-success)]' : '')}>{it.cost}</span>
                        <div className="flex justify-end">
                          <Button variant="ghost" size="icon"><MoreHorizontal size={16} /></Button>
                        </div>
                      </div>
                      {/* Mobile layout */}
                      <div className="sm:hidden">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="font-mono text-xs text-[var(--text-tertiary)]">{it.time}</span>
                              <Badge variant={typeVariant[it.type]}>{it.type}</Badge>
                            </div>
                            <div className="font-medium text-sm">{it.name}</div>
                          </div>
                          <span className={cn('font-medium text-sm shrink-0', it.cost === 'free' ? 'text-[var(--color-success)]' : '')}>{it.cost}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* ===== BUDGET ASIDE ===== */}
        <aside>
          <Card className="py-0">
            <CardHeader className="p-5 pb-3">
              <CardDescription>Trip budget</CardDescription>
              <CardTitle className="text-3xl">₹2,400</CardTitle>
              <CardDescription>of ₹3,200 ceiling · 75% spent</CardDescription>
            </CardHeader>
            <CardContent className="px-5 pb-5">
              <Progress value={75} className="mb-6" />
              {[['Travel', '₹620', 26], ['Stay', '₹940', 39], ['Food', '₹420', 17], ['Activities', '₹280', 12], ['Misc', '₹140', 6]].map(([k, v, p]) => (
                <div key={k} className="mb-3">
                  <div className="flex justify-between text-sm mb-1.5">
                    <span>{k}</span>
                    <span className="font-medium">{v} <span className="text-[var(--text-tertiary)] text-xs">· {p}%</span></span>
                  </div>
                  <div className="h-1.5 rounded-full bg-[var(--bg-muted)] overflow-hidden">
                    <div className="h-full bg-[var(--brand-primary)]" style={{ width: `${p}%` }} />
                  </div>
                </div>
              ))}
              <div className="mt-4 p-3 bg-[#FEFCBF] border border-[#F6E05E] rounded-[var(--radius-md)] text-xs text-[#975A16]">
                ▲ Day 3 is over the daily average by ₹38. Consider moving the dawn tour.
              </div>
              <Button variant="outline" size="sm" className="w-full mt-4" onClick={() => navigate('invoice')}>View invoice</Button>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  )
}
