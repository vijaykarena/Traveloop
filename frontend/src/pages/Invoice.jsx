import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Chrome from '../components/Chrome'
import Controls from '../components/Controls'
import { useNav } from '../navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Download } from 'lucide-react'
import api, { ENDPOINTS } from '../api'

const CAT_VARIANT = { MEAL: 'accent', MISC: 'secondary', OTHER: 'outline' }
const CAT_LABEL = { MEAL: 'Food', MISC: 'Misc', OTHER: 'Other' }

function fmtDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function Invoice() {
  const { id } = useParams()
  const { navigate } = useNav()

  const [trip, setTrip] = useState(null)
  const [expenses, setExpenses] = useState([])
  const [budget, setBudget] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) { setLoading(false); return }
    async function load() {
      try {
        const [tripRes, expRes, budgetRes] = await Promise.all([
          api.get(ENDPOINTS.TRIP_BY_ID(id)),
          api.get(ENDPOINTS.TRIP_EXPENSES(id)),
          api.get(ENDPOINTS.TRIP_BUDGET(id)).catch(() => ({ data: null })),
        ])
        setTrip(tripRes.data)
        setExpenses(expRes.data)
        setBudget(budgetRes.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  if (loading) return <div className="p-10 text-[var(--text-secondary)]">Loading invoice…</div>

  if (!id || !trip) {
    return (
      <div className="flex flex-col min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)] font-body">
        <Chrome active="My Trips" />
        <div className="p-10 text-center">
          <p className="text-[var(--text-tertiary)] mb-4">No trip selected.</p>
          <Button onClick={() => navigate('my-trips')}>Go to My Trips</Button>
        </div>
      </div>
    )
  }

  const total = budget?.total ?? expenses.reduce((a, e) => a + e.amount, 0)
  const invoiceNum = `TRV-${String(trip.id).padStart(5, '0')}`

  return (
    <div className="flex flex-col min-h-screen lg:h-screen bg-[var(--bg-page)] text-[var(--text-primary)] font-body lg:overflow-hidden">
      <Chrome active="My Trips" />
      <Controls q="Search invoice items…" />

      <div className="flex-1 lg:overflow-auto">
        <div className="px-4 sm:px-8 py-4">
          <Button variant="link" size="sm" className="px-0" onClick={() => navigate('my-trips')}>← Back to my trips</Button>
        </div>

        {/* ===== INVOICE HEADER ===== */}
        <div className="flex flex-col md:grid md:grid-cols-[1fr_280px] gap-4 sm:gap-6 px-4 sm:px-8 pb-6 border-b border-[var(--border-subtle)] items-start">
          <div>
            <Badge variant="secondary" className="mb-2">Invoice {invoiceNum}</Badge>
            <h1 className="font-display text-xl sm:text-2xl font-bold tracking-tight">{trip.title}</h1>
            <p className="text-[var(--text-secondary)] mt-1 text-sm">
              {new Date(trip.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              {' → '}
              {new Date(trip.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              {trip.destination && ` · ${trip.destination}`}
              {` · ${trip.stops?.length ?? 0} stops`}
            </p>
            <div className="flex flex-wrap gap-4 sm:gap-6 mt-4 items-center">
              <div>
                <div className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider">Generated</div>
                <div className="font-medium mt-0.5">{fmtDate(new Date().toISOString())}</div>
              </div>
              <Separator orientation="vertical" className="h-10 hidden sm:block" />
              <div>
                <div className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider">Currency</div>
                <div className="font-medium mt-0.5">INR · ₹</div>
              </div>
              <Separator orientation="vertical" className="h-10 hidden sm:block" />
              <div>
                <div className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider">Expenses</div>
                <div className="font-medium mt-0.5">{expenses.length} items</div>
              </div>
            </div>
          </div>

          {/* Budget card */}
          {budget && (
            <Card className="py-0 w-full">
              <CardHeader className="p-4 pb-2"><CardTitle className="text-sm">Budget Insights</CardTitle></CardHeader>
              <CardContent className="p-4 pt-2">
                <div className="flex items-center gap-4">
                  <svg viewBox="0 0 80 80" className="h-20 w-20 shrink-0">
                    <circle cx="40" cy="40" r="32" fill="none" stroke="var(--bg-muted)" strokeWidth="10" />
                    {budget.budgetLimit && (
                      <circle cx="40" cy="40" r="32" fill="none" stroke="var(--brand-primary)" strokeWidth="10"
                        strokeDasharray={`${Math.min(201, Math.round((budget.total / budget.budgetLimit) * 201))} 201`}
                        transform="rotate(-90 40 40)" strokeLinecap="round" />
                    )}
                  </svg>
                  <div>
                    {budget.budgetLimit && (
                      <>
                        <div className="text-xs text-[var(--text-tertiary)]">Total budget</div>
                        <div className="text-xl font-bold">₹{budget.budgetLimit.toLocaleString()}</div>
                      </>
                    )}
                    <div className="text-xs text-[var(--text-tertiary)] mt-1">
                      Spent · ₹{budget.total.toLocaleString()}
                      {budget.budgetLimit && ` (${Math.round((budget.total / budget.budgetLimit) * 100)}%)`}
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-3" onClick={() => navigate(`itinerary/${id}`)}>View itinerary</Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* ===== EXPENSES TABLE ===== */}
        <div className="p-4 sm:p-8">
          <Card className="py-0">

            {/* Desktop Table */}
            <div className="hidden sm:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Stop</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expenses.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-[var(--text-tertiary)] py-8">No expenses recorded for this trip.</TableCell>
                    </TableRow>
                  ) : (
                    expenses.map((e, i) => (
                      <TableRow key={e.id}>
                        <TableCell className="text-[var(--text-tertiary)] tabular-nums">{String(i + 1).padStart(2, '0')}</TableCell>
                        <TableCell><Badge variant={CAT_VARIANT[e.category] ?? 'outline'}>{CAT_LABEL[e.category] ?? e.category}</Badge></TableCell>
                        <TableCell className="font-medium">{e.description || '—'}</TableCell>
                        <TableCell className="text-[var(--text-tertiary)]">{fmtDate(e.expenseDate)}</TableCell>
                        <TableCell className="text-[var(--text-tertiary)]">{e.tripStop?.city?.name ?? '—'}</TableCell>
                        <TableCell className="text-right tabular-nums font-medium">₹{e.amount.toLocaleString()}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Card List */}
            <div className="sm:hidden divide-y divide-[var(--border-subtle)]">
              {expenses.length === 0 ? (
                <div className="p-6 text-center text-sm text-[var(--text-tertiary)]">No expenses recorded.</div>
              ) : (
                expenses.map((e, i) => (
                  <div key={e.id} className="flex items-start justify-between p-4 gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-[var(--text-tertiary)] font-mono">{String(i + 1).padStart(2, '0')}</span>
                        <Badge variant={CAT_VARIANT[e.category] ?? 'outline'}>{CAT_LABEL[e.category] ?? e.category}</Badge>
                      </div>
                      <div className="font-medium text-sm">{e.description || '—'}</div>
                      <div className="text-xs text-[var(--text-tertiary)] mt-0.5">{fmtDate(e.expenseDate)}</div>
                    </div>
                    <div className="font-bold text-base shrink-0">₹{e.amount.toLocaleString()}</div>
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* Totals */}
          {budget?.breakdown && (
            <div className="flex flex-col md:grid md:grid-cols-[1fr_300px] gap-4 mt-6">
              <div />
              <Card className="py-0">
                <CardContent className="p-5 space-y-2">
                  {Object.entries(budget.breakdown).map(([k, v]) => v > 0 && (
                    <div key={k} className="flex justify-between text-sm">
                      <span className="text-[var(--text-tertiary)] capitalize">{k}</span>
                      <span className="tabular-nums">₹{v.toLocaleString()}</span>
                    </div>
                  ))}
                  <Separator className="my-2" />
                  <div className="flex justify-between">
                    <span className="font-bold">Total spent</span>
                    <span className="text-xl font-bold tabular-nums">₹{budget.total.toLocaleString()}</span>
                  </div>
                  {budget.budgetLimit && (
                    <div className="flex justify-between text-sm">
                      <span className="text-[var(--text-tertiary)]">Budget limit</span>
                      <span className={`tabular-nums ${budget.overBudget ? 'text-red-500' : 'text-[var(--color-success)]'}`}>
                        ₹{budget.budgetLimit.toLocaleString()} {budget.overBudget ? '(over)' : '(ok)'}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 mt-6">
            <Button variant="outline"><Download size={14} /> Download invoice</Button>
            <Button variant="outline"><Download size={14} /> Export PDF</Button>
            <div className="flex-1" />
            <Button onClick={() => navigate(`itinerary/${id}`)}>Back to itinerary</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
