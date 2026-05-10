import Chrome from '../components/Chrome'
import Controls from '../components/Controls'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardTitle, CardDescription } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { MapPin, ArrowRight, Plus } from 'lucide-react'

const posts = [
  { author: 'Marco P.', city: 'Naples, IT', title: 'Three days in Naples — by mouth', body: 'A kid-friendly route through the back streets of the Spanish Quarters.', tags: ['Food', 'Family'], reads: '2.4k' },
  { author: 'Iris K.', city: 'Hanoi, VN', title: 'A walking guide to Hanoi at dawn', body: 'The old quarter wakes up earlier than you think. A sub-€20 morning that changes how you see the city.', tags: ['Slow', 'Solo'], reads: '1.1k' },
  { author: 'Diego R.', city: 'Patagonia, AR', title: 'Patagonia in the off-season', body: 'Cheaper, quieter, and the wind has manners. A fully costed 14-day loop.', tags: ['Hike', 'Budget'], reads: '880' },
  { author: 'Hana S.', city: 'Kyoto, JP', title: 'Temples without crowds — a small map', body: 'Five lesser-known temples, walking distances, and the cafés near each. Trip cost in JPY included.', tags: ['Photo', 'Slow'], reads: '4.7k' },
]

export default function Community() {
  return (
    <div className="flex flex-col min-h-screen lg:h-screen bg-[var(--bg-page)] text-[var(--text-primary)] font-body lg:overflow-hidden">
      <Chrome active="Community" />
      <Controls q="Search community trip plans…" />

      {/* Page Header — stacks on mobile */}
      <div className="px-4 sm:px-8 py-4 sm:py-6 border-b border-[var(--border-subtle)] flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-3 shrink-0 bg-[var(--bg-surface)]">
        <div>
          <Badge variant="secondary" className="mb-2">Community</Badge>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">Trips, in other people's words</h1>
          <p className="text-[var(--text-secondary)] mt-1 max-w-xl text-sm sm:text-base">Travelers share their itineraries here. Search, filter, and copy any trip into your own plan.</p>
        </div>
        <Button className="self-start sm:self-auto shrink-0"><Plus size={14} /> Share a trip</Button>
      </div>

      {/* Post cards */}
      <div className="p-4 sm:p-8 space-y-3 flex-1 lg:overflow-auto">
        {posts.map(p => (
          <Card key={p.title} className="hover:shadow-[var(--shadow-md)] transition-shadow cursor-pointer py-0">
            {/* Mobile: stacked layout */}
            <div className="block sm:hidden p-4">
              <div className="flex items-center gap-3 mb-3">
                <Avatar className="h-10 w-10 shrink-0">
                  <AvatarFallback className="bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] text-sm font-bold">
                    {p.author.split(' ')[0][0]}{p.author.split(' ')[1][0]}
                  </AvatarFallback>
                </Avatar>
                <div className="text-xs text-[var(--text-tertiary)] flex flex-wrap items-center gap-1.5">
                  <span className="font-medium text-[var(--text-primary)]">{p.author}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1"><MapPin size={11} /> {p.city}</span>
                  <span>·</span>
                  <span>{p.reads} reads</span>
                </div>
              </div>
              <CardTitle className="text-base mb-1">{p.title}</CardTitle>
              <CardDescription className="text-xs">{p.body}</CardDescription>
              <div className="flex flex-wrap gap-2 mt-2">
                {p.tags.map(t => <Badge key={t} variant="outline">{t}</Badge>)}
              </div>
              <div className="flex gap-2 mt-3">
                <Button size="sm" className="flex-1">Read trip <ArrowRight size={14} /></Button>
                <Button variant="outline" size="sm" className="flex-1">Copy itinerary</Button>
              </div>
            </div>

            {/* Desktop: 3-col grid */}
            <div className="hidden sm:grid sm:grid-cols-[64px_1fr_180px] sm:items-center sm:gap-4 sm:p-5">
              <Avatar className="h-14 w-14">
                <AvatarFallback className="bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] text-base font-bold">
                  {p.author.split(' ')[0][0]}{p.author.split(' ')[1][0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="text-xs text-[var(--text-tertiary)] flex items-center gap-2 mb-1">
                  <span className="font-medium text-[var(--text-primary)]">{p.author}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1"><MapPin size={11} /> {p.city}</span>
                  <span>·</span>
                  <span>{p.reads} reads</span>
                </div>
                <CardTitle className="text-lg">{p.title}</CardTitle>
                <CardDescription className="mt-1">{p.body}</CardDescription>
                <div className="flex gap-2 mt-2">
                  {p.tags.map(t => <Badge key={t} variant="outline">{t}</Badge>)}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Button size="sm">Read trip <ArrowRight size={14} /></Button>
                <Button variant="outline" size="sm">Copy itinerary</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
