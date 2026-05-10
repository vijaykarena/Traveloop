/**
 * SectionHeader — Reusable section header matching the design system's
 * eyebrow + title + description pattern.
 *
 * @param {string} eyebrow — Small uppercase label above the title
 * @param {string} title — Section title (uses Syne display font)
 * @param {string} description — Supporting description text
 * @param {React.ReactNode} trailing — Right-side action (button, link, etc.)
 * @param {string} className — Additional wrapper classes
 */
export default function SectionHeader({
  eyebrow,
  title,
  description,
  trailing,
  className = '',
}) {
  return (
    <div className={`mb-6 ${className}`}>
      <div className="flex items-baseline justify-between">
        <div>
          {eyebrow && (
            <div className="text-[11px] font-bold uppercase tracking-[1.5px] text-[var(--brand-primary)] mb-2">
              {eyebrow}
            </div>
          )}
          {title && (
            <h2 className="font-display text-2xl font-bold tracking-tight text-[var(--text-primary)] leading-tight">
              {title}
            </h2>
          )}
          {description && (
            <p className="text-sm text-[var(--text-secondary)] mt-1 max-w-[600px]">
              {description}
            </p>
          )}
        </div>
        {trailing && <div className="shrink-0 ml-4">{trailing}</div>}
      </div>
    </div>
  )
}
