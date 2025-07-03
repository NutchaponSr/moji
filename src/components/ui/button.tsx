import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-normal transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive [&_svg]:stroke-[1.75]",
  {
    variants: {
      variant: {
        default: "bg-primary text-white dark:text-black shadow-xs hover:bg-primary/90",
        destructive: "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline: "border border-border text-primary bg-background hover:bg-accent hover:text-primary dark:bg-transparent dark:hover:bg-accent",
        secondary: "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost: "text-primary hover:bg-accent",
        icon: "text-foreground hover:bg-accent",
        link: "text-primary underline-offset-4 hover:underline",
        item: "justify-start text-primary font-normal hover:bg-accent hover:text-primary !gap-2",
        primary: "bg-[#2383e2] hover:bg-[#0077d4] text-white shadow-[inset_0_0_0_1px_rgba(15,15,15,0.1),0_1px_2px_rgba(15,15,15,0.1)]",
      },
      size: {
        default: "h-8 px-3 py-2",
        sm: "h-7 rounded-sm gap-1.5 px-2 ![&_svg]:size-3",
        md: "h-7.5 rounded-sm gap-1.5 px-3",
        xs: "h-6 rounded-sm gap-1 font-normal text-xs px-2 ![&_svg]:size-3",
        lg: "h-9 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-7 rounded-sm",
        smIcon: "size-6 rounded",
        xsIcon: "size-5 rounded",
        mdIcon: "size-8 rounded-md",
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
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
