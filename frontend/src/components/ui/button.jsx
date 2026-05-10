import * as React from "react"
import { cva } from "class-variance-authority";
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center gap-2 border border-transparent font-body text-sm font-semibold whitespace-nowrap cursor-pointer text-decoration-none transition-all duration-[120ms] ease outline-none select-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--brand-primary)] text-white hover:bg-[var(--brand-primary-hover)] hover:-translate-y-px hover:shadow-[var(--shadow-md)] focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]/30",
        secondary:
          "bg-[var(--brand-secondary)] text-white hover:bg-[var(--brand-secondary-hover)] hover:-translate-y-px focus-visible:ring-2 focus-visible:ring-[var(--brand-secondary)]/30",
        outline:
          "bg-transparent text-[var(--brand-primary)] border-[1.5px] border-[var(--brand-primary)] hover:bg-flame-50 dark:hover:bg-[var(--bg-muted)] focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]/30",
        ghost:
          "bg-transparent text-[var(--text-secondary)] border-[1.5px] border-[var(--border-default)] hover:bg-[var(--bg-muted)] hover:text-[var(--text-primary)] focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]/30",
        destructive:
          "bg-[var(--color-error)] text-white hover:bg-[#C53030] focus-visible:ring-2 focus-visible:ring-[var(--color-error)]/30",
        link:
          "text-[var(--brand-primary)] underline-offset-4 hover:underline border-none bg-transparent",
      },
      size: {
        default: "h-10 px-5 rounded-[var(--radius-lg)]",
        sm: "h-8 px-4 text-[13px] rounded-[var(--radius-md)]",
        lg: "h-[52px] px-8 text-base rounded-[var(--radius-xl)]",
        icon: "size-9 rounded-[var(--radius-md)]",
        "icon-sm": "size-8 rounded-[var(--radius-md)]",
        "icon-lg": "size-10 rounded-[var(--radius-lg)]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props} />
  );
}

export { Button, buttonVariants }
