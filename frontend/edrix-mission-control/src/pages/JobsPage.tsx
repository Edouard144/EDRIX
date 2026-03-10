import { useState } from "react";
import { EdrixCard } from "@/components/edrix/EdrixCard";
import { EdrixBadge } from "@/components/edrix/EdrixBadge";
import { EdrixButton } from "@/components/edrix/EdrixButton";
import { EdrixDrawer } from "@/components/edrix/EdrixDrawer";
import { useJobs } from "@/hooks/useJobs";

const filterTabs = ["ALL", "PENDING", "RUNNING", "COMPLETED", "FAILED"] as const;

const statusVariant: Record<string, string> = {
  pending: "muted", running: "info", completed: "success", failed: "danger",
};

const JobsPage = () => {
  const [filter, setFilter] = useState<string>("ALL");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<string>("");
  
  const statusFilter = filter === "ALL" ? undefined : filter.toLowerCase();
  const { jobs, isLoading, deadLetterJobs, retryJob, useJob } = useJobs(statusFilter);

  const handleViewLogs = (jobName: string) => {
    setSelectedJob(jobName);
    setDrawerOpen(true);
  };

  const handleRetry = async (jobId: string) => {
    await retryJob.mutateAsync(jobId);
  };

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
          {isLoading ? (
            <div className="text-center py-10 text-muted-foreground">Loading jobs...</div>
          ) : (
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
                {jobs && jobs.length > 0 ? jobs.map((job: any) => (
                  <tr key={job.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                    <td className="py-3 px-3 text-foreground">{job.name}</td>
                    <td className="py-3 px-3">
                      <EdrixBadge variant={statusVariant[job.status] as any} className={job.status === "running" ? "animate-cyan-pulse" : ""}>
                        {job.status.toUpperCase()}
                      </EdrixBadge>
                    </td>
                    <td className="py-3 px-3 text-muted-foreground">{job.attempts || 0}/3</td>
                    <td className="py-3 px-3 text-muted-foreground">{new Date(job.created_at).toLocaleString()}</td>
                    <td className="py-3 px-3 text-muted-foreground">{job.duration || "—"}</td>
                    <td className="py-3 px-3">
                      <EdrixButton variant="ghost" size="sm" onClick={() => handleViewLogs(job.name)}>
                        View Logs
                      </EdrixButton>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-muted-foreground">No jobs found</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </EdrixCard>

      {/* Dead Letter Queue */}
      {deadLetterJobs && deadLetterJobs.length > 0 && (
        <div>
          <h2 className="font-syne font-bold text-lg text-foreground mb-3">Dead Letter Queue</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {deadLetterJobs.map((job: any) => (
              <div key={job.id} className="rounded-lg bg-destructive/5 border border-destructive/20 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-mono text-foreground">{job.name}</p>
                    <p className="text-xs font-mono text-muted-foreground mt-1">{job.attempts} attempts exhausted · {new Date(job.created_at).toLocaleString()}</p>
                  </div>
                  <EdrixButton variant="danger" size="sm" onClick={() => handleRetry(job.id)} disabled={retryJob.isPending}>
                    {retryJob.isPending ? "Retrying..." : "Retry"}
                  </EdrixButton>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Logs drawer */}
      <EdrixDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title={`Logs: ${selectedJob}`}>
        <div className="space-y-1">
          <div className="text-xs font-mono text-muted-foreground text-center py-10">
            Job logs will appear here
          </div>
        </div>
      </EdrixDrawer>
    </div>
  );
};

export default JobsPage;
