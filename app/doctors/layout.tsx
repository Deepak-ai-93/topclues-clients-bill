import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function DoctorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white text-black font-sans antialiased selection:bg-primary selection:text-white border-t-2 border-primary flex flex-col justify-between">
      {/* Shared Public Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-primary/10">
        <div className="max-w-6xl mx-auto px-6 h-20 md:h-24 md:py-0 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <Image 
              src="/Logo(1).png" 
              alt="TopClues" 
              width={500} 
              height={500} 
              className="h-12 sm:h-14 w-auto md:w-[220px] md:h-auto object-contain" 
              priority 
            />
          </Link>

          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium tracking-tight">
            <Link 
              href="/doctors" 
              className="font-bold underline underline-offset-4 decoration-2"
            >
              Find Doctors
            </Link>
            <Link 
              href="/#features" 
              className="hover:underline underline-offset-4 decoration-2 transition-all text-neutral-600"
            >
              Portal Modules
            </Link>
            <Link 
              href="/#workflow" 
              className="hover:underline underline-offset-4 decoration-2 transition-all text-neutral-600"
            >
              Workflows
            </Link>
            <Link 
              href="/#packages" 
              className="hover:underline underline-offset-4 decoration-2 transition-all text-neutral-600"
            >
              Growth Plans
            </Link>
          </nav>

          <div className="flex items-center space-x-3">
            <Link 
              href="/login" 
              className="text-sm font-medium px-4 py-2 hover:underline underline-offset-4 hidden sm:inline-block"
            >
              Doctor Sign In
            </Link>
            <Link 
              href="/admin/login" 
              className="text-xs font-mono uppercase px-3 py-1.5 border border-primary hover:bg-primary hover:text-white transition-colors"
            >
              Agency Login
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Shared Footer */}
      <footer className="border-t border-primary py-12 px-6 bg-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs font-mono text-neutral-500">
          <div className="flex items-center space-x-4">
            <Image 
              src="/Logo(1).png" 
              alt="TopClues" 
              width={140} 
              height={140} 
              className="h-12 md:h-14 w-auto object-contain" 
            />
            <span>© {new Date().getFullYear()} TopClues. All rights reserved.</span>
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <Link href="/doctors" className="hover:text-primary transition-colors font-bold">Find Doctors</Link>
            <Link href="/login" className="hover:text-primary transition-colors">Doctor Login</Link>
            <Link href="/admin/login" className="hover:text-primary transition-colors">Agency Login</Link>
            <Link href="/client" className="hover:text-primary transition-colors">Dashboard</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
