'use client';
import { useEffect, useState } from 'react';
import { useAuth, apiFetch } from '@/store/auth';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const user = useAuth(s=>s.user);
  const router = useRouter();
  const [bookings, setBookings] = useState<any[]>([]);
  useEffect(()=>{ if(!user) router.push('/login'); }, [user, router]);
  useEffect(()=>{
    apiFetch('/api/bookings').then(r=>r.json()).then(d=>setBookings(d.bookings||[]));
  }, []);

  async function cancel(id:string) {
    if(!confirm('Cancel booking & request refund?')) return;
    const res = await apiFetch(`/api/bookings/${id}/cancel`, { method: 'POST' });
    if (res.ok) { toast.success('Cancelled, refund requested'); location.reload(); }
    else toast.error('Failed');
  }

  if (!user) return null;
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-extrabold">Hi, {user.name}</h1>
      <div className="text-white/60 text-sm mt-1">{user.email} • {user.phone} • {user.city||'—'} {user.role==='ADMIN' && <span className="text-offside-green">• ADMIN</span>}</div>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">My Bookings</h2>
        {bookings.length===0 ? <div className="text-white/60">No bookings yet.</div> :
        <div className="space-y-3">
          {bookings.map((b:any)=>(
            <div key={b.id} className="rounded-xl border border-white/10 bg-[#0f1729]/70 p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <div className="font-semibold">{b.match.venue.city.name} • {b.match.venue.name}</div>
                <div className="text-sm text-white/70">{new Date(b.match.startTime).toLocaleString('en-IN', { dateStyle:'medium', timeStyle:'short'})} • {b.match.category} • ₹{b.match.price}</div>
                <div className="text-xs text-white/50 mt-1">UPI: {b.upiIdUsed}</div>
              </div>
              <div className="text-right">
                <div className={`text-sm font-semibold ${b.paymentStatus==='VERIFIED'?'text-offside-green': b.paymentStatus==='REJECTED'?'text-red-400':'text-amber-300'}`}>{b.paymentStatus}</div>
                <div className="text-xs text-white/60">{b.bookingStatus}{b.refundRequested ? ` • Refund ${b.refundStatus||'REQUESTED'}`:''}</div>
                {b.bookingStatus==='ACTIVE' && (
                  <button onClick={()=>cancel(b.id)} className="mt-2 text-xs px-3 py-1.5 rounded-full border border-white/20 hover:bg-white/5">Cancel & Refund</button>
                )}
              </div>
            </div>
          ))}
        </div>}
      </div>
    </div>
  );
}
