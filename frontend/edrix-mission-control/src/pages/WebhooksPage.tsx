import { useState } from "react";
import { EdrixCard } from "@/components/edrix/EdrixCard";
import { EdrixBadge } from "@/components/edrix/EdrixBadge";
import { EdrixButton } from "@/components/edrix/EdrixButton";
import { EdrixModal } from "@/components/edrix/EdrixModal";
import { EdrixInput } from "@/components/edrix/EdrixInput";
import { useWebhooks } from "@/hooks/useWebhooks";
import { Copy, Send, ChevronDown, ChevronRight, AlertTriangle } from "lucide-react";

const eventTypes = ["user.created", "job.failed", "billing.invoice", "test.ping"];

const WebhooksPage = () => {
  const [showCreate, setShowCreate] = useState(false);
  const [showSecret, setShowSecret] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [newWebhookName, setNewWebhookName] = useState("");
  const [newWebhookUrl, setNewWebhookUrl] = useState("");
  
  const { webhooks, isLoading, createWebhook, deleteWebhook, testWebhook } = useWebhooks();

  const toggleEvent = (event: string) => {
    setSelectedEvents((prev) => prev.includes(event) ? prev.filter((e) => e !== event) : [...prev, event]);
  };

  const handleCreateWebhook = async () => {
    if (!newWebhookName || !newWebhookUrl) return;
    await createWebhook.mutateAsync({ name: newWebhookName, url: newWebhookUrl, events: selectedEvents });
    setNewWebhookName("");
    setNewWebhookUrl("");
    setSelectedEvents([]);
    setShowCreate(false);
    setShowSecret(true);
  };

  const handleTestWebhook = async (id: string) => {
    await testWebhook.mutateAsync();
  };

  const handleDeleteWebhook = async (id: string) => {
    await deleteWebhook.mutateAsync(id);
  };

  return (
    <div className="space-y-6 animate-fade-slide-up">
      <div className="flex items-center justify-between">
        <h1 className="font-syne font-bold text-3xl text-foreground">Webhooks</h1>
        <EdrixButton onClick={() => setShowCreate(true)}>New Webhook</EdrixButton>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-10 text-muted-foreground">Loading webhooks...</div>
        ) : webhooks && webhooks.length > 0 ? (
          webhooks.map((wh: any) => (
            <EdrixCard key={wh.id} hover>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <h3 className="font-syne font-bold text-foreground">{wh.name}</h3>
                  <div className={`w-2 h-2 rounded-full ${wh.is_active ? 'bg-success' : 'bg-muted-foreground'}`} />
                </div>
                <div className="flex items-center gap-2">
                  <EdrixButton variant="ghost" size="sm" onClick={() => handleTestWebhook(wh.id)} disabled={testWebhook.isPending}>
                    <Send size={12} /> Test
                  </EdrixButton>
                  <EdrixButton variant="ghost" size="sm" onClick={() => handleDeleteWebhook(wh.id)} disabled={deleteWebhook.isPending}>
                    Delete
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
                  {wh.events?.map((e: string) => <EdrixBadge key={e} variant="info">{e}</EdrixBadge>) || <EdrixBadge variant="info">test.ping</EdrixBadge>}
                </div>
                <span className={`text-xs font-mono ${wh.success_rate >= 99 ? 'text-success' : wh.success_rate >= 95 ? 'text-warning' : 'text-destructive'}`}>
                  {wh.success_rate || 100}% success
                </span>
              </div>

              {expandedId === wh.id && (
                <div className="mt-4 border-t border-border pt-4">
                  <h4 className="text-xs font-mono text-muted-foreground mb-3 uppercase tracking-widest">Delivery History</h4>
                  <div className="text-xs font-mono text-muted-foreground text-center py-5">
                    Delivery history will appear here
                  </div>
                </div>
              )}
            </EdrixCard>
          ))
        ) : (
          <div className="text-center py-10 text-muted-foreground">No webhooks found. Create one to get started.</div>
        )}
      </div>

      {/* Create modal */}
      <EdrixModal open={showCreate && !showSecret} onClose={() => setShowCreate(false)} title="New Webhook"
        footer={<><EdrixButton variant="ghost" onClick={() => setShowCreate(false)}>Cancel</EdrixButton><EdrixButton onClick={handleCreateWebhook} disabled={createWebhook.isPending}>{createWebhook.isPending ? "Creating..." : "Create"}</EdrixButton></>}
      >
        <div className="flex flex-col gap-4">
          <EdrixInput label="Name" placeholder="My Webhook" value={newWebhookName} onChange={(e) => setNewWebhookName(e.target.value)} />
          <EdrixInput label="URL" placeholder="https://example.com/webhook" value={newWebhookUrl} onChange={(e) => setNewWebhookUrl(e.target.value)} />
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
