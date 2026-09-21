'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/store/auth';
import Link from 'next/link';
import { formatINR } from '@/lib/utils';

export default function MatchesPage() {
  const cityFilter = useAuth(s=>s.cityFilter);
  const setCityFilter = useAuth(s=>s.setCityFilter);
  const [cat, setCat] = useState<string>('ALL');
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    setLoading(true);
    const p = new URLSearchParams({ upcoming:'true', city: cityFilter });
    if (cat !== 'ALL') p.set('category', cat);
    fetch(`/api/matches?${p.toString()}`).then(r=>r.json()).then(d=>setMatches(d.matches||[])).finally(()=>setLoading(false));
  }, [cityFilter, cat]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-extrabold">Find a Match</h1>
      <div className="flex flex-wrap gap-3 mt-5">
        {['Vadodara','Ahmedabad'].map(c=>(
          <button key={c} onClick={()=>setCityFilter(c)}
            className={`px-4 py-2 rounded-full border text-sm ${cityFilter===c ? 'border-offside-green text-offside-green bg-offside-green/10' : 'border-white/15 text-white/80'}`}>{c}</button>
        ))}
        <div className="w-px bg-white/10 mx-2 hidden sm:block" />
        {['ALL','STANDARD','PLUS'].map(k=>(
          <button key={k} onClick={()=>setCat(k)}
            className={`px-3 py-2 rounded-full text-sm ${cat===k ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white'}`}>{k}</button>
        ))}
      </div>

      {loading ? <div className="py-16 text-white/60">Loading…</div> :
      matches.length===0 ? <div className="py-16 text-white/60">No matches. New schedule every Sunday.</div> :
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">
        {matches.map((m:any)=>{
          const d = new Date(m.startTime);
          return (
            <Link key={m.id} href={`/matches/${m.id}`} className="rounded-2xl border border-white/10 bg-[#0f1729]/80 p-5 hover:border-offside-green/40 transition block">
              <div className="flex justify-between text-xs">
                <span className={`px-2 py-1 rounded-full ${m.category==='PLUS'?'bg-offside-green/15 text-offside-green':'bg-white/8 text-white/80'}`}>{m.category}</span>
                <span className="text-white/50">{m.venue.city}</span>
              </div>
              <div className="mt-3 text-lg font-semibold">{d.toLocaleDateString('en-IN',{weekday:'short', month:'short', day:'numeric'})}</div>
              <div className="text-white/70 text-sm">{d.toLocaleTimeString('en-IN',{hour:'2-digit', minute:'2-digit'})} • {m.venue.name}</div>
              <div className="mt-4 flex items-center justify-between">
                <div className="text-offside-green font-bold">{formatINR(m.price)}</div>
                <div className="text-xs text-white/60">{m.spotsLeft} spots left</div>
              </div>
              <div className="mt-3 h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-offside-green" style={{width:`${(m.spotsFilled/m.maxPlayers)*100}%`}}/>
              </div>
            </Link>
          );
        })}
      </div>}
    </div>
  );
}
