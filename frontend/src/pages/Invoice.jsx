import Chrome from '../components/Chrome'
import Controls from '../components/Controls'
import Img from '../components/Img'
import { useNav } from '../navigation'

const rows = [
  [1, 'Stay', 'Hotel booking · Rome (Trastevere)', '3 nights', 300, 900],
  [2, 'Travel', 'Flight · Lisbon → Rome', '2 pax', 240, 480],
  [3, 'Travel', 'Train · Rome → Naples', '2 pax', 22, 44],
  [4, 'Activities', 'Vatican private tour', '2 pax', 96, 192],
  [5, 'Food', 'Cooking class · Sorrento', '2 pax', 85, 170],
  [6, 'Stay', 'Apartment · Sorrento', '4 nights', 145, 580],
  [7, 'Travel', 'Ferry · Sorrento → Capri (rt)', '2 pax', 28, 56]
]

export default function Invoice() {
  const { navigate } = useNav()
  return (
    <div className="tl-screen">
      <Chrome active="My Trips" />
      <Controls q="Search invoice items…" extra={<><button className="tl-pill">Filter</button><button className="tl-pill">Sort</button></>} />
      <div style={{ padding: '20px 36px 0' }}>
        <a className="tl-eyebrow" style={{ color: 'var(--ink-3)', cursor: 'pointer' }} onClick={() => navigate('my-trips')}>← Back to my trips</a>
      </div>
      <div style={{ padding: '12px 36px 16px', display: 'grid', gridTemplateColumns: '120px 1.4fr 1fr', gap: 28, alignItems: 'start' }}>
        <Img ratio="1 / 1" label="trip" />
        <div>
          <div className="tl-eyebrow">— Invoice · TRV-30540</div>
          <h2 className="tl-display" style={{ fontSize: 32, margin: '6px 0 0' }}>Trip to Europe <i>Adventure</i></h2>
          <div className="tl-num" style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 8 }}>Amelia Stone · 18 May → 02 Jun 2026 · 6 stops</div>
          <div style={{ display: 'flex', gap: 28, marginTop: 14, fontSize: 13 }}>
            <div>
              <div className="tl-eyebrow" style={{ fontSize: 9 }}>Generated</div>
              <div className="tl-num" style={{ marginTop: 2 }}>10 May 2026</div>
            </div>
            <div>
              <div className="tl-eyebrow" style={{ fontSize: 9 }}>Currency</div>
              <div className="tl-num" style={{ marginTop: 2 }}>EUR · €</div>
            </div>
            <div>
              <div className="tl-eyebrow" style={{ fontSize: 9 }}>Payment status</div>
              <div className="tl-num" style={{ marginTop: 2, color: 'var(--terracotta)' }}>Pending · 4 of 7</div>
            </div>
          </div>
        </div>
        <div className="tl-card" style={{ padding: 16 }}>
          <div className="tl-eyebrow">— Budget Insights</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 12 }}>
            <svg viewBox="0 0 80 80" style={{ width: 80, height: 80 }}>
              <circle cx="40" cy="40" r="32" fill="none" stroke="oklch(0.92 0.012 72)" strokeWidth="12" />
              <circle cx="40" cy="40" r="32" fill="none" stroke="oklch(0.60 0.13 40)" strokeWidth="12" strokeDasharray="151 200" strokeDashoffset="0" transform="rotate(-90 40 40)" />
            </svg>
            <div>
              <div className="tl-num" style={{ fontSize: 11, color: 'var(--ink-3)' }}>Total budget</div>
              <div className="tl-num" style={{ fontFamily: 'var(--serif)', fontSize: 24 }}>€3,200</div>
              <div className="tl-num" style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 4 }}>Spent · €2,422 (75%)</div>
            </div>
          </div>
          <button className="tl-pill" style={{ marginTop: 12, width: '100%' }} onClick={() => navigate('itinerary')}>View full budget →</button>
        </div>
      </div>
      <div style={{ padding: '0 36px 28px', flex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '40px 100px 1fr 120px 90px 100px', gap: 16, padding: '12px 0', borderTop: '1px solid var(--ink)', borderBottom: '1px solid var(--rule)', fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-3)' }}>
          <span>#</span><span>Category</span><span>Description</span><span>Qty / Details</span><span style={{ textAlign: 'right' }}>Unit</span><span style={{ textAlign: 'right' }}>Amount</span>
        </div>
        {rows.map(r => (
          <div key={r[0]} style={{ display: 'grid', gridTemplateColumns: '40px 100px 1fr 120px 90px 100px', gap: 16, padding: '14px 0', borderBottom: '1px solid var(--rule-2)', fontSize: 13, alignItems: 'baseline' }}>
            <span className="tl-num" style={{ color: 'var(--ink-3)' }}>{String(r[0]).padStart(2, '0')}</span>
            <span><span className="tl-tag">{r[1]}</span></span>
            <span style={{ fontFamily: 'var(--serif)', fontSize: 17 }}>{r[2]}</span>
            <span className="tl-num" style={{ color: 'var(--ink-3)' }}>{r[3]}</span>
            <span className="tl-num" style={{ textAlign: 'right' }}>€{r[4]}</span>
            <span className="tl-num" style={{ textAlign: 'right' }}>€{r[5].toLocaleString()}</span>
          </div>
        ))}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 200px 100px', gap: 16, padding: '20px 0 0', borderTop: '1px solid var(--rule)' }}>
          <span />
          <div style={{ fontSize: 13, color: 'var(--ink-3)', display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span>Subtotal</span><span>VAT (10%)</span><span>Discount</span>
            <span style={{ fontFamily: 'var(--serif)', fontSize: 18, color: 'var(--ink)', marginTop: 4 }}>Grand total</span>
          </div>
          <div className="tl-num" style={{ display: 'flex', flexDirection: 'column', gap: 6, textAlign: 'right' }}>
            <span>€2,422</span><span>€242</span><span style={{ color: 'var(--terracotta)' }}>− €50</span>
            <span style={{ fontFamily: 'var(--serif)', fontSize: 22, color: 'var(--ink)', marginTop: 4 }}>€2,614</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 22 }}>
          <button className="tl-pill">Download invoice</button>
          <button className="tl-pill">Export as PDF</button>
          <span style={{ flex: 1 }} />
          <button className="tl-btn terracotta">Mark as paid</button>
        </div>
      </div>
    </div>
  )
}
