'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data } = await api.post('/auth/login', form);
      setAuth(data.data.user, data.data.accessToken, data.data.refreshToken);
      router.push('/overview');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-bg flex items-center justify-center px-6">

      {/* Grid bg */}
      <div className="absolute inset-0 opacity-5"
        style={{ backgroundImage: 'linear-gradient(#00f5ff 1px, transparent 1px), linear-gradient(90deg, #00f5ff 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

      <div className="relative z-10 w-full max-w-sm animate-slide-up">

        {/* Logo */}
        <div className="flex items-center gap-3 mb-10">
          <div className="w-6 h-6 border border-cyan rotate-45 glow" />
          <span className="font-display text-xl font-bold tracking-widest text-cyan">EDRIX</span>
        </div>

        <h1 className="font-display text-3xl font-bold text-white mb-2">Welcome back</h1>
        <p className="text-muted text-sm mb-8">Sign in to your universe</p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs tracking-widest text-muted block mb-2">EMAIL</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full bg-card border border-border text-text px-4 py-3 text-sm focus:outline-none focus:border-cyan transition-colors"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="text-xs tracking-widest text-muted block mb-2">PASSWORD</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full bg-card border border-border text-text px-4 py-3 text-sm focus:outline-none focus:border-cyan transition-colors"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="border border-danger/30 bg-danger/5 text-danger text-xs px-4 py-3">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cyan text-bg font-display font-bold text-sm tracking-widest py-3 hover:opacity-90 transition-opacity disabled:opacity-50 glow mt-2">
            {loading ? 'SIGNING IN...' : 'SIGN IN'}
          </button>
        </form>

        <p className="text-muted text-xs mt-6 text-center">
          No account?{' '}
          <Link href="/register" className="text-cyan underline-cyan">Create one</Link>
        </p>
      </div>
    </main>
  );
}