import { cn } from "@/lib/utils";

interface EdrixCardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

const EdrixCard = ({ className, hover = false, children, ...props }: EdrixCardProps) => (
  <div
    className={cn(
      "rounded-lg bg-card border border-border p-5",
      hover && "transition-all duration-200 hover:border-primary/30 hover:shadow-[0_0_20px_hsl(184_100%_49%/0.05)]",
      className
    )}
    {...props}
  >
    {children}
  </div>
);

export { EdrixCard };
