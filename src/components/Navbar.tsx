'use client';
import Link from 'next/link';
import { useAuth } from '@/store/auth';
import { useState } from 'react';
import { Zap } from 'lucide-react';

export default function Navbar() {
  const { user, logout, cityFilter, setCityFilter } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#070b14]/80 border-b border-white/7">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg tracking-tight">
          <div className="w-8 h-8 rounded-md bg-offside-green flex items-center justify-center shadow-glow">
            <Zap className="w-5 h-5 text-[#07120a]" fill="currentColor" />
          </div>
          <span>OFF<span className="text-offside-green">SIDE</span></span>
        </Link>

        <nav className="hidden md:flex items-center gap-7 text-sm text-white/80">
          <Link href="/" className="hover:text-white">Home</Link>
          <Link href="/matches" className="hover:text-white">Matches</Link>
          <Link href="/about" className="hover:text-white">About</Link>
          <Link href="/reviews" className="hover:text-white">Reviews</Link>
          {user?.role === 'ADMIN' && (
            <Link href="/admin" className="text-offside-green font-medium">Admin Panel</Link>
          )}
        </nav>

        <div className="flex items-center gap-3">
          <div className="relative hidden sm:block">
            <button
              onClick={() => setOpen(!open)}
              className="text-sm px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:border-white/20"
            >
              <span className="text-offside-green">●</span> {cityFilter} ▾
            </button>
            {open && (
              <div className="absolute right-0 mt-2 w-40 rounded-xl bg-[#10182a] border border-white/10 shadow-2xl overflow-hidden">
                {['Vadodara','Ahmedabad'].map(c => (
                  <button key={c}
                    onClick={()=>{setCityFilter(c); setOpen(false)}}
                    className={`block w-full text-left px-4 py-2.5 text-sm hover:bg-white/5 ${cityFilter===c?'text-offside-green':''}`}>
                    {c}
                  </button>
                ))}
              </div>
            )}
          </div>

          {user ? (
            <div className="flex items-center gap-2">
              <Link href="/profile" className="text-sm hidden sm:inline text-white/80 hover:text-white">{user.name.split(' ')[0]}</Link>
              <button onClick={async()=>{
                await fetch('/api/auth/logout',{method:'POST', credentials:'include'});
                logout();
                window.location.href='/';
              }} className="text-xs px-3 py-1.5 rounded-full border border-white/15 hover:bg-white/5">Logout</button>
            </div>
          ) : (
            <Link href="/login" className="bg-offside-green text-[#0a2a0a] font-semibold px-4 py-2 rounded-full text-sm shadow-glow hover:shadow-glow-strong transition">
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
