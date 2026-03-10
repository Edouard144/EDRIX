import { useState } from "react";
import { EdrixCard } from "@/components/edrix/EdrixCard";
import { EdrixBadge } from "@/components/edrix/EdrixBadge";
import { EdrixButton } from "@/components/edrix/EdrixButton";
import { EdrixModal } from "@/components/edrix/EdrixModal";
import { EdrixInput } from "@/components/edrix/EdrixInput";
import { Copy, Send, ChevronDown, ChevronRight, AlertTriangle } from "lucide-react";

const eventTypes = ["user.created", "job.failed", "billing.invoice", "test.ping"];

const mockWebhooks = [
  { id: 1, name: "Slack Alerts", url: "https://hooks.slack.com/services/T0A1B2C3/B4D5E6F7/xyzSecretToken123456", events: ["job.failed", "billing.invoice"], active: true, successRate: 98.5 },
  { id: 2, name: "Analytics Pipeline", url: "https://analytics.internal.edrix.dev/webhook/ingest", events: ["user.created", "billing.invoice"], active: true, successRate: 100 },
  { id: 3, name: "PagerDuty Integration", url: "https://events.pagerduty.com/integration/v2/enqueue", events: ["job.failed"], active: false, successRate: 94.2 },
];

const mockDeliveries = [
  { event: "job.failed", status: "success", code: 200, time: "2026-03-10 09:14:22", retries: 0 },
  { event: "billing.invoice", status: "success", code: 200, time: "2026-03-10 08:00:01", retries: 0 },
  { event: "job.failed", status: "failed", code: 500, time: "2026-03-10 07:45:33", retries: 3 },
  { event: "user.created", status: "success", code: 201, time: "2026-03-10 06:12:45", retries: 1 },
];

const WebhooksPage = () => {
  const [showCreate, setShowCreate] = useState(false);
  const [showSecret, setShowSecret] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);

  const toggleEvent = (event: string) => {
    setSelectedEvents((prev) => prev.includes(event) ? prev.filter((e) => e !== event) : [...prev, event]);
  };

  return (
    <div className="space-y-6 animate-fade-slide-up">
      <div className="flex items-center justify-between">
        <h1 className="font-syne font-bold text-3xl text-foreground">Webhooks</h1>
        <EdrixButton onClick={() => setShowCreate(true)}>New Webhook</EdrixButton>
      </div>

      <div className="space-y-4">
        {mockWebhooks.map((wh) => (
          <EdrixCard key={wh.id} hover>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <h3 className="font-syne font-bold text-foreground">{wh.name}</h3>
                <div className={`w-2 h-2 rounded-full ${wh.active ? 'bg-success' : 'bg-muted-foreground'}`} />
              </div>
              <div className="flex items-center gap-2">
                <EdrixButton variant="ghost" size="sm" onClick={() => {}}>
                  <Send size={12} /> Test
                </EdrixButton>
                <button
                  onClick={() => setExpandedId(expandedId === wh.id ? null : wh.id)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  {expandedId === wh.id ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </button>
              </div>
            </div>
            <p className="text-xs font-mono text-muted-foreground truncate mb-3">{wh.url}</p>
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                {wh.events.map((e) => <EdrixBadge key={e} variant="info">{e}</EdrixBadge>)}
              </div>
              <span className={`text-xs font-mono ${wh.successRate >= 99 ? 'text-success' : wh.successRate >= 95 ? 'text-warning' : 'text-destructive'}`}>
                {wh.successRate}% success
              </span>
            </div>

            {expandedId === wh.id && (
              <div className="mt-4 border-t border-border pt-4">
                <h4 className="text-xs font-mono text-muted-foreground mb-3 uppercase tracking-widest">Delivery History</h4>
                <table className="w-full text-xs font-mono">
                  <thead>
                    <tr className="text-muted-foreground border-b border-border">
                      <th className="text-left py-2">EVENT</th>
                      <th className="text-left py-2">STATUS</th>
                      <th className="text-left py-2">CODE</th>
                      <th className="text-left py-2">TIME</th>
                      <th className="text-left py-2">RETRIES</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockDeliveries.map((d, i) => (
                      <tr key={i} className="border-b border-border/30">
                        <td className="py-2 text-foreground">{d.event}</td>
                        <td className="py-2"><EdrixBadge variant={d.status === "success" ? "success" : "danger"}>{d.status}</EdrixBadge></td>
                        <td className="py-2 text-muted-foreground">{d.code}</td>
                        <td className="py-2 text-muted-foreground">{d.time}</td>
                        <td className="py-2 text-muted-foreground">{d.retries}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </EdrixCard>
        ))}
      </div>

      {/* Create modal */}
      <EdrixModal open={showCreate && !showSecret} onClose={() => setShowCreate(false)} title="New Webhook"
        footer={<><EdrixButton variant="ghost" onClick={() => setShowCreate(false)}>Cancel</EdrixButton><EdrixButton onClick={() => { setShowCreate(false); setShowSecret(true); }}>Create</EdrixButton></>}
      >
        <div className="flex flex-col gap-4">
          <EdrixInput label="Name" placeholder="My Webhook" />
          <EdrixInput label="URL" placeholder="https://example.com/webhook" />
          <div>
            <label className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-2 block">Events</label>
            <div className="flex flex-wrap gap-2">
              {eventTypes.map((e) => (
                <button
                  key={e}
                  onClick={() => toggleEvent(e)}
                  className={`px-3 py-1 rounded-full text-xs font-mono border transition-colors ${
                    selectedEvents.includes(e)
                      ? "border-primary text-primary bg-primary/10"
                      : "border-border text-muted-foreground hover:border-primary/50"
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>
        </div>
      </EdrixModal>

      {/* Secret modal */}
      <EdrixModal open={showSecret} onClose={() => setShowSecret(false)} title="Webhook Created">
        <div className="space-y-4">
          <div className="flex items-center gap-2 bg-warning/10 border border-warning/20 rounded px-3 py-2">
            <AlertTriangle size={14} className="text-warning flex-shrink-0" />
            <p className="text-xs font-mono text-warning">Save this — shown once</p>
          </div>
          <div className="bg-secondary rounded p-3 flex items-center justify-between">
            <code className="text-xs font-mono text-foreground">whsec_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6</code>
            <button className="text-muted-foreground hover:text-primary"><Copy size={14} /></button>
          </div>
        </div>
      </EdrixModal>
    </div>
  );
};

export default WebhooksPage;
