import Chrome from '../components/Chrome'
import Controls from '../components/Controls'
import Img from '../components/Img'
import SectionHeader from '../components/common/SectionHeader'
import { useNav } from '../navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardTitle } from '@/components/ui/card'
import { ArrowRight } from 'lucide-react'

const groups = [
  { label: 'Ongoing', count: 1, variant: 'success', sample: { title: 'Rome & the Amalfi', dates: '18 May → 02 Jun', stops: '6 stops', budget: '€2,400 / €3,200', img: 'rome' }, page: 'itinerary' },
  { label: 'Up-coming', count: 2, variant: 'info', sample: { title: 'Tokyo · neighbourhood loop', dates: '12 Jun → 24 Jun', stops: '4 stops', budget: '¥210k of ¥260k', img: 'tokyo' }, page: 'itinerary' },
  { label: 'Completed', count: 8, variant: 'outline', sample: { title: 'Hokkaidō Loop', dates: 'Feb 2026', stops: '14 days', budget: 'Archived', img: 'hokkaido' }, page: 'my-trips' },
]

export default function MyTrips() {
  const { navigate } = useNav()
  return (
    <div className="flex flex-col h-screen bg-[var(--bg-page)] text-[var(--text-primary)] font-body overflow-hidden">
      <Chrome active="My Trips" />
      <Controls q="Search your trips…" />
      <div className="px-8 py-6 space-y-6 flex-1 overflow-auto">
        {groups.map(g => (
          <div key={g.label}>
            <SectionHeader
              title={g.label}
              trailing={<Button variant="link" size="sm">View all <ArrowRight size={14} /></Button>}
            >
              <Badge variant={g.variant} className="ml-2">{g.count}</Badge>
            </SectionHeader>
            <Card className="overflow-hidden py-0">
              <div className="grid grid-cols-[200px_1fr_auto] items-center">
                <Img ratio="3/2" label={g.sample.img} className="rounded-none border-0 border-r rounded-l-[var(--radius-xl)]" style={{ aspectRatio: undefined, height: '100%' }} />
                <div className="p-5">
                  <CardTitle className="text-xl">{g.sample.title}</CardTitle>
                  <div className="text-sm text-[var(--text-tertiary)] mt-1">{g.sample.dates} · {g.sample.stops}</div>
                  <div className="flex gap-2 mt-3">
                    <Badge variant="accent">{g.sample.budget}</Badge>
                    <Badge variant="outline">Notes · 6</Badge>
                    <Badge variant="outline">Activities · 14</Badge>
                  </div>
                </div>
                <div className="flex flex-col gap-2 p-5">
                  <Button size="sm" onClick={() => navigate(g.page)}>Open <ArrowRight size={14} /></Button>
                  <Button variant="outline" size="sm">Duplicate</Button>
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>
    </div>
  )
}
