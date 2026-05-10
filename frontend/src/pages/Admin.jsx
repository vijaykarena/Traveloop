import { useState, useEffect } from 'react'
import Chrome from '../components/Chrome'
import TabsSwitcher from '../components/TabsSwitcher'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { TrendingUp, PlaneTakeoff, Receipt, Globe, Trash2, ShieldCheck, ShieldOff, X } from 'lucide-react'
import api from '../api'

const ADMIN = '/admin'

function fmtDate(iso) {
  return new Date(iso).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })
}

export default function Admin() {
  const [tab, setTab] = useState('Popular cities')
  const [stats, setStats] = useState(null)
  const [statsLoading, setStatsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Users tab state
  const [users, setUsers] = useState([])
  const [usersLoading, setUsersLoading] = useState(false)
  const [userSearch, setUserSearch] = useState('')
  const [userSearchDebounced, setUserSearchDebounced] = useState('')
  const [roleUpdating, setRoleUpdating] = useState(null)
  const [deleting, setDeleting] = useState(null)

  // Cities tab state
  const [adminCities, setAdminCities] = useState([])
  const [citiesLoading, setCitiesLoading] = useState(false)
  const [deletingCity, setDeletingCity] = useState(null)

  // Debounce user search input
  useEffect(() => {
    const t = setTimeout(() => setUserSearchDebounced(userSearch), 400)
    return () => clearTimeout(t)
  }, [userSearch])

  useEffect(() => {
    api.get(`${ADMIN}/stats`)
      .then(r => setStats(r.data))
      .catch(e => setError(e.response?.data?.error || e.message || 'Failed to load stats'))
      .finally(() => setStatsLoading(false))
  }, [])

  useEffect(() => {
    if (tab !== 'Manage users') return
    let active = true
    setUsersLoading(true)
    const params = userSearchDebounced ? `?search=${encodeURIComponent(userSearchDebounced)}` : ''
    api.get(`${ADMIN}/users${params}`)
      .then(r => { if (active) setUsers(r.data.users || []) })
      .catch(e => { if (active) setError(e.response?.data?.error || e.message) })
      .finally(() => { if (active) setUsersLoading(false) })
    return () => { active = false }
  }, [tab, userSearchDebounced])

  useEffect(() => {
    if (tab !== 'Popular cities') return
    let active = true
    setCitiesLoading(true)
    api.get(`${ADMIN}/cities`)
      .then(r => { if (active) setAdminCities(r.data || []) })
      .catch(e => { if (active) setError(e.response?.data?.error || e.message) })
      .finally(() => { if (active) setCitiesLoading(false) })
    return () => { active = false }
  }, [tab])

  const toggleRole = async (user) => {
    setRoleUpdating(user.id)
    try {
      const newRole = user.role === 'ADMIN' ? 'USER' : 'ADMIN'
      const r = await api.put(`${ADMIN}/users/${user.id}/role`, { role: newRole })
      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, role: r.data.role } : u))
    } catch (e) {
      console.error(e)
    } finally {
      setRoleUpdating(null)
    }
  }

  const deleteUser = async (userId) => {
    if (!confirm('Delete this user and all their data?')) return
    setDeleting(userId)
    try {
      await api.delete(`${ADMIN}/users/${userId}`)
      setUsers(prev => prev.filter(u => u.id !== userId))
    } catch (e) {
      console.error(e)
    } finally {
      setDeleting(null)
    }
  }

  const deleteCity = async (cityId) => {
    if (!confirm('Delete this city? This will remove it from all trips.')) return
    setDeletingCity(cityId)
    try {
      await api.delete(`${ADMIN}/cities/${cityId}`)
      setAdminCities(prev => prev.filter(c => c.id !== cityId))
    } catch (e) {
      console.error(e)
    } finally {
      setDeletingCity(null)
    }
  }

  const statCards = stats ? [
    ['Members', stats.totalUsers.toLocaleString(), TrendingUp],
    ['Trips created', stats.totalTrips.toLocaleString(), PlaneTakeoff],
    ['Avg. trip budget', stats.avgBudget ? `₹${Math.round(stats.avgBudget).toLocaleString()}` : '—', Receipt],
    ['Public trips', stats.publicTrips.toLocaleString(), Globe],
  ] : []

  const topCities = stats?.topCities ?? []
  const maxStops = topCities[0]?._count?.tripStops ?? 1
  const topActivities = stats?.topActivities ?? []
  const maxActs = topActivities[0]?._count?.tripActivities ?? 1

  return (
    <div className="flex flex-col min-h-screen lg:h-screen bg-[var(--bg-page)] text-[var(--text-primary)] font-body lg:overflow-hidden">
      <Chrome active="" />

      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-3 px-4 sm:px-8 py-4 sm:py-6 border-b border-[var(--border-subtle)] shrink-0 bg-[var(--bg-surface)]">
        <div>
          <Badge variant="secondary" className="mb-2">Admin</Badge>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">Analytics overview</h1>
          <p className="text-[var(--text-secondary)] mt-1">Platform health, user trends, and popular destinations.</p>
        </div>
        <TabsSwitcher tabs={['Manage users', 'Popular cities', 'Activities', 'Trends']} active={tab} onChange={setTab} />
      </div>

      {error && (
        <div className="px-4 sm:px-8 py-3 bg-red-50 dark:bg-red-950/20 border-b border-red-200 dark:border-red-800 flex items-center justify-between gap-4">
          <span className="text-sm text-red-700 dark:text-red-300">{error}</span>
          <Button variant="ghost" size="sm" className="text-red-500 shrink-0" onClick={() => setError(null)}>
            <X size={14} />
          </Button>
        </div>
      )}

      <div className="flex-1 lg:overflow-auto">
        {/* Stat cards — always visible */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 sm:p-8 pb-4">
          {statsLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <Card key={i} className="py-0 animate-pulse"><CardContent className="p-4 h-24" /></Card>
              ))
            : statCards.map(([k, v, Icon]) => (
                <Card key={k} className="py-0">
                  <CardHeader className="flex-row items-center justify-between space-y-0 p-4 pb-2">
                    <CardDescription>{k}</CardDescription>
                    <Icon size={16} className="text-[var(--text-tertiary)]" />
                  </CardHeader>
                  <CardContent className="p-4 pt-2">
                    <div className="text-2xl font-bold">{v}</div>
                  </CardContent>
                </Card>
              ))}
        </div>

        {/* ── Manage Users ── */}
        {tab === 'Manage users' && (
          <div className="px-4 sm:px-8 pb-8 space-y-4">
            <div className="flex items-center gap-3">
              <Input
                placeholder="Search by name or email…"
                value={userSearch}
                onChange={e => setUserSearch(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <Card className="py-0">
              {/* Desktop */}
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Trips</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {usersLoading
                      ? Array.from({ length: 5 }).map((_, i) => (
                          <TableRow key={i}>
                            {Array.from({ length: 5 }).map((__, j) => (
                              <TableCell key={j}><div className="h-4 bg-[var(--bg-muted)] rounded animate-pulse" /></TableCell>
                            ))}
                          </TableRow>
                        ))
                      : users.length === 0
                        ? <TableRow><TableCell colSpan={5} className="text-center text-[var(--text-tertiary)] py-8">No users found.</TableCell></TableRow>
                        : users.map(u => (
                            <TableRow key={u.id}>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-7 w-7">
                                    <AvatarFallback className="bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] text-xs font-bold">
                                      {u.firstName[0]}{u.lastName[0]}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="font-medium">{u.firstName} {u.lastName}</div>
                                    <div className="text-xs text-[var(--text-tertiary)]">{u.email}</div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="text-[var(--text-tertiary)]">{fmtDate(u.createdAt)}</TableCell>
                              <TableCell className="tabular-nums">{u._count.trips}</TableCell>
                              <TableCell>
                                <Badge variant={u.role === 'ADMIN' ? 'accent' : 'secondary'}>{u.role}</Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1 justify-end">
                                  <Button
                                    variant="ghost" size="sm"
                                    disabled={roleUpdating === u.id}
                                    onClick={() => toggleRole(u)}
                                    title={u.role === 'ADMIN' ? 'Demote to user' : 'Promote to admin'}
                                  >
                                    {u.role === 'ADMIN'
                                      ? <ShieldOff size={14} className="text-[var(--text-tertiary)]" />
                                      : <ShieldCheck size={14} className="text-[var(--brand-primary)]" />}
                                  </Button>
                                  <Button
                                    variant="ghost" size="sm"
                                    disabled={deleting === u.id}
                                    onClick={() => deleteUser(u.id)}
                                    className="text-red-500 hover:text-red-600"
                                  >
                                    <Trash2 size={14} />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile */}
              <div className="md:hidden divide-y divide-[var(--border-subtle)]">
                {usersLoading
                  ? Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="flex items-center gap-3 p-4 animate-pulse">
                        <div className="h-10 w-10 rounded-full bg-[var(--bg-muted)]" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-[var(--bg-muted)] rounded w-2/3" />
                          <div className="h-3 bg-[var(--bg-muted)] rounded w-1/2" />
                        </div>
                      </div>
                    ))
                  : users.map(u => (
                      <div key={u.id} className="flex items-center gap-3 p-4">
                        <Avatar className="h-10 w-10 shrink-0">
                          <AvatarFallback className="bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] text-sm font-bold">
                            {u.firstName[0]}{u.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <div className="font-medium text-sm truncate">{u.firstName} {u.lastName}</div>
                            <Badge variant={u.role === 'ADMIN' ? 'accent' : 'secondary'} className="text-xs">{u.role}</Badge>
                          </div>
                          <div className="text-xs text-[var(--text-tertiary)] mt-0.5 truncate">{u.email}</div>
                          <div className="text-xs text-[var(--text-tertiary)]">{u._count.trips} trips · joined {fmtDate(u.createdAt)}</div>
                        </div>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" disabled={roleUpdating === u.id} onClick={() => toggleRole(u)}>
                            {u.role === 'ADMIN' ? <ShieldOff size={14} /> : <ShieldCheck size={14} />}
                          </Button>
                          <Button variant="ghost" size="sm" disabled={deleting === u.id} onClick={() => deleteUser(u.id)} className="text-red-500">
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </div>
                    ))}
              </div>
            </Card>
          </div>
        )}

        {/* ── Popular Cities ── */}
        {tab === 'Popular cities' && (
          <div className="px-4 sm:px-8 pb-8">
            <Card className="py-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>City</TableHead>
                    <TableHead>Activities</TableHead>
                    <TableHead>Trip stops</TableHead>
                    <TableHead />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {citiesLoading
                    ? Array.from({ length: 6 }).map((_, i) => (
                        <TableRow key={i}>{Array.from({ length: 4 }).map((__, j) => <TableCell key={j}><div className="h-4 bg-[var(--bg-muted)] rounded animate-pulse" /></TableCell>)}</TableRow>
                      ))
                    : adminCities.length === 0
                      ? <TableRow><TableCell colSpan={4} className="text-center text-[var(--text-tertiary)] py-8">No cities.</TableCell></TableRow>
                      : adminCities.map(c => (
                          <TableRow key={c.id}>
                            <TableCell className="font-medium">{c.name}</TableCell>
                            <TableCell className="tabular-nums">{c._count?.activities ?? 0}</TableCell>
                            <TableCell className="tabular-nums">{c._count?.tripStops ?? 0}</TableCell>
                            <TableCell>
                              <Button
                                variant="ghost" size="sm"
                                disabled={deletingCity === c.id}
                                onClick={() => deleteCity(c.id)}
                                className="text-red-500 hover:text-red-600"
                              >
                                <Trash2 size={14} />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                </TableBody>
              </Table>
            </Card>
          </div>
        )}

        {/* ── Top Activities ── */}
        {tab === 'Activities' && (
          <div className="px-4 sm:px-8 pb-8">
            <Card className="py-0">
              <CardHeader className="p-4 pb-2"><CardTitle className="text-base">Most used activities</CardTitle></CardHeader>
              <CardContent className="px-4 pb-4 space-y-3">
                {statsLoading
                  ? Array.from({ length: 8 }).map((_, i) => <div key={i} className="h-6 bg-[var(--bg-muted)] rounded animate-pulse" />)
                  : topActivities.length === 0
                    ? <p className="text-sm text-[var(--text-tertiary)]">No activity usage data yet.</p>
                    : topActivities.map(a => (
                        <div key={a.id}>
                          <div className="flex justify-between text-sm mb-1">
                            <span>{a.name}</span>
                            <span className="font-medium tabular-nums">{a._count.tripActivities} uses</span>
                          </div>
                          <div className="h-1.5 rounded-full bg-[var(--bg-muted)] overflow-hidden">
                            <div className="h-full bg-[var(--brand-primary)]" style={{ width: `${(a._count.tripActivities / maxActs) * 100}%` }} />
                          </div>
                        </div>
                      ))}
              </CardContent>
            </Card>
          </div>
        )}

        {/* ── Trends chart ── */}
        {tab === 'Trends' && (
          <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-4 px-4 sm:px-8 pb-8">
            <Card className="py-0">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-base">Trips created · last 12 weeks</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <svg viewBox="0 0 600 200" className="w-full h-40 sm:h-48">
                  {[40, 80, 120, 160].map(y => <line key={y} x1="0" x2="600" y1={y} y2={y} stroke="var(--border-subtle)" />)}
                  <polyline fill="none" stroke="var(--brand-primary)" strokeWidth="2"
                    points="0,150 50,140 100,120 150,130 200,90 250,100 300,70 350,80 400,55 450,40 500,55 550,30 600,40" />
                  {[[0,150],[50,140],[100,120],[150,130],[200,90],[250,100],[300,70],[350,80],[400,55],[450,40],[500,55],[550,30],[600,40]].map(([x,y],i) => (
                    <circle key={i} cx={x} cy={y} r="3.5" fill="var(--brand-primary)" />
                  ))}
                </svg>
                <div className="flex justify-between text-xs text-[var(--text-tertiary)] mt-1">
                  <span>W 09</span><span>W 12</span><span>W 15</span><span>W 18</span><span>W 21</span>
                </div>
              </CardContent>
            </Card>

            <Card className="py-0">
              <CardHeader className="p-4 pb-2"><CardTitle className="text-base">Top cities by usage</CardTitle></CardHeader>
              <CardContent className="px-4 pb-4 space-y-3">
                {statsLoading
                  ? Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-6 bg-[var(--bg-muted)] rounded animate-pulse" />)
                  : topCities.length === 0
                    ? <p className="text-sm text-[var(--text-tertiary)]">No data yet.</p>
                    : topCities.map(c => (
                        <div key={c.id}>
                          <div className="flex justify-between text-sm mb-1">
                            <span>{c.name}</span>
                            <span className="font-medium tabular-nums">{c._count.tripStops.toLocaleString()}</span>
                          </div>
                          <div className="h-1.5 rounded-full bg-[var(--bg-muted)] overflow-hidden">
                            <div className="h-full bg-[var(--brand-primary)]" style={{ width: `${(c._count.tripStops / maxStops) * 100}%` }} />
                          </div>
                        </div>
                      ))}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
