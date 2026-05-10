import { useState } from 'react'
import Chrome from '../components/Chrome'
import Controls from '../components/Controls'

const notes = [
  { date: 'Day 03 · 20 Jun', title: 'Hotel check-in details — Rome stop', body: 'Check-in after 2pm, room 502, breakfast included (7–10am). Concierge holds bags from 09:00. Code for the building gate: 4421#.', tags: ['Stay', 'Logistics'] },
  { date: 'Day 03 · 20 Jun', title: 'Reservations — Wednesday', body: "Roscioli at 13:30 (Marco's name). Apertivo 18:30 — no booking. Backup: Pianostrada nearby if line too long.", tags: ['Food'] },
  { date: 'Day 04 · 21 Jun', title: 'Train · Rome → Naples (Frecciarossa)', body: '07:55 from Termini, arrive 09:05 Centrale. Carriage 4, seats 11A/B. Print or have ticket on phone before boarding.', tags: ['Travel'] },
  { date: 'Day 05 · 22 Jun', title: 'Vesuvius hike — bring', body: 'Trail closes 16:00. Bring water (1.5L each), proper shoes, light layer. Park entry €10pp, separate from tour.', tags: ['Hike', 'Buy'] },
  { date: 'Day 07 · 24 Jun', title: 'Sorrento apartment — quirks', body: 'Hot water needs 20 min. Wifi: TRAVELOOP-301 / sorrento2026. Laundry on Tuesday only. Trash collection 22:00.', tags: ['Stay'] }
]

export default function Notes() {
  const [active, setActive] = useState(0)
  return (
    <div className="tl-screen">
      <Chrome active="My Trips" />
      <Controls q="Search trip notes…" extra={<button className="tl-pill active">+ Add note</button>} />
      <div style={{ padding: '24px 36px 0', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <div>
          <div className="tl-eyebrow">— Trip Notes · Rome &amp; Amalfi</div>
          <h2 className="tl-display" style={{ fontSize: 36, margin: '6px 0 0' }}>The <i>logbook,</i> in plain words.</h2>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="tl-pill active">All</button>
          <button className="tl-pill">By day</button>
          <button className="tl-pill">By stop</button>
        </div>
      </div>
      <div style={{ padding: '20px 36px 28px', display: 'grid', gridTemplateColumns: '120px 1fr', gap: 0, flex: 1 }}>
        <div style={{ borderRight: '1px solid var(--rule-2)', paddingRight: 18 }}>
          <div className="tl-eyebrow" style={{ marginBottom: 14 }}>Index</div>
          {notes.map((n, i) => (
            <div key={i} style={{ padding: '8px 0', fontFamily: 'var(--mono)', fontSize: 11, color: i === active ? 'var(--terracotta)' : 'var(--ink-3)', borderBottom: '1px solid var(--rule-2)', cursor: 'pointer' }} onClick={() => setActive(i)}>
              <div className="tl-num">№ {String(i + 1).padStart(2, '0')}</div>
              <div style={{ marginTop: 2 }}>{n.date}</div>
            </div>
          ))}
        </div>
        <div style={{ paddingLeft: 24 }}>
          {notes.map((n, i) => (
            <div key={i} className="tl-card" style={{ padding: '20px 24px', marginBottom: 14, display: 'grid', gridTemplateColumns: '60px 1fr auto', gap: 20, opacity: i === active ? 1 : 0.6 }}>
              <span style={{ fontFamily: 'var(--serif)', fontSize: 32, color: 'var(--terracotta)' }}>№{String(i + 1).padStart(2, '0')}</span>
              <div>
                <div className="tl-num" style={{ fontSize: 11, color: 'var(--ink-3)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{n.date}</div>
                <div className="tl-display" style={{ fontSize: 22, marginTop: 4 }}>{n.title}</div>
                <div style={{ color: 'var(--ink-2)', fontSize: 14, marginTop: 8, maxWidth: 660, lineHeight: 1.6 }}>{n.body}</div>
                <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
                  {n.tags.map(t => <span key={t} className="tl-tag">{t}</span>)}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <button className="tl-pill">Edit</button>
                <button className="tl-pill">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
