import { useState } from 'react'
import Chrome from '../components/Chrome'
import TabsSwitcher from '../components/TabsSwitcher'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardTitle, CardDescription } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Calendar, Edit, Plus } from 'lucide-react'

const sections = [
  { n: 1, title: 'Rome — three slow days', dates: '18 → 21 May', budget: '€620', body: "Settle into Trastevere, visit the Pantheon at golden hour, find a small enoteca near Campo de' Fiori.", tags: ['Walking', 'Food', 'Architecture'] },
  { n: 2, title: 'Naples & a day on Vesuvius', dates: '22 → 24 May', budget: '€480', body: 'Pizza pilgrimage. A day trip up the volcano. Espresso at every stop, on principle.', tags: ['Hike', 'Food', 'Day trip'] },
  { n: 3, title: 'The Amalfi by ferry', dates: '25 → 30 May', budget: '€1,180', body: 'Sorrento as base camp. Ferries to Positano and Capri. Read on the deck, swim in coves.', tags: ['Coast', 'Slow', 'Swim'] },
]

export default function BuildItinerary() {
  const [tab, setTab] = useState('Sections')
  return (
    <div className="flex flex-col h-screen bg-background text-foreground font-sans overflow-hidden">
      <Chrome active="Plan" />
      <div className="flex items-end justify-between px-8 py-6 border-b shrink-0">
        <div>
          <Badge variant="secondary" className="mb-2">Itinerary builder · 16 days</Badge>
          <h1 className="text-3xl font-semibold tracking-tight">Rome &amp; the Amalfi Coast</h1>
        </div>
        <TabsSwitcher tabs={['Sections', 'Calendar', 'Map']} active={tab} onChange={setTab} />
      </div>
      <div className="p-8 space-y-4 flex-1 overflow-auto">
        {sections.map(s => (
          <Card key={s.n} className="rounded-xl border shadow-sm py-0">
            <div className="grid grid-cols-[80px_1fr_280px]">
              <div className="p-6 border-r flex items-start justify-center">
                <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground grid place-items-center font-semibold">{s.n}</div>
              </div>
              <CardContent className="pt-6 pb-6">
                <CardTitle className="text-base">{s.title}</CardTitle>
                <CardDescription className="mt-2">{s.body}</CardDescription>
                <div className="flex gap-2 mt-3">
                  {s.tags.map(t => <Badge key={t} variant="secondary">{t}</Badge>)}
                </div>
              </CardContent>
              <div className="p-6 border-l space-y-4 bg-muted/30">
                <div>
                  <Label className="text-xs text-muted-foreground">Date range</Label>
                  <div className="font-medium mt-1 flex items-center gap-1.5 text-sm"><Calendar size={14} /> {s.dates}</div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Section budget</Label>
                  <div className="font-semibold mt-1 text-primary text-lg">{s.budget}</div>
                </div>
                <Button variant="outline" size="sm" className="w-full"><Edit size={14} /> Edit section</Button>
              </div>
            </div>
          </Card>
        ))}
        <Button variant="outline" className="w-full h-14 border-dashed"><Plus size={16} /> Add another section</Button>
      </div>
    </div>
  )
}
