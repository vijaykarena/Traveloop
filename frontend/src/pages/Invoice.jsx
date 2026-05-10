import Chrome from '../components/Chrome'
import Controls from '../components/Controls'
import Img from '../components/Img'
import { useNav } from '../navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Download, Filter } from 'lucide-react'

const rows = [
  [1, 'Stay', 'Hotel booking · Rome (Trastevere)', '3 nights', 300, 900],
  [2, 'Travel', 'Flight · Lisbon → Rome', '2 pax', 240, 480],
  [3, 'Travel', 'Train · Rome → Naples', '2 pax', 22, 44],
  [4, 'Activities', 'Vatican private tour', '2 pax', 96, 192],
  [5, 'Food', 'Cooking class · Sorrento', '2 pax', 85, 170],
  [6, 'Stay', 'Apartment · Sorrento', '4 nights', 145, 580],
  [7, 'Travel', 'Ferry · Sorrento → Capri (rt)', '2 pax', 28, 56],
]

const catVariant = { Stay: 'secondary', Travel: 'info', Activities: 'success', Food: 'accent' }

export default function Invoice() {
  const { navigate } = useNav()
  return (
    <div className="flex flex-col h-screen bg-background text-foreground font-sans overflow-hidden">
      <Chrome active="My Trips" />
      <Controls q="Search invoice items…" extra={
        <>
          <Button variant="outline" size="sm"><Filter size={14} /> Filter</Button>
          <Button variant="outline" size="sm">Sort</Button>
        </>
      } />
      <div className="flex-1 overflow-auto">
        <div className="px-8 py-4">
          <Button variant="link" size="sm" className="px-0" onClick={() => navigate('my-trips')}>← Back to my trips</Button>
        </div>
        <div className="grid grid-cols-[120px_1.4fr_1fr] gap-6 px-8 pb-6 border-b items-start">
          <Img ratio="1/1" label="trip" />
          <div>
            <Badge variant="secondary" className="mb-2">Invoice TRV-30540</Badge>
            <h1 className="text-2xl font-semibold tracking-tight">Trip to Europe Adventure</h1>
            <p className="text-muted-foreground mt-1">Amelia Stone · 18 May → 02 Jun 2026 · 6 stops</p>
            <div className="flex gap-6 mt-4 items-center">
              <div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider">Generated</div>
                <div className="font-medium mt-0.5">10 May 2026</div>
              </div>
              <Separator orientation="vertical" className="h-10" />
              <div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider">Currency</div>
                <div className="font-medium mt-0.5">EUR · €</div>
              </div>
              <Separator orientation="vertical" className="h-10" />
              <div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider">Status</div>
                <Badge variant="warning" className="mt-0.5">Pending · 4 of 7</Badge>
              </div>
            </div>
          </div>
          <Card className="rounded-xl border shadow-sm py-0">
            <CardHeader className="p-4 pb-2"><CardTitle className="text-sm">Budget Insights</CardTitle></CardHeader>
            <CardContent className="p-4 pt-2">
              <div className="flex items-center gap-4">
                <svg viewBox="0 0 80 80" className="h-20 w-20 shrink-0">
                  <circle cx="40" cy="40" r="32" fill="none" stroke="hsl(var(--secondary))" strokeWidth="10" />
                  <circle cx="40" cy="40" r="32" fill="none" stroke="hsl(var(--primary))" strokeWidth="10"
                    strokeDasharray="151 200" transform="rotate(-90 40 40)" strokeLinecap="round" />
                </svg>
                <div>
                  <div className="text-xs text-muted-foreground">Total budget</div>
                  <div className="text-xl font-semibold">€3,200</div>
                  <div className="text-xs text-muted-foreground mt-1">Spent · €2,422 (75%)</div>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full mt-3" onClick={() => navigate('itinerary')}>View full budget</Button>
            </CardContent>
          </Card>
        </div>
        <div className="p-8">
          <Card className="rounded-xl border shadow-sm py-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Qty / Details</TableHead>
                  <TableHead className="text-right">Unit</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map(r => (
                  <TableRow key={r[0]}>
                    <TableCell className="text-muted-foreground tabular-nums">{String(r[0]).padStart(2, '0')}</TableCell>
                    <TableCell><Badge variant={catVariant[r[1]]}>{r[1]}</Badge></TableCell>
                    <TableCell className="font-medium">{r[2]}</TableCell>
                    <TableCell className="text-muted-foreground">{r[3]}</TableCell>
                    <TableCell className="text-right tabular-nums">€{r[4]}</TableCell>
                    <TableCell className="text-right tabular-nums font-medium">€{r[5].toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
          <div className="grid grid-cols-[1fr_300px] mt-6">
            <div />
            <Card className="rounded-xl border shadow-sm py-0">
              <CardContent className="p-5 space-y-2">
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Subtotal</span><span className="tabular-nums">€2,422</span></div>
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">VAT (10%)</span><span className="tabular-nums">€242</span></div>
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Discount</span><span className="tabular-nums text-emerald-600">−€50</span></div>
                <Separator className="my-2" />
                <div className="flex justify-between">
                  <span className="font-semibold">Grand total</span>
                  <span className="text-xl font-semibold tabular-nums">€2,614</span>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="flex gap-2 mt-6">
            <Button variant="outline"><Download size={14} /> Download invoice</Button>
            <Button variant="outline"><Download size={14} /> Export PDF</Button>
            <div className="flex-1" />
            <Button>Mark as paid</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
