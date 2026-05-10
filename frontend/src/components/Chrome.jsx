import { useNav } from '../navigation'

const NAV_MAP = {
  Discover: 'dashboard',
  Plan: 'create-trip',
  'My Trips': 'my-trips',
  Community: 'community',
}

export default function Chrome({ active = 'Plan', user = 'AS' }) {
  const { navigate } = useNav()
  return (
    <header className="tl-chrome">
      <div className="tl-brand" onClick={() => navigate('dashboard')}>
        Trave<i>loop</i>
      </div>
      <nav className="tl-nav">
        {Object.entries(NAV_MAP).map(([label, page]) => (
          <a
            key={label}
            className={label === active ? 'active' : ''}
            onClick={() => navigate(page)}
          >
            {label}
          </a>
        ))}
      </nav>
      <div className="tl-chrome-right">
        <span>48.8566° N · 2.3522° E</span>
        <span className="tl-avatar" onClick={() => navigate('profile')}>{user}</span>
      </div>
    </header>
  )
}
