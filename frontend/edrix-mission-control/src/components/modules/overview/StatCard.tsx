import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  className?: string;
}

const StatCard = ({ label, value, subtitle, className }: StatCardProps) => (
  <div className={cn("rounded-lg bg-card border border-border p-5", className)}>
    <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-2">{label}</p>
    <p className="text-3xl font-syne font-bold text-primary">{value}</p>
    {subtitle && <p className="text-xs font-mono text-muted-foreground mt-1">{subtitle}</p>}
  </div>
);

export { StatCard };
