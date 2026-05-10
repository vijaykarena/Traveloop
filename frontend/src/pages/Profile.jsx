import { useState, useEffect } from 'react'
import Chrome from '../components/Chrome'
import Img from '../components/Img'
import SectionHeader from '../components/common/SectionHeader'
import { useNav } from '../navigation'
import { useUser } from '../context/UserContext'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Heart, Edit, ArrowRight, X, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

const API = 'http://localhost:4000'
const H = () => ({ Authorization: `Bearer ${localStorage.getItem('token')}` })

function fmtMemberSince(iso) {
  return new Date(iso).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })
}

export default function Profile() {
  const { navigate } = useNav()
  const { user, loading: userLoading, setUser } = useUser()

  const [trips, setTrips] = useState([])
  const [savedCities, setSavedCities] = useState([])
  const [dataLoading, setDataLoading] = useState(true)

  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({})
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState(null)

  useEffect(() => {
    async function load() {
      try {
        const [tripsRes, savedRes] = await Promise.all([
          fetch(`${API}/trips`, { headers: H() }),
          fetch(`${API}/users/me/saved-destinations`, { headers: H() }),
        ])
        if (tripsRes.ok) setTrips(await tripsRes.json())
        if (savedRes.ok) setSavedCities(await savedRes.json())
      } finally {
        setDataLoading(false)
      }
    }
    load()
  }, [])

  function startEdit() {
    setForm({
      firstName: user?.firstName ?? '',
      lastName: user?.lastName ?? '',
      phoneNo: user?.phoneNo ?? '',
      city: user?.city ?? '',
      bio: user?.bio ?? '',
      language: user?.language ?? 'en',
    })
    setSaveError(null)
    setEditing(true)
  }

  function cancelEdit() {
    setEditing(false)
    setSaveError(null)
  }

  async function saveEdit() {
    setSaving(true)
    setSaveError(null)
    try {
      const res = await fetch(`${API}/users/me`, {
        method: 'PUT',
        headers: { ...H(), 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          country: 'India',
          countryCode: 'IN',
        }),
      })
      if (!res.ok) {
        const err = await res.json()
        setSaveError(err.error ?? 'Failed to save')
        return
      }
      const updated = await res.json()
      setUser(updated)
      setEditing(false)
    } finally {
      setSaving(false)
    }
  }

  const now = new Date()
  const upcomingTrips = trips.filter(t => new Date(t.startDate) > now)
  const pastTrips = trips.filter(t => new Date(t.endDate) <= now)

  const initials = user ? `${user.firstName[0]}${user.lastName[0]}` : '?'
  const fullName = user ? `${user.firstName} ${user.lastName}` : '—'

  const accountRows = [
    ['Email', user?.email],
    ['Phone', user?.phoneNo],
    ['City', user?.city],
    ['Country', 'India'],
    ['Language', user?.language?.toUpperCase()],
    ['Currency', '₹ INR'],
  ].filter(([, v]) => v)

  return (
    <div className="flex flex-col min-h-screen lg:h-screen bg-[var(--bg-page)] text-[var(--text-primary)] font-body lg:overflow-hidden">
      <Chrome active="" />

      {/* ===== PROFILE HEADER ===== */}
      {/* Desktop: 3-col [avatar | info | buttons]   Mobile: stacked, centered */}
      <div className="px-4 sm:px-8 py-6 sm:py-8 border-b border-[var(--border-subtle)] shrink-0 bg-[var(--bg-surface)]">
        <div className="flex flex-col sm:grid sm:grid-cols-[120px_1fr_auto] sm:gap-6 sm:items-center gap-4 items-center sm:items-start text-center sm:text-left">
          <Avatar className="h-24 w-24 sm:h-28 sm:w-28 text-2xl">
            {user?.avatarUrl
              ? <img src={user.avatarUrl} alt={fullName} className="h-full w-full object-cover rounded-full" />
              : <AvatarFallback className="bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] text-2xl font-bold">{initials}</AvatarFallback>
            }
          </Avatar>
          <div>
            {userLoading
              ? <div className="h-8 w-48 bg-[var(--bg-muted)] rounded animate-pulse mb-2" />
              : editing
                ? (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input value={form.firstName} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))} placeholder="First name" className="max-w-[160px]" />
                      <Input value={form.lastName} onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))} placeholder="Last name" className="max-w-[160px]" />
                    </div>
                    <Textarea
                      value={form.bio}
                      onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                      placeholder="Short bio…"
                      rows={2}
                      className="max-w-xl resize-none"
                    />
                    {saveError && <p className="text-xs text-red-500">{saveError}</p>}
                  </div>
                )
                : (
                  <>
                    <Badge variant="secondary" className="mb-2">
                      {user ? `Member since ${fmtMemberSince(user.createdAt)} · ${trips.length} trips logged` : '—'}
                    </Badge>
                    <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">{fullName}</h1>
                    {user?.bio && <p className="text-[var(--text-secondary)] mt-1 max-w-xl text-sm sm:text-base">{user.bio}</p>}
                  </>
                )
            }
          </div>
          <div className="flex gap-2 sm:flex-col sm:items-stretch">
            {editing
              ? (
                <>
                  <Button variant="outline" onClick={cancelEdit} disabled={saving}><X size={14} /> Cancel</Button>
                  <Button onClick={saveEdit} disabled={saving}>
                    <Check size={14} /> {saving ? 'Saving…' : 'Save'}
                  </Button>
                </>
              )
              : <Button onClick={startEdit} disabled={userLoading}><Edit size={14} /> Edit profile</Button>
            }
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
              {userLoading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="p-4 border-b border-[var(--border-subtle)] last:border-0">
                      <div className="h-4 bg-[var(--bg-muted)] rounded animate-pulse" />
                    </div>
                  ))
                : editing
                  ? (
                    <div className="p-4 space-y-3">
                      <div>
                        <label className="text-xs text-[var(--text-tertiary)] mb-1 block">Phone</label>
                        <Input value={form.phoneNo} onChange={e => setForm(f => ({ ...f, phoneNo: e.target.value }))} placeholder="+91 98765 43210" />
                      </div>
                      <div>
                        <label className="text-xs text-[var(--text-tertiary)] mb-1 block">City</label>
                        <Input value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} placeholder="Mumbai" />
                      </div>
                      <div>
                        <label className="text-xs text-[var(--text-tertiary)] mb-1 block">Language</label>
                        <Input value={form.language} onChange={e => setForm(f => ({ ...f, language: e.target.value }))} placeholder="en" />
                      </div>
                      <div className={cn('flex justify-between pt-2 border-t border-[var(--border-subtle)]')}>
                        <span className="text-xs text-[var(--text-tertiary)]">Country</span>
                        <span className="text-xs font-medium">India</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs text-[var(--text-tertiary)]">Currency</span>
                        <span className="text-xs font-medium">₹ INR</span>
                      </div>
                    </div>
                  )
                  : accountRows.map(([k, v], i, a) => (
                      <div key={k} className={cn('flex justify-between p-4', i < a.length - 1 && 'border-b border-[var(--border-subtle)]')}>
                        <span className="text-sm text-[var(--text-tertiary)]">{k}</span>
                        <span className="text-sm font-medium">{v}</span>
                      </div>
                    ))
              }
            </CardContent>
          </Card>

          <SectionHeader title="Saved destinations" className="mt-6" />
          <div className="flex flex-wrap gap-2">
            {dataLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-6 w-20 bg-[var(--bg-muted)] rounded-full animate-pulse" />
                ))
              : savedCities.length === 0
                ? <p className="text-sm text-[var(--text-tertiary)]">No saved destinations yet.</p>
                : savedCities.map(c => (
                    <Badge key={c.id} variant="outline"><Heart size={11} className="mr-1" />{c.name}</Badge>
                  ))}
          </div>
        </div>

        {/* RIGHT — Trip cards */}
        <div>
          <SectionHeader
            title="Upcoming trips"
            trailing={<Badge variant="secondary">{upcomingTrips.length} ahead</Badge>}
          />
          {dataLoading
            ? <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-48 bg-[var(--bg-muted)] rounded-[var(--radius-xl)] animate-pulse" />)}</div>
            : upcomingTrips.length === 0
              ? <p className="text-sm text-[var(--text-tertiary)] mb-6">No upcoming trips yet.</p>
              : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {upcomingTrips.map(t => (
                    <Card key={t.id} className="py-0">
                      <Img ratio="4/3" className="rounded-t-[var(--radius-xl)] rounded-b-none border-0 border-b" />
                      <CardHeader className="p-4">
                        <CardTitle className="text-base">{t.title}</CardTitle>
                        <CardDescription>
                          {new Date(t.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                          {t.destination ? ` · ${t.destination}` : ''}
                        </CardDescription>
                      </CardHeader>
                      <CardFooter className="p-4 pt-0">
                        <Button variant="outline" size="sm" className="w-full" onClick={() => navigate('itinerary')}>View <ArrowRight size={14} /></Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}

          <SectionHeader title="Past trips" className="mt-6 sm:mt-8" />
          {dataLoading
            ? <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-40 bg-[var(--bg-muted)] rounded-[var(--radius-xl)] animate-pulse" />)}</div>
            : pastTrips.length === 0
              ? <p className="text-sm text-[var(--text-tertiary)]">No past trips yet.</p>
              : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {pastTrips.slice(0, 6).map(t => (
                    <Card key={t.id} className="py-0">
                      <Img ratio="4/3" className="rounded-t-[var(--radius-xl)] rounded-b-none border-0 border-b" />
                      <CardHeader className="p-4">
                        <CardTitle className="text-base">{t.title}</CardTitle>
                        <CardDescription>
                          {new Date(t.startDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                          {t.destination ? ` · ${t.destination}` : ''}
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              )}
        </div>
      </div>
    </div>
  )
}
