'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/store/auth';
import Link from 'next/link';
import { formatINR } from '@/lib/utils';

type Match = {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  category: 'STANDARD'|'PLUS';
  price: number;
  venue: { name: string; city: string; address: string };
  spotsLeft: number;
  spotsFilled: number;
  maxPlayers: number;
};

export default function MatchListHome() {
  const cityFilter = useAuth(s=>s.cityFilter);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    setLoading(true);
    fetch(`/api/matches?city=${encodeURIComponent(cityFilter)}&upcoming=true`, { cache: 'no-store' })
      .then(r=>r.json()).then(d=>setMatches(d.matches||[])).finally(()=>setLoading(false));
  }, [cityFilter]);

  if (loading) return <div className="text-white/60 text-center py-10">Loading matches in {cityFilter}…</div>;
  if (!matches.length) return <div className="text-center py-12 text-white/60 rounded-2xl border border-dashed border-white/15">No upcoming matches in {cityFilter} yet. Check Sunday schedule drop.</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Upcoming in {cityFilter}</h2>
        <Link href="/matches" className="text-sm text-offside-green hover:underline">View all →</Link>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {matches.slice(0,6).map(m=>{
          const d = new Date(m.startTime);
          return (
            <div key={m.id} className="rounded-2xl border border-white/10 bg-[#101827]/70 p-5 hover:border-white/20 transition">
              <div className="flex items-center justify-between text-xs">
                <span className={`px-2.5 py-1 rounded-full ${m.category==='PLUS' ? 'bg-offside-green/15 text-offside-green' : 'bg-white/7 text-white/80'}`}>{m.category}</span>
                <span className="text-white/50">{m.venue.city}</span>
              </div>
              <div className="mt-3 font-semibold">{d.toLocaleDateString('en-IN', { weekday:'short', day:'numeric', month:'short'})} • {d.toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit'})}</div>
              <div className="text-sm text-white/70 mt-1">{m.venue.name}</div>
              <div className="mt-4 flex items-end justify-between">
                <div>
                  <div className="text-lg font-bold text-offside-green">{formatINR(m.price)}</div>
                  <div className="text-xs text-white/60">{m.spotsFilled}/{m.maxPlayers} filled • {m.spotsLeft} left</div>
                </div>
                <Link href={`/matches/${m.id}`} className="text-sm px-3 py-1.5 rounded-full bg-white/[0.06] border border-white/15 hover:bg-white/[0.1]">Details</Link>
              </div>
              <div className="w-full h-1.5 bg-white/10 rounded-full mt-4 overflow-hidden">
                <div className="h-full bg-offside-green" style={{ width: `${(m.spotsFilled/m.maxPlayers)*100}%`}}/>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
