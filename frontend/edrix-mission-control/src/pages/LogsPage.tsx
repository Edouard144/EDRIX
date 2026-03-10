import { useState } from "react";
import { EdrixCard } from "@/components/edrix/EdrixCard";
import { EdrixBadge } from "@/components/edrix/EdrixBadge";
import { EdrixInput } from "@/components/edrix/EdrixInput";
import { useLogs } from "@/hooks/useLogs";
import { ChevronDown, ChevronRight, RefreshCw } from "lucide-react";
import { StatCard } from "@/components/modules/overview/StatCard";

const levels = ["ALL", "INFO", "WARN", "ERROR", "DEBUG"] as const;
const sources = ["ALL", "auth", "jobs", "billing", "webhooks", "api-gateway"] as const;

const levelVariant: Record<string, string> = { INFO: "info", WARN: "warning", ERROR: "danger", DEBUG: "muted" };

const LogsPage = () => {
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState("ALL");
  const [sourceFilter, setSourceFilter] = useState("ALL");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [live, setLive] = useState(true);

  const filters = {
    level: levelFilter === "ALL" ? undefined : levelFilter,
    source: sourceFilter === "ALL" ? undefined : sourceFilter,
    search: search || undefined,
  };

  const { logs, stats, isLoading, refetch } = useLogs(filters);

  const errorCount = stats?.by_level?.ERROR || 0;
  const warnCount = stats?.by_level?.WARN || 0;
  const infoCount = stats?.by_level?.INFO || 0;

  return (
    <div className="space-y-6 animate-fade-slide-up">
      <div className="flex items-center justify-between">
        <h1 className="font-syne font-bold text-3xl text-foreground">Logs</h1>
        <button
          onClick={() => setLive(!live)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-mono transition-colors ${
            live ? "bg-success/10 text-success" : "bg-secondary text-muted-foreground"
          }`}
        >
          <RefreshCw size={12} className={live ? "animate-spin" : ""} style={live ? { animationDuration: '3s' } : {}} />
          {live ? "LIVE" : "PAUSED"}
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="flex-1 min-w-[200px]">
          <EdrixInput placeholder="Search logs..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select
          value={levelFilter}
          onChange={(e) => setLevelFilter(e.target.value)}
          className="h-10 bg-secondary border border-border rounded-md px-3 text-sm font-mono text-foreground focus:border-primary focus:outline-none"
        >
          {levels.map((l) => <option key={l} value={l}>{l}</option>)}
        </select>
        <select
          value={sourceFilter}
          onChange={(e) => setSourceFilter(e.target.value)}
          className="h-10 bg-secondary border border-border rounded-md px-3 text-sm font-mono text-foreground focus:border-primary focus:outline-none"
        >
          {sources.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Total (24h)" value={stats?.total_requests?.toLocaleString() || "0"} />
        <StatCard label="Errors" value={String(errorCount)} />
        <StatCard label="Warnings" value={String(warnCount)} />
        <StatCard label="Info" value={String(infoCount)} />
      </div>

      {/* Log table */}
      <EdrixCard className="p-0">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="text-center py-10 text-muted-foreground">Loading logs...</div>
          ) : (
            <table className="w-full text-xs font-mono">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="text-left py-3 px-4 w-8"></th>
                  <th className="text-left py-3 px-4">TIMESTAMP</th>
                  <th className="text-left py-3 px-4">LEVEL</th>
                  <th className="text-left py-3 px-4">SOURCE</th>
                  <th className="text-left py-3 px-4">MESSAGE</th>
                </tr>
              </thead>
              <tbody>
                {logs && logs.length > 0 ? logs.map((log: any, idx: number) => (
                  <>
                    <tr
                      key={log.id || idx}
                      onClick={() => setExpandedId(expandedId === (log.id || idx) ? null : (log.id || idx))}
                      className={`border-b border-border/50 hover:bg-secondary/30 cursor-pointer transition-colors ${
                        log.level === 'ERROR' ? 'border-l-2 border-l-destructive' : log.level === 'WARN' ? 'border-l-2 border-l-warning' : ''
                      }`}
                    >
                      <td className="py-3 px-4 text-muted-foreground">
                        {expandedId === (log.id || idx) ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground whitespace-nowrap">{new Date(log.created_at).toLocaleString()}</td>
                      <td className="py-3 px-4"><EdrixBadge variant={levelVariant[log.level] as any || "default"}>{log.level}</EdrixBadge></td>
                      <td className="py-3 px-4"><EdrixBadge variant="default">{log.source}</EdrixBadge></td>
                      <td className="py-3 px-4 text-foreground">{log.message}</td>
                    </tr>
                    {expandedId === (log.id || idx) && log.metadata && (
                      <tr key={`${log.id || idx}-meta`} className="border-b border-border/50">
                        <td colSpan={5} className="px-12 py-3">
                          <pre className="text-xs font-mono text-muted-foreground bg-secondary/50 rounded p-3 overflow-x-auto">
                            {JSON.stringify(log.metadata, null, 2)}
                          </pre>
                        </td>
                      </tr>
                    )}
                  </>
                )) : (
                  <tr>
                    <td colSpan={5} className="text-center py-10 text-muted-foreground">No logs found</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </EdrixCard>
    </div>
  );
};

export default LogsPage;
