'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowRight, Menu, X, Check, Shield, Zap, FileText, 
  Users, BarChart3, Calendar, CheckSquare, MessageSquare, 
  HelpCircle, ArrowUpRight, Activity
} from 'lucide-react';
import { motion } from 'motion/react';
import { getFeaturedDoctors } from '@/lib/doctors-data';
import DoctorCard from '@/app/doctors/_components/DoctorCard';

export default function DoctorHubLandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-black font-sans antialiased selection:bg-black selection:text-white border-t-2 border-black">
      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-black/10">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <Image src="/Logo(1).png" alt="TopClues" width={140} height={48} className="h-12 w-auto object-contain" priority />
          </Link>

          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium tracking-tight">
            <a href="#features" className="hover:underline underline-offset-4 decoration-2 transition-all">Portal Modules</a>
            <a href="#workflow" className="hover:underline underline-offset-4 decoration-2 transition-all">Workflows</a>
            <Link href="/doctors" className="hover:underline underline-offset-4 decoration-2 transition-all font-bold">Find Doctors</Link>
            <a href="#packages" className="hover:underline underline-offset-4 decoration-2 transition-all">Growth Plans</a>
            <a href="#faq" className="hover:underline underline-offset-4 decoration-2 transition-all">FAQ</a>
          </nav>

          <div className="hidden md:flex items-center space-x-3">
            <Link 
              href="/login" 
              className="text-sm font-medium px-4 py-2 hover:underline underline-offset-4"
            >
              Doctor Sign In
            </Link>
            <Link 
              href="/admin/login" 
              className="text-xs font-mono uppercase px-3 py-1.5 border border-black hover:bg-black hover:text-white transition-colors"
            >
              Agency Login
            </Link>
            <Link 
              href="/client" 
              className="text-sm font-medium px-5 py-2.5 bg-black text-white hover:bg-neutral-800 transition-colors border border-black"
            >
              Client Dashboard
            </Link>
          </div>

          <button 
            className="md:hidden p-2 border border-black"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-black bg-white px-6 py-6 space-y-4">
            <a href="#features" className="block text-base font-medium" onClick={() => setMobileMenuOpen(false)}>Portal Modules</a>
            <a href="#workflow" className="block text-base font-medium" onClick={() => setMobileMenuOpen(false)}>Workflows</a>
            <Link href="/doctors" className="block text-base font-medium font-bold" onClick={() => setMobileMenuOpen(false)}>Find Doctors</Link>
            <a href="#packages" className="block text-base font-medium" onClick={() => setMobileMenuOpen(false)}>Growth Plans</a>
            <a href="#faq" className="block text-base font-medium" onClick={() => setMobileMenuOpen(false)}>FAQ</a>
            <div className="pt-4 border-t border-black/10 flex flex-col space-y-3">
              <Link href="/login" className="text-center py-2 text-sm font-medium border border-black">Doctor Sign In</Link>
              <Link href="/admin/login" className="text-center py-2 text-sm font-medium border border-black">Agency Login</Link>
              <Link href="/client" className="text-center py-2.5 text-sm font-medium bg-black text-white">Client Dashboard</Link>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="pt-36 pb-24 md:pt-48 md:pb-32 px-6 max-w-6xl mx-auto border-b border-black/10">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-2 mb-6">
              <span className="border border-black px-3 py-1 text-xs font-mono tracking-widest uppercase">
                Topclues Solutions
              </span>
              <span className="border border-black bg-black text-white px-3 py-1 text-xs font-mono tracking-widest uppercase">
                Doctor Hub 1.0
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-[0.95] mb-8">
              Your complete digital growth dashboard.
            </h1>
            
            <p className="text-lg md:text-xl text-neutral-600 max-w-2xl font-light leading-relaxed mb-10">
              Designed specifically for doctors and clinic teams. Track marketing performance, review leads, approve content calendars, and access performance reports in one centralized portal.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link 
                href="/login" 
                className="px-8 py-4 bg-black text-white font-medium text-base hover:bg-neutral-800 transition-all text-center flex items-center justify-center gap-2 group border border-black"
              >
                Access Doctor Portal
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="/admin/login" 
                className="px-8 py-4 bg-white text-black font-medium text-base hover:bg-neutral-100 transition-all text-center border border-black"
              >
                Agency Team Sign In
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Overview Stats Bar */}
      <section className="py-14 border-b border-black/10 bg-neutral-50/50">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <div className="text-3xl md:text-4xl font-bold tracking-tight mb-1">100%</div>
            <div className="text-xs font-mono uppercase tracking-widest text-neutral-500">Transparent Reports</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold tracking-tight mb-1">1-Click</div>
            <div className="text-xs font-mono uppercase tracking-widest text-neutral-500">Content Approvals</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold tracking-tight mb-1">Real-time</div>
            <div className="text-xs font-mono uppercase tracking-widest text-neutral-500">Patient Lead Tracking</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold tracking-tight mb-1">24/7</div>
            <div className="text-xs font-mono uppercase tracking-widest text-neutral-500">Account Team Access</div>
          </div>
        </div>
      </section>

      {/* Portal Modules / Features */}
      <section id="features" className="py-24 md:py-32 px-6 max-w-6xl mx-auto border-b border-black/10">
        <div className="mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-neutral-500 block mb-3">// Architecture</span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Built for clinic growth & transparency.</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Module 1 */}
          <div className="border border-black p-8 flex flex-col justify-between hover:border-black/50 transition-colors">
            <div>
              <div className="w-12 h-12 border border-black flex items-center justify-center mb-6">
                <Users className="w-6 h-6 stroke-[1.5]" />
              </div>
              <h3 className="text-xl font-bold mb-3 tracking-tight">Lead Management</h3>
              <p className="text-neutral-600 text-sm leading-relaxed">
                View patient inquiries, track follow-up statuses, record appointment outcomes, and export leads effortlessly.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-black/10 text-xs font-mono text-neutral-400">MODULE 01 / LEADS</div>
          </div>

          {/* Module 2 */}
          <div className="border border-black p-8 flex flex-col justify-between hover:border-black/50 transition-colors">
            <div>
              <div className="w-12 h-12 border border-black flex items-center justify-center mb-6">
                <CheckSquare className="w-6 h-6 stroke-[1.5]" />
              </div>
              <h3 className="text-xl font-bold mb-3 tracking-tight">Content Approvals</h3>
              <p className="text-neutral-600 text-sm leading-relaxed">
                Review graphics, videos, posts, and marketing creatives. Approve with a single click or request quick edits.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-black/10 text-xs font-mono text-neutral-400">MODULE 02 / APPROVALS</div>
          </div>

          {/* Module 3 */}
          <div className="border border-black p-8 flex flex-col justify-between hover:border-black/50 transition-colors">
            <div>
              <div className="w-12 h-12 border border-black flex items-center justify-center mb-6">
                <BarChart3 className="w-6 h-6 stroke-[1.5]" />
              </div>
              <h3 className="text-xl font-bold mb-3 tracking-tight">Reports & Performance</h3>
              <p className="text-neutral-600 text-sm leading-relaxed">
                Access monthly performance summaries, SEO progress reports, ad campaign metrics, and downloadable PDFs.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-black/10 text-xs font-mono text-neutral-400">MODULE 03 / ANALYTICS</div>
          </div>

          {/* Module 4 */}
          <div className="border border-black p-8 flex flex-col justify-between hover:border-black/50 transition-colors">
            <div>
              <div className="w-12 h-12 border border-black flex items-center justify-center mb-6">
                <Calendar className="w-6 h-6 stroke-[1.5]" />
              </div>
              <h3 className="text-xl font-bold mb-3 tracking-tight">Content Calendar</h3>
              <p className="text-neutral-600 text-sm leading-relaxed">
                Stay updated on planned social media schedules, upcoming reels, health awareness days, and campaign dates.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-black/10 text-xs font-mono text-neutral-400">MODULE 04 / CALENDAR</div>
          </div>

          {/* Module 5 */}
          <div className="border border-black p-8 flex flex-col justify-between hover:border-black/50 transition-colors">
            <div>
              <div className="w-12 h-12 border border-black flex items-center justify-center mb-6">
                <FileText className="w-6 h-6 stroke-[1.5]" />
              </div>
              <h3 className="text-xl font-bold mb-3 tracking-tight">Billing & Invoices</h3>
              <p className="text-neutral-600 text-sm leading-relaxed">
                Download tax invoices, review active service packages, track payment receipts, and monitor contract renewals.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-black/10 text-xs font-mono text-neutral-400">MODULE 05 / BILLING</div>
          </div>

          {/* Module 6 */}
          <div className="border border-black p-8 flex flex-col justify-between hover:border-black/50 transition-colors">
            <div>
              <div className="w-12 h-12 border border-black flex items-center justify-center mb-6">
                <HelpCircle className="w-6 h-6 stroke-[1.5]" />
              </div>
              <h3 className="text-xl font-bold mb-3 tracking-tight">Dedicated Support</h3>
              <p className="text-neutral-600 text-sm leading-relaxed">
                Direct ticketing system with your assigned Topclues account manager for rapid resolutions without clutter.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-black/10 text-xs font-mono text-neutral-400">MODULE 06 / SUPPORT</div>
          </div>
        </div>
      </section>

      {/* Core Workflow Section */}
      <section id="workflow" className="py-24 md:py-32 px-6 max-w-6xl mx-auto border-b border-black/10">
        <div className="mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-neutral-500 block mb-3">// Seamless Process</span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">How Topclues Doctor Hub works.</h2>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          <div className="border border-black p-6">
            <div className="text-xs font-mono uppercase tracking-widest mb-4">Step 01</div>
            <h4 className="text-lg font-bold mb-2">Secure Sign In</h4>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Log in with credentials or OTP to access your personalized clinic growth dashboard.
            </p>
          </div>

          <div className="border border-black p-6">
            <div className="text-xs font-mono uppercase tracking-widest mb-4">Step 02</div>
            <h4 className="text-lg font-bold mb-2">Review & Approve</h4>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Check creative assets, reels, and posts submitted by Topclues design team.
            </p>
          </div>

          <div className="border border-black p-6">
            <div className="text-xs font-mono uppercase tracking-widest mb-4">Step 03</div>
            <h4 className="text-lg font-bold mb-2">Track Patient Leads</h4>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Receive patient leads generated through ad campaigns and update appointment statuses.
            </p>
          </div>

          <div className="border border-black p-6">
            <div className="text-xs font-mono uppercase tracking-widest mb-4">Step 04</div>
            <h4 className="text-lg font-bold mb-2">Download Reports</h4>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Get monthly ROI breakdowns, download invoices, and request service enhancements.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Doctors Section */}
      <section id="doctors" className="py-24 md:py-32 px-6 max-w-6xl mx-auto border-b border-black/10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-neutral-500 block mb-3">// Verified Topclues Clients</span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Doctors we grow.</h2>
            <p className="text-neutral-600 text-sm md:text-base mt-3 max-w-xl">
              Leading doctors and clinics across Gujarat & Mumbai trust Topclues for digital marketing, patient leads, and brand growth.
            </p>
          </div>
          <Link
            href="/doctors"
            className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white text-xs font-mono uppercase font-bold hover:bg-neutral-800 transition-colors border border-black shrink-0 self-start md:self-auto"
          >
            <span>View All Doctors</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {getFeaturedDoctors().map(doctor => (
            <DoctorCard key={doctor.id} doctor={doctor} variant="featured" />
          ))}
        </div>
      </section>

      {/* Growth Plans / Packages */}
      <section id="packages" className="py-24 md:py-32 px-6 max-w-6xl mx-auto border-b border-black/10">
        <div className="mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-neutral-500 block mb-3">// Marketing Packages</span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Digital growth solutions.</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl">
          {/* Clinic Standard Plan */}
          <div className="border border-black p-8 md:p-10 flex flex-col justify-between">
            <div>
              <div className="text-xs font-mono uppercase tracking-widest text-neutral-500 mb-2">Essential Growth</div>
              <h3 className="text-2xl font-bold mb-4">Clinic Growth Package</h3>
              <p className="text-xs text-neutral-600 mb-6">Designed for growing clinics establishing local digital presence.</p>
              <ul className="space-y-3.5 mb-8 text-sm">
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-black shrink-0" />
                  <span>Social Media Management & Creative Posts</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-black shrink-0" />
                  <span>Google My Business Profile Optimization</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-black shrink-0" />
                  <span>Monthly Performance & Lead Summary</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-black shrink-0" />
                  <span>Portal Access & Content Approval Suite</span>
                </li>
              </ul>
            </div>
            <Link href="/login" className="w-full py-3 border border-black text-center font-medium hover:bg-black hover:text-white transition-colors">
              Access Portal
            </Link>
          </div>

          {/* Premium Hospital & Specialist Plan */}
          <div className="border-2 border-black p-8 md:p-10 flex flex-col justify-between bg-black text-white relative">
            <span className="absolute -top-3 right-6 bg-white text-black border border-black px-3 py-0.5 text-xs font-mono font-bold uppercase">
              Recommended
            </span>
            <div>
              <div className="text-xs font-mono uppercase tracking-widest text-neutral-400 mb-2">Comprehensive</div>
              <h3 className="text-2xl font-bold mb-4">Specialist & Hospital Package</h3>
              <p className="text-xs text-neutral-400 mb-6">Complete digital transformation, video production, and high-volume ad campaigns.</p>
              <ul className="space-y-3.5 mb-8 text-sm text-neutral-300">
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-white shrink-0" />
                  <span>High-converting Patient Lead Campaigns</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-white shrink-0" />
                  <span>Professional Video Shoot & Doctor Reels</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-white shrink-0" />
                  <span>Advanced SEO & Website Management</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-white shrink-0" />
                  <span>Dedicated Account Manager & Priority Support</span>
                </li>
              </ul>
            </div>
            <Link href="/login" className="w-full py-3 bg-white text-black text-center font-medium hover:bg-neutral-200 transition-colors">
              Access Portal
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-32 px-6 max-w-6xl mx-auto">
        <div className="border-2 border-black p-10 md:p-16 text-center max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
            Streamline your clinic growth today.
          </h2>
          <p className="text-neutral-600 max-w-xl mx-auto mb-8 text-base md:text-lg">
            Login to TopClues to manage your marketing assets, leads, and monthly performance.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/login" 
              className="inline-flex items-center gap-2 px-8 py-4 bg-black text-white font-medium text-base hover:bg-neutral-800 transition-colors"
            >
              Sign In to TopClues
              <ArrowUpRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-black py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs font-mono text-neutral-500">
          <div className="flex items-center space-x-4">
            <Image src="/Logo(1).png" alt="TopClues" width={100} height={32} className="h-8 w-auto object-contain" />
            <span>© {new Date().getFullYear()} TopClues. All rights reserved.</span>
          </div>
          <div className="flex items-center space-x-6">
            <Link href="/doctors" className="hover:text-black transition-colors font-bold">Find Doctors</Link>
            <Link href="/login" className="hover:text-black transition-colors">Doctor Login</Link>
            <Link href="/admin/login" className="hover:text-black transition-colors">Agency Login</Link>
            <Link href="/client" className="hover:text-black transition-colors">Dashboard</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
