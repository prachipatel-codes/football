import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Offside Community — Your Next Match Awaits",
  description: "Structured, high-quality football matches in Vadodara & Ahmedabad. Standard & PLUS. UPI verified.",
  metadataBase: new URL('https://www.theoffsidecommunity.com'),
  openGraph: {
    title: 'Offside Community',
    description: 'Built by ballers, for ballers — Vadodara & Ahmedabad',
    url: 'https://www.theoffsidecommunity.com',
    siteName: 'Offside Community',
    type: 'website',
  }
};

import Navbar from '@/components/Navbar';
import { Toaster } from 'react-hot-toast';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#070b14] text-[#e7eef8] min-h-screen`}
      >
        <div className="relative min-h-screen bg-green-radial">
          <Navbar />
          <main>{children}</main>
          <footer className="border-t border-white/8 mt-24 py-10 text-center text-sm text-offside-muted">
            <div className="max-w-6xl mx-auto px-4">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>© {new Date().getFullYear()} Offside Community • Vadodara • Ahmedabad</div>
                <div className="flex gap-6">
                  <a href="https://instagram.com/theoffsidesociety" target="_blank" className="hover:text-offside-green">@theoffsidesociety</a>
                  <a href="tel:+919313074629" className="hover:text-offside-green">9313074629</a>
                  <a href="/about" className="hover:text-offside-green">About</a>
                  <a href="/reviews" className="hover:text-offside-green">Reviews</a>
                </div>
              </div>
              <p className="mt-3 text-xs text-white/40">Academy offering coming soon.</p>
            </div>
          </footer>
        </div>
        <Toaster position="top-right" toastOptions={{
          style: { background: '#121a2b', color: '#e7eef8', border: '1px solid #1f2a44' },
          success: { iconTheme: { primary: '#5EE85C', secondary: '#0b1220' } }
        }} />
      </body>
    </html>
  );
}
