'use client';
import Link from 'next/link';
import { useAuth } from '@/store/auth';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

const links = [
  { href: '/admin', label: 'Overview' },
  { href: '/admin/matches', label: 'Matches' },
  { href: '/admin/bookings', label: 'Bookings' },
  { href: '/admin/refunds', label: 'Refunds' },
  { href: '/admin/users', label: 'Users' },
  { href: '/admin/venues', label: 'Venues' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = useAuth(s=>s.user);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(()=>{
    if (user && user.role !== 'ADMIN') router.push('/');
    if (!user) { /* allow flicker, page will redirect */ }
  }, [user, router]);

  if (!user) return <div className="max-w-6xl mx-auto px-4 py-16">Checking admin access… <Link href="/login" className="text-offside-green underline">Sign in</Link></div>;
  if (user.role !== 'ADMIN') return <div className="max-w-6xl mx-auto px-4 py-16">Forbidden</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold">Admin Panel</h1>
        <div className="text-sm text-white/60">Signed in as {user.name}</div>
      </div>
      <nav className="flex flex-wrap gap-2 mt-4 mb-6">
        {links.map(l=>(
          <Link key={l.href} href={l.href}
            className={`px-3 py-1.5 rounded-full text-sm border ${pathname===l.href ? 'border-offside-green text-offside-green bg-offside-green/10' : 'border-white/15 text-white/75 hover:bg-white/5'}`}>
            {l.label}
          </Link>
        ))}
      </nav>
      <div>{children}</div>
    </div>
  );
}
