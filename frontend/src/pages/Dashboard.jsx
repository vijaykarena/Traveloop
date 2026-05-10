import Chrome from '../components/Chrome'
import Controls from '../components/Controls'
import Img from '../components/Img'
import SectionHeader from '../components/common/SectionHeader'
import { useNav } from '../navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Plus, ArrowRight } from 'lucide-react'

export default function Dashboard() {
  const { navigate } = useNav()
  return (
    <div className="flex flex-col min-h-screen lg:h-screen bg-[var(--bg-page)] text-[var(--text-primary)] font-body lg:overflow-hidden">
      <Chrome active="Discover" />
      <div className="flex-1 lg:overflow-auto">

        {/* ===== HERO BANNER ===== */}
        <div className="relative h-48 sm:h-64 md:h-72 border-b border-[var(--border-subtle)] shrink-0">
          <Img label="Banner · Cinque Terre" className="absolute inset-0 rounded-none border-0 h-full w-full" style={{ aspectRatio: undefined }} />
          <div className="absolute inset-x-4 sm:inset-x-8 bottom-4 sm:bottom-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <Card className="max-w-xs sm:max-w-md py-0">
              <CardHeader className="p-4 sm:p-6">
                <Badge variant="accent" className="w-fit mb-2">May 2026</Badge>
                <CardTitle className="text-xl sm:text-3xl">Where to, Amelia?</CardTitle>
                <CardDescription className="hidden sm:block">Three trips on the horizon. Eight days until Rome.</CardDescription>
              </CardHeader>
            </Card>
            <Button size="sm" className="sm:hidden self-start" onClick={() => navigate('create-trip')}>
              <Plus size={14} /> New Trip
            </Button>
            <Button size="lg" className="hidden sm:flex" onClick={() => navigate('create-trip')}>
              <Plus size={16} /> Plan a New Trip
            </Button>
          </div>
        </div>

        {/* Controls */}
        <Controls q="Lisbon, paragliding, slow trains in Japan…" />

        {/* ===== MAIN CONTENT GRID ===== */}
        {/* Desktop: 2fr 1fr | Mobile: single column */}
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4 sm:gap-8 p-4 sm:p-8">

          {/* LEFT COLUMN */}
          <div>
            <SectionHeader
              title="Top regional selections"
              trailing={<span className="text-xs text-[var(--text-tertiary)]">5 of 24</span>}
            />
            {/* Destination cards: 2 cols mobile → 3 tablet → 5 desktop */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {[['Lisbon', 'PT'], ['Kyoto', 'JP'], ['Marrakesh', 'MA'], ['Reykjavík', 'IS'], ['Oaxaca', 'MX']].map(([n, c]) => (
                <Card key={n} className="overflow-hidden cursor-pointer hover:shadow-[var(--shadow-md)] transition-shadow py-0">
                  <Img ratio="1/1" label={c} className="rounded-none border-0" />
                  <div className="p-3">
                    <div className="font-medium text-sm">{n}</div>
                    <div className="text-xs text-[var(--text-tertiary)]">{c}</div>
                  </div>
                </Card>
              ))}
            </div>

            <SectionHeader
              title="Previous trips"
              trailing={<Button variant="link" size="sm">View all <ArrowRight size={14} /></Button>}
              className="mt-6 sm:mt-8"
            />
            {/* Previous trip cards: 1 col mobile → 2 tablet → 3 desktop */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                ['Hokkaidō Loop', 'Feb 2026', '14 days · ₹1,84,200'],
                ['Lofoten Islands', 'Aug 2025', '8 days · ₹2,140'],
                ['Cusco → Sacred Valley', 'Apr 2025', '11 days · ₹1,860'],
              ].map(([n, d, m]) => (
                <Card key={n} className="py-0 cursor-pointer" onClick={() => navigate('my-trips')}>
                  <Img ratio="16/10" className="rounded-b-none border-0 border-b rounded-t-[var(--radius-xl)]" />
                  <CardHeader className="p-4">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-base">{n}</CardTitle>
                      <Badge variant="outline">{d}</Badge>
                    </div>
                    <CardDescription>{m}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>

          {/* RIGHT ASIDE — stacks below on mobile */}
          <aside>
            <SectionHeader title="Up next" />
            <Card className="py-0 cursor-pointer" onClick={() => navigate('itinerary')}>
              <CardHeader className="p-5">
                <Badge variant="accent" className="w-fit">In 8 days</Badge>
                <CardTitle className="text-2xl mt-2">Rome &amp; the Amalfi</CardTitle>
                <CardDescription>18 May → 02 Jun · 6 stops</CardDescription>
              </CardHeader>
              <CardContent className="px-5 pb-5">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-[var(--text-tertiary)]">Budget</span>
                  <span className="font-medium">₹2,400 / ₹3,200</span>
                </div>
                <Progress value={75} />
              </CardContent>
            </Card>

            <h3 className="text-xs font-semibold mt-6 mb-3 text-[var(--text-tertiary)] uppercase tracking-wider">From the community</h3>
            <div className="space-y-3">
              {[
                'Three days in Naples — by mouth',
                'A walking guide to Hanoi at dawn',
                'Patagonia in the off-season',
              ].map(t => (
                <Card key={t} className="cursor-pointer hover:bg-[var(--bg-muted)] transition-colors py-0" onClick={() => navigate('community')}>
                  <CardContent className="p-4">
                    <div className="text-sm font-medium">{t}</div>
                    <div className="text-xs text-[var(--text-tertiary)] mt-1">Shared 2d ago</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </aside>
        </div>

      </div>
    </div>
  )
}
