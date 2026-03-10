import { useState } from "react";
import { EdrixCard } from "@/components/edrix/EdrixCard";
import { EdrixBadge } from "@/components/edrix/EdrixBadge";
import { EdrixButton } from "@/components/edrix/EdrixButton";
import { EdrixInput } from "@/components/edrix/EdrixInput";
import { EdrixModal } from "@/components/edrix/EdrixModal";
import { Copy, Eye, EyeOff, Trash2, AlertTriangle, UserPlus } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";

const settingsTabs = ["Profile", "Organization", "Members", "API Keys", "Danger Zone"] as const;

const members = [
  { name: "Alex Mercer", email: "alex@edrix.dev", role: "OWNER" },
  { name: "Sam Chen", email: "sam@edrix.dev", role: "ADMIN" },
  { name: "Jordan Blake", email: "jordan@edrix.dev", role: "MEMBER" },
  { name: "Taylor Kim", email: "taylor@edrix.dev", role: "VIEWER" },
];

const roleVariant: Record<string, string> = { OWNER: "info", ADMIN: "success", MEMBER: "muted", VIEWER: "default" };

const apiKeys = [
  { id: 1, prefix: "edx_a1b2c3d4", name: "Production API", scopes: ["read", "write", "admin"], lastUsed: "2 hours ago" },
  { id: 2, prefix: "edx_e5f6g7h8", name: "CI/CD Pipeline", scopes: ["read", "write"], lastUsed: "5 min ago" },
  { id: 3, prefix: "edx_i9j0k1l2", name: "Monitoring", scopes: ["read"], lastUsed: "1 day ago" },
];

