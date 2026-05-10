import { useState } from 'react'
import Chrome from '../components/Chrome'
import Controls from '../components/Controls'
import Img from '../components/Img'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardTitle, CardDescription } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { MapPin, ArrowRight, Plus, SlidersHorizontal, X } from 'lucide-react'

const results = [
  { name: 'Paragliding · Cape Sounion', meta: 'Athens, Greece', dur: '4h', cost: '₹120', tag: 'Adventure', body: 'Tandem flights from cliff-tops above the Aegean. Pickup from central Athens.' },
  { name: 'Paragliding · Ölüdeniz', meta: 'Fethiye, Türkiye', dur: '3h', cost: '₹95', tag: 'Adventure', body: 'World-class thermals over the Blue Lagoon. Multiple takeoff altitudes from 1,200–1,960 m.' },
  { name: 'Paragliding course', meta: 'Annecy, France', dur: '5 days', cost: '₹860', tag: 'Course', body: 'Beginner-to-solo certification on the Col de la Forclaz. English instructors, weather-flexible.' },
  { name: 'Tandem · Interlaken', meta: 'Switzerland', dur: '2h', cost: 'CHF 220', tag: 'Adventure', body: 'Classic alpine flight over Lake Thun. GoPro footage included.' },
  { name: 'Paragliding · Bir Billing', meta: 'Himachal, India', dur: '3h', cost: '₹3,200', tag: 'Adventure', body: 'Himalayan foothills, second-highest paragliding site in the world. Best Oct–Nov.' },
  { name: 'Photography flight', meta: 'Cappadocia, TR', dur: '1d', cost: '₹180', tag: 'Photo', body: 'Sunrise flight alongside the balloons — purpose-built for photographers.' },
]

export default function Search() {
  const [filtersOpen, setFiltersOpen] = useState(false)

  return (
    <div className="flex flex-col min-h-screen lg:h-screen bg-[var(--bg-page)] text-[var(--text-primary)] font-body lg:overflow-hidden">
      <Chrome active="Discover" />
      <Controls q="paragliding" />

      {/* Mobile filter toggle bar */}
      <div className="lg:hidden flex items-center justify-between px-4 py-2 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] shrink-0">
        <span className="text-sm text-[var(--text-tertiary)]">6 results · "paragliding"</span>
        <Button variant="outline" size="sm" onClick={() => setFiltersOpen(v => !v)}>
          {filtersOpen ? <><X size={14} /> Hide filters</> : <><SlidersHorizontal size={14} /> Show filters</>}
        </Button>
      </div>

      <div className="flex flex-col lg:grid lg:grid-cols-[1fr_300px] gap-4 sm:gap-8 p-4 sm:p-8 flex-1 lg:overflow-auto">

        {/* ===== RESULTS ===== */}
        <div>
          <div className="flex flex-wrap items-baseline justify-between gap-2 mb-4">
            <div>
              <h2 className="font-display text-xl sm:text-2xl font-bold tracking-tight">6 places to fly</h2>
              <div className="text-sm text-[var(--text-tertiary)] mt-1">Activities matching "paragliding" · sorted by relevance</div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="accent">Adventure</Badge>
              <Badge variant="outline">Under ₹200</Badge>
              <Badge variant="outline">Half-day</Badge>
            </div>
          </div>

          <div className="space-y-3">
            {results.map((r, i) => (
              <Card key={r.name} className="hover:shadow-[var(--shadow-md)] transition-shadow cursor-pointer py-0">
                {/* Mobile: image on top, then content + actions */}
                <div className="block sm:hidden">
                  <Img ratio="16/9" label={r.tag.toLowerCase()} className="w-full rounded-b-none border-0 border-b rounded-t-[var(--radius-xl)]" />
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <CardTitle className="text-base">{r.name}</CardTitle>
                          <Badge variant="secondary">{r.tag}</Badge>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--text-tertiary)] mt-1">
                          <span className="flex items-center gap-1"><MapPin size={11} /> {r.meta}</span>
                          <span>·</span><span>{r.dur}</span><span>·</span>
                          <span className="font-medium text-[var(--text-primary)]">{r.cost}</span>
                        </div>
                        <CardDescription className="mt-2 text-xs">{r.body}</CardDescription>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button variant="outline" size="sm" className="flex-1">Preview</Button>
                      <Button size="sm" className="flex-1"><Plus size={14} /> Add</Button>
                    </div>
                  </div>
                </div>

                {/* Desktop: 4-col grid */}
                <div className="hidden sm:grid sm:grid-cols-[40px_140px_1fr_auto] sm:items-center sm:gap-4 sm:p-4">
                  <span className="text-xs text-[var(--text-tertiary)] font-mono">{String(i + 1).padStart(2, '0')}</span>
                  <Img ratio="4/3" label={r.tag.toLowerCase()} className="w-full" />
                  <div>
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">{r.name}</CardTitle>
                      <Badge variant="secondary">{r.tag}</Badge>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-[var(--text-tertiary)] mt-1">
                      <span className="flex items-center gap-1"><MapPin size={12} /> {r.meta}</span>
                      <span>·</span><span>{r.dur}</span><span>·</span>
                      <span className="font-medium text-[var(--text-primary)]">{r.cost}</span>
                    </div>
                    <CardDescription className="mt-2">{r.body}</CardDescription>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button variant="outline" size="sm">Preview</Button>
                    <Button size="sm"><Plus size={14} /> Add</Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* ===== FILTER ASIDE ===== */}
        {/* Always shown on lg+. On mobile: toggled via filtersOpen state */}
        <aside className={`space-y-4 ${filtersOpen ? 'block' : 'hidden'} lg:block`}>
          <Card className="py-0">
            <div className="p-4 pb-2 font-medium text-sm">Cost (INR)</div>
            <div className="p-4 pt-2">
              <div className="relative h-6">
                <div className="absolute inset-x-0 top-1/2 h-px bg-[var(--border-subtle)]" />
                <div className="absolute left-[15%] right-[30%] top-1/2 h-px bg-[var(--brand-primary)]" />
                <div className="absolute left-[15%] top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-[var(--bg-surface)] border-2 border-[var(--brand-primary)]" />
                <div className="absolute left-[70%] top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-[var(--brand-primary)]" />
              </div>
              <div className="flex justify-between text-xs text-[var(--text-tertiary)] mt-3"><span>₹80</span><span>₹480</span></div>
            </div>
          </Card>

          <Card className="py-0">
            <div className="p-4 pb-2 font-medium text-sm">Type</div>
            <div className="p-4 pt-2 space-y-2">
              {[['Adventure', 24, true], ['Course', 6, true], ['Photo', 11, true], ['Wellness', 38, false], ['Sightseeing', 92, false], ['Food', 140, false]].map(([t, n, on]) => (
                <label key={t} className="flex items-center justify-between text-sm cursor-pointer">
                  <span className="flex items-center gap-2"><Checkbox checked={on} /> {t}</span>
                  <span className="text-xs text-[var(--text-tertiary)]">{n}</span>
                </label>
              ))}
            </div>
          </Card>

          <Card className="py-0">
            <div className="p-4 pb-2 font-medium text-sm">Region</div>
            <div className="p-4 pt-2 space-y-2">
              {['Europe', 'Asia', 'Americas', 'Africa', 'Oceania'].map(r => (
                <div key={r} className="flex justify-between text-sm cursor-pointer hover:text-[var(--brand-primary)] transition-colors">
                  <span>{r}</span><ArrowRight size={14} className="text-[var(--text-tertiary)]" />
                </div>
              ))}
            </div>
          </Card>
        </aside>
      </div>
    </div>
  )
}
