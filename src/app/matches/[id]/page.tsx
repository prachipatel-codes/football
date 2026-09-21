'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/store/auth';
import Link from 'next/link';
import { formatINR } from '@/lib/utils';

export default function MatchDetail() {
  const { id } = useParams();
  const router = useRouter();
  const user = useAuth(s=>s.user);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    if(!id) return;
    fetch(`/api/matches/${id}`, { headers: user ? { Authorization: `Bearer ${useAuth.getState().accessToken||''}` } : {} })
      .then(r=>r.json()).then(setData).finally(()=>setLoading(false));
  }, [id, user]);

  if (loading) return <div className="max-w-4xl mx-auto px-4 py-16 text-white/70">Loading…</div>;
  if (!data?.match) return <div className="max-w-4xl mx-auto px-4 py-16">Match not found</div>;

  const m = data.match;
  const start = new Date(m.startTime);
  const players = data.confirmedPlayers || [];
  const myBooking = data.myBooking;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <Link href="/matches" className="text-sm text-white/60 hover:text-white">← Back to matches</Link>
      <div className="mt-4 grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 rounded-2xl border border-white/10 bg-[#0f1729]/80 p-6">
          <div className={`inline-block text-xs px-2.5 py-1 rounded-full mb-3 ${m.category==='PLUS'?'bg-offside-green/15 text-offside-green':'bg-white/10 text-white/80'}`}>{m.category}</div>
          <h1 className="text-2xl font-bold">{m.venue.city.name} • {m.venue.name}</h1>
          <div className="text-white/70 mt-2">
            {start.toLocaleDateString('en-IN', { weekday:'long', day:'numeric', month:'long' })} • {start.toLocaleTimeString('en-IN', {hour:'2-digit', minute:'2-digit'})}
          </div>
          <div className="text-sm text-white/60 mt-1">{m.venue.address} {m.venue.mapLink && <>• <a href={m.venue.mapLink} target="_blank" className="underline text-offside-green">Maps</a></>}</div>
          {m.notes && <p className="mt-4 text-sm text-white/80 bg-white/5 border border-white/10 rounded-xl p-3">{m.notes}</p>}
          <div className="mt-6">
            <div className="text-sm text-white/60 mb-2">Confirmed Players ({players.length}/{m.maxPlayers})</div>
            {players.length===0 ? <div className="text-white/50 text-sm">Be the first to book.</div> :
              <div className="flex flex-wrap gap-2">
                {players.map((p:any)=>(
                  <div key={p.id} className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm">
                    {p.name} {p.position && <span className="text-white/50">• {p.position}</span>}
                  </div>
                ))}
              </div>
            }
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-[#0f1729]/80 p-6 h-fit">
          <div className="text-3xl font-extrabold text-offside-green">{formatINR(m.price)}</div>
          <div className="text-xs text-white/60 mt-1">per slot • UPI verified</div>
          <div className="mt-5 text-sm">
            <div className="flex justify-between py-1"><span className="text-white/60">Spots</span><span>{players.length}/{m.maxPlayers}</span></div>
            <div className="flex justify-between py-1"><span className="text-white/60">Category</span><span>{m.category}</span></div>
            <div className="flex justify-between py-1"><span className="text-white/60">Status</span><span>{m.status}</span></div>
          </div>
          {myBooking ? (
            <div className="mt-5 p-3 rounded-xl bg-white/5 border border-white/10 text-sm">
              Your booking: <b className={
                myBooking.paymentStatus==='VERIFIED' ? 'text-offside-green' :
                myBooking.paymentStatus==='REJECTED' ? 'text-red-400' : 'text-amber-300'
              }>{myBooking.paymentStatus}</b>
              <div className="mt-2"><Link href="/profile" className="text-offside-green underline">View in profile →</Link></div>
            </div>
          ) : user ? (
            <button onClick={()=>router.push(`/matches/${m.id}/book`)} className="w-full mt-5 py-3 rounded-xl bg-offside-green text-[#07200a] font-bold shadow-glow">
              Book Now
            </button>
          ) : (
            <Link href="/login" className="block text-center w-full mt-5 py-3 rounded-xl bg-offside-green text-[#07200a] font-bold">Sign in to book</Link>
          )}
          <p className="text-[11px] text-white/50 mt-3">Admin-verified UPI. Cancel anytime → refund request in profile.</p>
        </div>
      </div>
    </div>
  );
}
