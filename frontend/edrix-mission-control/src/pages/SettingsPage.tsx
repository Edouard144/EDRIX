import { useState } from "react";
import { EdrixCard } from "@/components/edrix/EdrixCard";
import { EdrixBadge } from "@/components/edrix/EdrixBadge";
import { EdrixButton } from "@/components/edrix/EdrixButton";
import { EdrixInput } from "@/components/edrix/EdrixInput";
import { EdrixModal } from "@/components/edrix/EdrixModal";
import { useAuthStore } from "@/store/auth.store";
import { useOrgs } from "@/hooks/useOrgs";
import { useApiKeys } from "@/hooks/useApiKeys";
import { Copy, Eye, EyeOff, Trash2, AlertTriangle, UserPlus } from "lucide-react";

const settingsTabs = ["Profile", "Organization", "Members", "API Keys", "Danger Zone"] as const;

const roleVariant: Record<string, string> = { OWNER: "info", ADMIN: "success", MEMBER: "muted", VIEWER: "default" };

const SettingsPage = () => {
  const user = useAuthStore((s) => s.user);
  const { currentOrg, useMembers, inviteMember } = useOrgs();
  const { apiKeys, createApiKey, revokeApiKey } = useApiKeys();
  const [tab, setTab] = useState<string>("Profile");
  const [showInvite, setShowInvite] = useState(false);
  const [showGenKey, setShowGenKey] = useState(false);
  const [keyGenerated, setKeyGenerated] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("MEMBER");
  const [keyName, setKeyName] = useState("");

  const membersQuery = useMembers();

  const handleInvite = async () => {
    if (!inviteEmail) return;
    await inviteMember.mutateAsync({ email: inviteEmail, role: inviteRole });
    setInviteEmail("");
    setShowInvite(false);
  };

  const handleCreateKey = async () => {
    if (!keyName) return;
    await createApiKey.mutateAsync({ name: keyName, scopes: ["read", "write"] });
    setKeyName("");
    setShowGenKey(false);
    setKeyGenerated(true);
  };

  const handleRevokeKey = async (keyId: string) => {
    await revokeApiKey.mutateAsync(keyId);
  };

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
              {user?.full_name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1 flex flex-col gap-4">
              <EdrixInput label="Name" defaultValue={user?.full_name || 'Developer'} />
              <EdrixInput label="Email" defaultValue={user?.email || ''} disabled className="opacity-50" />
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
            <EdrixInput label="Organization Name" defaultValue={currentOrg?.name || ''} />
            <EdrixInput label="Slug" defaultValue={currentOrg?.slug || ''} />
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
          {membersQuery.isLoading ? (
            <div className="text-center py-5 text-muted-foreground">Loading members...</div>
          ) : membersQuery.data && membersQuery.data.length > 0 ? (
            <table className="w-full text-xs font-mono">
              <thead><tr className="border-b border-border text-muted-foreground"><th className="text-left py-2">NAME</th><th className="text-left py-2">EMAIL</th><th className="text-left py-2">ROLE</th></tr></thead>
              <tbody>
                {membersQuery.data.map((m: any) => (
                  <tr key={m.email} className="border-b border-border/30 hover:bg-secondary/30">
                    <td className="py-3 text-foreground">{m.full_name || m.name}</td>
                    <td className="py-3 text-muted-foreground">{m.email}</td>
                    <td className="py-3"><EdrixBadge variant={roleVariant[m.role] as any || "default"}>{m.role}</EdrixBadge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-5 text-muted-foreground">No members found</div>
          )}
        </EdrixCard>
      )}

      {/* API Keys */}
      {tab === "API Keys" && (
        <EdrixCard>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-syne font-bold text-foreground">API Keys</h3>
            <EdrixButton size="sm" onClick={() => { setShowGenKey(true); setKeyGenerated(false); }}>Generate Key</EdrixButton>
          </div>
          {apiKeys && apiKeys.length > 0 ? (
            <table className="w-full text-xs font-mono">
              <thead><tr className="border-b border-border text-muted-foreground"><th className="text-left py-2">KEY</th><th className="text-left py-2">NAME</th><th className="text-left py-2">SCOPES</th><th className="text-left py-2">LAST USED</th><th className="text-right py-2"></th></tr></thead>
              <tbody>
                {apiKeys.map((k: any) => (
                  <tr key={k.id} className="border-b border-border/30 hover:bg-secondary/30">
                    <td className="py-3 text-foreground">{k.prefix}...</td>
                    <td className="py-3 text-muted-foreground">{k.name}</td>
                    <td className="py-3 flex gap-1">{k.scopes?.map((s: string) => <EdrixBadge key={s} variant="default">{s}</EdrixBadge>)}</td>
                    <td className="py-3 text-muted-foreground">{k.last_used || "Never"}</td>
                    <td className="py-3 text-right"><EdrixButton variant="danger" size="sm" onClick={() => handleRevokeKey(k.id)} disabled={revokeApiKey.isPending}>Revoke</EdrixButton></td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-5 text-muted-foreground">No API keys found</div>
          )}
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
        footer={<><EdrixButton variant="ghost" onClick={() => setShowInvite(false)}>Cancel</EdrixButton><EdrixButton onClick={handleInvite} disabled={inviteMember.isPending}>{inviteMember.isPending ? "Sending..." : "Send Invite"}</EdrixButton></>}
      >
        <div className="flex flex-col gap-4">
          <EdrixInput label="Email" placeholder="team@company.com" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} />
          <div>
            <label className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-2 block">Role</label>
            <select 
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value)}
              className="h-10 w-full bg-secondary border border-border rounded-md px-3 text-sm font-mono text-foreground focus:border-primary focus:outline-none"
            >
              <option>ADMIN</option>
              <option>MEMBER</option>
              <option>VIEWER</option>
            </select>
          </div>
        </div>
      </EdrixModal>

      {/* Generate Key modal */}
      <EdrixModal open={showGenKey} onClose={() => setShowGenKey(false)} title={keyGenerated ? "Key Generated" : "Generate API Key"}
        footer={!keyGenerated ? <><EdrixButton variant="ghost" onClick={() => setShowGenKey(false)}>Cancel</EdrixButton><EdrixButton onClick={handleCreateKey} disabled={createApiKey.isPending}>{createApiKey.isPending ? "Generating..." : "Generate"}</EdrixButton></> : undefined}
      >
        {!keyGenerated ? (
          <div className="flex flex-col gap-4">
            <EdrixInput label="Key Name" placeholder="Production API" value={keyName} onChange={(e) => setKeyName(e.target.value)} />
            <div>
              <label className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-2 block">Scopes</label>
              <div className="flex gap-2">
                {["read", "write", "admin"].map((s) => (
                  <label key={s} className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
                    <input type="checkbox" className="accent-[hsl(184,100%,49%)]" defaultChecked={s === "read" || s === "write"} /> {s}
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
