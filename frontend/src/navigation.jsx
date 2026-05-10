import { createContext, useContext } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const NavContext = createContext(null)

export function useNav() {
  return useContext(NavContext)
}

export function NavProvider({ children }) {
  const navigate = useNavigate()
  const location = useLocation()

  // Extract page name from pathname (e.g., "/login" -> "login")
  // Default to 'dashboard' if path is "/"
  const page = location.pathname.substring(1) || 'dashboard'

  const handleNavigate = (pageName) => {
    // Basic mapping: 'dashboard' -> '/', others -> '/pageName'
    const path = pageName === 'dashboard' ? '/' : `/${pageName}`
    navigate(path)
  }

  return (
    <NavContext.Provider value={{ page, navigate: handleNavigate }}>
      {children}
    </NavContext.Provider>
  )
}
