import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface EdrixModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

const EdrixModal = ({ open, onClose, title, children, footer, className }: EdrixModalProps) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      <div
        className={cn(
          "relative z-10 w-full max-w-lg rounded-lg bg-card border border-border p-6 animate-fade-slide-up",
          className
        )}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-syne font-bold text-lg text-foreground">{title}</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X size={18} />
          </button>
        </div>
        <div>{children}</div>
        {footer && <div className="mt-6 flex justify-end gap-3">{footer}</div>}
      </div>
    </div>
  );
};

export { EdrixModal };
