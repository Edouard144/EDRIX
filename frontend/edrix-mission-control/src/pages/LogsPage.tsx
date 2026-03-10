import { useState } from "react";
import { EdrixCard } from "@/components/edrix/EdrixCard";
import { EdrixBadge } from "@/components/edrix/EdrixBadge";
import { EdrixInput } from "@/components/edrix/EdrixInput";
import { ChevronDown, ChevronRight, RefreshCw } from "lucide-react";
import { StatCard } from "@/components/modules/overview/StatCard";

const levels = ["ALL", "INFO", "WARN", "ERROR", "DEBUG"] as const;
const sources = ["ALL", "auth", "jobs", "billing", "webhooks", "api-gateway"] as const;

const mockLogs = [
  { id: 1, ts: "2026-03-10 09:16:42.123", level: "INFO", source: "api-gateway", msg: "GET /api/v1/users → 200 (42ms)", meta: { request_id: "req_a1b2c3", ip: "192.168.1.42", user_agent: "axios/1.6.0" } },
  { id: 2, ts: "2026-03-10 09:16:41.890", level: "ERROR", source: "jobs", msg: "Job webhook.deliver failed after 3 attempts: Connection timeout to https://hooks.example.com", meta: { job_id: "job_x9y8z7", error_code: "ETIMEDOUT", stack: "Error: connect ETIMEDOUT..." } },
  { id: 3, ts: "2026-03-10 09:16:40.456", level: "WARN", source: "billing", msg: "Approaching rate limit for Stripe API — 89/100 requests this second", meta: { rate_limit_remaining: 11, window: "1s" } },
  { id: 4, ts: "2026-03-10 09:16:39.001", level: "INFO", source: "auth", msg: "User usr_d4e5f6 authenticated via OAuth2 (Google)", meta: { provider: "google", session_id: "sess_m1n2o3" } },
  { id: 5, ts: "2026-03-10 09:16:38.222", level: "DEBUG", source: "api-gateway", msg: "Rate limiter check: org_a1b2c3 — 142/10000 requests", meta: { org_id: "org_a1b2c3", plan: "pro" } },
  { id: 6, ts: "2026-03-10 09:16:37.555", level: "INFO", source: "webhooks", msg: "Webhook wh_p4q5r6 delivered successfully to https://api.client.com/hook", meta: { webhook_id: "wh_p4q5r6", response_code: 200, latency: "234ms" } },
  { id: 7, ts: "2026-03-10 09:16:36.111", level: "ERROR", source: "auth", msg: "Failed login attempt for admin@example.com — invalid password (attempt 3/5)", meta: { ip: "203.0.113.42", blocked: false } },
  { id: 8, ts: "2026-03-10 09:16:35.888", level: "INFO", source: "jobs", msg: "Job analytics.aggregate_daily completed in 34.5s", meta: { job_id: "job_w1x2y3", records_processed: 142890 } },
  { id: 9, ts: "2026-03-10 09:16:34.333", level: "WARN", source: "api-gateway", msg: "Slow response detected: POST /api/v1/projects/deploy took 4.2s", meta: { threshold: "2s", actual: "4.2s" } },
  { id: 10, ts: "2026-03-10 09:16:33.777", level: "INFO", source: "billing", msg: "Invoice INV-2026-0314 generated for org_a1b2c3 — $482.50", meta: { invoice_id: "INV-2026-0314", amount: 482.5 } },
];

const levelVariant: Record<string, string> = { INFO: "info", WARN: "warning", ERROR: "danger", DEBUG: "muted" };

const LogsPage = () => {
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState("ALL");
  const [sourceFilter, setSourceFilter] = useState("ALL");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [live, setLive] = useState(true);

  const filtered = mockLogs.filter((log) => {
    if (levelFilter !== "ALL" && log.level !== levelFilter) return false;
    if (sourceFilter !== "ALL" && log.source !== sourceFilter) return false;
    if (search && !log.msg.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const errorCount = mockLogs.filter((l) => l.level === "ERROR").length;
  const warnCount = mockLogs.filter((l) => l.level === "WARN").length;
  const infoCount = mockLogs.filter((l) => l.level === "INFO").length;

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
        <StatCard label="Total (24h)" value={mockLogs.length.toLocaleString()} />
        <StatCard label="Errors" value={errorCount} />
        <StatCard label="Warnings" value={warnCount} />
        <StatCard label="Info" value={infoCount} />
      </div>

      {/* Log table */}
      <EdrixCard className="p-0">
        <div className="overflow-x-auto">
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
              {filtered.map((log) => (
                <>
                  <tr
                    key={log.id}
                    onClick={() => setExpandedId(expandedId === log.id ? null : log.id)}
                    className={`border-b border-border/50 hover:bg-secondary/30 cursor-pointer transition-colors ${
                      log.level === 'ERROR' ? 'border-l-2 border-l-destructive' : log.level === 'WARN' ? 'border-l-2 border-l-warning' : ''
                    }`}
                  >
                    <td className="py-3 px-4 text-muted-foreground">
                      {expandedId === log.id ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                    </td>
                    <td className="py-3 px-4 text-muted-foreground whitespace-nowrap">{log.ts}</td>
                    <td className="py-3 px-4"><EdrixBadge variant={levelVariant[log.level] as any}>{log.level}</EdrixBadge></td>
                    <td className="py-3 px-4"><EdrixBadge variant="default">{log.source}</EdrixBadge></td>
                    <td className="py-3 px-4 text-foreground">{log.msg}</td>
                  </tr>
                  {expandedId === log.id && (
                    <tr key={`${log.id}-meta`} className="border-b border-border/50">
                      <td colSpan={5} className="px-12 py-3">
                        <pre className="text-xs font-mono text-muted-foreground bg-secondary/50 rounded p-3 overflow-x-auto">
                          {JSON.stringify(log.meta, null, 2)}
                        </pre>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </EdrixCard>
    </div>
  );
};

export default LogsPage;
