import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface EdrixInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const EdrixInput = forwardRef<HTMLInputElement, EdrixInputProps>(
  ({ className, label, ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={cn(
          "h-10 w-full rounded-md bg-secondary border border-border px-3 py-2 text-sm font-mono text-foreground",
          "placeholder:text-muted-foreground",
          "focus:outline-none focus:border-primary focus:shadow-[0_0_8px_hsl(184_100%_49%/0.2)]",
          "transition-all duration-200",
          className
        )}
        {...props}
      />
    </div>
  )
);
EdrixInput.displayName = "EdrixInput";

export { EdrixInput };
