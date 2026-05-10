import Chrome from '../components/Chrome'
import Controls from '../components/Controls'

const posts = [
  { author: 'Marco P.', city: 'Naples, IT', title: 'Three days in Naples — by mouth', body: 'A kid-friendly route through the back streets of the Spanish Quarters. Pizza order, in order.', tags: ['Food', 'Family'], reads: '2.4k' },
  { author: 'Iris K.', city: 'Hanoi, VN', title: 'A walking guide to Hanoi at dawn', body: 'The old quarter wakes up earlier than you think. A sub-€20 morning that changes how you see the city.', tags: ['Slow', 'Solo'], reads: '1.1k' },
  { author: 'Diego R.', city: 'Patagonia, AR', title: 'Patagonia in the off-season', body: 'On going in May. Cheaper, quieter, and the wind has manners. A fully costed 14-day loop.', tags: ['Hike', 'Budget'], reads: '880' },
  { author: 'Hana S.', city: 'Kyoto, JP', title: 'Temples without crowds — a small map', body: 'Five lesser-known temples, walking distances, and the cafés near each. Trip cost in JPY included.', tags: ['Photo', 'Slow'], reads: '4.7k' }
]

export default function Community() {
  return (
    <div className="tl-screen">
      <Chrome active="Community" />
      <Controls q="Search community trip plans…" />
      <div style={{ padding: '24px 36px 12px', display: 'grid', gridTemplateColumns: '1fr 320px', gap: 28 }}>
        <div>
          <div className="tl-eyebrow">— Community Logbook</div>
          <h2 className="tl-display" style={{ fontSize: 36, margin: '6px 0 16px' }}>Trips, in <i>other peoples'</i> words.</h2>
        </div>
        <div style={{ paddingTop: 20 }}>
          <div className="tl-eyebrow" style={{ marginBottom: 6 }}>How this works</div>
          <div style={{ fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.6 }}>
            Travelers share their itineraries here. Use the search, group-by, filter and sort options to narrow results to what you're looking for — by region, season, budget, or pace.
          </div>
        </div>
      </div>
      <div style={{ padding: '0 36px 28px', flex: 1 }}>
        {posts.map((p, i) => (
          <div key={p.title} style={{ display: 'grid', gridTemplateColumns: '64px 1fr 200px', gap: 24, padding: '20px 0', borderTop: '1px solid var(--rule-2)', borderBottom: i === posts.length - 1 ? '1px solid var(--rule-2)' : 'none', alignItems: 'center' }}>
            <div style={{ width: 56, height: 56, borderRadius: 999, background: 'var(--terracotta-soft)', border: '1px solid var(--rule)', display: 'grid', placeItems: 'center', fontFamily: 'var(--serif)', color: 'var(--terracotta)', fontSize: 22 }}>
              {p.author.split(' ')[0][0]}{p.author.split(' ')[1][0]}
            </div>
            <div>
              <div className="tl-num" style={{ fontSize: 11, color: 'var(--ink-3)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{p.author} · {p.city} · {p.reads} reads</div>
              <div className="tl-display" style={{ fontSize: 26, marginTop: 4 }}>"{p.title}"</div>
              <div style={{ color: 'var(--ink-2)', fontSize: 14, marginTop: 6, maxWidth: 640 }}>{p.body}</div>
              <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
                {p.tags.map(t => <span key={t} className="tl-tag">{t}</span>)}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <button className="tl-pill">Read trip →</button>
              <button className="tl-pill">Copy itinerary</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
