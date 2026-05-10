import Chrome from '../components/Chrome'
import { useNav } from '../navigation'

export default function Register() {
  const { navigate } = useNav()
  return (
    <div className="tl-screen">
      <Chrome active="" user="·" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 0, flex: 1 }}>
        <div style={{ padding: '48px 48px', borderRight: '1px solid var(--rule)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div className="tl-eyebrow">— Step 01 of 02</div>
            <h1 className="tl-display" style={{ fontSize: 56, margin: '14px 0 0' }}>Begin your <i>logbook.</i></h1>
            <p style={{ color: 'var(--ink-2)', maxWidth: 380, marginTop: 18, fontSize: 15 }}>
              A free account stores your trips, notes and packing lists across devices. Takes about a minute.
            </p>
          </div>
          <div style={{ marginTop: 32 }}>
            <div className="tl-eyebrow" style={{ marginBottom: 12 }}>Profile photo</div>
            <div style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
              <div className="tl-img" style={{ width: 96, height: 96, borderRadius: 999, display: 'grid', placeItems: 'center' }}>
                <span style={{ fontFamily: 'var(--serif)', fontSize: 36, color: 'var(--terracotta)' }}>+</span>
              </div>
              <div style={{ fontSize: 13, color: 'var(--ink-3)', maxWidth: 220 }}>Drop a square JPG or PNG, ≥ 400×400 px. Optional but recommended.</div>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-3)' }}>
            <span>Already a member? <a style={{ color: 'var(--terracotta)' }} onClick={() => navigate('login')}>Sign In</a></span>
            <span>Privacy · Terms</span>
          </div>
        </div>
        <div style={{ padding: '48px 56px' }}>
          <div className="tl-eyebrow">Personal details</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginTop: 14 }}>
            <div className="tl-input"><label>First name</label><div className="field">Amelia</div></div>
            <div className="tl-input"><label>Last name</label><div className="field">Stone</div></div>
            <div className="tl-input"><label>Email address</label><div className="field">amelia.stone@traveloop.io</div></div>
            <div className="tl-input"><label>Phone number</label><div className="field">+44 7700 900 421</div></div>
            <div className="tl-input"><label>City</label><div className="field">Lisbon</div></div>
            <div className="tl-input"><label>Country</label><div className="field">Portugal</div></div>
          </div>
          <div className="tl-input" style={{ marginTop: 18 }}>
            <label>About you · what kind of trips do you dream of?</label>
            <div className="field placeholder" style={{ minHeight: 110, alignItems: 'flex-start', paddingTop: 14, lineHeight: 1.6 }}>
              Slow travel through small towns. Coastal walks, family-run kitchens, second-hand bookshops. Not in a rush.
            </div>
          </div>
          <div style={{ marginTop: 24, display: 'flex', alignItems: 'center', gap: 14 }}>
            <span className="tl-tag dot terracotta">Saved as draft · 14:02</span>
            <span style={{ flex: 1 }} />
            <button className="tl-btn ghost" onClick={() => navigate('login')}>Cancel</button>
            <button className="tl-btn" onClick={() => navigate('dashboard')}>Register · Continue →</button>
          </div>
        </div>
      </div>
    </div>
  )
}
