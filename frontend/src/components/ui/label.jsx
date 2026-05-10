import * as React from "react"

import { cn } from "@/lib/utils"

function Label({ className, ...props }) {
  return (
    <label
      data-slot="label"
      className={cn(
        "block text-xs font-semibold text-[var(--text-secondary)] select-none",
        "peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className,
      )}
      {...props}
    />
  )
}

export { Label }
