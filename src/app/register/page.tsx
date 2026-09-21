'use client';
import { useState } from 'react';
import { useAuth } from '@/store/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const [form, setForm] = useState({ name:'', email:'', phone:'', password:'', city:'Vadodara', position:'Midfielder' });
  const [loading, setLoading] = useState(false);
  const setAuth = useAuth(s=>s.setAuth);
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', { method:'POST', headers:{'Content-Type':'application/json'}, credentials:'include', body: JSON.stringify(form)});
      const data = await res.json();
      if (!res.ok) throw new Error(typeof data.error==='string'?data.error:'Validation failed');
      setAuth(data.user, data.accessToken);
      toast.success('Account created');
      router.push('/matches');
    } catch(err:any){ toast.error(err.message); } finally { setLoading(false); }
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-14">
      <h1 className="text-3xl font-extrabold">Create Free Account</h1>
      <p className="text-white/60 mt-2 text-sm">Join Offside Community — Vadodara & Ahmedabad</p>
      <form onSubmit={submit} className="mt-8 space-y-4 bg-[#101828]/70 border border-white/10 rounded-2xl p-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="text-sm text-white/70">Full name</label>
            <input required value={form.name} onChange={e=>setForm({...form, name:e.target.value})}
              className="w-full mt-1 px-4 py-3 rounded-xl bg-black/30 border border-white/15 focus:border-offside-green outline-none" />
          </div>
          <div>
            <label className="text-sm text-white/70">Email</label>
            <input type="email" required value={form.email} onChange={e=>setForm({...form, email:e.target.value})}
              className="w-full mt-1 px-4 py-3 rounded-xl bg-black/30 border border-white/15 outline-none" />
          </div>
          <div>
            <label className="text-sm text-white/70">Phone (10 digit)</label>
            <input required pattern="[6-9][0-9]{9}" value={form.phone} onChange={e=>setForm({...form, phone:e.target.value})}
              className="w-full mt-1 px-4 py-3 rounded-xl bg-black/30 border border-white/15 outline-none" />
          </div>
          <div className="sm:col-span-2">
            <label className="text-sm text-white/70">Password (min 8)</label>
            <input type="password" required minLength={8} value={form.password} onChange={e=>setForm({...form, password:e.target.value})}
              className="w-full mt-1 px-4 py-3 rounded-xl bg-black/30 border border-white/15 outline-none" />
          </div>
          <div>
            <label className="text-sm text-white/70">City</label>
            <select value={form.city} onChange={e=>setForm({...form, city:e.target.value})}
              className="w-full mt-1 px-4 py-3 rounded-xl bg-black/30 border border-white/15 outline-none">
              <option>Vadodara</option>
              <option>Ahmedabad</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-white/70">Position</label>
            <select value={form.position} onChange={e=>setForm({...form, position:e.target.value})}
              className="w-full mt-1 px-4 py-3 rounded-xl bg-black/30 border border-white/15 outline-none">
              <option>GK</option><option>Defender</option><option>Midfielder</option><option>Forward</option>
            </select>
          </div>
        </div>
        <button disabled={loading} className="w-full py-3 rounded-xl bg-offside-green text-[#07200a] font-bold">
          {loading ? 'Creating…' : 'Create account'}
        </button>
        <div className="text-sm text-center text-white/70">Already have an account? <Link href="/login" className="text-offside-green underline">Sign in</Link></div>
      </form>
    </div>
  );
}
