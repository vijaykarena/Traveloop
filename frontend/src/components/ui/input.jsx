import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "font-body text-sm w-full min-w-0",
        "bg-[var(--bg-surface)] text-[var(--text-primary)]",
        "border-[1.5px] border-[var(--border-default)] rounded-[var(--radius-lg)]",
        "px-4 py-2.5 h-11",
        "outline-none transition-all duration-[120ms] ease",
        "placeholder:text-[var(--text-tertiary)]",
        "focus:border-[var(--brand-primary)] focus:shadow-[0_0_0_3px_rgba(255,107,43,0.15)]",
        "disabled:pointer-events-none disabled:opacity-50",
        "file:text-[var(--text-primary)] file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium",
        className,
      )}
      {...props}
    />
  )
}

export { Input }