const SettingsPage = () => {
  const user = useAuthStore((s) => s.user);
  const [tab, setTab] = useState<string>("Profile");
  const [showInvite, setShowInvite] = useState(false);
  const [showGenKey, setShowGenKey] = useState(false);
  const [keyGenerated, setKeyGenerated] = useState(false);

  return (
    <div className="space-y-6 animate-fade-slide-up">
      <h1 className="font-syne font-bold text-3xl text-foreground">Settings</h1>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-border overflow-x-auto">
        {settingsTabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`pb-3 text-sm font-mono transition-colors border-b-2 whitespace-nowrap ${
              tab === t ? "text-primary border-primary" : "text-muted-foreground border-transparent hover:text-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Profile */}
      {tab === "Profile" && (
        <EdrixCard>
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center text-2xl font-syne text-primary flex-shrink-0">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1 flex flex-col gap-4">
              <EdrixInput label="Name" defaultValue={user?.name || 'Developer'} />
              <EdrixInput label="Email" defaultValue={user?.email || 'dev@edrix.dev'} disabled className="opacity-50" />
              <EdrixButton className="self-start">Save Changes</EdrixButton>
            </div>
          </div>
        </EdrixCard>
      )}

      {/* Organization */}
      {tab === "Organization" && (
        <EdrixCard>
          <h3 className="font-syne font-bold text-foreground mb-4">Organization</h3>
          <div className="flex flex-col gap-4">
            <EdrixInput label="Organization Name" defaultValue="EDRIX Corp" />
            <EdrixInput label="Slug" defaultValue="edrix-corp" />
            <EdrixButton className="self-start">Update</EdrixButton>
          </div>
        </EdrixCard>
      )}

      {/* Members */}
      {tab === "Members" && (
        <EdrixCard>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-syne font-bold text-foreground">Team Members</h3>
            <EdrixButton size="sm" onClick={() => setShowInvite(true)}><UserPlus size={14} /> Invite</EdrixButton>
          </div>
          <table className="w-full text-xs font-mono">
            <thead><tr className="border-b border-border text-muted-foreground"><th className="text-left py-2">NAME</th><th className="text-left py-2">EMAIL</th><th className="text-left py-2">ROLE</th></tr></thead>
            <tbody>
              {members.map((m) => (
                <tr key={m.email} className="border-b border-border/30 hover:bg-secondary/30">
                  <td className="py-3 text-foreground">{m.name}</td>
                  <td className="py-3 text-muted-foreground">{m.email}</td>
                  <td className="py-3"><EdrixBadge variant={roleVariant[m.role] as any}>{m.role}</EdrixBadge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </EdrixCard>
      )}

      {/* API Keys */}
      {tab === "API Keys" && (
        <EdrixCard>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-syne font-bold text-foreground">API Keys</h3>
            <EdrixButton size="sm" onClick={() => { setShowGenKey(true); setKeyGenerated(false); }}>Generate Key</EdrixButton>
          </div>
          <table className="w-full text-xs font-mono">
            <thead><tr className="border-b border-border text-muted-foreground"><th className="text-left py-2">KEY</th><th className="text-left py-2">NAME</th><th className="text-left py-2">SCOPES</th><th className="text-left py-2">LAST USED</th><th className="text-right py-2"></th></tr></thead>
            <tbody>
              {apiKeys.map((k) => (
                <tr key={k.id} className="border-b border-border/30 hover:bg-secondary/30">
                  <td className="py-3 text-foreground">{k.prefix}...</td>
                  <td className="py-3 text-muted-foreground">{k.name}</td>
                  <td className="py-3 flex gap-1">{k.scopes.map((s) => <EdrixBadge key={s} variant="default">{s}</EdrixBadge>)}</td>
                  <td className="py-3 text-muted-foreground">{k.lastUsed}</td>
                  <td className="py-3 text-right"><EdrixButton variant="danger" size="sm">Revoke</EdrixButton></td>
                </tr>
              ))}
            </tbody>
          </table>
        </EdrixCard>
      )}

      {/* Danger Zone */}
      {tab === "Danger Zone" && (
        <div className="rounded-lg border-2 border-destructive/30 p-6">
          <h3 className="font-syne font-bold text-destructive text-lg mb-2">Danger Zone</h3>
          <p className="text-xs font-mono text-muted-foreground mb-4">
            Permanently delete this organization and all its data. This action cannot be undone.
          </p>
          <EdrixButton variant="danger">Delete Organization</EdrixButton>
        </div>
      )}

      {/* Invite modal */}
      <EdrixModal open={showInvite} onClose={() => setShowInvite(false)} title="Invite Member"
        footer={<><EdrixButton variant="ghost" onClick={() => setShowInvite(false)}>Cancel</EdrixButton><EdrixButton>Send Invite</EdrixButton></>}
      >
        <div className="flex flex-col gap-4">
          <EdrixInput label="Email" placeholder="team@company.com" />
          <div>
            <label className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-2 block">Role</label>
            <select className="h-10 w-full bg-secondary border border-border rounded-md px-3 text-sm font-mono text-foreground focus:border-primary focus:outline-none">
              <option>ADMIN</option>
              <option>MEMBER</option>
              <option>VIEWER</option>
            </select>
          </div>
        </div>
      </EdrixModal>

      {/* Generate Key modal */}
      <EdrixModal open={showGenKey} onClose={() => setShowGenKey(false)} title={keyGenerated ? "Key Generated" : "Generate API Key"}
        footer={!keyGenerated ? <><EdrixButton variant="ghost" onClick={() => setShowGenKey(false)}>Cancel</EdrixButton><EdrixButton onClick={() => setKeyGenerated(true)}>Generate</EdrixButton></> : undefined}
      >
        {!keyGenerated ? (
          <div className="flex flex-col gap-4">
            <EdrixInput label="Key Name" placeholder="Production API" />
            <div>
              <label className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-2 block">Scopes</label>
              <div className="flex gap-2">
                {["read", "write", "admin"].map((s) => (
                  <label key={s} className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
                    <input type="checkbox" className="accent-[hsl(184,100%,49%)]" /> {s}
                  </label>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2 bg-warning/10 border border-warning/20 rounded px-3 py-2">
              <AlertTriangle size={14} className="text-warning flex-shrink-0" />
              <p className="text-xs font-mono text-warning">Save this key — it won't be shown again</p>
            </div>
            <div className="bg-secondary rounded p-3 flex items-center justify-between">
              <code className="text-xs font-mono text-foreground break-all">edx_sk_live_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6</code>
              <button className="text-muted-foreground hover:text-primary ml-2 flex-shrink-0"><Copy size={14} /></button>
            </div>
          </div>
        )}
      </EdrixModal>
    </div>
  );
};

export default SettingsPage;
