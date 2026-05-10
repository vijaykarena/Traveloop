import Chrome from '../components/Chrome'
import Img from '../components/Img'
import { useNav } from '../navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { ArrowRight, Plus } from 'lucide-react'

export default function CreateTrip() {
  const { navigate } = useNav()
  return (
    <div className="flex flex-col h-screen bg-background text-foreground font-sans overflow-hidden">
      <Chrome active="Plan" />
      <div className="px-8 py-6 border-b shrink-0">
        <Badge variant="secondary" className="mb-2">New trip · Draft</Badge>
        <h1 className="text-3xl font-semibold tracking-tight">Plan a new trip</h1>
        <p className="text-muted-foreground mt-1">Start with the basics. You can refine the itinerary in the next step.</p>
      </div>
      <div className="grid grid-cols-[1fr_1.6fr] flex-1 overflow-hidden">
        <div className="p-8 border-r space-y-4 overflow-auto">
          <h2 className="text-lg font-semibold">Trip details</h2>
          <div className="space-y-2"><Label>Trip name</Label><Input defaultValue="A long weekend in Rome" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2"><Label>Start date</Label><Input defaultValue="18 / 05 / 2026" /></div>
            <div className="space-y-2"><Label>End date</Label><Input defaultValue="02 / 06 / 2026" /></div>
          </div>
          <div className="space-y-2"><Label>Destination</Label><Input defaultValue="Rome, Italy" /></div>
          <div className="space-y-2">
            <Label>Companions</Label>
            <div className="flex flex-wrap gap-2 p-2 border rounded-md min-h-10 bg-background">
              <Badge variant="secondary">Marco ×</Badge>
              <Badge variant="secondary">Iris ×</Badge>
              <button className="text-xs text-muted-foreground hover:text-foreground px-2">+ add</button>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea rows={4} defaultValue="A slow loop through Lazio and the Amalfi coast — markets, espresso, and an afternoon train down the coast." />
          </div>
          <div className="flex gap-2 pt-2">
            <Button variant="outline">Save draft</Button>
            <Button className="flex-1" onClick={() => navigate('build-itinerary')}>Build itinerary <ArrowRight size={14} /></Button>
          </div>
        </div>

        <div className="p-8 overflow-auto">
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="text-lg font-semibold">Suggested places &amp; activities</h2>
            <span className="text-xs text-muted-foreground">Curated by region</span>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[
              ['Trastevere walk', 'Rome · 3h', 'free'],
              ['Mt. Vesuvius hike', 'Naples · 1d', '€18'],
              ['Positano by ferry', 'Amalfi · ½d', '€32'],
              ['Cooking with Nonna', 'Sorrento · 4h', '€85'],
              ['Vatican at dawn', 'Rome · 3h', '€48'],
              ['Capri grottoes', 'Capri · 1d', '€54'],
            ].map(([n, m, p]) => (
              <Card key={n} className="rounded-xl border shadow-sm py-0">
                <Img ratio="4/3" className="rounded-t-xl rounded-b-none border-0 border-b" />
                <CardHeader className="p-4">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-base">{n}</CardTitle>
                    <Badge variant={p === 'free' ? 'success' : 'outline'}>{p}</Badge>
                  </div>
                  <CardDescription>{m}</CardDescription>
                </CardHeader>
                <CardFooter className="p-4 pt-0 gap-2">
                  <Button variant="outline" size="sm" className="flex-1">Preview</Button>
                  <Button size="sm" className="flex-1"><Plus size={14} /> Add</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
