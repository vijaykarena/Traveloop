import * as React from "react"
import { Checkbox as CheckboxPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"
import { Check } from "lucide-react"

function Checkbox({
  className,
  ...props
}) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer relative flex size-4 shrink-0 items-center justify-center rounded-[5px] border border-transparent",
        "bg-input/90 transition-shadow outline-none",
        "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-[var(--brand-primary)]/30",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "data-checked:border-[var(--brand-primary)] data-checked:bg-[var(--brand-primary)] data-checked:text-white",
        className,
      )}
      {...props}>
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="grid place-content-center text-current transition-none [&>svg]:size-3.5">
        <Check />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox }
