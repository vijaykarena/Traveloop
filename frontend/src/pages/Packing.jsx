import { useState } from 'react'
import Chrome from '../components/Chrome'
import Controls from '../components/Controls'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Progress } from '@/components/ui/progress'
import { FileText, Package, Heart, Share, Plus, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const ICONS = { Documents: FileText, Clothing: Package, Electronics: Package, Wellness: Heart }

const initialCats = [
  { name: 'Documents', items: [['Passport', true], ['Flight tickets (printed)', true], ['Travel insurance', true], ['Hotel booking confirmation', false]] },
  { name: 'Clothing', items: [['Casual shirts × 4', true], ['Trousers / jeans × 2', true], ['Comfortable walking shoes', true], ['Light jacket / windbreaker', false], ['Swimwear', false]] },
  { name: 'Electronics', items: [['Phone charger', true], ['Universal power adaptor', false], ['Earphones / headphones', false]] },
  { name: 'Wellness', items: [['Sunscreen', false], ['Reusable water bottle', false], ['Pocket first-aid kit', false]] },
]

export default function Packing() {
  const [cats, setCats] = useState(initialCats)

  const toggle = (ci, ii) => {
    setCats(prev => prev.map((c, ci2) =>
      ci2 !== ci ? c : { ...c, items: c.items.map((it, ii2) => ii2 !== ii ? it : [it[0], !it[1]]) }
    ))
  }

  const total = cats.reduce((a, c) => a + c.items.length, 0)
  const done = cats.reduce((a, c) => a + c.items.filter(i => i[1]).length, 0)

  return (
    <div className="flex flex-col min-h-screen lg:h-screen bg-[var(--bg-page)] text-[var(--text-primary)] font-body lg:overflow-hidden">
      <Chrome active="Plan" />
      <Controls q="Search this checklist…" />

      {/* Page Header — stacks on mobile */}
      <div className="px-4 sm:px-8 py-4 sm:py-6 border-b border-[var(--border-subtle)] flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 shrink-0 bg-[var(--bg-surface)]">
        <div className="flex-1">
          <Badge variant="secondary" className="mb-2">Trip to Europe Adventure</Badge>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">Packing checklist</h1>
          <div className="flex items-center gap-3 mt-3 max-w-md">
            <Progress value={(done / total) * 100} className="flex-1" />
            <span className="text-sm font-medium">{done} / {total}</span>
          </div>
        </div>
        {/* Action buttons wrap on mobile */}
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => setCats(initialCats)}>Reset</Button>
          <Button variant="outline"><Share size={14} /> Share</Button>
          <Button><Plus size={14} /> Add item</Button>
        </div>
      </div>

      {/* Category cards: 1-col mobile → 2-col sm+ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 p-4 sm:p-8 flex-1 lg:overflow-auto">
        {cats.map((c, ci) => {
          const Icon = ICONS[c.name] ?? Package
          const catDone = c.items.filter(i => i[1]).length
          return (
            <Card key={c.name} className="py-0">
              <CardHeader className="flex-row items-center justify-between space-y-0 p-4 sm:p-5 pb-3">
                <div className="flex items-center gap-2">
                  <Icon size={16} />
                  <CardTitle className="text-base">{c.name}</CardTitle>
                </div>
                <Badge variant={catDone === c.items.length ? 'success' : 'outline'}>{catDone} / {c.items.length}</Badge>
              </CardHeader>
              <CardContent className="p-0">
                {c.items.map(([label, on], ii) => (
                  <label
                    key={ii}
                    className={cn(
                      'flex items-center gap-3 px-4 sm:px-5 py-3 cursor-pointer hover:bg-[var(--bg-muted)]/50 transition-colors min-h-[44px]',
                      ii < c.items.length - 1 && 'border-t border-[var(--border-subtle)]'
                    )}
                  >
                    <Checkbox checked={on} onCheckedChange={() => toggle(ci, ii)} />
                    <span className={cn('text-sm flex-1', on && 'line-through text-[var(--text-tertiary)]')}>{label}</span>
                    <button className="text-[var(--text-tertiary)] hover:text-[var(--color-error)] transition-colors p-1" onClick={e => e.preventDefault()}>
                      <Trash2 size={14} />
                    </button>
                  </label>
                ))}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
