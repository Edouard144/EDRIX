import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";

const edrixButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-syne font-semibold text-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 tracking-wider uppercase",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground hover:opacity-90 shadow-[0_0_20px_hsl(184_100%_49%/0.2)]",
        outline: "border border-primary text-primary hover:bg-primary/10",
        ghost: "text-foreground hover:bg-secondary",
        danger: "bg-destructive text-destructive-foreground hover:opacity-90",
        muted: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      },
      size: {
        sm: "h-8 px-3 text-xs rounded-md",
        md: "h-10 px-5 text-sm rounded-md",
        lg: "h-12 px-8 text-sm rounded-lg",
        icon: "h-9 w-9 rounded-md",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface EdrixButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof edrixButtonVariants> {}

const EdrixButton = forwardRef<HTMLButtonElement, EdrixButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button className={cn(edrixButtonVariants({ variant, size }), className)} ref={ref} {...props} />
  )
);
EdrixButton.displayName = "EdrixButton";

export { EdrixButton, edrixButtonVariants };
