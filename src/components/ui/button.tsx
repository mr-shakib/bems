import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold transition-all duration-300 ease-out transform hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:bg-neutral-100 disabled:from-neutral-100 disabled:to-neutral-100 disabled:text-neutral-300 border-neutral-300 disabled:shadow-sm disabled:hover:scale-100",
  {
    variants: {
      variant: {
        primary:
          "bg-gradient-to-b from-blue-600 to-blue-700 text-primary-foreground hover:from-blue-700 hover:to-blue-700 hover:shadow-lg hover:shadow-blue-500/25",
        destructive:
          "bg-gradient-to-b from-amber-600 to-amber-700 text-destructive-foreground hover:from-amber-700 hover:to-amber-700 hover:shadow-lg hover:shadow-amber-500/25",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground hover:shadow-md hover:border-accent",
        secondary: "bg-white text-black hover:bg-neutral-100 border border-neutral-200 hover:shadow-md hover:border-neutral-300",
        ghost: "border-transparent shadow-none hover:bg-accent hover:text-accent-foreground hover:shadow-sm",
        muted: "bg-neutral-200 text-neutral-600 hover:bg-neutral-200/80 hover:shadow-sm",
        tertiary: "bg-blue-100 text-blue-600 border-transparent hover:bg-blue-200 shadow-none hover:shadow-sm",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-md px-3",
        xs: "h-7 rounded-md px-2 text-xs",
        lg: "h-12 rounded-md px-8",
        icon: "h-8 w-8",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
