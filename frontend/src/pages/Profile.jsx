import Chrome from '../components/Chrome'
import Img from '../components/Img'
import { useNav } from '../navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Heart, Settings, Edit, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function Profile() {
  const { navigate } = useNav()
  return (
    <div className="flex flex-col h-screen bg-background text-foreground font-sans overflow-hidden">
      <Chrome active="" user="AS" />

      <div className="px-8 py-8 border-b grid grid-cols-[120px_1fr_auto] gap-6 items-center shrink-0">
        <Avatar className="h-28 w-28 text-2xl bg-primary/10 text-primary">
          <AvatarFallback className="bg-primary/10 text-primary text-2xl font-medium">AS</AvatarFallback>
        </Avatar>
        <div>
          <Badge variant="secondary" className="mb-2">Member since Mar 2024 · 11 trips logged</Badge>
          <h1 className="text-3xl font-semibold tracking-tight">Amelia Stone</h1>
          <p className="text-muted-foreground mt-1 max-w-xl">Slow traveller, occasional cook, cataloguer of small bookshops. Based in Lisbon.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline"><Settings size={14} /> Settings</Button>
          <Button><Edit size={14} /> Edit profile</Button>
        </div>
      </div>

      <div className="grid grid-cols-[1fr_2fr] gap-8 p-8 flex-1 overflow-auto">
        <div>
          <h2 className="text-lg font-semibold mb-4">Account details</h2>
          <Card className="rounded-xl border shadow-sm py-0">
            <CardContent className="p-0">
              {[
                ['Email', 'amelia.stone@traveloop.io'],
                ['Phone', '+44 7700 900 421'],
                ['Location', 'Lisbon, Portugal'],
                ['Languages', 'EN · PT · IT'],
                ['Currency', 'EUR'],
                ['Visibility', 'Friends only'],
              ].map(([k, v], i, a) => (
                <div key={k} className={cn('flex justify-between p-4', i < a.length - 1 && 'border-b')}>
                  <span className="text-sm text-muted-foreground">{k}</span>
                  <span className="text-sm font-medium">{v}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <h2 className="text-lg font-semibold mt-6 mb-3">Saved destinations</h2>
          <div className="flex flex-wrap gap-2">
            {['Lisbon', 'Naples', 'Reykjavík', 'Marrakesh', 'Kyoto', 'Oaxaca', 'Tbilisi', 'Hanoi'].map(c => (
              <Badge key={c} variant="outline"><Heart size={11} className="mr-1" />{c}</Badge>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="text-lg font-semibold">Preplanned trips</h2>
            <Badge variant="secondary">3 ahead</Badge>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[['Rome & Amalfi', '18 May'], ['Tokyo loop', '12 Jun'], ['Iceland', '02 Aug']].map(([n, d]) => (
              <Card key={n} className="rounded-xl border shadow-sm py-0">
                <Img ratio="4/3" className="rounded-t-xl rounded-b-none border-0 border-b" />
                <CardHeader className="p-4">
                  <CardTitle className="text-base">{n}</CardTitle>
                  <CardDescription>Departs {d}</CardDescription>
                </CardHeader>
                <CardFooter className="p-4 pt-0">
                  <Button variant="outline" size="sm" className="w-full" onClick={() => navigate('itinerary')}>View <ArrowRight size={14} /></Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <h2 className="text-lg font-semibold mt-8 mb-4">Previous trips</h2>
          <div className="grid grid-cols-3 gap-4">
            {[['Hokkaidō', 'Feb 2026'], ['Lofoten', 'Aug 2025'], ['Cusco', 'Apr 2025']].map(([n, d]) => (
              <Card key={n} className="rounded-xl border shadow-sm py-0">
                <Img ratio="4/3" className="rounded-t-xl rounded-b-none border-0 border-b" />
                <CardHeader className="p-4">
                  <CardTitle className="text-base">{n}</CardTitle>
                  <CardDescription>{d}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
