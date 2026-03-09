'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { useUIStore } from '@/store/ui.store';

const NAV = [
  { href: '/overview',      label: 'Overview',      icon: '◈' },
  { href: '/projects',      label: 'Projects',       icon: '⬡' },
  { href: '/jobs',          label: 'Jobs',           icon: '⟳' },
  { href: '/logs',          label: 'Logs',           icon: '≡' },
  { href: '/analytics',     label: 'Analytics',      icon: '◉' },
  { href: '/webhooks',      label: 'Webhooks',       icon: '⇌' },
  { href: '/billing',       label: 'Billing',        icon: '◇' },
  { href: '/settings',      label: 'Settings',       icon: '⚙' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, clearAuth } = useAuthStore();
  const { sidebarOpen, toggleSidebar } = useUIStore();

  return (
    <div className="min-h-screen bg-bg flex">

      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-56' : 'w-16'} border-r border-border flex flex-col transition-all duration-300 shrink-0`}>

        {/* Logo */}
        <div className="h-14 flex items-center px-4 border-b border-border">
          <div className="w-5 h-5 border border-cyan rotate-45 glow shrink-0" />
          {sidebarOpen && (
            <span className="font-display font-bold tracking-widest text-cyan ml-3 text-sm">EDRIX</span>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4">
          {NAV.map(({ href, label, icon }) => {
            const active = pathname === href;
            return (
              <Link key={href} href={href}
                className={`flex items-center gap-3 px-4 py-2.5 text-xs tracking-widest transition-colors
                  ${active
                    ? 'text-cyan border-r-2 border-cyan bg-cyan/5'
                    : 'text-muted hover:text-text hover:bg-card'}`}>
                <span className="text-base shrink-0">{icon}</span>
                {sidebarOpen && label}
              </Link>
            );
          })}
        </nav>

        {/* User */}
        {sidebarOpen && user && (
          <div className="p-4 border-t border-border">
            <div className="text-xs text-text truncate">{user.full_name}</div>
            <div className="text-xs text-muted truncate">{user.email}</div>
            <button onClick={clearAuth}
              className="text-xs text-muted hover:text-danger mt-2 transition-colors">
              Sign out
            </button>
          </div>
        )}
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Topbar */}
        <header className="h-14 border-b border-border flex items-center px-6 gap-4 shrink-0">
          <button onClick={toggleSidebar} className="text-muted hover:text-cyan transition-colors text-lg">
            ☰
          </button>
          <div className="flex items-center gap-2 ml-auto">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse-cyan" />
            <span className="text-xs text-muted tracking-widest">LIVE</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-auto animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
}