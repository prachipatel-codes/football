import Link from 'next/link';
import MatchListHome from '@/components/MatchListHome';

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(900px_500px_at_50%_-10%,rgba(94,232,92,0.14),transparent)] pointer-events-none" />
        {/* subtle stadium grid */}
        <div className="absolute inset-0 opacity-[0.035]" style={{
          backgroundImage: `linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)`,
          backgroundSize: '48px 48px'
        }} />
        <div className="max-w-6xl mx-auto px-4 pt-20 pb-16 md:pt-28 md:pb-24 text-center relative">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.045] border border-white/[0.09] text-xs md:text-sm text-white/80 mb-6">
            <span>🔥</span>
            <span>Built by ballers, for ballers — Vadodara & Ahmedabad</span>
          </div>
          <h1 className="text-[42px] md:text-[72px] leading-[0.95] font-extrabold tracking-tight">
            Your Next<br />
            <span className="text-offside-green relative">Match
              <span className="absolute left-0 -bottom-2 w-full h-[4px] bg-offside-green/70 blur-[0.5px] rounded-full"></span>
            </span> Awaits.
          </h1>
          <p className="mt-6 text-white/70 max-w-2xl mx-auto text-base md:text-lg">
            Verified matches. Premium turfs. Instant UPI slot booking.<br className="hidden md:block" />
            No chaos — just good football and the right people.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/matches" className="px-6 py-3.5 rounded-full bg-offside-green text-[#081d08] font-bold shadow-glow hover:shadow-glow-strong transition">
              Find a Match →
            </Link>
            <Link href="/register" className="px-6 py-3.5 rounded-full border border-white/20 bg-white/[0.03] hover:bg-white/[0.06] font-semibold">
              Create Free Account
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-white/60">
            <div className="flex items-center gap-2">✅ Pay via UPI / QR</div>
            <div className="flex items-center gap-2">🛡️ Admin-verified payments</div>
            <div className="flex items-center gap-2">⚡ Slots fill fast</div>
          </div>
        </div>
      </section>

      {/* Live matches preview */}
      <section className="max-w-6xl mx-auto px-4 py-6">
        <MatchListHome />
      </section>

      {/* Categories */}
      <section className="max-w-6xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#10192b] to-[#0d1424] p-7">
          <div className="text-xs tracking-widest text-white/50 uppercase">Match Type</div>
          <h3 className="text-2xl font-bold mt-1">Standard Match</h3>
          <p className="text-white/70 mt-3 text-sm leading-relaxed">
            Mineral water included • MVP medal • Best GK medal • MVP feature on the page.
          </p>
          <div className="mt-4 text-offside-green font-bold">₹299 / slot</div>
        </div>
        <div className="rounded-2xl border border-offside-green/30 bg-gradient-to-br from-[#11271b] to-[#0d1c14] p-7 shadow-glow">
          <div className="text-xs tracking-widest text-offside-green uppercase">Match Type</div>
          <h3 className="text-2xl font-bold mt-1">Offside Society <span className="text-offside-green">Plus</span></h3>
          <p className="text-white/75 mt-3 text-sm leading-relaxed">
            Everything in Standard, plus energy drinks, full match recording, match uploaded to YouTube, social media presence for all players.
          </p>
          <div className="mt-4 text-offside-green font-bold">₹449 / slot</div>
        </div>
      </section>

      {/* coordinators */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <div className="rounded-2xl border border-white/10 bg-[#101828]/60 p-8">
          <h4 className="text-xl font-bold mb-4">Your Football Chiefs</h4>
          <div className="grid sm:grid-cols-2 gap-6 text-white/80">
            <div>
              <div className="text-white/50 text-sm">Vadodara</div>
              <div className="text-lg font-semibold">Parth — <a href="tel:+919313074629" className="text-offside-green hover:underline">9313074629</a></div>
              <div className="text-sm mt-1">Sportingo Turf • <a className="underline text-white/70" target="_blank" href="https://maps.app.goo.gl/PsPSaG8aWEnbuKgv8?g_st=ic">Maps</a></div>
            </div>
            <div>
              <div className="text-white/50 text-sm">Ahmedabad</div>
              <div className="text-lg font-semibold">Rudra — <a href="tel:+919313074629" className="text-offside-green hover:underline">9313074629</a></div>
              <div className="text-sm mt-1">Venue: updating weekly</div>
            </div>
          </div>
          <p className="text-xs text-white/50 mt-6">Match slots are scheduled roughly a week at a time, updated every Sunday.</p>
        </div>
      </section>
    </div>
  );
}
