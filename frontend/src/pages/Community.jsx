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
    <div className="flex flex-col h-screen bg-background text-foreground font-sans overflow-hidden">
      <Chrome active="Community" />
      <Controls q="Search community trip plans…" />
      <div className="px-8 py-6 border-b flex items-baseline justify-between shrink-0">
        <div>
          <Badge variant="secondary" className="mb-2">Community</Badge>
          <h1 className="text-3xl font-semibold tracking-tight">Trips, in other people's words</h1>
          <p className="text-muted-foreground mt-1 max-w-xl">Travelers share their itineraries here. Search, filter, and copy any trip into your own plan.</p>
        </div>
        <Button><Plus size={14} /> Share a trip</Button>
      </div>
      <div className="p-8 space-y-3 flex-1 overflow-auto">
        {posts.map(p => (
          <Card key={p.title} className="hover:shadow-md transition-shadow cursor-pointer rounded-xl border shadow-sm py-0">
            <div className="grid grid-cols-[64px_1fr_180px] items-center gap-4 p-5">
              <Avatar className="h-14 w-14">
                <AvatarFallback className="bg-primary/10 text-primary text-base font-medium">
                  {p.author.split(' ')[0][0]}{p.author.split(' ')[1][0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="text-xs text-muted-foreground flex items-center gap-2 mb-1">
                  <span className="font-medium text-foreground">{p.author}</span>
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
