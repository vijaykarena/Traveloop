import Chrome from '../components/Chrome'
import Controls from '../components/Controls'
import Img from '../components/Img'

const results = [
  { name: 'Paragliding · Cape Sounion', meta: 'Athens, Greece · 4h · €120', tag: 'Adventure', body: 'Tandem flights from cliff-tops above the Aegean. Pickup from central Athens; minimum age 12.' },
  { name: 'Paragliding · Ölüdeniz', meta: 'Fethiye, Türkiye · 3h · €95', tag: 'Adventure', body: 'World-class thermals over the Blue Lagoon. Multiple takeoff altitudes from 1,200–1,960 m.' },
  { name: 'Paragliding course · Annecy', meta: 'France · 5 days · €860', tag: 'Course', body: 'Beginner-to-solo certification on the Col de la Forclaz. English instructors, weather-flexible.' },
  { name: 'Tandem · Interlaken', meta: 'Switzerland · 2h · CHF 220', tag: 'Adventure', body: 'Classic alpine flight over Lake Thun. GoPro footage included; transfers from your hotel.' },
  { name: 'Paragliding · Bir Billing', meta: 'Himachal, India · 3h · ₹3,200', tag: 'Adventure', body: 'Himalayan foothills, second-highest paragliding site in the world. Best Oct–Nov.' },
  { name: 'Paragliding photography', meta: 'Cappadocia, Türkiye · 1d · €180', tag: 'Photo', body: 'A flight at sunrise alongside the balloons — purpose-built for photographers.' }
]

export default function Search() {
  return (
    <div className="tl-screen">
      <Chrome active="Discover" />
      <Controls q="paragliding" />
      <div style={{ padding: '24px 36px', flex: 1, display: 'grid', gridTemplateColumns: '1fr 280px', gap: 28 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <div className="tl-eyebrow">— Results</div>
              <h2 className="tl-display" style={{ fontSize: 32, margin: '6px 0 0' }}>06 places to fly.</h2>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <span className="tl-tag dot terracotta">Adventure</span>
              <span className="tl-tag">Under €200</span>
              <span className="tl-tag">Half-day</span>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {results.map((r, i) => (
              <div key={r.name} style={{ display: 'grid', gridTemplateColumns: '40px 140px 1fr auto', gap: 18, padding: '18px 4px', borderTop: i === 0 ? '1px solid var(--rule)' : 'none', borderBottom: '1px solid var(--rule-2)', alignItems: 'center' }}>
                <span className="tl-num" style={{ fontFamily: 'var(--serif)', fontSize: 24, color: 'var(--ink-3)' }}>{String(i + 1).padStart(2, '0')}</span>
                <Img ratio="4 / 3" label={r.tag.toLowerCase()} />
                <div>
                  <div style={{ fontFamily: 'var(--serif)', fontSize: 22 }}>{r.name}</div>
                  <div className="tl-num" style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 4 }}>{r.meta}</div>
                  <div style={{ color: 'var(--ink-2)', fontSize: 13, marginTop: 8, maxWidth: 520 }}>{r.body}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <button className="tl-pill">Preview</button>
                  <button className="tl-pill active">+ Add to trip</button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <aside>
          <div className="tl-eyebrow" style={{ marginBottom: 12 }}>— Refine</div>
          <div className="tl-card" style={{ padding: 16 }}>
            <div className="tl-eyebrow" style={{ fontSize: 9 }}>Cost (EUR)</div>
            <div style={{ position: 'relative', height: 28, marginTop: 14 }}>
              <div style={{ position: 'absolute', inset: '14px 0', height: 1, background: 'var(--rule)' }} />
              <div style={{ position: 'absolute', left: '15%', right: '30%', top: 14, height: 1, background: 'var(--terracotta)' }} />
              <div style={{ position: 'absolute', left: '15%', top: 8, width: 14, height: 14, borderRadius: 999, background: 'var(--paper)', border: '1px solid var(--ink)' }} />
              <div style={{ position: 'absolute', left: '70%', top: 8, width: 14, height: 14, borderRadius: 999, background: 'var(--ink)' }} />
            </div>
            <div className="tl-num" style={{ fontSize: 11, display: 'flex', justifyContent: 'space-between', color: 'var(--ink-3)', marginTop: 6 }}>
              <span>€80</span><span>€480</span>
            </div>
          </div>
          <div className="tl-card" style={{ padding: 16, marginTop: 14 }}>
            <div className="tl-eyebrow" style={{ fontSize: 9, marginBottom: 10 }}>Type of activity</div>
            {['Adventure', 'Course', 'Photo', 'Wellness', 'Sightseeing', 'Food'].map((t, i) => (
              <label key={t} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: 13, color: 'var(--ink-2)', cursor: 'pointer' }}>
                <span>
                  <span style={{ display: 'inline-block', width: 12, height: 12, border: '1px solid var(--ink)', background: i < 3 ? 'var(--ink)' : 'transparent', marginRight: 8, verticalAlign: -1 }} />
                  {t}
                </span>
                <span className="tl-num" style={{ color: 'var(--ink-3)' }}>{[24, 6, 11, 38, 92, 140][i]}</span>
              </label>
            ))}
          </div>
          <div className="tl-card" style={{ padding: 16, marginTop: 14 }}>
            <div className="tl-eyebrow" style={{ fontSize: 9, marginBottom: 10 }}>Region</div>
            {['Europe', 'Asia', 'Americas', 'Africa', 'Oceania'].map(r => (
              <div key={r} style={{ padding: '6px 0', fontSize: 13, color: 'var(--ink-2)', display: 'flex', justifyContent: 'space-between' }}>
                <span>{r}</span><span style={{ color: 'var(--ink-3)' }}>↗</span>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  )
}
