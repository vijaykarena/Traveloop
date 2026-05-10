import Chrome from '../components/Chrome'
import Img from '../components/Img'
import { useNav } from '../navigation'

export default function CreateTrip() {
  const { navigate } = useNav()
  return (
    <div className="tl-screen">
      <Chrome active="Plan" />
      <div style={{ padding: '36px 56px', borderBottom: '1px solid var(--rule)' }}>
        <div className="tl-eyebrow">— Plan a New Trip · Untitled · Draft</div>
        <h1 className="tl-display" style={{ fontSize: 56, margin: '8px 0 0' }}>Where shall we <i>begin?</i></h1>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', flex: 1 }}>
        <div style={{ padding: '36px 48px', borderRight: '1px solid var(--rule)', display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div className="tl-eyebrow">The basics</div>
          <div className="tl-input"><label>Trip name</label><div className="field">A long weekend in Rome</div></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div className="tl-input"><label>Start date</label><div className="field tl-num">18 · 05 · 2026</div></div>
            <div className="tl-input"><label>End date</label><div className="field tl-num">02 · 06 · 2026</div></div>
          </div>
          <div className="tl-input"><label>First place</label><div className="field">Rome, Italy</div></div>
          <div className="tl-input">
            <label>Travel companions</label>
            <div className="field" style={{ gap: 8, display: 'flex' }}>
              <span className="tl-tag">+ Marco</span>
              <span className="tl-tag">+ Iris</span>
              <span className="tl-tag" style={{ background: 'transparent', border: '1px dashed var(--rule)' }}>+ add</span>
            </div>
          </div>
          <div className="tl-input">
            <label>Trip description</label>
            <div className="field placeholder" style={{ minHeight: 90, alignItems: 'flex-start', paddingTop: 12, lineHeight: 1.6 }}>
              A slow loop through Lazio and the Amalfi coast — markets, espresso, and an afternoon train down the coast.
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <button className="tl-btn ghost">Save Draft</button>
            <button className="tl-btn" style={{ flex: 1 }} onClick={() => navigate('build-itinerary')}>Continue · Build Itinerary →</button>
          </div>
        </div>
        <div style={{ padding: '36px 48px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 14 }}>
            <div className="tl-eyebrow">— Suggestions for places &amp; activities</div>
            <span className="tl-num" style={{ fontSize: 11, color: 'var(--ink-3)' }}>Curated by region</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
            {[
              ['Trastevere walk', 'Rome · 3h', 'free'],
              ['Mt. Vesuvius hike', 'Naples · 1d', '€18'],
              ['Positano, by ferry', 'Amalfi · 1/2d', '€32'],
              ['Cooking with Nonna', 'Sorrento · 4h', '€85'],
              ['Vatican at dawn', 'Rome · 3h', '€48'],
              ['Capri grottoes', 'Capri · 1d', '€54']
            ].map(([n, m, p]) => (
              <div key={n} className="tl-card" style={{ padding: 12 }}>
                <Img ratio="4 / 3" label={m.split(' · ')[0].toLowerCase()} />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
                  <div style={{ fontFamily: 'var(--serif)', fontSize: 18 }}>{n}</div>
                  <span className="tl-num" style={{ fontSize: 11, color: 'var(--terracotta)' }}>{p}</span>
                </div>
                <div className="tl-num" style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 4 }}>{m}</div>
                <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                  <button className="tl-pill" style={{ flex: 1 }}>Preview</button>
                  <button className="tl-pill active" style={{ flex: 1 }}>+ Add</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
