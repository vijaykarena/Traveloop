import Chrome from '../Chrome'
import Controls from '../Controls'

/**
 * PageLayout — Common page wrapper used by all authenticated pages.
 * Eliminates repeated layout boilerplate across pages.
 *
 * @param {string} active — Nav item to highlight in Chrome header
 * @param {string} title — Page title
 * @param {string} subtitle — Page subtitle text
 * @param {React.ReactNode} badge — Optional badge element above the title
 * @param {React.ReactNode} titleAction — Optional action element next to the title
 * @param {string} searchPlaceholder — If provided, renders the Controls search bar
 * @param {React.ReactNode} controlsExtra — Extra elements for the Controls bar
 * @param {boolean} noChrome — If true, skip rendering the Chrome header
 * @param {boolean} noPadding — If true, skip default content padding
 * @param {React.ReactNode} children — Page content
 * @param {string} className — Additional classes for the content wrapper
 */
export default function PageLayout({
  active = 'Discover',
  title,
  subtitle,
  badge,
  titleAction,
  searchPlaceholder,
  controlsExtra,
  noChrome = false,
  noPadding = false,
  children,
  className = '',
}) {
  return (
    <div className="flex flex-col h-screen bg-[var(--bg-page)] text-[var(--text-primary)] font-body overflow-hidden">
      {!noChrome && <Chrome active={active} />}

      {/* Title Bar */}
      {title && (
        <div className="px-8 py-6 border-b border-[var(--border-subtle)] shrink-0 bg-[var(--bg-surface)]">
          {badge && <div className="mb-2">{badge}</div>}
          <div className="flex items-start justify-between">
            <div>
              <h1 className="font-display text-3xl font-bold tracking-tight text-[var(--text-primary)]">
                {title}
              </h1>
              {subtitle && (
                <p className="text-[var(--text-secondary)] mt-1">{subtitle}</p>
              )}
            </div>
            {titleAction && <div>{titleAction}</div>}
          </div>
        </div>
      )}

      {/* Search / Controls Bar */}
      {searchPlaceholder && (
        <Controls q={searchPlaceholder} extra={controlsExtra} />
      )}

      {/* Main Content */}
      <div className={`flex-1 overflow-auto ${noPadding ? '' : ''} ${className}`}>
        {children}
      </div>
    </div>
  )
}
