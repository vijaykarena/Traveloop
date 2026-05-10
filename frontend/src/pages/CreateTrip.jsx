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
    <div className="flex flex-col min-h-screen lg:h-screen bg-[var(--bg-page)] text-[var(--text-primary)] font-body lg:overflow-hidden">
      <Chrome active="Plan" />

      {/* Page Title Bar */}
      <div className="px-4 sm:px-8 py-4 sm:py-6 border-b border-[var(--border-subtle)] shrink-0 bg-[var(--bg-surface)]">
        <Badge variant="secondary" className="mb-2">New trip · Draft</Badge>
        <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">Plan a new trip</h1>
        <p className="text-[var(--text-secondary)] mt-1 text-sm sm:text-base">Start with the basics. You can refine the itinerary in the next step.</p>
      </div>

      {/*
        MOBILE: single scroll container, panels stack vertically
        DESKTOP: two independently scrolling panels side-by-side
      */}
      <div className="flex-1 overflow-y-auto lg:overflow-hidden">
        <div className="flex flex-col lg:grid lg:grid-cols-[1fr_1.6fr] lg:h-full">

          {/* ===== LEFT — Trip details form ===== */}
          <div className="p-4 sm:p-8 border-b lg:border-b-0 lg:border-r border-[var(--border-subtle)] space-y-4 lg:overflow-y-auto">
            <h2 className="font-display text-lg font-bold">Trip details</h2>
            <div className="space-y-2"><Label>Trip name</Label><Input defaultValue="A long weekend in Rome" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2"><Label>Start date</Label><Input defaultValue="18 / 05 / 2026" /></div>
              <div className="space-y-2"><Label>End date</Label><Input defaultValue="02 / 06 / 2026" /></div>
            </div>
            <div className="space-y-2"><Label>Destination</Label><Input defaultValue="Rome, Italy" /></div>
            <div className="space-y-2">
              <Label>Companions</Label>
              <div className="flex flex-wrap gap-2 p-2 border border-[var(--border-default)] rounded-[var(--radius-md)] min-h-10 bg-[var(--bg-surface)]">
                <Badge variant="secondary">Marco ×</Badge>
                <Badge variant="secondary">Iris ×</Badge>
                <button className="text-xs text-[var(--text-tertiary)] hover:text-[var(--text-primary)] px-2">+ add</button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea rows={4} defaultValue="A slow loop through Lazio and the Amalfi coast — markets, espresso, and an afternoon train down the coast." />
            </div>
            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <Button variant="outline" className="sm:w-auto">Save draft</Button>
              <Button className="flex-1" onClick={() => navigate('build-itinerary')}>Build itinerary <ArrowRight size={14} /></Button>
            </div>
          </div>

          {/* ===== RIGHT — Suggested places ===== */}
          <div className="p-4 sm:p-8 lg:overflow-y-auto">
            <div className="flex items-baseline justify-between mb-4">
              <h2 className="font-display text-lg font-bold">Suggested places &amp; activities</h2>
              <span className="text-xs text-[var(--text-tertiary)]">Curated by region</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                ['Trastevere walk', 'Rome · 3h', 'free'],
                ['Mt. Vesuvius hike', 'Naples · 1d', '€18'],
                ['Positano by ferry', 'Amalfi · ½d', '€32'],
                ['Cooking with Nonna', 'Sorrento · 4h', '€85'],
                ['Vatican at dawn', 'Rome · 3h', '€48'],
                ['Capri grottoes', 'Capri · 1d', '€54'],
              ].map(([n, m, p]) => (
                <Card key={n} className="py-0">
                  <Img ratio="4/3" className="rounded-t-[var(--radius-xl)] rounded-b-none border-0 border-b" />
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
    </div>
  )
}
