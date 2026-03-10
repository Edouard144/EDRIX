import { EdrixCard } from "@/components/edrix/EdrixCard";
import { EdrixBadge } from "@/components/edrix/EdrixBadge";
import { EdrixButton } from "@/components/edrix/EdrixButton";
import { StatCard } from "@/components/modules/overview/StatCard";
import { useBilling } from "@/hooks/useBilling";
import { Download, Check } from "lucide-react";

const BillingPage = () => {
  const { plans, subscription, usage, invoices, changePlan } = useBilling();

  return (
    <div className="space-y-6 animate-fade-slide-up">
      <h1 className="font-syne font-bold text-3xl text-foreground">Billing</h1>

      {/* Current plan */}
      <EdrixCard className="border-primary/20">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Current Plan</p>
            <p className="font-syne font-bold text-2xl text-foreground mt-1">{subscription?.plan?.name || "Free"}</p>
          </div>
          <p className="font-syne font-bold text-3xl text-primary">
            {subscription?.plan?.price ? `$${subscription.plan.price}` : "$0"}
            <span className="text-sm text-muted-foreground font-mono">/mo</span>
          </p>
        </div>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-xs font-mono text-muted-foreground mb-1">
              <span>API Calls</span>
              <span>{usage?.api_requests?.toLocaleString() || "0"} / {subscription?.plan?.limits?.api_calls?.toLocaleString() || "1,000"}</span>
            </div>
            <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: `${Math.min(((usage?.api_requests || 0) / (subscription?.plan?.limits?.api_calls || 1000)) * 100, 100)}%` }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs font-mono text-muted-foreground mb-1">
              <span>Jobs</span>
              <span>{usage?.jobs?.toLocaleString() || "0"} / ∞</span>
            </div>
            <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
              <div className="h-full bg-success rounded-full" style={{ width: "5%" }} />
            </div>
          </div>
        </div>
      </EdrixCard>

      {/* Projected + Usage */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <StatCard label="Projected Monthly Bill" value={usage ? `$${usage.total?.toFixed(2) || "0.00"}` : "$0.00"} subtitle="estimated based on current usage" />
        <div className="lg:col-span-2">
          <EdrixCard>
            <h3 className="font-syne font-bold text-foreground mb-3">Usage Breakdown</h3>
            <table className="w-full text-xs font-mono">
              <thead><tr className="border-b border-border text-muted-foreground"><th className="text-left py-2">TYPE</th><th className="text-left py-2">QUANTITY</th><th className="text-right py-2">COST</th></tr></thead>
              <tbody>
                <tr className="border-b border-border/30">
                  <td className="py-2 text-foreground">API Requests</td>
                  <td className="py-2 text-muted-foreground">{usage?.api_requests?.toLocaleString() || "0"}</td>
                  <td className="py-2 text-right text-primary">${usage?.api_requests_cost?.toFixed(2) || "0.00"}</td>
                </tr>
                <tr className="border-b border-border/30">
                  <td className="py-2 text-foreground">Job Executions</td>
                  <td className="py-2 text-muted-foreground">{usage?.jobs?.toLocaleString() || "0"}</td>
                  <td className="py-2 text-right text-primary">${usage?.jobs_cost?.toFixed(2) || "0.00"}</td>
                </tr>
                <tr className="border-b border-border/30">
                  <td className="py-2 text-foreground">Webhook Deliveries</td>
                  <td className="py-2 text-muted-foreground">{usage?.webhook_deliveries?.toLocaleString() || "0"}</td>
                  <td className="py-2 text-right text-primary">${usage?.webhooks_cost?.toFixed(2) || "0.00"}</td>
                </tr>
              </tbody>
            </table>
          </EdrixCard>
        </div>
      </div>

      {/* Invoices */}
      <EdrixCard>
        <h3 className="-bold text-foreground mb-3">font-syne fontInvoice History</h3>
        {invoices && invoices.length > 0 ? (
          <div className="text-center py-5 text-muted-foreground">Loading invoices...</div>
        ) : invoices && invoices.length > 0 ? (
          <table className="w-full text-xs font-mono">
            <thead><tr className="border-b border-border text-muted-foreground"><th className="text-left py-2">PERIOD</th><th className="text-left py-2">AMOUNT</th><th className="text-left py-2">STATUS</th><th className="text-right py-2"></th></tr></thead>
            <tbody>
              {invoices.map((inv: any) => (
                <tr key={inv.id} className="border-b border-border/30 hover:bg-secondary/30">
                  <td className="py-3 text-foreground">{inv.period || inv.created_at}</td>
                  <td className="py-3 text-foreground">${inv.amount}</td>
                  <td className="py-3"><EdrixBadge variant={inv.status === "paid" ? "success" : "warning"}>{inv.status?.toUpperCase() || "OPEN"}</EdrixBadge></td>
                  <td className="py-3 text-right"><button className="text-muted-foreground hover:text-primary"><Download size={14} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-5 text-muted-foreground">No invoices yet</div>
        )}
      </EdrixCard>

      {/* Plan cards */}
      <div>
        <h2 className="font-syne font-bold text-lg text-foreground mb-4">Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans && plans.length > 0 ? plans.map((plan: any) => (
            <EdrixCard key={plan.id} className={subscription?.plan?.id === plan.id ? "border-primary/40" : ""} hover>
              <h3 className="font-syne font-bold text-xl text-foreground">{plan.name}</h3>
              <p className="font-syne font-bold text-3xl text-primary mt-2">{plan.price === 0 ? "Free" : `$${plan.price}`}</p>
              {plan.price > 0 && <span className="text-xs font-mono text-muted-foreground">/month</span>}
              <ul className="mt-4 space-y-2">
                {plan.features?.map((f: string, i: number) => (
                  <li key={i} className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
                    <Check size={12} className="text-success" /> {f}
                  </li>
                ))}
              </ul>
              <EdrixButton
                variant={subscription?.plan?.id === plan.id ? "muted" : "outline"}
                className="w-full mt-4"
                disabled={subscription?.plan?.id === plan.id}
                onClick={() => changePlan.mutate(plan.id)}
              >
                {subscription?.plan?.id === plan.id ? "Current Plan" : "Upgrade"}
              </EdrixButton>
            </EdrixCard>
          )) : (
            // Fallback plans when API not available
            <>
              <EdrixCard hover>
                <h3 className="font-syne font-bold text-xl text-foreground">Free</h3>
                <p className="font-syne font-bold text-3xl text-primary mt-2">$0</p>
                <span className="text-xs font-mono text-muted-foreground">/month</span>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-center gap-2 text-xs font-mono text-muted-foreground"><Check size={12} className="text-success" /> 1,000 API calls/mo</li>
                  <li className="flex items-center gap-2 text-xs font-mono text-muted-foreground"><Check size={12} className="text-success" /> 1 project</li>
                  <li className="flex items-center gap-2 text-xs font-mono text-muted-foreground"><Check size={12} className="text-success" /> 5 jobs/day</li>
                </ul>
                <EdrixButton variant="muted" className="w-full mt-4" disabled>Current Plan</EdrixButton>
              </EdrixCard>
              <EdrixCard hover>
                <h3 className="font-syne font-bold text-xl text-foreground">Pro</h3>
                <p className="font-syne font-bold text-3xl text-primary mt-2">$49</p>
                <span className="text-xs font-mono text-muted-foreground">/month</span>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-center gap-2 text-xs font-mono text-muted-foreground"><Check size={12} className="text-success" /> 100,000 API calls/mo</li>
                  <li className="flex items-center gap-2 text-xs font-mono text-muted-foreground"><Check size={12} className="text-success" /> Unlimited projects</li>
                  <li className="flex items-center gap-2 text-xs font-mono text-muted-foreground"><Check size={12} className="text-success" /> Unlimited jobs</li>
                </ul>
                <EdrixButton variant="outline" className="w-full mt-4">Upgrade</EdrixButton>
              </EdrixCard>
              <EdrixCard hover>
                <h3 className="font-syne font-bold text-xl text-foreground">Enterprise</h3>
                <p className="font-syne font-bold text-3xl text-primary mt-2">Custom</p>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-center gap-2 text-xs font-mono text-muted-foreground"><Check size={12} className="text-success" /> Unlimited everything</li>
                  <li className="flex items-center gap-2 text-xs font-mono text-muted-foreground"><Check size={12} className="text-success" /> Dedicated support</li>
                  <li className="flex items-center gap-2 text-xs font-mono text-muted-foreground"><Check size={12} className="text-success" /> SLA guarantee</li>
                </ul>
                <EdrixButton variant="outline" className="w-full mt-4">Contact</EdrixButton>
              </EdrixCard>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BillingPage;
