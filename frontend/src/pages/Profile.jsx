import Chrome from '../components/Chrome'
import Img from '../components/Img'
import { useNav } from '../navigation'

export default function Profile() {
  const { navigate } = useNav()
  return (
    <div className="tl-screen">
      <Chrome active="" user="AS" />
      <div style={{ padding: '40px 56px 24px', borderBottom: '1px solid var(--rule)', display: 'grid', gridTemplateColumns: '120px 1fr auto', gap: 24, alignItems: 'center' }}>
        <div className="tl-img" style={{ width: 120, height: 120, borderRadius: 999 }}>
          <span className="tl-img-label" style={{ left: '50%', bottom: 8, transform: 'translateX(-50%)' }}>portrait</span>
        </div>
        <div>
          <div className="tl-eyebrow">Member since Mar 2024 · 11 trips logged</div>
          <h1 className="tl-display" style={{ fontSize: 48, margin: '6px 0 0' }}>Amelia <i>Stone</i></h1>
          <div style={{ color: 'var(--ink-2)', maxWidth: 540, marginTop: 8 }}>
            Slow traveller, occasional cook, cataloguer of small bookshops. Based in Lisbon.
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="tl-pill">Settings</button>
          <button className="tl-btn ghost">Edit profile</button>
        </div>
      </div>
      <div style={{ padding: '24px 56px', display: 'grid', gridTemplateColumns: '1.2fr 2fr', gap: 36, flex: 1 }}>
        <div>
          <div className="tl-eyebrow" style={{ marginBottom: 14 }}>— Account details</div>
          {[
            ['Email', 'amelia.stone@traveloop.io'],
            ['Phone', '+44 7700 900 421'],
            ['City · Country', 'Lisbon, Portugal'],
            ['Languages', 'English, Portuguese, Italian'],
            ['Currency', 'EUR'],
            ['Visibility', 'Friends only']
          ].map(([k, v]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--rule-2)' }}>
              <span className="tl-eyebrow" style={{ fontSize: 10 }}>{k}</span>
              <span style={{ fontSize: 14 }}>{v}</span>
            </div>
          ))}
          <div style={{ marginTop: 24, padding: 16, border: '1px solid var(--rule)', background: 'var(--paper-2)' }}>
            <div className="tl-eyebrow">Saved destinations · 14</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
              {['Lisbon', 'Naples', 'Reykjavík', 'Marrakesh', 'Kyoto', 'Oaxaca', 'Tbilisi', 'Hanoi'].map(c => (
                <span key={c} className="tl-tag">{c}</span>
              ))}
            </div>
          </div>
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 14 }}>
            <div className="tl-eyebrow">— Preplanned trips</div>
            <span className="tl-num" style={{ fontSize: 11, color: 'var(--ink-3)' }}>03 ahead</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
            {[['Rome & Amalfi', '18 May'], ['Tokyo loop', '12 Jun'], ['Iceland', '02 Aug']].map(([n, d]) => (
              <div key={n} className="tl-card" style={{ padding: 12 }}>
                <Img ratio="4 / 3" />
                <div style={{ fontFamily: 'var(--serif)', fontSize: 18, marginTop: 10 }}>{n}</div>
                <div className="tl-num" style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 4 }}>Departs {d}</div>
                <button className="tl-pill" style={{ marginTop: 12, width: '100%' }} onClick={() => navigate('itinerary')}>View →</button>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', margin: '28px 0 14px' }}>
            <div className="tl-eyebrow">— Previous trips</div>
            <span className="tl-num" style={{ fontSize: 11, color: 'var(--ink-3)' }}>08 archived</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
            {[['Hokkaidō', 'Feb 26'], ['Lofoten', 'Aug 25'], ['Cusco', 'Apr 25']].map(([n, d]) => (
              <div key={n} className="tl-card" style={{ padding: 12 }}>
                <Img ratio="4 / 3" />
                <div style={{ fontFamily: 'var(--serif)', fontSize: 18, marginTop: 10 }}>{n}</div>
                <div className="tl-num" style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 4 }}>{d}</div>
                <button className="tl-pill" style={{ marginTop: 12, width: '100%' }} onClick={() => navigate('my-trips')}>View →</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
