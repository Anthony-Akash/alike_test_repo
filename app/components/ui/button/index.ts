import type { VariantProps } from "class-variance-authority"
import { cva } from "class-variance-authority"

export { default as Button } from "./Button.vue"

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-vd-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary-vd underline-offset-4 hover:underline",
        
        // Custom Project Variants
        "primary-vd": "bg-primary-vd text-white hover:bg-[#004B6F] active:scale-95",
        "pill-active-category": "border-surface-outline bg-primary-variant font-medium text-primary-vd border",
        "pill-inactive-category": "border-surface-outline bg-white text-black hover:border-primary/40 hover:bg-primary-variant/50 hover:text-primary-vd border",
        "pill-active": "border-primary bg-primary-variant font-medium text-primary-vd border",
        "pill-inactive": "border-border bg-surface text-primary-vd hover:bg-[#F6FAFF] active:bg-[#EBF5FF] disabled:bg-[#F2F0F4] border",
        "tab-active": "border-outline bg-primary-vd-variant text-primary-vd border",
        "tab-inactive": "bg-white text-on-surface hover:bg-surface-dim border border-outline",
        "surface": "bg-surface-dim text-text-title hover:bg-border",
        "blur-icon": "bg-white/80 backdrop-blur-sm transition-colors hover:bg-white text-on-surface",
        "floating": "bg-white shadow-lg ring-1 ring-gray-200 hover:-translate-y-1 hover:shadow-xl hover:ring-2 active:translate-y-0 active:scale-90 active:shadow-md",
        "outline-icon": "border border-border bg-white text-primary-vd shadow-sm hover:border-primary hover:bg-primary-variant hover:text-primary-vd hover:shadow-md active:scale-95"
      },
      size: {
        "default": "h-10 px-4 py-2",
        "sm": "h-9 rounded-md px-3",
        "lg": "h-11 rounded-md px-8",
        "icon": "h-10 w-10",
        "icon-sm": "size-9",
        "icon-lg": "size-11",
        
        // Custom Project Sizes
        "pill": "rounded-full px-4 py-2",
        "pill-lg": "h-12 min-w-35.5 rounded-full px-4 py-3 text-body leading-[24px]",
        "tab": "h-12 rounded-2xl px-4 py-2 text-body leading-[24px]",
        "icon-rounded": "size-8 rounded-full",
        "icon-floating": "size-11 rounded-full lg:size-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export type ButtonVariants = VariantProps<typeof buttonVariants>
