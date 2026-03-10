import { useState } from "react";
import { Link } from "react-router-dom";
import { EdrixButton } from "@/components/edrix/EdrixButton";
import { EdrixCard } from "@/components/edrix/EdrixCard";
import { EdrixBadge } from "@/components/edrix/EdrixBadge";
import { EdrixModal } from "@/components/edrix/EdrixModal";
import { EdrixInput } from "@/components/edrix/EdrixInput";
import { Plus, ArrowRight } from "lucide-react";

const mockProjects = [
  { id: "proj-1", name: "Nexus API", slug: "nexus-api", envs: ["PROD", "STAGING", "DEV"], created: "2025-11-14" },
  { id: "proj-2", name: "Phantom Gateway", slug: "phantom-gw", envs: ["PROD", "DEV"], created: "2025-12-02" },
  { id: "proj-3", name: "Volt Engine", slug: "volt-engine", envs: ["PROD", "STAGING", "DEV"], created: "2026-01-18" },
  { id: "proj-4", name: "Cipher Auth", slug: "cipher-auth", envs: ["PROD"], created: "2026-02-05" },
];

const envColor: Record<string, string> = { PROD: "danger", STAGING: "warning", DEV: "info" };

const ProjectsPage = () => {
  const [showCreate, setShowCreate] = useState(false);

  return (
    <div className="space-y-6 animate-fade-slide-up">
      <div className="flex items-center justify-between">
        <h1 className="font-syne font-bold text-3xl text-foreground">Projects</h1>
        <EdrixButton variant="outline" onClick={() => setShowCreate(true)}>
          <Plus size={16} /> New Project
        </EdrixButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 stagger-children">
        {mockProjects.map((p) => (
          <Link key={p.id} to={`/projects/${p.id}`}>
            <EdrixCard hover className="group cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-syne font-bold text-foreground">{p.name}</h3>
                <ArrowRight size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <p className="text-xs font-mono text-muted-foreground mb-3">{p.slug}</p>
              <div className="flex gap-2 mb-3">
                {p.envs.map((e) => (
                  <EdrixBadge key={e} variant={envColor[e] as any}>{e}</EdrixBadge>
                ))}
              </div>
              <p className="text-xs font-mono text-muted-foreground">Created {p.created}</p>
            </EdrixCard>
          </Link>
        ))}

        {/* Empty state card */}
        <div
          className="rounded-lg border-2 border-dashed border-border flex items-center justify-center p-10 cursor-pointer hover:border-primary/30 transition-colors"
          onClick={() => setShowCreate(true)}
        >
          <div className="text-center">
            <Plus size={24} className="mx-auto text-muted-foreground mb-2" />
            <p className="text-sm font-mono text-muted-foreground">Create your first project</p>
          </div>
        </div>
      </div>

      <EdrixModal open={showCreate} onClose={() => setShowCreate(false)} title="New Project"
        footer={<><EdrixButton variant="ghost" onClick={() => setShowCreate(false)}>Cancel</EdrixButton><EdrixButton>Create</EdrixButton></>}
      >
        <div className="flex flex-col gap-4">
          <EdrixInput label="Project Name" placeholder="My Awesome Project" />
          <EdrixInput label="Slug" placeholder="my-awesome-project" />
        </div>
      </EdrixModal>
    </div>
  );
};

export default ProjectsPage;
