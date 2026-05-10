import Chrome from '../components/Chrome'
import Controls from '../components/Controls'

export default function Admin() {
  return (
    <div className="tl-screen">
      <Chrome active="" user="·" />
      <Controls q="Search users, trips, cities…" extra={<button className="tl-pill">Export</button>} />
      <div style={{ padding: '24px 36px 0', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <div>
          <div className="tl-eyebrow">— Admin · Analytics overview · May 2026</div>
          <h2 className="tl-display" style={{ fontSize: 36, margin: '6px 0 0' }}>Where is Traveloop <i>going?</i></h2>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="tl-pill">Manage users</button>
          <button className="tl-pill active">Popular cities</button>
          <button className="tl-pill">Activities</button>
          <button className="tl-pill">Trends</button>
        </div>
      </div>
      <div style={{ padding: '24px 36px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        {[
          ['Active members', '12,486', '+ 6.2% MoM'],
          ['Trips created', '34,120', '+ 11.8%'],
          ['Avg. trip budget', '€1,820', '− 3.4%'],
          ['New community posts', '1,420', '+ 14.1%']
        ].map(([k, v, d]) => (
          <div key={k} className="tl-card" style={{ padding: 16 }}>
            <div className="tl-eyebrow" style={{ fontSize: 9 }}>{k}</div>
            <div className="tl-num" style={{ fontFamily: 'var(--serif)', fontSize: 32, marginTop: 8 }}>{v}</div>
            <div className="tl-num" style={{ fontSize: 11, color: d.startsWith('−') ? 'var(--ink-3)' : 'var(--terracotta)' }}>{d}</div>
          </div>
        ))}
      </div>
      <div style={{ padding: '0 36px 28px', display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 20, flex: 1 }}>
        <div className="tl-card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <div className="tl-eyebrow">— Trips created · last 12 weeks</div>
            <span className="tl-num" style={{ fontSize: 11, color: 'var(--ink-3)' }}>weekly</span>
          </div>
          <svg viewBox="0 0 600 200" style={{ width: '100%', height: 200, marginTop: 16 }}>
            {[40, 80, 120, 160].map(y => <line key={y} x1="0" x2="600" y1={y} y2={y} stroke="oklch(0.92 0.012 72)" />)}
            <polyline fill="none" stroke="oklch(0.20 0.015 60)" strokeWidth="1.4"
              points="0,150 50,140 100,120 150,130 200,90 250,100 300,70 350,80 400,55 450,40 500,55 550,30 600,40" />
            {[[0,150],[50,140],[100,120],[150,130],[200,90],[250,100],[300,70],[350,80],[400,55],[450,40],[500,55],[550,30],[600,40]].map(([x,y],i) => (
              <circle key={i} cx={x} cy={y} r="3" fill="oklch(0.60 0.13 40)" />
            ))}
          </svg>
          <div className="tl-num" style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--ink-3)', marginTop: 4 }}>
            <span>W 09</span><span>W 12</span><span>W 15</span><span>W 18</span><span>W 21</span>
          </div>
        </div>
        <div className="tl-card" style={{ padding: 20 }}>
          <div className="tl-eyebrow">— Top cities</div>
          {[
            ['Rome, IT', 1840, 'oklch(0.60 0.13 40)'],
            ['Tokyo, JP', 1620, 'oklch(0.20 0.015 60)'],
            ['Lisbon, PT', 1280, 'oklch(0.62 0.04 130)'],
            ['Reykjavík, IS', 940, 'oklch(0.62 0.07 235)'],
            ['Marrakesh, MA', 720, 'oklch(0.55 0.012 70)']
          ].map(([n, v, c]) => (
            <div key={n} style={{ marginTop: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                <span>{n}</span><span className="tl-num">{v}</span>
              </div>
              <div style={{ height: 4, background: 'var(--paper-2)', marginTop: 4 }}>
                <div style={{ width: `${v / 20}%`, height: '100%', background: c }} />
              </div>
            </div>
          ))}
        </div>
        <div className="tl-card" style={{ padding: 20, gridColumn: '1 / -1' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <div className="tl-eyebrow">— Recent users</div>
            <a className="tl-eyebrow" style={{ color: 'var(--ink-2)' }}>Manage all →</a>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '40px 1.5fr 1fr 1fr 1fr 80px', gap: 14, padding: '14px 0 8px', borderBottom: '1px solid var(--rule-2)', fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-3)' }}>
            <span>#</span><span>Name</span><span>Joined</span><span>Trips</span><span>Last seen</span><span>Status</span>
          </div>
          {[
            ['001', 'Amelia Stone', 'Mar 2024', 11, '2 min ago', 'Active'],
            ['002', 'Marco Pirelli', 'Jul 2024', 6, '1h ago', 'Active'],
            ['003', 'Iris Khan', 'Nov 2025', 2, '3d ago', 'Idle'],
            ['004', 'Diego Reyes', 'Jan 2026', 1, '6d ago', 'Idle']
          ].map(r => (
            <div key={r[0]} style={{ display: 'grid', gridTemplateColumns: '40px 1.5fr 1fr 1fr 1fr 80px', gap: 14, padding: '12px 0', borderBottom: '1px solid var(--rule-2)', fontSize: 13 }}>
              <span className="tl-num" style={{ color: 'var(--ink-3)' }}>{r[0]}</span>
              <span style={{ fontFamily: 'var(--serif)', fontSize: 16 }}>{r[1]}</span>
              <span className="tl-num" style={{ color: 'var(--ink-3)' }}>{r[2]}</span>
              <span className="tl-num">{r[3]}</span>
              <span className="tl-num" style={{ color: 'var(--ink-3)' }}>{r[4]}</span>
              <span className={r[5] === 'Active' ? 'tl-tag dot terracotta' : 'tl-tag dot'}>{r[5]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
