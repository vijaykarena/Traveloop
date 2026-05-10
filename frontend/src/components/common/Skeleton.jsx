import { cn } from '@/lib/utils'

/**
 * Skeleton — Loading placeholder with shimmer animation.
 * Uses the shimmer keyframe from animations.css.
 *
 * @param {string} width — CSS width value
 * @param {string} height — CSS height value
 * @param {string} radius — Border radius (defaults to --radius-md)
 * @param {boolean} circle — If true, renders as a circle
 * @param {string} className — Additional classes
 */
export default function Skeleton({
  width,
  height,
  radius,
  circle = false,
  className = '',
  ...props
}) {
  return (
    <div
      className={cn('skeleton', className)}
      style={{
        width: circle ? height : width,
        height,
        borderRadius: circle ? 'var(--radius-full)' : (radius || undefined),
      }}
      {...props}
    />
  )
}
