import { useState } from "react";
import { EdrixCard } from "@/components/edrix/EdrixCard";
import { EdrixBadge } from "@/components/edrix/EdrixBadge";
import { EdrixButton } from "@/components/edrix/EdrixButton";
import { EdrixDrawer } from "@/components/edrix/EdrixDrawer";

const filterTabs = ["ALL", "PENDING", "RUNNING", "COMPLETED", "FAILED"] as const;

const mockJobs = [
  { id: 1, name: "email.send_welcome", status: "completed", attempts: 1, created: "2026-03-10 09:12:04", duration: "1.2s" },
  { id: 2, name: "billing.generate_invoice", status: "running", attempts: 1, created: "2026-03-10 09:14:22", duration: "—" },
  { id: 3, name: "analytics.aggregate_daily", status: "completed", attempts: 2, created: "2026-03-10 08:00:00", duration: "34.5s" },
  { id: 4, name: "webhook.deliver", status: "failed", attempts: 3, created: "2026-03-10 08:45:11", duration: "12.1s" },
  { id: 5, name: "auth.cleanup_sessions", status: "pending", attempts: 0, created: "2026-03-10 09:15:00", duration: "—" },
  { id: 6, name: "project.deploy", status: "completed", attempts: 1, created: "2026-03-10 07:30:00", duration: "48.2s" },
  { id: 7, name: "cache.invalidate", status: "running", attempts: 1, created: "2026-03-10 09:16:00", duration: "—" },
  { id: 8, name: "email.send_reset", status: "failed", attempts: 3, created: "2026-03-10 06:20:00", duration: "5.4s" },
];

const statusVariant: Record<string, string> = {
  pending: "muted", running: "info", completed: "success", failed: "danger",
};

const mockLogs = [
  { time: "09:14:22.001", level: "INFO", msg: "Job started: billing.generate_invoice" },
  { time: "09:14:22.045", level: "INFO", msg: "Fetching usage data for org_a1b2c3d4" },
  { time: "09:14:22.312", level: "DEBUG", msg: "Calculated line items: 14 events" },
  { time: "09:14:22.890", level: "INFO", msg: "Invoice INV-2026-0314 generated" },
  { time: "09:14:23.001", level: "WARN", msg: "Stripe API rate limit approaching" },
];

const dlqJobs = mockJobs.filter((j) => j.status === "failed");

const JobsPage = () => {
  const [filter, setFilter] = useState<string>("ALL");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<string>("");

  const filtered = filter === "ALL" ? mockJobs : mockJobs.filter((j) => j.status === filter.toLowerCase());

  return (
    <div className="space-y-6 animate-fade-slide-up">
      <h1 className="font-syne font-bold text-3xl text-foreground">Jobs</h1>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {filterTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-3 py-1.5 rounded-md text-xs font-mono transition-colors ${
              filter === tab ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Jobs table */}
      <EdrixCard>
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="text-left py-2 px-3">NAME</th>
                <th className="text-left py-2 px-3">STATUS</th>
                <th className="text-left py-2 px-3">ATTEMPTS</th>
                <th className="text-left py-2 px-3">CREATED</th>
                <th className="text-left py-2 px-3">DURATION</th>
                <th className="text-left py-2 px-3">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((job) => (
                <tr key={job.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                  <td className="py-3 px-3 text-foreground">{job.name}</td>
                  <td className="py-3 px-3">
                    <EdrixBadge variant={statusVariant[job.status] as any} className={job.status === "running" ? "animate-cyan-pulse" : ""}>
                      {job.status.toUpperCase()}
                    </EdrixBadge>
                  </td>
                  <td className="py-3 px-3 text-muted-foreground">{job.attempts}/3</td>
                  <td className="py-3 px-3 text-muted-foreground">{job.created}</td>
                  <td className="py-3 px-3 text-muted-foreground">{job.duration}</td>
                  <td className="py-3 px-3">
                    <EdrixButton variant="ghost" size="sm" onClick={() => { setSelectedJob(job.name); setDrawerOpen(true); }}>
                      View Logs
                    </EdrixButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </EdrixCard>

      {/* Dead Letter Queue */}
      {dlqJobs.length > 0 && (
        <div>
          <h2 className="font-syne font-bold text-lg text-foreground mb-3">Dead Letter Queue</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {dlqJobs.map((job) => (
              <div key={job.id} className="rounded-lg bg-destructive/5 border border-destructive/20 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-mono text-foreground">{job.name}</p>
                    <p className="text-xs font-mono text-muted-foreground mt-1">{job.attempts} attempts exhausted · {job.created}</p>
                  </div>
                  <EdrixButton variant="danger" size="sm">Retry</EdrixButton>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Logs drawer */}
      <EdrixDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title={`Logs: ${selectedJob}`}>
        <div className="space-y-1">
          {mockLogs.map((log, i) => (
            <div key={i} className="flex gap-3 text-xs font-mono py-1.5 border-b border-border/30">
              <span className="text-muted-foreground flex-shrink-0">{log.time}</span>
              <span className={`flex-shrink-0 ${log.level === 'ERROR' ? 'text-destructive' : log.level === 'WARN' ? 'text-warning' : log.level === 'DEBUG' ? 'text-muted-foreground' : 'text-primary'}`}>
                {log.level}
              </span>
              <span className="text-foreground">{log.msg}</span>
            </div>
          ))}
        </div>
      </EdrixDrawer>
    </div>
  );
};

export default JobsPage;
