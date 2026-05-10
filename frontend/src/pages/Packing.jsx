import { useState, useEffect } from 'react'
import Chrome from '../components/Chrome'
import Controls from '../components/Controls'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { FileText, Package, Heart, Zap, Pill, Plus, Trash2, X, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

const API = 'http://localhost:4000'
const H = () => ({ Authorization: `Bearer ${localStorage.getItem('token')}` })

const CATEGORIES = ['CLOTHING', 'DOCUMENTS', 'TOILETRIES', 'ELECTRONICS', 'MEDICATIONS', 'OTHER']
const CAT_ICON = { DOCUMENTS: FileText, CLOTHING: Package, ELECTRONICS: Zap, MEDICATIONS: Pill, TOILETRIES: Heart, OTHER: Package }
const CAT_LABEL = { DOCUMENTS: 'Documents', CLOTHING: 'Clothing', ELECTRONICS: 'Electronics', MEDICATIONS: 'Medications', TOILETRIES: 'Toiletries', OTHER: 'Other' }

function groupByCategory(items) {
  const map = {}
  for (const cat of CATEGORIES) map[cat] = []
  for (const item of items) {
    const key = CATEGORIES.includes(item.category) ? item.category : 'OTHER'
    map[key].push(item)
  }
  return Object.entries(map).filter(([, v]) => v.length > 0)
}

export default function Packing() {
  const [trips, setTrips] = useState([])
  const [tripId, setTripId] = useState('')
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)

  const [adding, setAdding] = useState(false)
  const [newName, setNewName] = useState('')
  const [newCat, setNewCat] = useState('OTHER')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch(`${API}/trips`, { headers: H() })
      .then(r => r.ok ? r.json() : [])
      .then(data => {
        setTrips(data)
        if (data.length > 0) setTripId(String(data[0].id))
      })
  }, [])

  useEffect(() => {
    if (!tripId) return
    setLoading(true)
    fetch(`${API}/trips/${tripId}/packing`, { headers: H() })
      .then(r => r.ok ? r.json() : [])
      .then(setItems)
      .finally(() => setLoading(false))
  }, [tripId])

  async function toggle(item) {
    const res = await fetch(`${API}/trips/${tripId}/packing/${item.id}`, {
      method: 'PUT',
      headers: { ...H(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ isPacked: !item.isPacked }),
    })
    if (res.ok) {
      const updated = await res.json()
      setItems(prev => prev.map(it => it.id === item.id ? updated : it))
    }
  }

  async function deleteItem(itemId) {
    const res = await fetch(`${API}/trips/${tripId}/packing/${itemId}`, {
      method: 'DELETE', headers: H(),
    })
    if (res.ok) setItems(prev => prev.filter(it => it.id !== itemId))
  }

  async function addItem() {
    if (!newName.trim()) return
    setSaving(true)
    const res = await fetch(`${API}/trips/${tripId}/packing`, {
      method: 'POST',
      headers: { ...H(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName.trim(), category: newCat, order: items.length }),
    })
    if (res.ok) {
      const item = await res.json()
      setItems(prev => [...prev, item])
      setNewName(''); setNewCat('OTHER'); setAdding(false)
    }
    setSaving(false)
  }

  async function resetAll() {
    const res = await fetch(`${API}/trips/${tripId}/packing/reset`, {
      method: 'POST', headers: H(),
    })
    if (res.ok) setItems(prev => prev.map(it => ({ ...it, isPacked: false })))
  }

  const total = items.length
  const done = items.filter(i => i.isPacked).length
  const grouped = groupByCategory(items)

  return (
    <div className="flex flex-col min-h-screen lg:h-screen bg-[var(--bg-page)] text-[var(--text-primary)] font-body lg:overflow-hidden">
      <Chrome active="Plan" />
      <Controls q="Search this checklist…" />

      {/* Page Header — stacks on mobile */}
      <div className="px-4 sm:px-8 py-4 sm:py-6 border-b border-[var(--border-subtle)] flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 shrink-0 bg-[var(--bg-surface)]">
        <div className="flex-1">
          {trips.length > 0 ? (
            <select
              value={tripId}
              onChange={e => setTripId(e.target.value)}
              className="mb-2 text-xs font-medium bg-[var(--bg-muted)] border border-[var(--border-subtle)] rounded-[var(--radius-md)] px-2 py-1 text-[var(--text-secondary)] cursor-pointer"
            >
              {trips.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
            </select>
          ) : (
            <Badge variant="secondary" className="mb-2">No trips yet</Badge>
          )}
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">Packing checklist</h1>
          {total > 0 && (
            <div className="flex items-center gap-3 mt-3 max-w-md">
              <Progress value={total > 0 ? (done / total) * 100 : 0} className="flex-1" />
              <span className="text-sm font-medium">{done} / {total}</span>
            </div>
          )}
        </div>
        {/* Action buttons wrap on mobile */}
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={resetAll} disabled={!tripId || total === 0}>Reset</Button>
          <Button onClick={() => setAdding(true)} disabled={!tripId || adding}>
            <Plus size={14} /> Add item
          </Button>
        </div>
      </div>

      {/* Category cards: 1-col mobile → 2-col sm+ */}
      <div className="p-4 sm:p-8 flex-1 lg:overflow-auto">
        {adding && (
          <div className="flex gap-2 mb-6 items-center flex-wrap">
            <Input
              placeholder="Item name…"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              className="max-w-xs"
              onKeyDown={e => e.key === 'Enter' && addItem()}
              autoFocus
            />
            <select
              value={newCat}
              onChange={e => setNewCat(e.target.value)}
              className="text-xs bg-[var(--bg-muted)] border border-[var(--border-subtle)] rounded-[var(--radius-md)] px-2 py-2 text-[var(--text-secondary)] cursor-pointer"
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{CAT_LABEL[c]}</option>)}
            </select>
            <Button size="sm" onClick={addItem} disabled={saving || !newName.trim()}><Check size={14} /></Button>
            <Button variant="ghost" size="sm" onClick={() => { setAdding(false); setNewName('') }}><X size={14} /></Button>
          </div>
        )}

        {!tripId ? (
          <p className="text-sm text-[var(--text-tertiary)]">Select a trip to view its packing list.</p>
        ) : loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-48 bg-[var(--bg-muted)] rounded-[var(--radius-xl)] animate-pulse" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <p className="text-sm text-[var(--text-tertiary)]">No items yet. Add one above.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {grouped.map(([cat, catItems]) => {
              const Icon = CAT_ICON[cat] ?? Package
              const catDone = catItems.filter(i => i.isPacked).length
              return (
                <Card key={cat} className="py-0">
                  <CardHeader className="flex-row items-center justify-between space-y-0 p-4 sm:p-5 pb-3">
                    <div className="flex items-center gap-2">
                      <Icon size={16} />
                      <CardTitle className="text-base">{CAT_LABEL[cat]}</CardTitle>
                    </div>
                    <Badge variant={catDone === catItems.length ? 'success' : 'outline'}>
                      {catDone} / {catItems.length}
                    </Badge>
                  </CardHeader>
                  <CardContent className="p-0">
                    {catItems.map((item, ii) => (
                      <label
                        key={item.id}
                        className={cn(
                          'flex items-center gap-3 px-4 sm:px-5 py-3 cursor-pointer hover:bg-[var(--bg-muted)]/50 transition-colors min-h-[44px]',
                          ii < catItems.length - 1 && 'border-t border-[var(--border-subtle)]'
                        )}
                      >
                        <Checkbox checked={item.isPacked} onCheckedChange={() => toggle(item)} />
                        <span className={cn('text-sm flex-1', item.isPacked && 'line-through text-[var(--text-tertiary)]')}>
                          {item.name}
                        </span>
                        <button
                          className="text-[var(--text-tertiary)] hover:text-[var(--color-error)] transition-colors p-1"
                          onClick={e => { e.preventDefault(); deleteItem(item.id) }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </label>
                    ))}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
