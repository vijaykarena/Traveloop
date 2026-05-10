import Chrome from '../components/Chrome'

const sections = [
  { n: 'I.', title: 'Rome — three slow days', dates: '18 → 21 May', budget: '€620', body: "Settle into Trastevere, visit the Pantheon at golden hour, find a small enoteca near Campo de' Fiori. No museums on day one.", tags: ['Walking', 'Food', 'Architecture'] },
  { n: 'II.', title: 'Naples & a day on Vesuvius', dates: '22 → 24 May', budget: '€480', body: 'Pizza pilgrimage. A day trip up the volcano with proper boots. Espresso at every stop, on principle.', tags: ['Hike', 'Food', 'Day trip'] },
  { n: 'III.', title: 'The Amalfi by ferry', dates: '25 → 30 May', budget: '€1,180', body: 'Sorrento as base camp. Lazy ferries to Positano and Capri. Read on the deck, swim in coves, miss the last bus once.', tags: ['Coast', 'Slow', 'Swim'] }
]

export default function BuildItinerary() {
  return (
    <div className="tl-screen">
      <Chrome active="Plan" />
      <div style={{ padding: '24px 36px 0', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <div>
          <div className="tl-eyebrow">— Build Itinerary · Rome &amp; Amalfi · 16 days</div>
          <h2 className="tl-display" style={{ fontSize: 36, margin: '6px 0 0' }}>The shape of <i>your trip.</i></h2>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="tl-pill">Calendar view</button>
          <button className="tl-pill active">Section view</button>
          <button className="tl-pill">Map</button>
        </div>
      </div>
      <div style={{ padding: '28px 36px', flex: 1 }}>
        {sections.map((s) => (
          <div key={s.n} className="tl-card" style={{ padding: '22px 26px', marginBottom: 16, display: 'grid', gridTemplateColumns: '64px 1fr 320px', gap: 28 }}>
            <div style={{ fontFamily: 'var(--serif)', fontSize: 44, color: 'var(--terracotta)', lineHeight: 1 }}>{s.n}</div>
            <div>
              <div style={{ fontFamily: 'var(--serif)', fontSize: 26 }}>{s.title}</div>
              <div style={{ color: 'var(--ink-2)', fontSize: 14, marginTop: 8, maxWidth: 560 }}>{s.body}</div>
              <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
                {s.tags.map(t => <span key={t} className="tl-tag">{t}</span>)}
              </div>
            </div>
            <div style={{ borderLeft: '1px solid var(--rule-2)', paddingLeft: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <div className="tl-eyebrow" style={{ fontSize: 9 }}>Date range</div>
                <div className="tl-num" style={{ fontSize: 16, marginTop: 4 }}>{s.dates}</div>
              </div>
              <div>
                <div className="tl-eyebrow" style={{ fontSize: 9 }}>Section budget</div>
                <div className="tl-num" style={{ fontSize: 16, marginTop: 4, color: 'var(--terracotta)' }}>{s.budget}</div>
              </div>
              <button className="tl-pill" style={{ marginTop: 'auto' }}>Edit section →</button>
            </div>
          </div>
        ))}
        <button className="tl-card" style={{ width: '100%', padding: 18, border: '1px dashed var(--rule)', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-3)', cursor: 'pointer' }}>
          ＋ Add another section
        </button>
      </div>
    </div>
  )
}
