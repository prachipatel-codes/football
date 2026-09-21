'use client';
import { useEffect, useState } from 'react';
import { apiFetch } from '@/store/auth';
import toast from 'react-hot-toast';

export default function AdminMatches() {
  const [matches, setMatches] = useState<any[]>([]);
  const [venues, setVenues] = useState<any[]>([]);
  const [form, setForm] = useState({ venueId:'', date:'', startTime:'', endTime:'', category:'STANDARD', price:299, maxPlayers:14, notes:'' });

  const load = ()=> apiFetch('/api/admin/matches').then(r=>r.json()).then(d=>setMatches(d.matches||[]));
  useEffect(()=>{ load(); 
    // quick venues fetch via matches then dedupe — simpler: hardcode for seed
    fetch('/api/matches').then(r=>r.json()).then(()=>{});
  }, []);

  // seed venues quick fetch helper
  useEffect(()=>{
    // temporary: get venues from prisma? just manual
    // We'll let admin paste venueId manually first; improve later
  }, []);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        maxPlayers: Number(form.maxPlayers),
        date: new Date(form.startTime).toISOString(),
        startTime: new Date(form.startTime).toISOString(),
        endTime: new Date(form.endTime).toISOString(),
      };
      const res = await apiFetch('/api/admin/matches', { method:'POST', body: JSON.stringify(payload) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      toast.success('Match created');
      load();
    } catch(err:any){ toast.error(err.message); }
  }

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-white/10 bg-[#101828] p-5">
        <h2 className="font-bold mb-3">New Match</h2>
        <form onSubmit={create} className="grid md:grid-cols-3 gap-3 text-sm">
          <input placeholder="venueId (see venues page)" required value={form.venueId} onChange={e=>setForm({...form, venueId:e.target.value})}
            className="px-3 py-2 rounded-xl bg-black/30 border border-white/15 col-span-3"/>
          <input type="datetime-local" required value={form.startTime} onChange={e=>setForm({...form, startTime:e.target.value})}
            className="px-3 py-2 rounded-xl bg-black/30 border border-white/15"/>
          <input type="datetime-local" required value={form.endTime} onChange={e=>setForm({...form, endTime:e.target.value})}
            className="px-3 py-2 rounded-xl bg-black/30 border border-white/15"/>
          <select value={form.category} onChange={e=>setForm({...form, category:e.target.value})}
            className="px-3 py-2 rounded-xl bg-black/30 border border-white/15">
            <option>STANDARD</option><option>PLUS</option>
          </select>
          <input type="number" value={form.price} onChange={e=>setForm({...form, price: Number(e.target.value)})}
            className="px-3 py-2 rounded-xl bg-black/30 border border-white/15" placeholder="price"/>
          <input type="number" value={form.maxPlayers} onChange={e=>setForm({...form, maxPlayers: Number(e.target.value)})}
            className="px-3 py-2 rounded-xl bg-black/30 border border-white/15" placeholder="maxPlayers"/>
          <input placeholder="notes" value={form.notes} onChange={e=>setForm({...form, notes:e.target.value})}
            className="px-3 py-2 rounded-xl bg-black/30 border border-white/15 md:col-span-3"/>
          <button className="md:col-span-3 py-2.5 rounded-xl bg-offside-green text-[#07200a] font-bold">Create Match</button>
        </form>
        <p className="text-xs text-white/50 mt-2">Tip: weekly bulk scheduler — duplicate for Sunday slots. Venue IDs found in /admin/venues.</p>
      </div>

      <div>
        <h3 className="font-bold mb-3">Recent matches</h3>
        <div className="space-y-2">
          {matches.slice(0,30).map((m:any)=>(
            <div key={m.id} className="flex items-center justify-between px-4 py-3 rounded-xl bg-[#0f1729] border border-white/10 text-sm">
              <div>{new Date(m.startTime).toLocaleString('en-IN')} • {m.venue.city.name} • {m.venue.name} • {m.category} • ₹{m.price}</div>
              <div className="text-white/60">{m.status} • {m._count.bookings} bookings</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
