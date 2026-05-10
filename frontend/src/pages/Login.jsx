import { useNav } from '../navigation'
import Img from '../components/Img'

export default function Login() {
  const { navigate } = useNav()
  return (
    <div className="tl-screen" style={{ flexDirection: 'row' }}>
      <div style={{ flex: '0 0 46%', padding: '56px 56px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div className="tl-brand" style={{ fontSize: 28 }}>Trave<i>loop</i></div>
        <div>
          <div className="tl-eyebrow" style={{ marginBottom: 18 }}>— Sign In · Member 0001</div>
          <h1 className="tl-display" style={{ fontSize: 64, margin: 0 }}>Welcome <i>back,</i><br />traveller.</h1>
          <p style={{ color: 'var(--ink-2)', maxWidth: 360, marginTop: 18, fontSize: 15 }}>
            Pick up where you left off. Your itineraries, notes, and dog-eared pages are right where you left them.
          </p>
          <div style={{ marginTop: 36, display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 360 }}>
            <div className="tl-input">
              <label>Username or email</label>
              <div className="field placeholder">amelia.stone@traveloop.io</div>
            </div>
            <div className="tl-input">
              <label>Password</label>
              <div className="field placeholder">• • • • • • • •</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
              <label style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 13, color: 'var(--ink-2)' }}>
                <span style={{ width: 14, height: 14, border: '1px solid var(--ink)', display: 'inline-block', background: 'var(--ink)' }} /> Remember me
              </label>
              <a style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--terracotta)' }}>Forgot Password</a>
            </div>
            <button className="tl-btn" style={{ marginTop: 8 }} onClick={() => navigate('dashboard')}>Sign In →</button>
            <div style={{ fontSize: 13, color: 'var(--ink-3)', textAlign: 'center', marginTop: 6 }}>
              New here? <a style={{ color: 'var(--ink)', textDecoration: 'underline' }} onClick={() => navigate('register')}>Create an account</a>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-3)' }}>
          <span>© 2026 Traveloop</span><span>Issue Nº 14</span>
        </div>
      </div>
      <div style={{ flex: 1, position: 'relative', borderLeft: '1px solid var(--rule)' }}>
        <Img label="Cover · Lisbon Rooftops" coord="38.7223° N  9.1393° W" style={{ position: 'absolute', inset: 0, border: 'none', width: '100%', height: '100%' }} />
        <div style={{ position: 'absolute', bottom: 40, left: 40, right: 40, color: 'var(--ink)', background: 'var(--paper)', padding: '20px 24px', borderTop: '1px solid var(--ink)' }}>
          <div className="tl-eyebrow">Featured Itinerary · 7 Days</div>
          <div className="tl-display" style={{ fontSize: 32, marginTop: 6 }}>The slow road through <i>Iberia</i>.</div>
        </div>
      </div>
    </div>
  )
}
