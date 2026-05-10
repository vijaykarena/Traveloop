import { useState } from 'react'
import Chrome from '../components/Chrome'
import Controls from '../components/Controls'
import TabsSwitcher from '../components/TabsSwitcher'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Edit, Trash2, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

const notes = [
  { date: 'Day 03 · 20 Jun', title: 'Hotel check-in details — Rome stop', body: 'Check-in after 2pm, room 502, breakfast included (7–10am). Concierge holds bags from 09:00. Code for the building gate: 4421#.', tags: ['Stay', 'Logistics'] },
  { date: 'Day 03 · 20 Jun', title: 'Reservations — Wednesday', body: "Roscioli at 13:30 (Marco's name). Aperitivo 18:30 — no booking. Backup: Pianostrada nearby if line too long.", tags: ['Food'] },
  { date: 'Day 04 · 21 Jun', title: 'Train · Rome → Naples (Frecciarossa)', body: '07:55 from Termini, arrive 09:05 Centrale. Carriage 4, seats 11A/B. Print or have ticket on phone before boarding.', tags: ['Travel'] },
  { date: 'Day 05 · 22 Jun', title: 'Vesuvius hike — bring', body: 'Trail closes 16:00. Bring water (1.5L each), proper shoes, light layer. Park entry €10pp, separate from tour.', tags: ['Hike', 'Buy'] },
  { date: 'Day 07 · 24 Jun', title: 'Sorrento apartment — quirks', body: 'Hot water needs 20 min. Wifi: TRAVELOOP-301 / sorrento2026. Laundry on Tuesday only.', tags: ['Stay'] },
]

export default function Notes() {
  const [tab, setTab] = useState('All')
  const [selectedNote, setSelectedNote] = useState(0)

  return (
    <div className="flex flex-col min-h-screen lg:h-screen bg-[var(--bg-page)] text-[var(--text-primary)] font-body lg:overflow-hidden">
      <Chrome active="My Trips" />
      <Controls q="Search trip notes…" extra={<Button size="sm"><Plus size={14} /> Add note</Button>} />

      {/* Page Header — stacks on mobile */}
      <div className="px-4 sm:px-8 py-4 sm:py-6 border-b border-[var(--border-subtle)] flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 shrink-0 bg-[var(--bg-surface)]">
        <div>
          <Badge variant="secondary" className="mb-2">Rome &amp; Amalfi</Badge>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">Trip notes</h1>
          <p className="text-[var(--text-secondary)] mt-1">Important details, reminders, and confirmations.</p>
        </div>
        <TabsSwitcher tabs={['All', 'By day', 'By stop']} active={tab} onChange={setTab} />
      </div>

      {/* Main grid: sidebar hidden on mobile */}
      <div className="flex flex-col lg:grid lg:grid-cols-[200px_1fr] gap-4 sm:gap-6 p-4 sm:p-8 flex-1 lg:overflow-auto">

        {/* ===== SIDEBAR INDEX — hidden on mobile ===== */}
        <aside className="hidden lg:block">
          <h3 className="text-xs font-bold text-[var(--text-tertiary)] uppercase tracking-wider mb-3">Index</h3>
          <div className="space-y-1">
            {notes.map((n, i) => (
              <button
                key={i}
                onClick={() => setSelectedNote(i)}
                className={cn(
                  'w-full text-left p-2 rounded-[var(--radius-md)] text-sm hover:bg-[var(--bg-muted)] transition-colors',
                  i === selectedNote && 'bg-[var(--bg-muted)]'
                )}
              >
                <div className="font-medium truncate">№ {String(i + 1).padStart(2, '0')} · {n.title.split('—')[0].trim()}</div>
                <div className="text-xs text-[var(--text-tertiary)]">{n.date}</div>
              </button>
            ))}
          </div>
        </aside>

        {/* ===== NOTES LIST ===== */}
        <div className="space-y-4">
          {notes.map((n, i) => (
            <Card key={i} className="py-0">
              <CardHeader className="flex-row items-start justify-between space-y-0 p-4 sm:p-5 pb-3">
                <div>
                  <div className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider mb-1">{n.date}</div>
                  <CardTitle className="text-base sm:text-lg">{n.title}</CardTitle>
                </div>
                <div className="flex gap-1 shrink-0">
                  <Button variant="ghost" size="icon"><Edit size={14} /></Button>
                  <Button variant="ghost" size="icon"><Trash2 size={14} /></Button>
                </div>
              </CardHeader>
              <CardContent className="px-4 sm:px-5 pb-4 sm:pb-5">
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{n.body}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {n.tags.map(t => <Badge key={t} variant="outline">{t}</Badge>)}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
