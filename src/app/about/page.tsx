export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-14">
      <h1 className="text-4xl font-extrabold">What is Offside Society?</h1>
      <p className="mt-6 text-white/80 text-lg leading-relaxed">
        Not just organized games — a structured, high-quality football experience in Vadodara (and now Ahmedabad).
        No random setups, no confusion — proper football done right.
      </p>
      <p className="mt-4 text-white/70">
        <b>How games work:</b> Show up, get assigned to balanced teams, play competitive, well-managed matches.
      </p>

      <div className="grid md:grid-cols-2 gap-6 mt-10">
        <div className="rounded-2xl border border-white/10 bg-[#101828] p-6">
          <h3 className="text-xl font-bold">Standard Match</h3>
          <ul className="mt-3 text-white/75 text-sm space-y-2 list-disc ml-5">
            <li>Mineral water included</li>
            <li>MVP medal</li>
            <li>Best GK medal</li>
            <li>MVP feature on the page</li>
          </ul>
          <div className="mt-4 text-offside-green font-bold">₹299</div>
        </div>
        <div className="rounded-2xl border border-offside-green/30 bg-[#0e1f15] p-6">
          <h3 className="text-xl font-bold">Offside Society <span className="text-offside-green">Plus</span></h3>
          <ul className="mt-3 text-white/80 text-sm space-y-2 list-disc ml-5">
            <li>Everything in Standard</li>
            <li>Energy drinks</li>
            <li>Full match recording</li>
            <li>Match uploaded to YouTube</li>
            <li>Social media presence for all players</li>
          </ul>
          <div className="mt-4 text-offside-green font-bold">₹449</div>
        </div>
      </div>

      <div className="mt-12 rounded-2xl border border-white/10 bg-[#101828]/60 p-6">
        <h3 className="text-xl font-bold">Coordinators</h3>
        <div className="mt-4 grid sm:grid-cols-2 gap-4 text-white/80">
          <div><b>Vadodara</b> — Parth • 9313074629<br/><span className="text-sm text-white/60">Sportingo Turf</span></div>
          <div><b>Ahmedabad</b> — Rudra • 9313074629<br/><span className="text-sm text-white/60">Venue rotating</span></div>
        </div>
        <p className="text-sm text-white/60 mt-4">Schedule cadence: Match slots are scheduled roughly a week at a time, updated every Sunday.</p>
        <p className="text-sm text-white/60 mt-2">Instagram: <a className="text-offside-green" href="https://instagram.com/theoffsidesociety" target="_blank">@theoffsidesociety</a></p>
      </div>

      <div className="mt-10 border border-dashed border-amber-400/30 bg-amber-400/5 rounded-2xl p-5">
        <div className="text-amber-300 font-semibold">Academy — coming soon</div>
        <p className="text-sm text-white/70 mt-1">Structured training program. Leave your email in profile to get early access.</p>
      </div>

      <p className="mt-10 text-white/70">No politics, no chaos — just good football and the right people.</p>
    </div>
  );
}
