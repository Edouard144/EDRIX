import { Link } from "react-router-dom";
import { EdrixLogo } from "@/components/EdrixLogo";
import { EdrixButton } from "@/components/edrix/EdrixButton";
import { useEffect, useState } from "react";

const tickerItems = ["AUTH", "JOBS", "LOGS", "BILLING", "WEBHOOKS", "PROJECTS", "RBAC", "API KEYS"];

const LandingPage = () => {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setVisible(true); }, []);

  return (
    <div className="min-h-screen bg-background grid-bg relative overflow-hidden flex flex-col">
      {/* Radial glow */}
      <div className="absolute inset-0 radial-glow pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-8 py-6">
        <EdrixLogo />
        <Link to="/login">
          <EdrixButton variant="ghost" size="sm">Sign In</EdrixButton>
        </Link>
      </header>

      {/* Hero */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4">
        <div className={`transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h1 className="font-syne font-extrabold text-5xl md:text-7xl lg:text-8xl text-foreground leading-tight mb-6">
            The infrastructure<br />that rules.
          </h1>
          <p className="font-mono text-muted-foreground text-lg mb-10">
            Build kingdoms. Ship empires.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link to="/register">
              <EdrixButton size="lg">Get Started</EdrixButton>
            </Link>
            <Link to="/login">
              <EdrixButton variant="outline" size="lg">Sign In</EdrixButton>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className={`mt-16 flex items-center gap-8 font-mono text-sm text-muted-foreground transition-all duration-1000 delay-300 ${visible ? 'opacity-100' : 'opacity-0'}`}>
          <span>9 Modules</span>
          <span className="text-border">◆</span>
          <span>50+ DB Tables</span>
          <span className="text-border">◆</span>
          <span>∞ Scale</span>
        </div>
      </div>

      {/* Ticker */}
      <div className="relative z-10 border-t border-border py-3 overflow-hidden">
        <div className="animate-ticker whitespace-nowrap flex">
          {[...tickerItems, ...tickerItems, ...tickerItems, ...tickerItems].map((item, i) => (
            <span key={i} className="font-mono text-xs text-muted-foreground mx-6 tracking-widest">
              {item} <span className="text-primary ml-6">◆</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
