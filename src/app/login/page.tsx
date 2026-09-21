'use client';
import { useState } from 'react';
import { useAuth } from '@/store/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('player@test.com');
  const [password, setPassword] = useState('Player@123');
  const [loading, setLoading] = useState(false);
  const setAuth = useAuth(s=>s.setAuth);
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', { method:'POST', headers:{'Content-Type':'application/json'}, credentials:'include', body: JSON.stringify({ email, password })});
      const data = await res.json();
      if (!res.ok) throw new Error(data.error||'Login failed');
      setAuth(data.user, data.accessToken);
      toast.success(`Welcome ${data.user.name}`);
      router.push(data.user.role==='ADMIN' ? '/admin' : '/matches');
    } catch(err:any){ toast.error(err.message); } finally { setLoading(false); }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="text-3xl font-extrabold">Sign in</h1>
      <p className="text-white/60 mt-2 text-sm">Built by ballers, for ballers.</p>
      <form onSubmit={submit} className="mt-8 space-y-4 bg-[#101828]/70 border border-white/10 rounded-2xl p-6">
        <div>
          <label className="text-sm text-white/70">Email</label>
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required
            className="w-full mt-1 px-4 py-3 rounded-xl bg-black/30 border border-white/15 focus:border-offside-green outline-none" />
        </div>
        <div>
          <label className="text-sm text-white/70">Password</label>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required
            className="w-full mt-1 px-4 py-3 rounded-xl bg-black/30 border border-white/15 focus:border-offside-green outline-none" />
        </div>
        <button disabled={loading} className="w-full py-3 rounded-xl bg-offside-green text-[#07200a] font-bold shadow-glow disabled:opacity-60">
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
        <div className="text-xs text-white/50">Demo — player@test.com / Player@123 — admin@theoffsidecommunity.com / Admin@123</div>
        <div className="text-sm text-center text-white/70">No account? <Link href="/register" className="text-offside-green underline">Create free account</Link></div>
      </form>
    </div>
  );
}
