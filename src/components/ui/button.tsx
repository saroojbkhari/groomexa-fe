import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import { Slot } from "radix-ui"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-transparent bg-clip-padding text-center font-semibold whitespace-nowrap transition-all outline-none select-none focus-visible:ring-3 focus-visible:ring-ring/40 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        /** The one main action in a view (coral). */
        default: "bg-primary text-primary-foreground shadow-[0_1px_2px_rgba(14,47,46,0.12)] hover:bg-coral-600",
        /** Strong secondary action (ink). */
        dark: "bg-ink text-cream hover:bg-teal-700",
        /** Default secondary action: quiet, bordered. */
        outline: "border-border bg-white text-foreground shadow-[0_1px_2px_rgba(14,47,46,0.05)] hover:border-stone hover:bg-cream aria-expanded:bg-muted",
        /** Bold 2px outline used on the marketing site. */
        strong: "border-2 border-ink text-ink hover:bg-ink hover:text-cream",
        secondary: "bg-secondary text-secondary-foreground hover:bg-sand/70",
        /** Low-priority / inline action: text only. */
        ghost: "text-teal hover:bg-muted hover:text-foreground aria-expanded:bg-muted",
        destructive: "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:ring-destructive/20",
        link: "text-teal underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-[18px] text-[15px]",
        sm: "h-9 px-3 text-[13px]",
        lg: "h-12 px-6 text-base",
        /** Marketing hero CTAs. */
        xl: "min-h-11 px-[30px] py-[18px] text-[17px]",
        icon: "size-11",
        "icon-sm": "size-9",
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
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
