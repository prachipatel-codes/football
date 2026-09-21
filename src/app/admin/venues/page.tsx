'use client';
import { useEffect, useState } from 'react';

export default function VenuesPage(){
  const [venues, setVenues] = useState<any[]>([]);
  useEffect(()=>{
    // quick hack: pull from matches include
    fetch('/api/matches?upcoming=false').then(r=>r.json()).then(()=>{});
    // fallback show seed IDs
    setVenues([
      { id:'venue_sportingo_seed', name:'Sportingo Turf', city:'Vadodara', address:'Vadodara, Gujarat', map:'https://maps.app.goo.gl/PsPSaG8aWEnbuKgv8?g_st=ic' },
      { id:'venue_ahmedabad_seed', name:'Ahmedabad Turf (TBD)', city:'Ahmedabad', address:'Ahmedabad, Gujarat', map:'' }
    ]);
  },[]);
  return (
    <div>
      <h2 className="font-bold mb-3">Venues (seed)</h2>
      <div className="space-y-2 text-sm">
        {venues.map(v=>(
          <div key={v.id} className="p-4 rounded-xl bg-[#101828] border border-white/10">
            <div className="font-semibold">{v.name} • {v.city}</div>
            <div className="text-white/60">{v.address}</div>
            <div className="text-xs text-offside-green mt-1 font-mono">{v.id}</div>
            {v.map && <a href={v.map} target="_blank" className="text-xs underline text-white/70">maps →</a>}
          </div>
        ))}
      </div>
      <p className="text-xs text-white/50 mt-4">Full venue CRUD API exists at /api/admin/venues — UI form left minimal to ship fast.</p>
    </div>
  );
}
