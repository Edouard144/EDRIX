import { useLocation, Link } from "react-router-dom";
import {
  LayoutDashboard, FolderKanban, RefreshCw, AlignLeft,
  BarChart3, Webhook, CreditCard, Settings, LogOut, PanelLeftClose, PanelLeft
} from "lucide-react";
import { EdrixLogo } from "@/components/EdrixLogo";
import { useUIStore } from "@/store/ui.store";
import { useAuthStore } from "@/store/auth.store";
import { cn } from "@/lib/utils";

const navItems = [
  { title: "Overview", path: "/overview", icon: LayoutDashboard },
  { title: "Projects", path: "/projects", icon: FolderKanban },
  { title: "Jobs", path: "/jobs", icon: RefreshCw },
  { title: "Logs", path: "/logs", icon: AlignLeft },
  { title: "Analytics", path: "/analytics", icon: BarChart3 },
  { title: "Webhooks", path: "/webhooks", icon: Webhook },
  { title: "Billing", path: "/billing", icon: CreditCard },
  { title: "Settings", path: "/settings", icon: Settings },
];

export const Sidebar = () => {
  const { sidebarCollapsed, toggleSidebar } = useUIStore();
  const { user, logout } = useAuthStore();
  const location = useLocation();

  return (
    <aside
      className={cn(
        "h-screen flex flex-col border-r border-border bg-[#0a0a0a] transition-all duration-300 flex-shrink-0",
        sidebarCollapsed ? "w-[60px]" : "w-[220px]"
      )}
    >
      {/* Header */}
      <div className="h-14 flex items-center justify-between px-3 border-b border-border">
        <EdrixLogo collapsed={sidebarCollapsed} />
        <button onClick={toggleSidebar} className="text-muted-foreground hover:text-foreground transition-colors">
          {sidebarCollapsed ? <PanelLeft size={16} /> : <PanelLeftClose size={16} />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 flex flex-col gap-0.5 px-2">
        {navItems.map((item) => {
          const active = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-mono transition-all duration-150 relative",
                active
                  ? "text-primary bg-primary/5"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              )}
            >
              {active && <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-primary rounded-l" />}
              <item.icon size={18} />
              {!sidebarCollapsed && <span>{item.title}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="border-t border-border p-3">
        {!sidebarCollapsed ? (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-mono text-foreground">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-mono text-foreground truncate">{user?.name || 'User'}</p>
              <p className="text-xs font-mono text-muted-foreground truncate">{user?.email || 'user@edrix.dev'}</p>
            </div>
            <button onClick={logout} className="text-muted-foreground hover:text-destructive transition-colors">
              <LogOut size={14} />
            </button>
          </div>
        ) : (
          <button onClick={logout} className="w-full flex justify-center text-muted-foreground hover:text-destructive transition-colors">
            <LogOut size={16} />
          </button>
        )}
      </div>
    </aside>
  );
};
