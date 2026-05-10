import { useTheme } from '../../context/ThemeContext'
import { Sun, Moon } from 'lucide-react'

export default function ThemeToggle({ className = '' }) {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className={`inline-flex items-center gap-2 px-4 py-2 text-[13px] font-medium rounded-full
        bg-[var(--bg-muted)] border border-[var(--border-subtle)] text-[var(--text-secondary)]
        cursor-pointer whitespace-nowrap
        transition-all duration-[120ms] ease
        hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]
        focus-visible:outline-2 focus-visible:outline-[var(--brand-primary)] focus-visible:outline-offset-2
        ${className}`}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
      {theme === 'dark' ? 'Light' : 'Dark'}
    </button>
  )
}
