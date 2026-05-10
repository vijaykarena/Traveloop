import { useState } from 'react'
import Chrome from '../components/Chrome'
import Controls from '../components/Controls'

const initialCats = [
  { name: 'Documents', count: '3 / 4', items: [
    ['Passport', true], ['Flight tickets (printed)', true], ['Travel insurance', true], ['Hotel booking confirmation', false]
  ]},
  { name: 'Clothing', count: '3 / 5', items: [
    ['Casual shirts × 4', true], ['Trousers / jeans × 2', true], ['Comfortable walking shoes', true], ['Light jacket / windbreaker', false], ['Swimwear', false]
  ]},
  { name: 'Electronics', count: '1 / 3', items: [
    ['Phone charger', true], ['Universal power adaptor', false], ['Earphones / headphones', false]
  ]},
  { name: 'Wellness', count: '0 / 3', items: [
    ['Sunscreen', false], ['Reusable water bottle', false], ['Pocket first-aid kit', false]
  ]}
]

export default function Packing() {
  const [cats, setCats] = useState(initialCats)

  const toggle = (ci, ii) => {
    setCats(prev => prev.map((c, ci2) =>
      ci2 !== ci ? c : {
        ...c,
        items: c.items.map((it, ii2) => ii2 !== ii ? it : [it[0], !it[1]])
      }
    ))
  }

  const packed = cats.flatMap(c => c.items).filter(i => i[1]).length
  const total = cats.flatMap(c => c.items).length

  return (
    <div className="tl-screen">
      <Chrome active="Plan" />
      <Controls q="Search this checklist…" />
      <div style={{ padding: '24px 36px 12px', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <div>
          <div className="tl-eyebrow">— Packing checklist · Trip to Europe Adventure</div>
          <h2 className="tl-display" style={{ fontSize: 36, margin: '6px 0 0' }}>
            {total - packed} items <i>still</i> to pack.
          </h2>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="tl-pill" onClick={() => setCats(initialCats)}>Reset</button>
          <button className="tl-pill">Share</button>
          <button className="tl-pill active">+ Add item</button>
        </div>
      </div>
      <div style={{ padding: '12px 36px 0' }}>
        <div className="tl-num" style={{ fontSize: 12, color: 'var(--ink-3)', display: 'flex', justifyContent: 'space-between' }}>
          <span>Progress · {packed} of {total} items packed</span>
          <span>{Math.round(packed / total * 100)}%</span>
        </div>
        <div style={{ height: 4, background: 'var(--paper-2)', marginTop: 8 }}>
          <div style={{ width: `${packed / total * 100}%`, height: '100%', background: 'var(--terracotta)', transition: 'width 0.2s' }} />
        </div>
      </div>
      <div style={{ padding: '24px 36px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, flex: 1 }}>
        {cats.map((c, ci) => (
          <div key={c.name} className="tl-card" style={{ padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', borderBottom: '1px solid var(--rule-2)', paddingBottom: 12, marginBottom: 8 }}>
              <span style={{ fontFamily: 'var(--serif)', fontSize: 22 }}>{c.name}</span>
              <span className="tl-num" style={{ fontSize: 11, color: 'var(--ink-3)' }}>
                {c.items.filter(i => i[1]).length} / {c.items.length}
              </span>
            </div>
            {c.items.map(([label, on], ii) => (
              <label key={ii} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: ii < c.items.length - 1 ? '1px solid var(--rule-2)' : 'none', cursor: 'pointer' }} onClick={() => toggle(ci, ii)}>
                <span style={{
                  width: 18, height: 18,
                  border: '1px solid ' + (on ? 'var(--terracotta)' : 'var(--ink)'),
                  background: on ? 'var(--terracotta)' : 'transparent',
                  display: 'grid', placeItems: 'center',
                  color: 'var(--paper)', fontSize: 12,
                  flexShrink: 0
                }}>{on ? '✓' : ''}</span>
                <span style={{ fontSize: 14, color: on ? 'var(--ink-3)' : 'var(--ink)', textDecoration: on ? 'line-through' : 'none' }}>{label}</span>
                <span style={{ flex: 1 }} />
                <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink-3)' }}>×</span>
              </label>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
