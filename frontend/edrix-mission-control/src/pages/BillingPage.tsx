import { EdrixCard } from "@/components/edrix/EdrixCard";
import { EdrixBadge } from "@/components/edrix/EdrixBadge";
import { EdrixButton } from "@/components/edrix/EdrixButton";
import { StatCard } from "@/components/modules/overview/StatCard";
import { Download, Check } from "lucide-react";

const plans = [
  {
    name: "Free", price: "$0", features: ["1,000 API calls/mo", "1 project", "Community support", "5 jobs/day"],
    current: false,
  },
  {
    name: "Pro", price: "$49", features: ["100,000 API calls/mo", "Unlimited projects", "Priority support", "Unlimited jobs", "Custom webhooks", "Analytics"],
    current: true,
  },
  {
    name: "Enterprise", price: "Custom", features: ["Unlimited everything", "Dedicated support", "SLA guarantee", "SSO / SAML", "Audit logs", "Custom integrations"],
    current: false,
  },
];

const invoices = [
  { period: "Mar 2026", amount: "$482.50", status: "open" },
  { period: "Feb 2026", amount: "$412.00", status: "paid" },
  { period: "Jan 2026", amount: "$398.75", status: "paid" },
  { period: "Dec 2025", amount: "$356.20", status: "paid" },
];

const usage = [
  { type: "API Requests", qty: "14,823", cost: "$148.23" },
  { type: "Job Executions", qty: "1,247", cost: "$62.35" },
  { type: "Webhook Deliveries", qty: "3,891", cost: "$38.91" },
  { type: "Storage (GB)", qty: "12.4", cost: "$24.80" },
  { type: "Bandwidth (GB)", qty: "45.2", cost: "$22.60" },
];

const BillingPage = () => {
  return (
    <div className="space-y-6 animate-fade-slide-up">
      <h1 className="font-syne font-bold text-3xl text-foreground">Billing</h1>

      {/* Current plan */}
      <EdrixCard className="border-primary/20">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Current Plan</p>
            <p className="font-syne font-bold text-2xl text-foreground mt-1">Pro Plan</p>
          </div>
          <p className="font-syne font-bold text-3xl text-primary">$49<span className="text-sm text-muted-foreground font-mono">/mo</span></p>
        </div>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-xs font-mono text-muted-foreground mb-1">
              <span>API Calls</span><span>14,823 / 100,000</span>
            </div>
            <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: "14.8%" }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs font-mono text-muted-foreground mb-1">
              <span>Jobs</span><span>1,247 / ∞</span>
            </div>
            <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
              <div className="h-full bg-success rounded-full" style={{ width: "5%" }} />
            </div>
          </div>
        </div>
      </EdrixCard>

      {/* Projected + Usage */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <StatCard label="Projected Monthly Bill" value="$482.50" subtitle="estimated based on current usage" />
        <div className="lg:col-span-2">
          <EdrixCard>
            <h3 className="font-syne font-bold text-foreground mb-3">Usage Breakdown</h3>
            <table className="w-full text-xs font-mono">
              <thead><tr className="border-b border-border text-muted-foreground"><th className="text-left py-2">TYPE</th><th className="text-left py-2">QUANTITY</th><th className="text-right py-2">COST</th></tr></thead>
              <tbody>
                {usage.map((u) => (
                  <tr key={u.type} className="border-b border-border/30">
                    <td className="py-2 text-foreground">{u.type}</td>
                    <td className="py-2 text-muted-foreground">{u.qty}</td>
                    <td className="py-2 text-right text-primary">{u.cost}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </EdrixCard>
        </div>
      </div>

      {/* Invoices */}
      <EdrixCard>
        <h3 className="font-syne font-bold text-foreground mb-3">Invoice History</h3>
        <table className="w-full text-xs font-mono">
          <thead><tr className="border-b border-border text-muted-foreground"><th className="text-left py-2">PERIOD</th><th className="text-left py-2">AMOUNT</th><th className="text-left py-2">STATUS</th><th className="text-right py-2"></th></tr></thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv.period} className="border-b border-border/30 hover:bg-secondary/30">
                <td className="py-3 text-foreground">{inv.period}</td>
                <td className="py-3 text-foreground">{inv.amount}</td>
                <td className="py-3"><EdrixBadge variant={inv.status === "paid" ? "success" : "warning"}>{inv.status.toUpperCase()}</EdrixBadge></td>
                <td className="py-3 text-right"><button className="text-muted-foreground hover:text-primary"><Download size={14} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </EdrixCard>

      {/* Plan cards */}
      <div>
        <h2 className="font-syne font-bold text-lg text-foreground mb-4">Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map((plan) => (
            <EdrixCard key={plan.name} className={plan.current ? "border-primary/40" : ""} hover>
              <h3 className="font-syne font-bold text-xl text-foreground">{plan.name}</h3>
              <p className="font-syne font-bold text-3xl text-primary mt-2">{plan.price}</p>
              {plan.price !== "Custom" && <span className="text-xs font-mono text-muted-foreground">/month</span>}
              <ul className="mt-4 space-y-2">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
                    <Check size={12} className="text-success" /> {f}
                  </li>
                ))}
              </ul>
              <EdrixButton
                variant={plan.current ? "muted" : "outline"}
                className="w-full mt-4"
                disabled={plan.current}
              >
                {plan.current ? "Current Plan" : "Upgrade"}
              </EdrixButton>
            </EdrixCard>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BillingPage;
