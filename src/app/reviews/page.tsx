'use client';
import { useEffect, useState } from 'react';
import { useAuth, apiFetch } from '@/store/auth';
import toast from 'react-hot-toast';

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const user = useAuth(s=>s.user);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const load = ()=> fetch('/api/reviews').then(r=>r.json()).then(d=>setReviews(d.reviews||[]));
  useEffect(()=>{ load(); }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const res = await apiFetch('/api/reviews', { method:'POST', body: JSON.stringify({ rating, comment })});
    if (res.ok) { toast.success('Thanks!'); setComment(''); load(); } else toast.error('Login to review');
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-extrabold">Player Reviews</h1>
      <div className="grid md:grid-cols-2 gap-4 mt-8">
        {reviews.map(r=>(
          <div key={r.id} className="rounded-2xl border border-white/10 bg-[#101828]/70 p-5">
            <div className="flex items-center justify-between">
              <div className="font-semibold">{r.user.name}<span className="text-white/50 text-sm"> • {r.user.city||''}</span></div>
              <div className="text-amber-300">{'★'.repeat(r.rating)}{'☆'.repeat(5-r.rating)}</div>
            </div>
            <p className="text-white/80 text-sm mt-2">{r.comment}</p>
          </div>
        ))}
        {reviews.length===0 && <div className="text-white/60">No reviews yet.</div>}
      </div>

      <div className="mt-10 rounded-2xl border border-white/10 bg-[#101828] p-6">
        <h3 className="font-bold mb-3">Leave a review</h3>
        {user ? (
          <form onSubmit={submit} className="space-y-3">
            <select value={rating} onChange={e=>setRating(Number(e.target.value))}
              className="px-3 py-2 rounded-xl bg-black/30 border border-white/15">
              {[5,4,3,2,1].map(n=> <option key={n} value={n}>{n} stars</option>)}
            </select>
            <textarea value={comment} onChange={e=>setComment(e.target.value)} required minLength={5}
              placeholder="How was your match?"
              className="w-full px-4 py-3 rounded-xl bg-black/30 border border-white/15 outline-none min-h-[100px]"/>
            <button className="px-5 py-2.5 rounded-xl bg-offside-green text-[#07200a] font-bold">Post review</button>
          </form>
        ) : <div className="text-white/60 text-sm">Sign in to post a review.</div>}
      </div>
    </div>
  );
}
