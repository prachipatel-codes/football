'use client';
import { useEffect, useState } from 'react';
import { apiFetch } from '@/store/auth';
import toast from 'react-hot-toast';

export default function AdminBookings() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [filter, setFilter] = useState('PENDING');

  const load = ()=> {
    const q = filter ? `?paymentStatus=${filter}` : '';
    apiFetch(`/api/admin/bookings${q}`).then(r=>r.json()).then(d=>setBookings(d.bookings||[]));
  };
  useEffect(()=>{ load(); }, [filter]);

  async function act(id:string, action:'VERIFIED'|'REJECTED') {
    const res = await apiFetch('/api/admin/bookings', { method:'PATCH', body: JSON.stringify({ bookingId:id, action }) });
    if (res.ok) { toast.success(action); load(); } else toast.error('Failed');
  }

  return (
    <div>
      <div className="flex gap-2 mb-4 text-sm">
        {['PENDING','VERIFIED','REJECTED',''].map(f=>(
          <button key={f||'ALL'} onClick={()=>setFilter(f)}
            className={`px-3 py-1.5 rounded-full border ${filter===f?'border-offside-green text-offside-green':'border-white/15 text-white/70'}`}>
            {f||'ALL'}
          </button>
        ))}
      </div>
      <div className="space-y-3">
        {bookings.map(b=>(
          <div key={b.id} className="rounded-xl border border-white/10 bg-[#101828] p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="font-semibold">{b.user.name} • {b.user.phone}</div>
                <div className="text-sm text-white/70">{b.match.venue.city.name} • {new Date(b.match.startTime).toLocaleString('en-IN')} • {b.match.category}</div>
                <div className="text-xs text-white/50 mt-1">UPI: {b.upiIdUsed}</div>
              </div>
              <div className="text-right text-sm">
                <div>₹{b.match.price} • <b className={b.paymentStatus==='PENDING'?'text-amber-300': b.paymentStatus==='VERIFIED'?'text-offside-green':'text-red-400'}>{b.paymentStatus}</b></div>
                {b.screenshotUrl && <a href={b.screenshotUrl} target="_blank" className="text-offside-green underline text-xs">screenshot →</a>}
              </div>
            </div>
            {b.paymentStatus==='PENDING' && (
              <div className="flex gap-2 mt-3">
                <button onClick={()=>act(b.id,'VERIFIED')} className="px-3 py-1.5 rounded-lg bg-offside-green text-[#07200a] text-sm font-semibold">Verify</button>
                <button onClick={()=>act(b.id,'REJECTED')} className="px-3 py-1.5 rounded-lg bg-red-500/15 text-red-300 border border-red-500/30 text-sm">Reject</button>
              </div>
            )}
          </div>
        ))}
        {bookings.length===0 && <div className="text-white/60">No bookings in this filter.</div>}
      </div>
    </div>
  );
}
