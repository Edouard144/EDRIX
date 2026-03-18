import { useEffect, useState } from "react";
import { StatCard } from "@/components/modules/overview/StatCard";
import { EdrixBadge } from "@/components/edrix/EdrixBadge";
import { EdrixCard } from "@/components/edrix/EdrixCard";
import { useAuthStore } from "@/store/auth.store";
import { useOrgs } from "@/hooks/useOrgs";
import { useLogs } from "@/hooks/useLogs";
import { useJobs } from "@/hooks/useJobs";
import { useBilling } from "@/hooks/useBilling";
import { AlertTriangle } from "lucide-react";
import { EdrixButton } from "@/components/edrix/EdrixButton";

const methodColor: Record<string, string> = { GET: "info", POST: "success", DELETE: "danger", PATCH: "warning" };
const statusColor = (s: number) => s < 300 ? "success" : s < 500 ? "warning" : "danger";

const OverviewPage = () => {
  const user = useAuthStore((s) => s.user);
  const { orgs } = useOrgs();
  const { logs, stats: logStats } = useLogs({});
  const { jobs } = useJobs('running');
  const { usage } = useBilling();
  
  const runningJobs = jobs?.length || 0;

  // Transform logs to request rows
  const requests = logs.slice(0, 20).map((log: any, i: number) => ({
    id: log.id || i,
    method: log.method || 'GET',
    path: log.path || '/api/unknown',
    status: log.status || 200,
    latency: log.duration ? `${log.duration}ms` : '0ms',
    time: log.timestamp ? new Date(log.timestamp).toLocaleTimeString() : new Date().toLocaleTimeString(),
  }));

  return (
    <div className="space-y-6 animate-fade-slide-up">
      <div>
        <h1 className="font-syne font-bold text-3xl text-foreground">Welcome back, {user?.full_name || 'Developer'}</h1>
        <p className="font-mono text-sm text-muted-foreground mt-1">Here's your infrastructure at a glance.</p>
      </div>

      {/* Stat cards - using real data from hooks */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
        <StatCard label="Organizations" value={String(orgs.length)} subtitle="+1 this month" />
        <StatCard label="API Requests Today" value={logStats?.total_requests?.toLocaleString() || "0"} subtitle="↑ from baseline" />
        <StatCard label="Active Jobs" value={String(runningJobs)} subtitle="running now" />
        <StatCard label="Monthly Spend" value={usage ? `$${usage.total?.toFixed(2) || '0.00'}` : "$0.00"} subtitle="Est. total" />
      </div>

      {/* Anomaly banner - could be conditionally rendered based on real data */}
      {logStats?.error_rate && logStats.error_rate > 10 && (
        <div className="flex items-center gap-3 border border-warning/30 bg-warning/5 rounded-lg px-5 py-3">
          <AlertTriangle size={18} className="text-warning flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-mono text-warning">ANOMALY DETECTED</p>
            <p className="text-xs font-mono text-muted-foreground">Error rate is {logStats.error_rate}% — above baseline</p>
          </div>
          <EdrixButton variant="outline" size="sm">Investigate</EdrixButton>
        </div>
      )}

      {/* Live request feed */}
      <EdrixCard>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-syne font-bold text-lg text-foreground">Live Request Feed</h2>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse-glow" />
            <span className="text-xs font-mono text-success">STREAMING</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="text-left py-2 px-3">METHOD</th>
                <th className="text-left py-2 px-3">PATH</th>
                <th className="text-left py-2 px-3">STATUS</th>
                <th className="text-left py-2 px-3">LATENCY</th>
                <th className="text-left py-2 px-3">TIME</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req, i) => (
                <tr key={req.id} className={`border-b border-border/50 hover:bg-secondary/30 transition-colors ${i === 0 ? 'animate-slide-in-bottom' : ''}`}>
                  <td className="py-2 px-3"><EdrixBadge variant={methodColor[req.method] as any}>{req.method}</EdrixBadge></td>
                  <td className="py-2 px-3 text-foreground">{req.path}</td>
                  <td className="py-2 px-3"><EdrixBadge variant={statusColor(req.status) as any}>{req.status}</EdrixBadge></td>
                  <td className="py-2 px-3 text-muted-foreground">{req.latency}</td>
                  <td className="py-2 px-3 text-muted-foreground">{req.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </EdrixCard>

      {/* System Health - could come from a health check endpoint */}
      <div>
        <h2 className="font-syne font-bold text-lg text-foreground mb-3">System Health</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 stagger-children">
          <EdrixCard className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-success animate-pulse-glow" />
            <div>
              <p className="text-sm font-mono text-foreground">Auth</p>
              <p className="text-xs font-mono text-success">UP</p>
            </div>
          </EdrixCard>
          <EdrixCard className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-success animate-pulse-glow" />
            <div>
              <p className="text-sm font-mono text-foreground">Jobs</p>
              <p className="text-xs font-mono text-success">UP</p>
            </div>
          </EdrixCard>
          <EdrixCard className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-success animate-pulse-glow" />
            <div>
              <p className="text-sm font-mono text-foreground">Webhooks</p>
              <p className="text-xs font-mono text-success">UP</p>
            </div>
          </EdrixCard>
          <EdrixCard className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-success animate-pulse-glow" />
            <div>
              <p className="text-sm font-mono text-foreground">Billing</p>
              <p className="text-xs font-mono text-success">UP</p>
            </div>
          </EdrixCard>
        </div>
      </div>
    </div>
  );
};

export default OverviewPage;
