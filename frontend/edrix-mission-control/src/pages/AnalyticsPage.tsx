import { useState } from "react";
import { useLogs } from "@/hooks/useLogs";
import { useBilling } from "@/hooks/useBilling";
import { EdrixCard } from "@/components/edrix/EdrixCard";
import { Loader2 } from "lucide-react";

const timeRanges = ["1H", "24H", "7D", "30D"] as const;

const tooltipStyle = {
  contentStyle: { backgroundColor: '#0f0f0f', border: '1px solid #1a1a1a', borderRadius: '6px', fontFamily: 'DM Mono', fontSize: '11px' },
  labelStyle: { color: '#555' },
};

const AnalyticsPage = () => {
  const [range, setRange] = useState<typeof timeRanges[number]>("24H");
  const hours = range === "1H" ? 1 : range === "24H" ? 24 : range === "7D" ? 168 : 720;
  const { stats, isLoading } = useLogs({});
  const { usage } = useBilling();

  const totalRequests = stats ? (Number(stats.info) + Number(stats.warn) + Number(stats.error) + Number(stats.debug)) : 0;
  const errorCount = Number(stats?.error) || 0;
  const errorRate = totalRequests > 0 ? ((errorCount / totalRequests) * 100).toFixed(2) : "0.00";

  return (
    <div className="space-y-6 animate-fade-slide-up">
      <div className="flex items-center justify-between">
        <h1 className="font-syne font-bold text-3xl text-foreground">Analytics</h1>
        <div className="flex gap-1 bg-secondary rounded-md p-0.5">
          {timeRanges.map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1.5 rounded text-xs font-mono transition-colors ${
                range === r ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="animate-spin text-primary" size={32} />
        </div>
      ) : (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <EdrixCard>
              <p className="text-xs font-mono text-muted-foreground mb-1">TOTAL REQUESTS</p>
              <p className="text-2xl font-syne font-bold text-primary">{totalRequests.toLocaleString()}</p>
            </EdrixCard>
            <EdrixCard>
              <p className="text-xs font-mono text-muted-foreground mb-1">ERROR RATE</p>
              <p className="text-2xl font-syne font-bold text-destructive">{errorRate}%</p>
            </EdrixCard>
            <EdrixCard>
              <p className="text-xs font-mono text-muted-foreground mb-1">ERRORS</p>
              <p className="text-2xl font-syne font-bold text-destructive">{errorCount}</p>
            </EdrixCard>
            <EdrixCard>
              <p className="text-xs font-mono text-muted-foreground mb-1">AVG LATENCY</p>
              <p className="text-2xl font-syne font-bold text-primary">--</p>
            </EdrixCard>
          </div>

          {/* Log Level Distribution */}
          <EdrixCard>
            <h3 className="font-syne font-bold text-foreground mb-4">Log Level Distribution</h3>
            {stats ? (
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center p-4 bg-secondary/30 rounded-lg">
                  <p className="text-3xl font-syne font-bold text-info">{stats.info || 0}</p>
                  <p className="text-xs font-mono text-muted-foreground">INFO</p>
                </div>
                <div className="text-center p-4 bg-secondary/30 rounded-lg">
                  <p className="text-3xl font-syne font-bold text-warning">{stats.warn || 0}</p>
                  <p className="text-xs font-mono text-muted-foreground">WARN</p>
                </div>
                <div className="text-center p-4 bg-secondary/30 rounded-lg">
                  <p className="text-3xl font-syne font-bold text-destructive">{stats.error || 0}</p>
                  <p className="text-xs font-mono text-muted-foreground">ERROR</p>
                </div>
                <div className="text-center p-4 bg-secondary/30 rounded-lg">
                  <p className="text-3xl font-syne font-bold text-muted-foreground">{stats.debug || 0}</p>
                  <p className="text-xs font-mono text-muted-foreground">DEBUG</p>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">No data available</p>
            )}
          </EdrixCard>

          {/* Usage Stats */}
          {usage && (
            <EdrixCard>
              <h3 className="font-syne font-bold text-foreground mb-4">Usage This Month</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs font-mono text-muted-foreground">API REQUESTS</p>
                  <p className="text-xl font-syne font-bold text-foreground">{usage.requests_used?.toLocaleString() || 0}</p>
                  <p className="text-xs font-mono text-muted-foreground">of {usage.requests_limit?.toLocaleString() || 0}</p>
                </div>
                <div>
                  <p className="text-xs font-mono text-muted-foreground">STORAGE</p>
                  <p className="text-xl font-syne font-bold text-foreground">{usage.storage_used_mb?.toFixed(2) || 0} MB</p>
                  <p className="text-xs font-mono text-muted-foreground">of {usage.storage_limit_mb?.toFixed(2) || 0} MB</p>
                </div>
                <div>
                  <p className="text-xs font-mono text-muted-foreground">WEBHOOKS</p>
                  <p className="text-xl font-syne font-bold text-foreground">{usage.webhooks_used || 0}</p>
                  <p className="text-xs font-mono text-muted-foreground">of {usage.webhooks_limit || 0}</p>
                </div>
                <div>
                  <p className="text-xs font-mono text-muted-foreground">TEAM MEMBERS</p>
                  <p className="text-xl font-syne font-bold text-foreground">{usage.members_used || 0}</p>
                  <p className="text-xs font-mono text-muted-foreground">of {usage.members_limit || 0}</p>
                </div>
              </div>
            </EdrixCard>
          )}
        </>
      )}
    </div>
  );
};

export default AnalyticsPage;
