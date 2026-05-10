import { useState, useEffect } from 'react'
import Chrome from '../components/Chrome'
import Controls from '../components/Controls'
import TabsSwitcher from '../components/TabsSwitcher'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { TrendingUp, PlaneTakeoff, Receipt, Globe, MoreHorizontal, ArrowRight, Download } from 'lucide-react'

const API = 'http://localhost:4000'

function authHeaders() {
  return { Authorization: `Bearer ${localStorage.getItem('token')}` }
}

function fmtDate(iso) {
  return new Date(iso).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })
}

export default function Admin() {
  const [tab, setTab] = useState('Popular cities')
  const [chartTab, setChartTab] = useState('Weekly')
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${API}/admin/stats`, { headers: authHeaders() })
        if (!res.ok) throw new Error('Failed to load stats')
        setStats(await res.json())
      } catch (e) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const statCards = stats ? [
    ['Members', stats.totalUsers.toLocaleString(), TrendingUp],
    ['Trips created', stats.totalTrips.toLocaleString(), PlaneTakeoff],
    ['Avg. trip budget', stats.avgBudget ? `₹${Math.round(stats.avgBudget).toLocaleString()}` : '—', Receipt],
    ['Public trips', stats.publicTrips.toLocaleString(), Globe],
  ] : []

  const topCities = stats?.topCities ?? []
  const maxStops = topCities[0]?._count?.tripStops ?? 1
  const recentUsers = stats?.recentUsers ?? []

  return (
    <div className="flex flex-col min-h-screen lg:h-screen bg-[var(--bg-page)] text-[var(--text-primary)] font-body lg:overflow-hidden">
      <Chrome active="" />
      <Controls q="Search users, trips, cities…" extra={<Button variant="outline" size="sm"><Download size={14} /> Export</Button>} />

      {/* Page Header — stacks on mobile */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-3 px-4 sm:px-8 py-4 sm:py-6 border-b border-[var(--border-subtle)] shrink-0 bg-[var(--bg-surface)]">
        <div>
          <Badge variant="secondary" className="mb-2">Admin</Badge>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">Analytics overview</h1>
          <p className="text-[var(--text-secondary)] mt-1">Platform health, user trends, and popular destinations.</p>
        </div>
        <TabsSwitcher tabs={['Manage users', 'Popular cities', 'Activities', 'Trends']} active={tab} onChange={setTab} />
      </div>

      {error && (
        <div className="px-4 sm:px-8 py-4 text-sm text-red-500">{error}</div>
      )}

      <div className="flex-1 lg:overflow-auto">
        {/* Stat cards: 1-col mobile → 2-col sm → 4-col lg */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 sm:p-8 pb-4">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <Card key={i} className="py-0 animate-pulse">
                  <CardContent className="p-4 h-24" />
                </Card>
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

        {/* Chart + Cities: stacked on mobile, 2-col on lg+ */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-4 px-4 sm:px-8 pb-4">
          {/* Static chart */}
          <Card className="py-0">
            <CardHeader className="p-4 pb-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <CardTitle className="text-base">Trips created · last 12 weeks</CardTitle>
                <TabsSwitcher tabs={['Weekly', 'Monthly']} active={chartTab} onChange={setChartTab} className="h-8 text-xs" />
              </div>
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

          {/* Top cities */}
          <Card className="py-0">
            <CardHeader className="p-4 pb-2"><CardTitle className="text-base">Top cities</CardTitle></CardHeader>
            <CardContent className="px-4 pb-4 space-y-3">
              {loading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-6 bg-[var(--bg-muted)] rounded animate-pulse" />
                  ))
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

        {/* ===== USERS SECTION ===== */}
        <div className="px-4 sm:px-8 pb-8">
          <Card className="py-0">
            <CardHeader className="flex-row items-center justify-between space-y-0 p-4 pb-2">
              <CardTitle className="text-base">Recent users</CardTitle>
              <Button variant="link" size="sm">Manage all <ArrowRight size={14} /></Button>
            </CardHeader>
            <CardContent className="p-0">

              {/* Desktop Table — hidden on mobile */}
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>#</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Trips</TableHead>
                      <TableHead />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading
                      ? Array.from({ length: 5 }).map((_, i) => (
                          <TableRow key={i}>
                            {Array.from({ length: 4 }).map((__, j) => (
                              <TableCell key={j}><div className="h-4 bg-[var(--bg-muted)] rounded animate-pulse" /></TableCell>
                            ))}
                            <TableCell />
                          </TableRow>
                        ))
                      : recentUsers.map(u => (
                          <TableRow key={u.id}>
                            <TableCell className="text-[var(--text-tertiary)] tabular-nums">{u.id}</TableCell>
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
                            <TableCell><Button variant="ghost" size="icon"><MoreHorizontal size={16} /></Button></TableCell>
                          </TableRow>
                        ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Card List — hidden on md+ */}
              <div className="md:hidden divide-y divide-[var(--border-subtle)]">
                {loading
                  ? Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="flex items-center gap-3 p-4 animate-pulse">
                        <div className="h-10 w-10 rounded-full bg-[var(--bg-muted)]" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-[var(--bg-muted)] rounded w-2/3" />
                          <div className="h-3 bg-[var(--bg-muted)] rounded w-1/2" />
                        </div>
                      </div>
                    ))
                  : recentUsers.map(u => (
                      <div key={u.id} className="flex items-center gap-3 p-4">
                        <Avatar className="h-10 w-10 shrink-0">
                          <AvatarFallback className="bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] text-sm font-bold">
                            {u.firstName[0]}{u.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm truncate">{u.firstName} {u.lastName}</div>
                          <div className="text-xs text-[var(--text-tertiary)] mt-0.5">
                            Joined {fmtDate(u.createdAt)} · {u._count.trips} trips
                          </div>
                          <div className="text-xs text-[var(--text-tertiary)] truncate">{u.email}</div>
                        </div>
                        <Button variant="ghost" size="icon"><MoreHorizontal size={16} /></Button>
                      </div>
                    ))}
              </div>

            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
