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
    <div className="flex flex-col min-h-screen lg:h-screen bg-[var(--bg-page)] text-[var(--text-primary)] font-body lg:overflow-hidden">
      <Chrome active="My Trips" />
      <Controls q="Search your trips…" />
      <div className="px-4 sm:px-8 py-4 sm:py-6 space-y-6 flex-1 lg:overflow-auto">
        {groups.map(g => (
          <div key={g.label}>
            <SectionHeader
              title={g.label}
              trailing={<Button variant="link" size="sm">View all <ArrowRight size={14} /></Button>}
            >
              <Badge variant={g.variant} className="ml-2">{g.count}</Badge>
            </SectionHeader>

            <Card className="overflow-hidden py-0">
              {/* Desktop: image | content | actions  Mobile: stacked */}
              <div className="flex flex-col sm:grid sm:grid-cols-[160px_1fr_auto] sm:items-center">
                {/* Image */}
                <Img
                  ratio="3/2"
                  label={g.sample.img}
                  className="rounded-none border-0 sm:border-r rounded-t-[var(--radius-xl)] sm:rounded-t-none sm:rounded-l-[var(--radius-xl)]"
                  style={{ aspectRatio: undefined, height: undefined }}
                />
                {/* Content */}
                <div className="p-4 sm:p-5">
                  <CardTitle className="text-lg sm:text-xl">{g.sample.title}</CardTitle>
                  <div className="text-sm text-[var(--text-tertiary)] mt-1">{g.sample.dates} · {g.sample.stops}</div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <Badge variant="accent">{g.sample.budget}</Badge>
                    <Badge variant="outline">Notes · 6</Badge>
                    <Badge variant="outline">Activities · 14</Badge>
                  </div>
                </div>
                {/* Actions */}
                <div className="flex sm:flex-col gap-2 p-4 sm:p-5 border-t sm:border-t-0 sm:border-l border-[var(--border-subtle)]">
                  <Button size="sm" className="flex-1 sm:flex-none" onClick={() => navigate(g.page)}>Open <ArrowRight size={14} /></Button>
                  <Button variant="outline" size="sm" className="flex-1 sm:flex-none">Duplicate</Button>
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>
    </div>
  )
}
