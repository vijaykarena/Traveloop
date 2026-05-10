import * as React from "react"
import { cva } from "class-variance-authority";
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "group/badge inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border border-transparent px-2.5 py-0.5 text-[11px] font-semibold whitespace-nowrap tracking-[0.3px] transition-all [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--brand-primary)] text-white",
        primary:
          "bg-flame-100 text-flame-700 dark:bg-flame-800 dark:text-flame-200",
        secondary:
          "bg-ocean-50 text-ocean-700 dark:bg-ocean-800 dark:text-ocean-200",
        success:
          "bg-[#C6F6D5] text-[#276749] dark:bg-[rgba(56,161,105,0.2)] dark:text-[#9AE6B4]",
        warning:
          "bg-[#FEFCBF] text-[#975A16] dark:bg-[rgba(221,107,32,0.2)] dark:text-[#FBD38D]",
        destructive:
          "bg-[#FED7D7] text-[#9B2C2C] dark:bg-[rgba(229,62,62,0.2)] dark:text-[#FEB2B2]",
        neutral:
          "bg-ink-100 text-ink-700 dark:bg-ink-700 dark:text-ink-200",
        outline:
          "border-[var(--border-default)] text-[var(--text-primary)] bg-transparent",
        ghost:
          "hover:bg-[var(--bg-muted)] hover:text-[var(--text-primary)]",
        accent:
          "bg-flame-100 text-flame-700 dark:bg-flame-800 dark:text-flame-200",
        info:
          "bg-[#BEE3F8] text-[#2A4365] dark:bg-[rgba(49,130,206,0.2)] dark:text-[#90CDF4]",
        link:
          "text-[var(--brand-primary)] underline-offset-4 hover:underline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props} />
  );
}

export { Badge, badgeVariants }
