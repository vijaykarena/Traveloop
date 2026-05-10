import Chrome from '../components/Chrome'
import Controls from '../components/Controls'
import TabsSwitcher from '../components/TabsSwitcher'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { TrendingUp, PlaneTakeoff, Receipt, Users, MoreHorizontal, ArrowRight, Download } from 'lucide-react'
import { useState } from 'react'

const statCards = [
  ['Active members', '12,486', '+6.2%', TrendingUp, 'success'],
  ['Trips created', '34,120', '+11.8%', PlaneTakeoff, 'success'],
  ['Avg. trip budget', '€1,820', '−3.4%', Receipt, 'warning'],
  ['Community posts', '1,420', '+14.1%', Users, 'success'],
]

const topCities = [['Rome, IT', 1840], ['Tokyo, JP', 1620], ['Lisbon, PT', 1280], ['Reykjavík, IS', 940], ['Marrakesh, MA', 720]]

const users = [
  ['001', 'Amelia Stone', 'Mar 2024', 11, '2 min ago', 'Active'],
  ['002', 'Marco Pirelli', 'Jul 2024', 6, '1h ago', 'Active'],
  ['003', 'Iris Khan', 'Nov 2025', 2, '3d ago', 'Idle'],
  ['004', 'Diego Reyes', 'Jan 2026', 1, '6d ago', 'Idle'],
]

export default function Admin() {
  const [tab, setTab] = useState('Popular cities')
  const [chartTab, setChartTab] = useState('Weekly')
  return (
    <div className="flex flex-col h-screen bg-[var(--bg-page)] text-[var(--text-primary)] font-body overflow-hidden">
      <Chrome active="" />
      <Controls q="Search users, trips, cities…" extra={<Button variant="outline" size="sm"><Download size={14} /> Export</Button>} />
      <div className="flex items-end justify-between px-8 py-6 border-b border-[var(--border-subtle)] shrink-0 bg-[var(--bg-surface)]">
        <div>
          <Badge variant="secondary" className="mb-2">Admin · May 2026</Badge>
          <h1 className="font-display text-3xl font-bold tracking-tight">Analytics overview</h1>
          <p className="text-[var(--text-secondary)] mt-1">Platform health, user trends, and popular destinations.</p>
        </div>
        <TabsSwitcher tabs={['Manage users', 'Popular cities', 'Activities', 'Trends']} active={tab} onChange={setTab} />
      </div>
      <div className="flex-1 overflow-auto">
        <div className="grid grid-cols-4 gap-4 p-8 pb-4">
          {statCards.map(([k, v, d, Icon, vt]) => (
            <Card key={k} className="py-0">
              <CardHeader className="flex-row items-center justify-between space-y-0 p-4 pb-2">
                <CardDescription>{k}</CardDescription>
                <Icon size={16} className="text-[var(--text-tertiary)]" />
              </CardHeader>
              <CardContent className="p-4 pt-2">
                <div className="text-2xl font-bold">{v}</div>
                <Badge variant={vt} className="mt-2">{d}</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-[1.6fr_1fr] gap-4 px-8 pb-4">
          <Card className="py-0">
            <CardHeader className="p-4 pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Trips created · last 12 weeks</CardTitle>
                <TabsSwitcher tabs={['Weekly', 'Monthly']} active={chartTab} onChange={setChartTab} className="h-8 text-xs" />
              </div>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <svg viewBox="0 0 600 200" className="w-full h-48">
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
            <CardHeader className="p-4 pb-2"><CardTitle className="text-base">Top cities</CardTitle></CardHeader>
            <CardContent className="px-4 pb-4 space-y-3">
              {topCities.map(([n, v]) => (
                <div key={n}>
                  <div className="flex justify-between text-sm mb-1"><span>{n}</span><span className="font-medium tabular-nums">{v.toLocaleString()}</span></div>
                  <div className="h-1.5 rounded-full bg-[var(--bg-muted)] overflow-hidden">
                    <div className="h-full bg-[var(--brand-primary)]" style={{ width: `${v / 20}%` }} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
        <div className="px-8 pb-8">
          <Card className="py-0">
            <CardHeader className="flex-row items-center justify-between space-y-0 p-4 pb-2">
              <CardTitle className="text-base">Recent users</CardTitle>
              <Button variant="link" size="sm">Manage all <ArrowRight size={14} /></Button>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Trips</TableHead>
                    <TableHead>Last seen</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map(r => (
                    <TableRow key={r[0]}>
                      <TableCell className="text-[var(--text-tertiary)] tabular-nums">{r[0]}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-7 w-7">
                            <AvatarFallback className="bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] text-xs font-bold">
                              {r[1].split(' ').map(s => s[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{r[1]}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-[var(--text-tertiary)]">{r[2]}</TableCell>
                      <TableCell className="tabular-nums">{r[3]}</TableCell>
                      <TableCell className="text-[var(--text-tertiary)]">{r[4]}</TableCell>
                      <TableCell><Badge variant={r[5] === 'Active' ? 'success' : 'outline'}>{r[5]}</Badge></TableCell>
                      <TableCell><Button variant="ghost" size="icon"><MoreHorizontal size={16} /></Button></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
