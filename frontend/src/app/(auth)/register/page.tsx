'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ full_name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/auth/register', form);
      router.push('/login?registered=true');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-bg flex items-center justify-center px-6">
      <div className="absolute inset-0 opacity-5"
        style={{ backgroundImage: 'linear-gradient(#00f5ff 1px, transparent 1px), linear-gradient(90deg, #00f5ff 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

      <div className="relative z-10 w-full max-w-sm animate-slide-up">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-6 h-6 border border-cyan rotate-45 glow" />
          <span className="font-display text-xl font-bold tracking-widest text-cyan">EDRIX</span>
        </div>

        <h1 className="font-display text-3xl font-bold text-white mb-2">Create account</h1>
        <p className="text-muted text-sm mb-8">Join the universe</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { key: 'full_name', label: 'FULL NAME', type: 'text', placeholder: 'Edouard' },
            { key: 'email',     label: 'EMAIL',     type: 'email', placeholder: 'you@example.com' },
            { key: 'password',  label: 'PASSWORD',  type: 'password', placeholder: '8+ characters' },
          ].map(({ key, label, type, placeholder }) => (
            <div key={key}>
              <label className="text-xs tracking-widest text-muted block mb-2">{label}</label>
              <input
                type={type}
                value={form[key as keyof typeof form]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                className="w-full bg-card border border-border text-text px-4 py-3 text-sm focus:outline-none focus:border-cyan transition-colors"
                placeholder={placeholder}
                required
              />
            </div>
          ))}

          {error && (
            <div className="border border-danger/30 bg-danger/5 text-danger text-xs px-4 py-3">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cyan text-bg font-display font-bold text-sm tracking-widest py-3 hover:opacity-90 transition-opacity disabled:opacity-50 glow mt-2">
            {loading ? 'CREATING...' : 'CREATE ACCOUNT'}
          </button>
        </form>

        <p className="text-muted text-xs mt-6 text-center">
          Have an account?{' '}
          <Link href="/login" className="text-cyan underline-cyan">Sign in</Link>
        </p>
      </div>
    </main>
  );
}