import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "font-body text-sm w-full min-w-0 min-h-16",
        "bg-[var(--bg-surface)] text-[var(--text-primary)]",
        "border-[1.5px] border-[var(--border-default)] rounded-[var(--radius-lg)]",
        "px-4 py-2.5",
        "outline-none transition-all duration-[120ms] ease",
        "placeholder:text-[var(--text-tertiary)]",
        "focus:border-[var(--brand-primary)] focus:shadow-[0_0_0_3px_rgba(255,107,43,0.15)]",
        "disabled:pointer-events-none disabled:opacity-50",
        "resize-y",
        className,
      )}
      {...props}
    />
  )
}

export { Textarea }
