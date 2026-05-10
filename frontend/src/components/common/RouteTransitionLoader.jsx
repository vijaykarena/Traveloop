import { useState, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * RouteTransitionLoader — Fullscreen loading overlay shown during page transitions.
 *
 * Listens to React Router location changes and displays the loading.gif
 * for a minimum duration to avoid jarring flashes, then fades out smoothly.
 *
 * Production considerations:
 *  - Skips initial mount (Layer 1 HTML splash handles that)
 *  - Minimum 400ms display prevents flash on fast navigations
 *  - 300ms CSS fade-out for smooth exit
 *  - Accessible: role="status" + aria-live for screen readers
 *  - Respects prefers-reduced-motion (via animations.css media query)
 *  - Theme-aware background via CSS custom properties
 */
export default function RouteTransitionLoader() {
  const location = useLocation()
  const [visible, setVisible] = useState(false)
  const [fading, setFading] = useState(false)
  const isFirstRender = useRef(true)
  const timersRef = useRef({ display: null, fade: null })

  useEffect(() => {
    // Skip the initial mount — the HTML splash already covers that
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    // Clear any pending timers from a rapid navigation
    clearTimeout(timersRef.current.display)
    clearTimeout(timersRef.current.fade)

    // Show the loader
    setVisible(true)
    setFading(false)

    // After minimum display time, begin fade-out
    timersRef.current.display = setTimeout(() => {
      setFading(true)

      // After fade animation completes, unmount
      timersRef.current.fade = setTimeout(() => {
        setVisible(false)
        setFading(false)
      }, 300) // matches CSS transition duration
    }, 400) // minimum display time

    return () => {
      clearTimeout(timersRef.current.display)
      clearTimeout(timersRef.current.fade)
    }
  }, [location.pathname])

  if (!visible) return null

  return (
    <div
      className={`route-loader ${fading ? 'route-loader--fading' : ''}`}
      role="status"
      aria-live="assertive"
    >
      <img
        src="/loading.gif"
        alt=""
        className="route-loader__img"
      />
      <span className="sr-only">Loading page…</span>
    </div>
  )
}
