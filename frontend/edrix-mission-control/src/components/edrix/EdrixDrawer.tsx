import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface EdrixDrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const EdrixDrawer = ({ open, onClose, title, children }: EdrixDrawerProps) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" onClick={onClose} />
      <div className={cn(
        "relative z-10 w-[400px] h-full bg-card border-l border-border p-6 overflow-y-auto",
        "animate-[slide-in-right_0.3s_ease-out]"
      )}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-syne font-bold text-lg text-foreground">{title}</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export { EdrixDrawer };
