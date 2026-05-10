import Chrome from '../components/Chrome'
import Controls from '../components/Controls'
import Img from '../components/Img'
import { useNav } from '../navigation'

const groups = [
  { label: 'Ongoing', tag: 'In progress', count: '01' },
  { label: 'Up-coming', tag: '8 days out', count: '02' },
  { label: 'Completed', tag: 'Archived', count: '08' }
]
const sample = [
  { title: 'Rome & the Amalfi', dates: '18 May → 02 Jun', stops: '6 stops', budget: '€2,400 / €3,200', img: 'rome' },
  { title: 'Tokyo · neighbourhood loop', dates: '12 Jun → 24 Jun', stops: '4 stops', budget: '¥210,000 / ¥260k', img: 'tokyo' },
  { title: 'Iceland Ring Road', dates: '02 Aug → 14 Aug', stops: '11 stops', budget: 'kr 380,000', img: 'iceland' },
]

export default function MyTrips() {
  const { navigate } = useNav()
  return (
    <div className="tl-screen">
      <Chrome active="My Trips" />
      <Controls q="Search your logbook…" />
      <div style={{ padding: '24px 36px', flex: 1 }}>
        {groups.map((g, gi) => (
          <div key={g.label}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', margin: gi === 0 ? '8px 0 14px' : '28px 0 14px' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
                <span className="tl-num" style={{ fontFamily: 'var(--serif)', fontSize: 28, color: 'var(--terracotta)' }}>{g.count}</span>
                <h3 className="tl-display" style={{ fontSize: 28, margin: 0 }}>{g.label}</h3>
                <span className="tl-tag dot">{g.tag}</span>
              </div>
              <a className="tl-eyebrow" style={{ color: 'var(--ink-2)' }}>View all →</a>
            </div>
            <div className="tl-card" style={{ padding: 16, display: 'grid', gridTemplateColumns: '180px 1fr auto', gap: 20, alignItems: 'center' }}>
              <Img ratio="3 / 2" label={sample[gi].img} style={{ width: 180 }} />
              <div>
                <div style={{ fontFamily: 'var(--serif)', fontSize: 24 }}>{sample[gi].title}</div>
                <div className="tl-num" style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 6 }}>{sample[gi].dates} · {sample[gi].stops}</div>
                <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                  <span className="tl-tag terracotta dot">{sample[gi].budget}</span>
                  <span className="tl-tag" style={{ cursor: 'pointer' }} onClick={() => navigate('itinerary')}>View timeline</span>
                  <span className="tl-tag" style={{ cursor: 'pointer' }} onClick={() => navigate('notes')}>Notes · 6</span>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <button className="tl-pill" onClick={() => navigate('itinerary')}>Open →</button>
                <button className="tl-pill">Duplicate</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
