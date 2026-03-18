import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { EdrixCard } from "@/components/edrix/EdrixCard";
import { EdrixBadge } from "@/components/edrix/EdrixBadge";
import { EdrixButton } from "@/components/edrix/EdrixButton";
import { EdrixInput } from "@/components/edrix/EdrixInput";
import { useProjects } from "@/hooks/useProjects";
import { Eye, EyeOff, Trash2, ChevronRight, Loader2 } from "lucide-react";

const tabs = ["Overview", "Environments", "Variables", "Settings"];

const ProjectDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { useProject, useEnvVars, setEnvVar, deleteEnvVar } = useProjects();
  const [activeTab, setActiveTab] = useState("Overview");
  const [revealed, setRevealed] = useState<Set<string>>(new Set());
  const [selectedEnvId, setSelectedEnvId] = useState<string>("");
  const [newVarKey, setNewVarKey] = useState("");
  const [newVarValue, setNewVarValue] = useState("");
  const [newVarSecret, setNewVarSecret] = useState(false);

  const projectQuery = useProject(id || "");
  const project = projectQuery.data;
  const environments = project?.environments || [];

  // Auto-select first environment
  const activeEnvId = selectedEnvId || environments[0]?.id || "";
  const envVarsQuery = useEnvVars(id || "", activeEnvId);
  const variables = envVarsQuery.data || [];

  const toggleReveal = (key: string) => {
    setRevealed((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const handleAddVar = async () => {
    if (!newVarKey || !newVarValue || !activeEnvId) return;
    await setEnvVar.mutateAsync({
      projectId: id || "",
      environmentId: activeEnvId,
      key: newVarKey,
      value: newVarValue,
      is_secret: newVarSecret,
    });
    setNewVarKey("");
    setNewVarValue("");
    setNewVarSecret(false);
  };

  const handleDeleteVar = async (key: string) => {
    await deleteEnvVar.mutateAsync({
      projectId: id || "",
      environmentId: activeEnvId,
      key,
    });
  };

  if (projectQuery.isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-20 text-muted-foreground font-mono">
        Project not found.
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-slide-up">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
        <Link to="/projects" className="hover:text-primary transition-colors">
          Projects
        </Link>
        <ChevronRight size={12} />
        <span className="text-foreground">{project.name}</span>
      </div>

      {/* Header */}
      <div>
        <h1 className="font-syne font-bold text-3xl text-foreground">
          {project.name}
        </h1>
        <p className="text-xs font-mono text-muted-foreground mt-1">
          /{project.slug}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-border">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`pb-3 text-sm font-mono transition-colors border-b-2 ${
              activeTab === t
                ? "text-primary border-primary"
                : "text-muted-foreground border-transparent hover:text-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === "Overview" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {environments.map((env: any) => (
            <EdrixCard key={env.id}>
              <div className="flex items-center justify-between mb-3">
                <span className="font-syne font-bold text-foreground">
                  {env.name}
                </span>
                <EdrixBadge
                  variant={
                    env.slug === "production"
                      ? "success"
                      : env.slug === "staging"
                      ? "warning"
                      : "default"
                  }
                >
                  {env.slug.toUpperCase()}
                </EdrixBadge>
              </div>
              <p className="text-xs font-mono text-muted-foreground">
                Environment ID: {env.id.slice(0, 8)}...
              </p>
              <EdrixButton
                size="sm"
                variant="outline"
                className="mt-4 w-full"
                onClick={() => {
                  setSelectedEnvId(env.id);
                  setActiveTab("Variables");
                }}
              >
                Manage Variables
              </EdrixButton>
            </EdrixCard>
          ))}
        </div>
      )}

      {/* Environments Tab */}
      {activeTab === "Environments" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {environments.map((env: any) => (
            <EdrixCard key={env.id}>
              <h3 className="font-syne font-bold text-foreground mb-2">
                {env.name}
              </h3>
              <p className="text-xs font-mono text-muted-foreground">
                /{env.slug}
              </p>
              <p className="text-xs font-mono text-muted-foreground mt-1">
                Created: {new Date(env.created_at).toLocaleDateString()}
              </p>
            </EdrixCard>
          ))}
        </div>
      )}

      {/* Variables Tab */}
      {activeTab === "Variables" && (
        <EdrixCard>
          {/* Environment selector */}
          <div className="flex gap-3 mb-6">
            {environments.map((env: any) => (
              <button
                key={env.id}
                onClick={() => setSelectedEnvId(env.id)}
                className={`px-3 py-1 text-xs font-mono tracking-widest border transition-colors ${
                  activeEnvId === env.id
                    ? "border-primary text-primary bg-primary/5"
                    : "border-border text-muted-foreground hover:border-border-lit"
                }`}
              >
                {env.name.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Add variable form */}
          <div className="flex gap-3 mb-6 items-end">
            <EdrixInput
              label="KEY"
              placeholder="DATABASE_URL"
              value={newVarKey}
              onChange={(e) => setNewVarKey(e.target.value)}
              className="flex-1"
            />
            <EdrixInput
              label="VALUE"
              placeholder="postgres://..."
              value={newVarValue}
              onChange={(e) => setNewVarValue(e.target.value)}
              className="flex-1"
            />
            <div className="flex items-center gap-2 pb-1">
              <input
                type="checkbox"
                id="secret"
                checked={newVarSecret}
                onChange={(e) => setNewVarSecret(e.target.checked)}
                className="accent-primary"
              />
              <label
                htmlFor="secret"
                className="text-xs font-mono text-muted-foreground"
              >
                SECRET
              </label>
            </div>
            <EdrixButton
              onClick={handleAddVar}
              disabled={setEnvVar.isPending}
              className="mb-0"
            >
              {setEnvVar.isPending ? "SAVING..." : "ADD"}
            </EdrixButton>
          </div>

          {/* Variables table */}
          {envVarsQuery.isLoading ? (
            <div className="text-center py-8 text-muted-foreground font-mono text-xs">
              Loading variables...
            </div>
          ) : variables.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground font-mono text-xs border border-dashed border-border">
              No variables yet. Add one above.
            </div>
          ) : (
            <table className="w-full text-xs font-mono">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="text-left py-2">KEY</th>
                  <th className="text-left py-2">VALUE</th>
                  <th className="text-left py-2">TYPE</th>
                  <th className="text-right py-2"></th>
                </tr>
              </thead>
              <tbody>
                {variables.map((v: any) => (
                  <tr
                    key={v.key}
                    className="border-b border-border/30 hover:bg-secondary/30"
                  >
                    <td className="py-3 text-foreground font-bold">{v.key}</td>
                    <td className="py-3 text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <span>
                          {revealed.has(v.key) ? v.value : "••••••••"}
                        </span>
                        {v.is_secret && (
                          <button
                            onClick={() => toggleReveal(v.key)}
                            className="text-muted-foreground hover:text-primary transition-colors"
                          >
                            {revealed.has(v.key) ? (
                              <EyeOff size={12} />
                            ) : (
                              <Eye size={12} />
                            )}
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="py-3">
                      {v.is_secret ? (
                        <EdrixBadge variant="warning">SECRET</EdrixBadge>
                      ) : (
                        <EdrixBadge variant="default">PLAIN</EdrixBadge>
                      )}
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => handleDeleteVar(v.key)}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                        disabled={deleteEnvVar.isPending}
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </EdrixCard>
      )}

      {/* Settings Tab */}
      {activeTab === "Settings" && (
        <EdrixCard>
          <h3 className="font-syne font-bold text-foreground mb-4">
            Project Settings
          </h3>
          <div className="flex flex-col gap-4 max-w-md">
            <EdrixInput label="Project Name" defaultValue={project.name} />
            <EdrixInput
              label="Description"
              defaultValue={project.description || ""}
            />
            <EdrixButton className="self-start">Save Changes</EdrixButton>
          </div>
          <div className="mt-8 pt-6 border-t border-border">
            <h4 className="font-syne font-bold text-destructive mb-2">
              Danger Zone
            </h4>
            <p className="text-xs font-mono text-muted-foreground mb-4">
              Permanently delete this project and all its data.
            </p>
            <EdrixButton variant="danger">Delete Project</EdrixButton>
          </div>
        </EdrixCard>
      )}
    </div>
  );
};

export default ProjectDetailPage;
