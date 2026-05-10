import Chrome from '../components/Chrome'
import Controls from '../components/Controls'
import Img from '../components/Img'
import { useNav } from '../navigation'

export default function Dashboard() {
  const { navigate } = useNav()
  return (
    <div className="tl-screen">
      <Chrome active="Discover" />
      <div style={{ position: 'relative', height: 360, borderBottom: '1px solid var(--rule)' }}>
        <Img label="Banner · Cinque Terre" coord="44.1281° N  9.7088° E" style={{ position: 'absolute', inset: 0, border: 'none', width: '100%', height: '100%' }} />
        <div style={{ position: 'absolute', left: 36, bottom: 36, right: 36, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 24 }}>
          <div style={{ background: 'var(--paper)', padding: '24px 28px', maxWidth: 520, borderTop: '2px solid var(--ink)' }}>
            <div className="tl-eyebrow">Issue 14 · May 2026</div>
            <div className="tl-display" style={{ fontSize: 44, marginTop: 6 }}>Where to, <i>Amelia?</i></div>
            <div style={{ color: 'var(--ink-2)', marginTop: 10, fontSize: 14 }}>Three trips on the horizon. Eight days until Rome.</div>
          </div>
          <button className="tl-btn terracotta" onClick={() => navigate('create-trip')}>＋ Plan a New Trip</button>
        </div>
      </div>
      <Controls q="Lisbon, paragliding, slow trains in Japan…" />
      <div style={{ padding: '28px 36px', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 36, flex: 1 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 14 }}>
            <div className="tl-eyebrow">— Top Regional Selections</div>
            <span className="tl-num" style={{ fontSize: 11, color: 'var(--ink-3)' }}>05 of 24</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
            {[
              ['Lisbon', 'PT', '38.72° N'],
              ['Kyoto', 'JP', '35.01° N'],
              ['Marrakesh', 'MA', '31.62° N'],
              ['Reykjavík', 'IS', '64.14° N'],
              ['Oaxaca', 'MX', '17.07° N']
            ].map(([n, c, lat]) => (
              <div key={n}>
                <Img ratio="1 / 1" label={c} coord={lat} />
                <div style={{ fontFamily: 'var(--serif)', fontSize: 22, marginTop: 8 }}>{n}</div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', margin: '32px 0 14px' }}>
            <div className="tl-eyebrow">— Previous Trips</div>
            <span className="tl-num" style={{ fontSize: 11, color: 'var(--ink-3)' }}>03 of 11</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {[
              ['Hokkaidō Loop', '14 days · ¥184,200', 'Feb 2026'],
              ['Lofoten Islands', '8 days · €2,140', 'Aug 2025'],
              ['Cusco → Sacred Valley', '11 days · $1,860', 'Apr 2025']
            ].map(([n, m, d]) => (
              <div key={n} className="tl-card" style={{ padding: 14, cursor: 'pointer' }} onClick={() => navigate('my-trips')}>
                <Img ratio="16 / 10" label="archive" />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
                  <div style={{ fontFamily: 'var(--serif)', fontSize: 20 }}>{n}</div>
                  <span className="tl-num" style={{ fontSize: 11, color: 'var(--ink-3)' }}>{d}</span>
                </div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink-3)', marginTop: 4 }}>{m}</div>
              </div>
            ))}
          </div>
        </div>
        <aside>
          <div className="tl-eyebrow" style={{ marginBottom: 14 }}>— Up Next</div>
          <div className="tl-card" style={{ padding: 18, cursor: 'pointer' }} onClick={() => navigate('itinerary')}>
            <div className="tl-tag dot terracotta">In 8 days</div>
            <div className="tl-display" style={{ fontSize: 28, marginTop: 10 }}>Rome <i>&amp;</i><br />the Amalfi.</div>
            <div className="tl-num" style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 6 }}>18 May → 02 Jun · 6 stops</div>
            <div style={{ height: 1, background: 'var(--rule)', margin: '14px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
              <span style={{ color: 'var(--ink-3)' }}>Budget</span>
              <span className="tl-num">€2,400 / €3,200</span>
            </div>
            <div style={{ height: 4, background: 'var(--paper-2)', marginTop: 8, borderRadius: 2 }}>
              <div style={{ width: '75%', height: '100%', background: 'var(--terracotta)', borderRadius: 2 }} />
            </div>
          </div>
          <div className="tl-eyebrow" style={{ marginTop: 24, marginBottom: 12 }}>— From the community</div>
          {['"Three days in Naples — by mouth"', '"A walking guide to Hanoi at dawn"', '"Patagonia in the off-season"'].map(t => (
            <div key={t} style={{ padding: '12px 0', borderBottom: '1px solid var(--rule-2)', cursor: 'pointer' }} onClick={() => navigate('community')}>
              <div style={{ fontFamily: 'var(--serif)', fontSize: 17, fontStyle: 'italic' }}>{t}</div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink-3)', marginTop: 4, letterSpacing: '0.1em' }}>SHARED · 2D AGO</div>
            </div>
          ))}
        </aside>
      </div>
    </div>
  )
}
