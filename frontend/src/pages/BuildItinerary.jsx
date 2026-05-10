import { useState } from 'react'
import Chrome from '../components/Chrome'
import TabsSwitcher from '../components/TabsSwitcher'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardTitle, CardDescription } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Calendar, Edit, Plus } from 'lucide-react'

const sections = [
  { n: 1, title: 'Rome — three slow days', dates: '18 → 21 May', budget: '₹620', body: "Settle into Trastevere, visit the Pantheon at golden hour, find a small enoteca near Campo de' Fiori.", tags: ['Walking', 'Food', 'Architecture'] },
  { n: 2, title: 'Naples & a day on Vesuvius', dates: '22 → 24 May', budget: '₹480', body: 'Pizza pilgrimage. A day trip up the volcano. Espresso at every stop, on principle.', tags: ['Hike', 'Food', 'Day trip'] },
  { n: 3, title: 'The Amalfi by ferry', dates: '25 → 30 May', budget: '₹1,180', body: 'Sorrento as base camp. Ferries to Positano and Capri. Read on the deck, swim in coves.', tags: ['Coast', 'Slow', 'Swim'] },
]

export default function BuildItinerary() {
  const [tab, setTab] = useState('Sections')
  return (
    <div className="flex flex-col min-h-screen lg:h-screen bg-[var(--bg-page)] text-[var(--text-primary)] font-body lg:overflow-hidden">
      <Chrome active="Plan" />

      {/* Page Header — stacks on mobile */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 px-4 sm:px-8 py-4 sm:py-6 border-b border-[var(--border-subtle)] shrink-0 bg-[var(--bg-surface)]">
        <div>
          <Badge variant="secondary" className="mb-2">Itinerary builder · 16 days</Badge>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">Rome &amp; the Amalfi Coast</h1>
        </div>
        <TabsSwitcher tabs={['Sections', 'Calendar', 'Map']} active={tab} onChange={setTab} />
      </div>

      {/* Section Cards */}
      <div className="p-4 sm:p-8 space-y-4 flex-1 lg:overflow-y-auto">
        {sections.map(s => (
          <Card key={s.n} className="py-0">
            {/* Desktop: 3-col [number | content | meta]  Mobile: stacked */}
            <div className="flex flex-col md:grid md:grid-cols-[80px_1fr_280px]">
              {/* Number */}
              <div className="flex md:flex-col items-center gap-3 p-4 md:p-6 md:border-r border-b md:border-b-0 border-[var(--border-subtle)] justify-start md:justify-center">
                <div className="h-10 w-10 rounded-full bg-[var(--brand-primary)] text-white grid place-items-center font-display font-bold shrink-0">{s.n}</div>
                <span className="md:hidden font-display font-bold text-base">{s.title}</span>
              </div>
              {/* Content */}
              <CardContent className="pt-4 md:pt-6 pb-4 md:pb-6">
                <CardTitle className="text-base hidden md:block">{s.title}</CardTitle>
                <CardDescription className="mt-2">{s.body}</CardDescription>
                <div className="flex flex-wrap gap-2 mt-3">
                  {s.tags.map(t => <Badge key={t} variant="secondary">{t}</Badge>)}
                </div>
              </CardContent>
              {/* Meta */}
              <div className="p-4 md:p-6 md:border-l border-t md:border-t-0 border-[var(--border-subtle)] space-y-3 bg-[var(--bg-muted)]/30 flex flex-row md:flex-col flex-wrap gap-4 md:gap-0 items-center md:items-start">
                <div>
                  <Label className="text-xs text-[var(--text-tertiary)]">Date range</Label>
                  <div className="font-medium mt-1 flex items-center gap-1.5 text-sm"><Calendar size={14} /> {s.dates}</div>
                </div>
                <div>
                  <Label className="text-xs text-[var(--text-tertiary)]">Section budget</Label>
                  <div className="font-bold mt-1 text-[var(--brand-primary)] text-lg">{s.budget}</div>
                </div>
                <Button variant="outline" size="sm" className="w-full md:w-full"><Edit size={14} /> Edit section</Button>
              </div>
            </div>
          </Card>
        ))}
        <Button variant="outline" className="w-full h-14 border-dashed"><Plus size={16} /> Add another section</Button>
      </div>
    </div>
  )
}
