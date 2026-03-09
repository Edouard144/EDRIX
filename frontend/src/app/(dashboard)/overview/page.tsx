'use client';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/auth.store';
import api from '@/lib/api';

// Stat card component
const StatCard = ({ label, value, sub, color = 'cyan' }: any) => (
  <div className="bg-card border border-border p-5 hover:border-cyan/30 transition-colors">
    <div className="text-xs tracking-widest text-muted mb-3">{label}</div>
    <div className={`font-display text-3xl font-bold text-${color}`}>{value}</div>
    {sub && <div className="text-xs text-muted mt-1">{sub}</div>}
  </div>
);

export default function OverviewPage() {
  const { user } = useAuthStore();
  const [orgs, setOrgs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/organizations')
      .then((r) => setOrgs(r.data.data.orgs))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-white">
          Welcome back, <span className="text-cyan">{user?.full_name?.split(' ')[0]}</span>
        </h1>
        <p className="text-muted text-sm mt-1">Your universe is running.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="ORGANIZATIONS" value={orgs.length} sub="active workspaces" />
        <StatCard label="STATUS"        value="ONLINE"      sub="all systems go"     color="success" />
        <StatCard label="ACCOUNT"       value={user?.is_email_verified ? 'VERIFIED' : 'UNVERIFIED'} color={user?.is_email_verified ? 'success' : 'warn'} />
        <StatCard label="PLAN"          value="FREE"        sub="upgrade anytime"    color="cyan" />
      </div>

      {/* Organizations */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg font-bold text-white">Organizations</h2>
          <button className="text-xs tracking-widest text-cyan border border-cyan/30 px-4 py-2 hover:bg-cyan/5 transition-colors">
            + NEW ORG
          </button>
        </div>

        {loading ? (
          <div className="text-muted text-sm">Loading...</div>
        ) : orgs.length === 0 ? (
          <div className="bg-card border border-border border-dashed p-8 text-center">
            <div className="text-muted text-sm">No organizations yet.</div>
            <button className="text-cyan text-xs mt-2 tracking-widest">Create your first org →</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {orgs.map((org) => (
              <div key={org.id} className="bg-card border border-border p-5 hover:border-cyan/30 transition-colors cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-display font-bold text-white">{org.name}</span>
                  <span className="text-xs text-muted bg-bg px-2 py-1 border border-border">{org.role}</span>
                </div>
                <div className="text-xs text-muted">/{org.slug}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}