import { Bell, Menu } from "lucide-react";
import { useUIStore } from "@/store/ui.store";

export const Topbar = () => {
  const { toggleSidebar } = useUIStore();

  return (
    <header className="h-14 border-b border-border flex items-center justify-between px-4 bg-background flex-shrink-0">
      <button onClick={toggleSidebar} className="text-muted-foreground hover:text-foreground transition-colors lg:hidden">
        <Menu size={20} />
      </button>
      <div />
      <div className="flex items-center gap-4">
        {/* Live indicator */}
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-success animate-pulse-glow" />
          <span className="text-xs font-mono text-success tracking-widest">LIVE</span>
        </div>
        {/* Notification bell */}
        <button className="text-muted-foreground hover:text-foreground transition-colors relative">
          <Bell size={18} />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-destructive rounded-full" />
        </button>
        {/* Org switcher */}
        <div className="flex items-center gap-2 border border-border rounded-md px-3 py-1.5 text-xs font-mono text-foreground">
          <span>EDRIX Corp</span>
        </div>
      </div>
    </header>
  );
};
