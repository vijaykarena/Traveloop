import Chrome from '../components/Chrome'
import Img from '../components/Img'
import SectionHeader from '../components/common/SectionHeader'
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
    <div className="flex flex-col min-h-screen lg:h-screen bg-[var(--bg-page)] text-[var(--text-primary)] font-body lg:overflow-hidden">
      <Chrome active="" user="AS" />

      {/* ===== PROFILE HEADER ===== */}
      {/* Desktop: 3-col [avatar | info | buttons]   Mobile: stacked, centered */}
      <div className="px-4 sm:px-8 py-6 sm:py-8 border-b border-[var(--border-subtle)] shrink-0 bg-[var(--bg-surface)]">
        <div className="flex flex-col sm:grid sm:grid-cols-[120px_1fr_auto] sm:gap-6 sm:items-center gap-4 items-center sm:items-start text-center sm:text-left">
          <Avatar className="h-24 w-24 sm:h-28 sm:w-28 text-2xl">
            <AvatarFallback className="bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] text-2xl font-bold">AS</AvatarFallback>
          </Avatar>
          <div>
            <Badge variant="secondary" className="mb-2">Member since Mar 2024 · 11 trips logged</Badge>
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">Amelia Stone</h1>
            <p className="text-[var(--text-secondary)] mt-1 max-w-xl text-sm sm:text-base">Slow traveller, occasional cook, cataloguer of small bookshops. Based in Lisbon.</p>
          </div>
          <div className="flex gap-2 sm:flex-col sm:items-stretch">
            <Button variant="outline" size="sm"><Settings size={14} /> Settings</Button>
            <Button size="sm"><Edit size={14} /> Edit profile</Button>
          </div>
        </div>
      </div>

      {/* ===== MAIN CONTENT ===== */}
      {/* Desktop: [1fr 2fr] | Mobile: stacked */}
      <div className="flex flex-col lg:grid lg:grid-cols-[1fr_2fr] gap-4 sm:gap-8 p-4 sm:p-8 flex-1 lg:overflow-auto">

        {/* LEFT — Account details + saved destinations */}
        <div>
          <SectionHeader title="Account details" />
          <Card className="py-0">
            <CardContent className="p-0">
              {[
                ['Email', 'amelia.stone@traveloop.io'],
                ['Phone', '+44 7700 900 421'],
                ['Location', 'Lisbon, Portugal'],
                ['Languages', 'EN · PT · IT'],
                ['Currency', 'EUR'],
                ['Visibility', 'Friends only'],
              ].map(([k, v], i, a) => (
                <div key={k} className={cn('flex justify-between p-4', i < a.length - 1 && 'border-b border-[var(--border-subtle)]')}>
                  <span className="text-sm text-[var(--text-tertiary)]">{k}</span>
                  <span className="text-sm font-medium">{v}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <SectionHeader title="Saved destinations" className="mt-6" />
          <div className="flex flex-wrap gap-2">
            {['Lisbon', 'Naples', 'Reykjavík', 'Marrakesh', 'Kyoto', 'Oaxaca', 'Tbilisi', 'Hanoi'].map(c => (
              <Badge key={c} variant="outline"><Heart size={11} className="mr-1" />{c}</Badge>
            ))}
          </div>
        </div>

        {/* RIGHT — Trip cards */}
        <div>
          <SectionHeader
            title="Preplanned trips"
            trailing={<Badge variant="secondary">3 ahead</Badge>}
          />
          {/* 1-col mobile → 2-col sm → 3-col lg */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[['Rome & Amalfi', '18 May'], ['Tokyo loop', '12 Jun'], ['Iceland', '02 Aug']].map(([n, d]) => (
              <Card key={n} className="py-0">
                <Img ratio="4/3" className="rounded-t-[var(--radius-xl)] rounded-b-none border-0 border-b" />
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

          <SectionHeader title="Previous trips" className="mt-6 sm:mt-8" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[['Hokkaidō', 'Feb 2026'], ['Lofoten', 'Aug 2025'], ['Cusco', 'Apr 2025']].map(([n, d]) => (
              <Card key={n} className="py-0">
                <Img ratio="4/3" className="rounded-t-[var(--radius-xl)] rounded-b-none border-0 border-b" />
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
