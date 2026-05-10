import { useState, useEffect } from 'react'
import Chrome from '../components/Chrome'
import Controls from '../components/Controls'
import TabsSwitcher from '../components/TabsSwitcher'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Edit, Trash2, Plus, X, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

const API = 'http://localhost:4000'
const H = () => ({ Authorization: `Bearer ${localStorage.getItem('token')}` })

function fmtDate(iso) {
  if (!iso) return null
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function Notes() {
  const [tab, setTab] = useState('All')

  const [trips, setTrips] = useState([])
  const [tripId, setTripId] = useState('')
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedIdx, setSelectedIdx] = useState(0)

  const [adding, setAdding] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newContent, setNewContent] = useState('')
  const [newDate, setNewDate] = useState('')
  const [saving, setSaving] = useState(false)

  const [editingId, setEditingId] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [editContent, setEditContent] = useState('')

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
    fetch(`${API}/trips/${tripId}/notes`, { headers: H() })
      .then(r => r.ok ? r.json() : [])
      .then(data => { setNotes(data); setSelectedIdx(0) })
      .finally(() => setLoading(false))
  }, [tripId])

  async function addNote() {
    if (!newContent.trim()) return
    setSaving(true)
    const body = { content: newContent.trim() }
    if (newTitle.trim()) body.title = newTitle.trim()
    if (newDate) body.noteDate = newDate
    const res = await fetch(`${API}/trips/${tripId}/notes`, {
      method: 'POST',
      headers: { ...H(), 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (res.ok) {
      const note = await res.json()
      setNotes(prev => [note, ...prev])
      setNewTitle(''); setNewContent(''); setNewDate('')
      setAdding(false)
    }
    setSaving(false)
  }

  async function deleteNote(noteId) {
    const res = await fetch(`${API}/trips/${tripId}/notes/${noteId}`, {
      method: 'DELETE', headers: H(),
    })
    if (res.ok) setNotes(prev => prev.filter(n => n.id !== noteId))
  }

  function startEdit(note) {
    setEditingId(note.id)
    setEditTitle(note.title ?? '')
    setEditContent(note.content)
  }

  async function saveEdit(noteId) {
    const res = await fetch(`${API}/trips/${tripId}/notes/${noteId}`, {
      method: 'PUT',
      headers: { ...H(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: editTitle || null, content: editContent }),
    })
    if (res.ok) {
      const updated = await res.json()
      setNotes(prev => prev.map(n => n.id === noteId ? updated : n))
      setEditingId(null)
    }
  }

  const displayNotes = tab === 'By day'
    ? [...notes].sort((a, b) => new Date(a.noteDate ?? a.createdAt) - new Date(b.noteDate ?? b.createdAt))
    : notes

  return (
    <div className="flex flex-col min-h-screen lg:h-screen bg-[var(--bg-page)] text-[var(--text-primary)] font-body lg:overflow-hidden">
      <Chrome active="My Trips" />
      <Controls
        q="Search trip notes…"
        extra={
          <Button size="sm" onClick={() => setAdding(true)} disabled={!tripId || adding}>
            <Plus size={14} /> Add note
          </Button>
        }
      />
      <div className="px-4 sm:px-8 py-4 sm:py-6 border-b border-[var(--border-subtle)] flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 shrink-0 bg-[var(--bg-surface)]">
        <div>
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
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">Trip notes</h1>
          <p className="text-[var(--text-secondary)] mt-1">Important details, reminders, and confirmations.</p>
        </div>
        <TabsSwitcher tabs={['All', 'By day']} active={tab} onChange={setTab} />
      </div>

      {/* Main grid: sidebar hidden on mobile */}
      <div className="flex flex-col lg:grid lg:grid-cols-[200px_1fr] gap-4 sm:gap-6 p-4 sm:p-8 flex-1 lg:overflow-auto">

        {/* ===== SIDEBAR INDEX — hidden on mobile ===== */}
        <aside className="hidden lg:block">
          <h3 className="text-xs font-bold text-[var(--text-tertiary)] uppercase tracking-wider mb-3">Index</h3>
          <div className="space-y-1">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-10 bg-[var(--bg-muted)] rounded-[var(--radius-md)] animate-pulse" />
                ))
              : displayNotes.map((n, i) => (
                  <button
                    key={n.id}
                    onClick={() => setSelectedIdx(i)}
                    className={cn(
                      'w-full text-left p-2 rounded-[var(--radius-md)] text-sm hover:bg-[var(--bg-muted)] transition-colors',
                      i === selectedIdx && 'bg-[var(--bg-muted)]'
                    )}
                  >
                    <div className="font-medium truncate">№ {String(i + 1).padStart(2, '0')} · {(n.title || n.content).split(' ').slice(0, 4).join(' ')}</div>
                    {n.noteDate && <div className="text-xs text-[var(--text-tertiary)]">{fmtDate(n.noteDate)}</div>}
                  </button>
                ))}
          </div>
        </aside>

        {/* ===== NOTES LIST ===== */}
        <div className="space-y-4">
          {adding && (
            <Card className="py-0 border-[var(--brand-primary)]">
              <CardContent className="p-5 space-y-3">
                <Input
                  placeholder="Title (optional)"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                />
                <Textarea
                  placeholder="Note content…"
                  value={newContent}
                  onChange={e => setNewContent(e.target.value)}
                  rows={3}
                />
                <Input
                  type="date"
                  value={newDate}
                  onChange={e => setNewDate(e.target.value)}
                />
                <div className="flex gap-2 justify-end">
                  <Button variant="ghost" size="sm" onClick={() => setAdding(false)}><X size={14} /> Cancel</Button>
                  <Button size="sm" onClick={addNote} disabled={saving || !newContent.trim()}>
                    <Check size={14} /> Save
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {!tripId ? (
            <p className="text-sm text-[var(--text-tertiary)]">Select a trip to view notes.</p>
          ) : loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-32 bg-[var(--bg-muted)] rounded-[var(--radius-xl)] animate-pulse" />
            ))
          ) : displayNotes.length === 0 ? (
            <p className="text-sm text-[var(--text-tertiary)]">No notes yet. Add one above.</p>
          ) : displayNotes.map((n) => (
            <Card key={n.id} className="py-0">
              <CardHeader className="flex-row items-start justify-between space-y-0 p-4 sm:p-5 pb-3">
                <div>
                  {n.noteDate && (
                    <div className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider mb-1">
                      {fmtDate(n.noteDate)}
                    </div>
                  )}
                  {editingId === n.id
                    ? <Input value={editTitle} onChange={e => setEditTitle(e.target.value)} className="text-lg font-semibold h-8" placeholder="Title (optional)" />
                    : <CardTitle className="text-base sm:text-lg">{n.title || <span className="text-[var(--text-tertiary)] font-normal italic">Untitled</span>}</CardTitle>
                  }
                </div>
                <div className="flex gap-1 shrink-0">
                  {editingId === n.id ? (
                    <>
                      <Button variant="ghost" size="icon" onClick={() => saveEdit(n.id)}><Check size={14} /></Button>
                      <Button variant="ghost" size="icon" onClick={() => setEditingId(null)}><X size={14} /></Button>
                    </>
                  ) : (
                    <>
                      <Button variant="ghost" size="icon" onClick={() => startEdit(n)}><Edit size={14} /></Button>
                      <Button variant="ghost" size="icon" onClick={() => deleteNote(n.id)}><Trash2 size={14} /></Button>
                    </>
                  )}
                </div>
              </CardHeader>
              <CardContent className="px-4 sm:px-5 pb-4 sm:pb-5">
                {editingId === n.id
                  ? <Textarea value={editContent} onChange={e => setEditContent(e.target.value)} rows={3} />
                  : <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{n.content}</p>
                }
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
