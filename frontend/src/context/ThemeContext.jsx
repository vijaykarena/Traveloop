import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext(null)

function getInitialTheme() {
  // Check localStorage first
  const stored = localStorage.getItem('traveloop-theme')
  if (stored === 'dark' || stored === 'light') return stored

  // Fall back to system preference
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark'

  return 'light'
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('traveloop-theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'))
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider')
  return ctx
}
