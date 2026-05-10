import Chrome from '../components/Chrome'
import Controls from '../components/Controls'
import Img from '../components/Img'
import { useNav } from '../navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Plus, ArrowRight } from 'lucide-react'

export default function Dashboard() {
  const { navigate } = useNav()
  return (
    <div className="flex flex-col h-screen bg-background text-foreground font-sans overflow-hidden">
      <Chrome active="Discover" />
      <div className="flex-1 overflow-auto">
        <div className="relative h-72 border-b shrink-0">
          <Img label="Banner · Cinque Terre" className="absolute inset-0 rounded-none border-0 h-full w-full" style={{ aspectRatio: undefined }} />
          <div className="absolute left-8 bottom-8 right-8 flex items-end justify-between">
            <Card className="max-w-md rounded-xl border shadow-sm py-0">
              <CardHeader className="p-6">
                <Badge variant="accent" className="w-fit mb-2">May 2026</Badge>
                <CardTitle className="text-3xl">Where to, Amelia?</CardTitle>
                <CardDescription>Three trips on the horizon. Eight days until Rome.</CardDescription>
              </CardHeader>
            </Card>
            <Button size="lg" onClick={() => navigate('create-trip')}><Plus size={16} /> Plan a New Trip</Button>
          </div>
        </div>

        <Controls q="Lisbon, paragliding, slow trains in Japan…" />

        <div className="grid grid-cols-[2fr_1fr] gap-8 p-8">
          <div>
            <div className="flex items-baseline justify-between mb-4">
              <h2 className="text-lg font-semibold">Top regional selections</h2>
              <span className="text-xs text-muted-foreground">5 of 24</span>
            </div>
            <div className="grid grid-cols-5 gap-3">
              {[['Lisbon', 'PT'], ['Kyoto', 'JP'], ['Marrakesh', 'MA'], ['Reykjavík', 'IS'], ['Oaxaca', 'MX']].map(([n, c]) => (
                <Card key={n} className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow rounded-xl border shadow-sm py-0">
                  <Img ratio="1/1" label={c} className="rounded-none border-0" />
                  <div className="p-3">
                    <div className="font-medium text-sm">{n}</div>
                    <div className="text-xs text-muted-foreground">{c}</div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="flex items-baseline justify-between mt-8 mb-4">
              <h2 className="text-lg font-semibold">Previous trips</h2>
              <Button variant="link" size="sm">View all <ArrowRight size={14} /></Button>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[
                ['Hokkaidō Loop', 'Feb 2026', '14 days · ¥184,200'],
                ['Lofoten Islands', 'Aug 2025', '8 days · €2,140'],
                ['Cusco → Sacred Valley', 'Apr 2025', '11 days · $1,860'],
              ].map(([n, d, m]) => (
                <Card key={n} className="rounded-xl border shadow-sm py-0 cursor-pointer" onClick={() => navigate('my-trips')}>
                  <Img ratio="16/10" className="rounded-b-none border-0 border-b rounded-t-xl" />
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

          <aside>
            <h2 className="text-lg font-semibold mb-4">Up next</h2>
            <Card className="rounded-xl border shadow-sm py-0 cursor-pointer" onClick={() => navigate('itinerary')}>
              <CardHeader className="p-5">
                <Badge variant="accent" className="w-fit">In 8 days</Badge>
                <CardTitle className="text-2xl mt-2">Rome &amp; the Amalfi</CardTitle>
                <CardDescription>18 May → 02 Jun · 6 stops</CardDescription>
              </CardHeader>
              <CardContent className="px-5 pb-5">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Budget</span>
                  <span className="font-medium">€2,400 / €3,200</span>
                </div>
                <Progress value={75} />
              </CardContent>
            </Card>

            <h3 className="text-sm font-semibold mt-6 mb-3 text-muted-foreground uppercase tracking-wide">From the community</h3>
            <div className="space-y-3">
              {[
                'Three days in Naples — by mouth',
                'A walking guide to Hanoi at dawn',
                'Patagonia in the off-season',
              ].map(t => (
                <Card key={t} className="cursor-pointer hover:bg-accent transition-colors rounded-xl border shadow-sm py-0" onClick={() => navigate('community')}>
                  <CardContent className="p-4">
                    <div className="text-sm font-medium">{t}</div>
                    <div className="text-xs text-muted-foreground mt-1">Shared 2d ago</div>
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
