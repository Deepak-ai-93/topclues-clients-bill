'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  Menu,
  X,
  Check,
  Shield,
  Zap,
  FileText,
  Users,
  BarChart3,
  Calendar,
  CheckSquare,
  MessageSquare,
  HelpCircle,
  ArrowUpRight,
  Activity
} from 'lucide-react';
import { motion, MotionConfig } from 'motion/react';
import { getFeaturedDoctors } from '@/lib/doctors-data';
import DoctorCard from '@/app/doctors/_components/DoctorCard';
import GrowthMonitor from '@/components/GrowthMonitor';

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] as const },
};

export default function DoctorHubLandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <MotionConfig reducedMotion="user">
    <div className="min-h-screen bg-white text-neutral-900 font-sans antialiased selection:bg-primary selection:text-white border-t-2 border-primary">
      {/* ============ Navigation ============ */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-primary/10">
        <div className="max-w-6xl mx-auto px-6 h-20 md:h-24 flex items-center justify-between">
          <Link href="/" className="flex items-center" aria-label="TopClues home">
            <Image
              src="/Logo(1).png"
              alt="TopClues"
              width={500}
              height={500}
              className="h-12 sm:h-14 w-auto md:w-[220px] md:h-auto object-contain"
              priority
            />
          </Link>

          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium tracking-tight" aria-label="Main">
            <a href="#features" className="hover:text-primary hover:underline underline-offset-4 decoration-2 transition-all">Portal Modules</a>
            <a href="#workflow" className="hover:text-primary hover:underline underline-offset-4 decoration-2 transition-all">Workflows</a>
            <Link href="/doctors" className="hover:text-primary hover:underline underline-offset-4 decoration-2 transition-all font-bold">Find Doctors</Link>
            <a href="#packages" className="hover:text-primary hover:underline underline-offset-4 decoration-2 transition-all">Growth Plans</a>
            <a href="#faq" className="hover:text-primary hover:underline underline-offset-4 decoration-2 transition-all">FAQ</a>
          </nav>

          <div className="hidden md:flex items-center space-x-3">
            <Link href="/login" className="text-sm font-medium px-4 py-2 hover:text-primary hover:underline underline-offset-4 transition-all">
              Doctor Sign In
            </Link>
            <Link
              href="/admin/login"
              className="text-xs font-mono uppercase px-3 py-1.5 border border-primary hover:bg-primary hover:text-white transition-colors rounded-md"
            >
              Agency Login
            </Link>
            <Link
              href="/client"
              className="text-sm font-medium px-5 py-2.5 bg-primary text-white hover:bg-primary-700 transition-colors border border-primary rounded-md shadow-primary"
            >
              Client Dashboard
            </Link>
          </div>

          <button
            className="md:hidden p-2 border border-primary rounded-md"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-b border-primary/20 bg-white px-6 py-6 space-y-4 shadow-card">
            <a href="#features" className="block text-base font-medium" onClick={() => setMobileMenuOpen(false)}>Portal Modules</a>
            <a href="#workflow" className="block text-base font-medium" onClick={() => setMobileMenuOpen(false)}>Workflows</a>
            <Link href="/doctors" className="block text-base font-medium font-bold" onClick={() => setMobileMenuOpen(false)}>Find Doctors</Link>
            <a href="#packages" className="block text-base font-medium" onClick={() => setMobileMenuOpen(false)}>Growth Plans</a>
            <a href="#faq" className="block text-base font-medium" onClick={() => setMobileMenuOpen(false)}>FAQ</a>
            <div className="pt-4 border-t border-primary/10 flex flex-col space-y-3">
              <Link href="/login" className="text-center py-2 text-sm font-medium border border-primary rounded-md">Doctor Sign In</Link>
              <Link href="/admin/login" className="text-center py-2 text-sm font-medium border border-primary rounded-md">Agency Login</Link>
              <Link href="/client" className="text-center py-2.5 text-sm font-medium bg-primary text-white rounded-md">Client Dashboard</Link>
            </div>
          </div>
        )}
      </header>

      {/* ============ Hero — the thesis ============ */}
      <section className="pt-36 pb-24 md:pt-48 md:pb-32 px-6 max-w-6xl mx-auto border-b border-primary/10">
        <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-12 lg:gap-16 items-center">
          {/* Copy */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}>
            <div className="flex items-center gap-2 mb-6 flex-wrap">
              <span className="inline-flex items-center gap-2 border border-primary px-3 py-1 text-xs font-mono tracking-widest uppercase rounded-md">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-500 animate-blink" />
                Topclues Solutions
              </span>
              <span className="border border-primary bg-primary text-white px-3 py-1 text-xs font-mono tracking-widest uppercase rounded-md">
                Doctor Hub 1.0
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-[0.98] mb-8">
              Your clinic&apos;s growth, on one monitor.
            </h1>

            <p className="text-lg md:text-xl text-neutral-600 max-w-xl font-light leading-relaxed mb-10">
              Track marketing performance, review patient leads, approve content calendars, and
              read performance reports — in a portal built for doctors and clinic teams.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link
                href="/login"
                className="px-8 py-4 bg-primary text-white font-medium text-base hover:bg-primary-700 transition-all text-center flex items-center justify-center gap-2 group border border-primary rounded-lg shadow-primary"
              >
                Access Doctor Portal
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/admin/login"
                className="px-8 py-4 bg-white text-neutral-900 font-medium text-base hover:bg-neutral-100 transition-all text-center border border-primary rounded-lg"
              >
                Agency Team Sign In
              </Link>
            </div>

            <div className="mt-10 flex items-center gap-6 text-xs font-mono uppercase tracking-widest text-neutral-500">
              <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-primary-600" /> Secure access</span>
              <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-accent-600" /> Real-time data</span>
              <span className="flex items-center gap-1.5"><Activity className="w-3.5 h-3.5 text-primary-600" /> 24/7 reporting</span>
            </div>
          </motion.div>

          {/* Signature: the growth monitor */}
          <motion.div
            initial={{ opacity: 0, y: 32, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-gradient-to-br from-primary-100/60 via-transparent to-accent-100/60 blur-2xl rounded-3xl" aria-hidden="true" />
            <div className="relative rotate-1 hover:rotate-0 transition-transform duration-500">
              <GrowthMonitor />
            </div>
            <div className="absolute -bottom-3 -left-3 hidden sm:block border border-primary bg-white px-3 py-1 text-[10px] font-mono uppercase tracking-widest rounded-md shadow-card">
              Live clinic data
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============ Overview Stats Bar ============ */}
      <section className="py-14 border-b border-primary/10 bg-neutral-50/50">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: '100%', label: 'Transparent Reports' },
            { value: '1-Click', label: 'Content Approvals' },
            { value: 'Real-time', label: 'Patient Lead Tracking' },
            { value: '24/7', label: 'Account Team Access' },
          ].map((stat) => (
            <motion.div key={stat.label} {...fadeUp}>
              <div className="text-3xl md:text-4xl font-bold tracking-tight mb-1 text-neutral-900">{stat.value}</div>
              <div className="text-xs font-mono uppercase tracking-widest text-neutral-500">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ============ Portal Modules ============ */}
      <section id="features" className="py-24 md:py-32 px-6 max-w-6xl mx-auto border-b border-primary/10">
        <motion.div className="mb-16" {...fadeUp}>
          <span className="text-xs font-mono uppercase tracking-widest text-primary-600 block mb-3">// Architecture</span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Built for clinic growth & transparency.</h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: Users, title: 'Lead Management', desc: 'View patient inquiries, track follow-up statuses, record appointment outcomes, and export leads effortlessly.', tag: 'MODULE 01 / LEADS' },
            { icon: CheckSquare, title: 'Content Approvals', desc: 'Review graphics, videos, posts, and marketing creatives. Approve with a single click or request quick edits.', tag: 'MODULE 02 / APPROVALS' },
            { icon: BarChart3, title: 'Reports & Performance', desc: 'Access monthly performance summaries, SEO progress reports, ad campaign metrics, and downloadable PDFs.', tag: 'MODULE 03 / ANALYTICS' },
            { icon: Calendar, title: 'Content Calendar', desc: 'Stay updated on planned social media schedules, upcoming reels, health awareness days, and campaign dates.', tag: 'MODULE 04 / CALENDAR' },
            { icon: FileText, title: 'Billing & Invoices', desc: 'Download tax invoices, review active service packages, track payment receipts, and monitor contract renewals.', tag: 'MODULE 05 / BILLING' },
            { icon: HelpCircle, title: 'Dedicated Support', desc: 'Direct ticketing system with your assigned Topclues account manager for rapid resolutions without clutter.', tag: 'MODULE 06 / SUPPORT' },
          ].map((module, i) => {
            const Icon = module.icon;
            return (
              <motion.div
                key={module.tag}
                {...fadeUp}
                transition={{ duration: 0.5, delay: (i % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="group border border-primary p-7 flex flex-col justify-between hover:border-primary-400 hover:shadow-raised hover:-translate-y-0.5 transition-all rounded-xl bg-white"
              >
                <div>
                  <div className="w-11 h-11 rounded-xl border border-primary bg-primary-50 flex items-center justify-center mb-6 transition-colors group-hover:bg-primary group-hover:border-primary">
                    <Icon className="w-5.5 h-5.5 stroke-[1.5] text-primary-600 transition-colors group-hover:text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 tracking-tight text-neutral-900">{module.title}</h3>
                  <p className="text-neutral-600 text-sm leading-relaxed">{module.desc}</p>
                </div>
                <div className="mt-8 pt-4 border-t border-primary/10 text-xs font-mono text-neutral-400 group-hover:text-primary-600 transition-colors">
                  {module.tag}
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ============ Core Workflow ============ */}
      <section id="workflow" className="py-24 md:py-32 px-6 max-w-6xl mx-auto border-b border-primary/10">
        <motion.div className="mb-16" {...fadeUp}>
          <span className="text-xs font-mono uppercase tracking-widest text-primary-600 block mb-3">// Seamless Process</span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">How Topclues Doctor Hub works.</h2>
        </motion.div>

        <div className="grid md:grid-cols-4 gap-5">
          {[
            { step: 'Step 01', title: 'Secure Sign In', desc: 'Log in with credentials or OTP to access your personalized clinic growth dashboard.' },
            { step: 'Step 02', title: 'Review & Approve', desc: 'Check creative assets, reels, and posts submitted by Topclues design team.' },
            { step: 'Step 03', title: 'Track Patient Leads', desc: 'Receive patient leads generated through ad campaigns and update appointment statuses.' },
            { step: 'Step 04', title: 'Download Reports', desc: 'Get monthly ROI breakdowns, download invoices, and request service enhancements.' },
          ].map((s, i) => (
            <motion.div
              key={s.step}
              {...fadeUp}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="relative border border-primary p-6 rounded-xl bg-white hover:shadow-raised hover:-translate-y-0.5 transition-all"
            >
              <div className="text-xs font-mono uppercase tracking-widest text-primary-600 mb-4">{s.step}</div>
              <h4 className="text-lg font-bold mb-2 text-neutral-900">{s.title}</h4>
              <p className="text-xs text-neutral-600 leading-relaxed">{s.desc}</p>
              {i < 3 && (
                <ArrowRight className="hidden md:block absolute -right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-400 z-10" aria-hidden="true" />
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* ============ Featured Doctors ============ */}
      <section id="doctors" className="py-24 md:py-32 px-6 max-w-6xl mx-auto border-b border-primary/10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <motion.div {...fadeUp}>
            <span className="text-xs font-mono uppercase tracking-widest text-primary-600 block mb-3">// Verified Topclues Clients</span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Doctors we grow.</h2>
            <p className="text-neutral-600 text-sm md:text-base mt-3 max-w-xl">
              Leading doctors and clinics across Gujarat &amp; Mumbai trust TopClues for digital marketing, patient leads, and brand growth.
            </p>
          </motion.div>
          <motion.div {...fadeUp}>
            <Link
              href="/doctors"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white text-xs font-mono uppercase font-bold hover:bg-primary-700 transition-colors border border-primary rounded-lg shadow-primary shrink-0 self-start md:self-auto"
            >
              <span>View All Doctors</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {getFeaturedDoctors().map((doctor, i) => (
            <motion.div
              key={doctor.id}
              {...fadeUp}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            >
              <DoctorCard doctor={doctor} variant="featured" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ============ Growth Plans ============ */}
      <section id="packages" className="py-24 md:py-32 px-6 max-w-6xl mx-auto border-b border-primary/10">
        <motion.div className="mb-16" {...fadeUp}>
          <span className="text-xs font-mono uppercase tracking-widest text-primary-600 block mb-3">// Marketing Packages</span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Digital growth solutions.</h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl">
          {/* Clinic Standard */}
          <motion.div {...fadeUp} className="border border-primary p-8 md:p-10 flex flex-col justify-between rounded-2xl bg-white hover:shadow-raised transition-shadow">
            <div>
              <div className="text-xs font-mono uppercase tracking-widest text-neutral-500 mb-2">Essential Growth</div>
              <h3 className="text-2xl font-bold mb-4 text-neutral-900">Clinic Growth Package</h3>
              <p className="text-xs text-neutral-600 mb-6">Designed for growing clinics establishing local digital presence.</p>
              <ul className="space-y-3.5 mb-8 text-sm">
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-accent-600 shrink-0" />
                  <span>Social Media Management &amp; Creative Posts</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-accent-600 shrink-0" />
                  <span>Google My Business Profile Optimization</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-accent-600 shrink-0" />
                  <span>Monthly Performance &amp; Lead Summary</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-accent-600 shrink-0" />
                  <span>Portal Access &amp; Content Approval Suite</span>
                </li>
              </ul>
            </div>
            <Link href="/login" className="w-full py-3 border border-primary text-center font-medium rounded-lg hover:bg-primary hover:text-white transition-colors">
              Access Portal
            </Link>
          </motion.div>

          {/* Specialist & Hospital */}
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="relative border-2 border-primary p-8 md:p-10 flex flex-col justify-between rounded-2xl bg-primary text-white shadow-primary overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary-600/0 via-transparent to-accent-500/20 pointer-events-none" aria-hidden="true" />
            <span className="absolute -top-3 right-6 bg-white text-primary-700 border border-primary px-3 py-0.5 text-xs font-mono font-bold uppercase rounded">
              Recommended
            </span>
            <div className="relative">
              <div className="text-xs font-mono uppercase tracking-widest text-primary-200 mb-2">Comprehensive</div>
              <h3 className="text-2xl font-bold mb-4">Specialist &amp; Hospital Package</h3>
              <p className="text-xs text-primary-100 mb-6">Complete digital transformation, video production, and high-volume ad campaigns.</p>
              <ul className="space-y-3.5 mb-8 text-sm text-primary-50">
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-accent-300 shrink-0" />
                  <span>High-converting Patient Lead Campaigns</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-accent-300 shrink-0" />
                  <span>Professional Video Shoot &amp; Doctor Reels</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-accent-300 shrink-0" />
                  <span>Advanced SEO &amp; Website Management</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-accent-300 shrink-0" />
                  <span>Dedicated Account Manager &amp; Priority Support</span>
                </li>
              </ul>
            </div>
            <Link href="/login" className="relative w-full py-3 bg-white text-primary-700 text-center font-medium rounded-lg hover:bg-neutral-100 transition-colors">
              Access Portal
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="py-24 md:py-32 px-6 max-w-6xl mx-auto">
        <motion.div {...fadeUp} className="border-2 border-primary p-10 md:p-16 text-center max-w-4xl mx-auto rounded-3xl bg-gradient-to-br from-primary-50/60 via-white to-accent-50/40">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 text-neutral-900">
            Streamline your clinic growth today.
          </h2>
          <p className="text-neutral-600 max-w-xl mx-auto mb-8 text-base md:text-lg">
            Login to TopClues to manage your marketing assets, leads, and monthly performance.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white font-medium text-base rounded-lg hover:bg-primary-700 transition-colors shadow-primary"
            >
              Sign In to TopClues
              <ArrowUpRight className="w-5 h-5" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ============ Footer ============ */}
      <footer className="border-t border-primary/20 py-12 px-6 bg-neutral-50/40">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs font-mono text-neutral-500">
          <div className="flex items-center space-x-4">
            <Image src="/Logo(1).png" alt="TopClues" width={140} height={140} className="h-12 md:h-14 w-auto object-contain" />
            <span>© {new Date().getFullYear()} TopClues. All rights reserved.</span>
          </div>
          <div className="flex items-center space-x-6">
            <Link href="/doctors" className="hover:text-primary transition-colors font-bold">Find Doctors</Link>
            <Link href="/login" className="hover:text-primary transition-colors">Doctor Login</Link>
            <Link href="/admin/login" className="hover:text-primary transition-colors">Agency Login</Link>
            <Link href="/client" className="hover:text-primary transition-colors">Dashboard</Link>
          </div>
        </div>
      </footer>
    </div>
    </MotionConfig>
  );
}
