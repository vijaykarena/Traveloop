import { createContext, useContext, useState } from 'react'

const NavContext = createContext(null)

export function useNav() {
  return useContext(NavContext)
}

export function NavProvider({ children }) {
  const [page, setPage] = useState('dashboard')
  return (
    <NavContext.Provider value={{ page, navigate: setPage }}>
      {children}
    </NavContext.Provider>
  )
}
