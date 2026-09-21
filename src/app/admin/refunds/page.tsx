'use client';
import { useEffect, useState } from 'react';
import { apiFetch } from '@/store/auth';
import toast from 'react-hot-toast';

export default function RefundsPage() {
  const [list, setList] = useState<any[]>([]);
  const load = ()=> apiFetch('/api/admin/refunds').then(r=>r.json()).then(d=>setList(d.refunds||[]));
  useEffect(()=>{ load(); }, []);
  async function mark(id:string, status:string){
    const res = await apiFetch('/api/admin/refunds', { method:'PATCH', body: JSON.stringify({ bookingId:id, status })});
    if(res.ok){ toast.success(status); load(); } else toast.error('fail');
  }
  return (
    <div className="space-y-3">
      {list.map(r=>(
        <div key={r.id} className="rounded-xl border border-white/10 bg-[#101828] p-4 flex justify-between items-center">
          <div>
            <div className="font-semibold">{r.user.name} • {r.user.phone}</div>
            <div className="text-sm text-white/70">Refund UPI: {r.refundUpiId || r.upiIdUsed} • ₹{r.match.price}</div>
            <div className="text-xs text-white/50">{r.match.venue.city?.name || ''} • {new Date(r.match.startTime).toLocaleString('en-IN')}</div>
          </div>
          <div className="text-right">
            <div className="text-sm mb-2">{r.refundStatus||'REQUESTED'}</div>
            {r.refundStatus!=='PROCESSED' && (
              <div className="flex gap-2">
                <button onClick={()=>mark(r.id,'PROCESSED')} className="px-3 py-1.5 text-sm rounded-lg bg-offside-green text-[#07200a] font-semibold">Mark Processed</button>
                <button onClick={()=>mark(r.id,'DENIED')} className="px-3 py-1.5 text-sm rounded-lg border border-white/20">Deny</button>
              </div>
            )}
          </div>
        </div>
      ))}
      {list.length===0 && <div className="text-white/60">No refund requests.</div>}
    </div>
  );
}
