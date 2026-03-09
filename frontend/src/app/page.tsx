import Link from 'next/link';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-bg flex flex-col items-center justify-center relative overflow-hidden">

      {/* Grid background */}
      <div className="absolute inset-0 opacity-5"
        style={{ backgroundImage: 'linear-gradient(#00f5ff 1px, transparent 1px), linear-gradient(90deg, #00f5ff 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

      {/* Glow orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-5"
        style={{ background: 'radial-gradient(circle, #00f5ff, transparent)' }} />

      {/* Content */}
      <div className="relative z-10 text-center px-6 animate-fade-in">

        {/* Logo */}
        <div className="inline-flex items-center gap-3 mb-12">
          <div className="w-8 h-8 border border-cyan rotate-45 glow" />
          <span className="font-display text-2xl font-bold tracking-widest text-cyan glow-text">
            EDRIX
          </span>
        </div>

        {/* Headline */}
        <h1 className="font-display text-6xl md:text-8xl font-bold text-white mb-6 leading-none">
          The infrastructure<br />
          <span className="text-cyan glow-text">that rules.</span>
        </h1>

        <p className="text-muted text-lg mb-12 max-w-md mx-auto">
          Build kingdoms. Ship empires.<br />
          One platform for everything your startup needs.
        </p>

        {/* CTA */}
        <div className="flex gap-4 justify-center">
          <Link href="/register"
            className="px-8 py-3 bg-cyan text-bg font-display font-bold text-sm tracking-widest hover:opacity-90 transition-opacity glow">
            GET STARTED
          </Link>
          <Link href="/login"
            className="px-8 py-3 border border-border text-text font-display text-sm tracking-widest hover:border-cyan hover:text-cyan transition-colors">
            SIGN IN
          </Link>
        </div>

        {/* Stats */}
        <div className="flex gap-12 justify-center mt-20 text-muted">
          {[['9', 'Modules'], ['50+', 'DB Tables'], ['∞', 'Scale']].map(([num, label]) => (
            <div key={label} className="text-center">
              <div className="font-display text-3xl font-bold text-cyan">{num}</div>
              <div className="text-xs tracking-widest mt-1">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom ticker */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-border overflow-hidden py-3">
        <div className="flex animate-ticker whitespace-nowrap">
          {Array(4).fill(['AUTH', 'JOBS', 'LOGS', 'BILLING', 'WEBHOOKS', 'PROJECTS', 'RBAC', 'API KEYS']).flat().map((item, i) => (
            <span key={i} className="mx-8 text-xs tracking-widest text-muted">
              <span className="text-cyan mr-2">◆</span>{item}
            </span>
          ))}
        </div>
      </div>
    </main>
  );
}