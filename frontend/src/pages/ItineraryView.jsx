import Chrome from '../components/Chrome'
import Controls from '../components/Controls'
import { useNav } from '../navigation'

const days = [
  { day: 'Day 01', date: 'Mon · 18 May', items: [
    { time: '09:30', name: 'Train · Lisbon → Rome (via Madrid)', dur: '12h', cost: '€220', type: 'Travel' },
    { time: '21:40', name: 'Check-in · Trastevere apartment', dur: '—', cost: '€140', type: 'Stay' }
  ]},
  { day: 'Day 02', date: 'Tue · 19 May', items: [
    { time: '08:00', name: "Espresso at Sant'Eustachio", dur: '30m', cost: '€4', type: 'Food' },
    { time: '10:00', name: 'Pantheon & Piazza Navona walk', dur: '3h', cost: 'free', type: 'Walk' },
    { time: '13:30', name: 'Lunch · Roscioli', dur: '2h', cost: '€60', type: 'Food' },
    { time: '17:00', name: "Aperitivo · Campo de' Fiori", dur: '2h', cost: '€18', type: 'Food' }
  ]},
  { day: 'Day 03', date: 'Wed · 20 May', items: [
    { time: '06:30', name: 'Vatican at dawn (private)', dur: '3h', cost: '€96', type: 'Tour' },
    { time: '14:00', name: 'Borghese Gardens · picnic', dur: '3h', cost: '€22', type: 'Walk' }
  ]}
]

export default function ItineraryView() {
  const { navigate } = useNav()
  return (
    <div className="tl-screen">
      <Chrome active="My Trips" />
      <Controls q="Search this itinerary…" />
      <div style={{ padding: '24px 36px 12px', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <div>
          <div className="tl-eyebrow">— Itinerary · Rome &amp; Amalfi</div>
          <h2 className="tl-display" style={{ fontSize: 36, margin: '6px 0 0' }}>Itinerary for <i>Rome.</i></h2>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="tl-pill">Export PDF</button>
          <button className="tl-pill">Share publicly</button>
          <button className="tl-pill active">+ Add stop</button>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 28, padding: '12px 36px 28px', flex: 1 }}>
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '90px 1fr 110px', gap: 16, fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--ink-3)', padding: '8px 0', borderBottom: '1px solid var(--rule)' }}>
            <span>Day · Time</span><span>Physical activity</span><span style={{ textAlign: 'right' }}>Expense</span>
          </div>
          {days.map((d) => (
            <div key={d.day} style={{ borderBottom: '1px solid var(--rule-2)' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, padding: '14px 0 6px' }}>
                <span style={{ fontFamily: 'var(--serif)', fontSize: 24, color: 'var(--terracotta)' }}>{d.day}</span>
                <span className="tl-num" style={{ fontSize: 12, color: 'var(--ink-3)' }}>{d.date}</span>
              </div>
              {d.items.map((it, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '90px 1fr 110px', gap: 16, alignItems: 'center', padding: '10px 0', borderTop: i === 0 ? '1px solid var(--rule-2)' : 'none' }}>
                  <span className="tl-num" style={{ fontSize: 13 }}>{it.time}</span>
                  <div>
                    <div style={{ fontFamily: 'var(--serif)', fontSize: 18 }}>{it.name}</div>
                    <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                      <span className="tl-tag">{it.type}</span>
                      <span className="tl-num" style={{ fontSize: 11, color: 'var(--ink-3)', alignSelf: 'center' }}>{it.dur}</span>
                    </div>
                  </div>
                  <span className="tl-num" style={{ textAlign: 'right', color: it.cost === 'free' ? 'var(--sage)' : 'var(--ink)' }}>{it.cost}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
        <aside>
          <div className="tl-eyebrow" style={{ marginBottom: 12 }}>— Budget · this trip</div>
          <div className="tl-card" style={{ padding: 18 }}>
            <div className="tl-num" style={{ fontFamily: 'var(--serif)', fontSize: 36, color: 'var(--ink)' }}>€2,400</div>
            <div className="tl-num" style={{ fontSize: 12, color: 'var(--ink-3)' }}>spent of €3,200 ceiling</div>
            <div style={{ height: 4, background: 'var(--paper-2)', marginTop: 12, borderRadius: 2 }}>
              <div style={{ width: '75%', height: '100%', background: 'var(--terracotta)', borderRadius: 2 }} />
            </div>
            <div style={{ height: 1, background: 'var(--rule)', margin: '18px 0' }} />
            {[
              ['Travel', '€620', 26],
              ['Stay', '€940', 39],
              ['Food', '€420', 17],
              ['Activities', '€280', 12],
              ['Misc', '€140', 6]
            ].map(([k, v, p]) => (
              <div key={k} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                  <span>{k}</span>
                  <span className="tl-num">{v} <span style={{ color: 'var(--ink-3)' }}>· {p}%</span></span>
                </div>
                <div style={{ height: 2, background: 'var(--paper-2)', marginTop: 6 }}>
                  <div style={{ width: `${p}%`, height: '100%', background: 'var(--ink)' }} />
                </div>
              </div>
            ))}
            <div style={{ marginTop: 14, padding: 12, background: 'var(--terracotta-soft)', fontSize: 12, color: 'oklch(0.36 0.10 40)' }}>
              ▲ Day 03 is over the daily average by €38. Consider moving the dawn tour.
            </div>
            <button className="tl-pill" style={{ marginTop: 14, width: '100%' }} onClick={() => navigate('invoice')}>View invoice →</button>
          </div>
        </aside>
      </div>
    </div>
  )
}
