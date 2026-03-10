import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const edrixBadgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-mono font-medium tracking-wide",
  {
    variants: {
      variant: {
        default: "bg-secondary text-secondary-foreground",
        success: "bg-success/15 text-success border border-success/20",
        warning: "bg-warning/15 text-warning border border-warning/20",
        danger: "bg-destructive/15 text-destructive border border-destructive/20",
        info: "bg-primary/15 text-primary border border-primary/20",
        muted: "bg-muted text-muted-foreground",
        cyan: "bg-primary/10 text-primary",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

interface EdrixBadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof edrixBadgeVariants> {}

const EdrixBadge = ({ className, variant, ...props }: EdrixBadgeProps) => (
  <span className={cn(edrixBadgeVariants({ variant }), className)} {...props} />
);

export { EdrixBadge, edrixBadgeVariants };
