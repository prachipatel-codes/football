'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth, apiFetch } from '@/store/auth';
import toast from 'react-hot-toast';

export default function BookPage() {
  const { id } = useParams();
  const router = useRouter();
  const user = useAuth(s=>s.user);
  const [match, setMatch] = useState<any>(null);
  const [upi, setUpi] = useState('');
  const [file, setFile] = useState<File|null>(null);
  const [uploading, setUploading] = useState(false);
  const [screenshotUrl, setScreenshotUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(()=>{ if(!user) router.push('/login'); }, [user, router]);
  useEffect(()=>{
    fetch(`/api/matches/${id}`).then(r=>r.json()).then(d=>setMatch(d.match));
  }, [id]);

  async function handleUpload() {
    if (!file) return toast.error('Select screenshot');
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const token = useAuth.getState().accessToken;
      const res = await fetch('/api/upload', { method:'POST', body: fd, headers: token ? { Authorization: `Bearer ${token}` } : {} });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error||'Upload failed');
      setScreenshotUrl(data.url);
      toast.success('Screenshot uploaded');
    } catch(e:any){ toast.error(e.message); } finally { setUploading(false); }
  }

  async function submit() {
    if (!screenshotUrl) return toast.error('Upload screenshot first');
    if (upi.length < 5) return toast.error('Enter UPI ID');
    setSubmitting(true);
    try {
      const res = await apiFetch('/api/bookings', {
        method: 'POST',
        body: JSON.stringify({ matchId: id, upiIdUsed: upi, screenshotUrl })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Booking failed');
      toast.success('Booking submitted — pending verification');
      router.push('/profile');
    } catch(e:any){ toast.error(e.message); } finally { setSubmitting(false); }
  }

  if (!match) return <div className="max-w-2xl mx-auto px-4 py-16 text-white/70">Loading…</div>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold">Pay & Confirm Slot</h1>
      <div className="mt-6 rounded-2xl border border-white/10 bg-[#101828] p-6">
        <div className="text-white/80 text-sm">{match.venue?.city?.name} • {match.venue?.name}</div>
        <div className="font-semibold mt-1">{new Date(match.startTime).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</div>
        <div className="mt-2 text-offside-green font-bold text-xl">₹{match.price}</div>
      </div>

      <div className="mt-6 rounded-2xl border border-offside-green/30 bg-[#0e1f15]/60 p-6">
        <h3 className="font-semibold mb-3">Step 1 — Pay via UPI</h3>
        <div className="grid sm:grid-cols-2 gap-5 items-center">
          <div>
            <div className="text-sm text-white/70">UPI ID</div>
            <div className="font-mono text-offside-green text-lg">offside@upi</div>
            <div className="text-xs text-white/60 mt-2">Open any UPI app → Pay ₹{match.price} → take screenshot</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-black text-center text-sm">
            QR Code<br/>
            <div className="text-xs text-gray-600 mt-2">(Admin uploads real QR in /admin/config)</div>
            <div className="mt-2 w-32 h-32 mx-auto bg-[repeating-linear-gradient(45deg,#ddd,#ddd_4px,#fff_4px,#fff_8px)] rounded" />
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-white/10 bg-[#101828] p-6 space-y-4">
        <h3 className="font-semibold">Step 2 — Submit proof</h3>
        <div>
          <label className="text-sm text-white/70">UPI ID you paid from</label>
          <input value={upi} onChange={e=>setUpi(e.target.value)} placeholder="yourname@upi"
            className="w-full mt-1 px-4 py-3 rounded-xl bg-black/30 border border-white/15 focus:border-offside-green outline-none" />
        </div>
        <div>
          <label className="text-sm text-white/70">Payment screenshot (JPG/PNG, &lt;5MB)</label>
          <div className="flex gap-2 mt-1">
            <input type="file" accept="image/*" onChange={e=>setFile(e.target.files?.[0]||null)}
              className="flex-1 text-sm file:mr-3 file:px-3 file:py-2 file:rounded-lg file:border-0 file:bg-white/10 file:text-white" />
            <button disabled={uploading || !file} onClick={handleUpload}
              className="px-4 py-2 rounded-xl bg-white/10 border border-white/15 text-sm disabled:opacity-50">
              {uploading ? 'Uploading…' : 'Upload'}
            </button>
          </div>
          {screenshotUrl && <div className="text-xs text-offside-green mt-2">✓ Uploaded</div>}
        </div>
        <button disabled={submitting || !screenshotUrl} onClick={submit}
          className="w-full py-3 rounded-xl bg-offside-green text-[#07200a] font-bold disabled:opacity-50">
          {submitting ? 'Submitting…' : 'Submit Booking'}
        </button>
        <p className="text-xs text-white/50">Booking = PENDING until admin verifies screenshot. You’ll see status in Profile.</p>
      </div>
    </div>
  );
}
