'use client';
import { useEffect, useState } from 'react';
import { apiFetch } from '@/store/auth';
import Link from 'next/link';

export default function AdminOverview() {
  const [stats, setStats] = useState<any>({ pending:0, refunds:0, today:0 });

  useEffect(()=>{
    Promise.all([
      apiFetch('/api/admin/bookings?paymentStatus=PENDING').then(r=>r.json()),
      apiFetch('/api/admin/refunds').then(r=>r.json()),
      apiFetch('/api/admin/matches').then(r=>r.json()),
    ]).then(([b,r,m])=>{
      const todayStr = new Date().toDateString();
      const todayCount = (m.matches||[]).filter((x:any)=> new Date(x.date).toDateString()===todayStr).length;
      setStats({ pending: (b.bookings||[]).length, refunds: (r.refunds||[]).filter((x:any)=>x.refundStatus==='REQUESTED').length, today: todayCount });
    });
  }, []);

  return (
    <div className="grid md:grid-cols-3 gap-5">
      {[
        { label:'Pending Verifications', value: stats.pending, href:'/admin/bookings', color:'text-amber-300' },
        { label:'Refund Requests', value: stats.refunds, href:'/admin/refunds', color:'text-red-300' },
        { label:"Today's Matches", value: stats.today, href:'/admin/matches', color:'text-offside-green' },
      ].map(c=>(
        <Link key={c.label} href={c.href} className="rounded-2xl border border-white/10 bg-[#101828]/80 p-6 hover:border-white/20">
          <div className="text-white/60 text-sm">{c.label}</div>
          <div className={`text-3xl font-extrabold mt-2 ${c.color}`}>{c.value}</div>
        </Link>
      ))}
      <div className="md:col-span-3 rounded-2xl border border-white/10 bg-[#101828]/60 p-5 text-sm text-white/70">
        Weekly scheduler tip: create matches in bulk every Sunday. Use <Link href="/admin/matches" className="text-offside-green underline">Matches → New</Link>.
        Payment flow is manual UPI — verify screenshot + UPI ID, then mark VERIFIED. Razorpay interface stub lives in <code>/lib/payments/</code>.
      </div>
    </div>
  );
}
