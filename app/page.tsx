'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles, Target, Users, Globe, TrendingUp, Award, ChevronDown,
  Quote, Mail, Phone, MapPin, CheckCircle, Star, Play, ExternalLink,
  Menu, X, ArrowRight, ShieldCheck
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const sections = [
  { id: 'dna', label: 'Our DNA' },
  { id: 'services', label: 'Services' },
  { id: 'highlights', label: 'Highlights' },
  { id: 'doses', label: 'Pricing' },
  { id: 'testimonials', label: 'Testimonials' },
  { id: 'contact', label: 'Contact' },
];

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const heroRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.fromTo(taglineRef.current, { y: 80, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2 })
        .fromTo(subtitleRef.current, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, '-=0.6')
        .fromTo(ctaRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, '-=0.4')
        .fromTo('.hero-badge', { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, stagger: 0.15 }, '-=0.2');

      gsap.utils.toArray<HTMLElement>('.reveal-up').forEach(el => {
        gsap.fromTo(el, { y: 60, opacity: 0 }, {
          y: 0, opacity: 1, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' }
        });
      });

      gsap.utils.toArray<HTMLElement>('.scale-in').forEach(el => {
        gsap.fromTo(el, { scale: 0.8, opacity: 0 }, {
          scale: 1, opacity: 1, duration: 0.8, ease: 'back.out(1.7)',
          scrollTrigger: { trigger: el, start: 'top 80%', toggleActions: 'play none none none' }
        });
      });

      gsap.utils.toArray<HTMLElement>('.split-line').forEach(el => {
        const text = el.textContent || '';
        el.innerHTML = text.split(' ').map(w => `<span class="inline-block overflow-hidden"><span class="inline-block translate-y-full opacity-0 word-anim">${w}</span></span>`).join(' ');
        gsap.to(el.querySelectorAll('.word-anim'), {
          y: 0, opacity: 1, duration: 0.8, stagger: 0.04, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 80%', toggleActions: 'play none none none' }
        });
      });

      const statNumbers = document.querySelectorAll('.stat-number');
      statNumbers.forEach(el => {
        const finalVal = parseInt(el.textContent || '0');
        gsap.fromTo(el, { textContent: 0 }, {
          textContent: finalVal, duration: 2, ease: 'power1.out',
          snap: { textContent: 1 },
          scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' }
        });
      });

      const sections_ = gsap.utils.toArray<HTMLElement>('[data-section]');
      sections_.forEach(s => {
        ScrollTrigger.create({
          trigger: s,
          start: 'top 45%',
          end: 'bottom 45%',
          onToggle: self => { if (self.isActive) setActiveSection(s.dataset.section || ''); }
        });
      });
    }, mainRef);

    return () => ctx.revert();
  }, []);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const services = [
    { icon: Target, title: 'Doctor Brand Building', desc: 'Strategic personal branding for healthcare professionals to establish authority and trust.' },
    { icon: Users, title: 'Digital Patient Reach', desc: 'Targeted digital campaigns connecting doctors with the right patients through data-driven outreach.' },
    { icon: Globe, title: 'Online Medical Presence', desc: 'Website development, SEO, and Google Business optimization for healthcare practices.' },
    { icon: TrendingUp, title: 'Healthcare Digital Growth', desc: 'Comprehensive growth strategies combining content, ads, and analytics for measurable results.' },
  ];

  const highlights = [
    { stat: '100+', label: 'Clients Served', icon: Users },
    { stat: '30+', label: 'Creative Professionals', icon: Sparkles },
    { stat: '7', label: 'Industries Covered', icon: Globe },
    { stat: '10+', label: 'Years of Excellence', icon: Award },
  ];

  const achievements = [
    { year: '2022', title: 'GPBS Business Expo', desc: 'Showcased at Surat', icon: Award },
    { year: '2024', title: 'GPBS Business Expo', desc: 'Showcased at Rajkot', icon: Award },
    { year: '2022', title: 'Health Dept. Punjab', desc: 'Designed official logo for Health Department of Punjab', icon: Star },
    { year: '2026', title: 'Vibrant Gujarat Conference', desc: 'Managed social media for Regional Conference (Dept. of Fisheries)', icon: Globe },
    { year: '2025', title: 'Collector Recognition', desc: 'Honored by Shri Mihir Patel for social media work during Bhadarvi Poonam Mela', icon: Award },
  ];

  const doses = [
    { name: 'Starter Dose', price: '10,000', period: '/month', color: 'from-emerald-500 to-teal-600', features: ['10 Creative Posts', '1 Animated Reel with Voiceover', 'Regular Posting on All Social Media', 'Meta Ads for Reach'], note: 'PPC Budget excluded' },
    { name: 'Growth Dose', price: '10,000', period: '/month', color: 'from-blue-500 to-indigo-600', features: ['Lead Capturing Ad Campaign Setup', 'Ad Creation & Management', '5 Creative Ad Posts', 'Result Tracking & Optimization'], note: 'PPC Budget excluded', popular: true },
    { name: 'Digital Surgery', price: '30,000', period: ' One-Time', color: 'from-purple-500 to-violet-600', features: ['Fully Functional Responsive Website', 'Online Appointment Booking', 'Google Business Profile Setup', 'Google Analytics & Facebook Pixel Setup'], note: 'Domain & Hosting excluded' },
    { name: 'Premium Visibility Therapy', price: '15,000', period: '/month', color: 'from-rose-500 to-pink-600', features: ['4 Creative Posts/month', '1 Animated Reel with Voiceover', '2 Videos (Shooting, Editing & Posting)', 'Regular Posting on All Social Media'] },
  ];

  const testimonials = [
    { quote: 'Their approach to digital marketing transformed our practice. Patients now find us online effortlessly.', name: 'Dr. Anish Desai', specialty: 'Cardiologist' },
    { quote: 'The team understands healthcare marketing uniquely. Our online presence has grown tremendously.', name: 'Dr. Priya Sharma', specialty: 'Dermatologist' },
    { quote: 'Professional, creative, and results-driven. Highly recommend for any healthcare practice.', name: 'Dr. Rajesh Mehta', specialty: 'Orthopedic Surgeon' },
  ];

  return (
    <div ref={mainRef} className="bg-neutral-950 text-white font-sans overflow-x-hidden">

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-neutral-950/80 backdrop-blur-lg border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <button onClick={() => scrollTo('hero')} className="flex items-center gap-2 shrink-0">
            <Image src="/Logo(1).png" alt="Logo" width={36} height={36} className="rounded-lg" />
          </button>
          <div className="hidden md:flex items-center gap-1">
            {sections.map(s => (
              <button key={s.id} onClick={() => scrollTo(s.id)}
                className={`px-3 py-2 text-xs font-semibold rounded-lg transition-all ${activeSection === s.id ? 'text-white bg-white/10' : 'text-neutral-400 hover:text-white'}`}>
                {s.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="hidden md:inline-flex items-center gap-2 px-4 py-2 bg-white text-neutral-950 rounded-xl text-xs font-bold hover:bg-neutral-200 transition-all">
              Client Login <ArrowRight className="w-3 h-3" />
            </Link>
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 text-neutral-400 hover:text-white">
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
        <AnimatePresence>
          {menuOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="md:hidden border-t border-white/5 bg-neutral-950">
              <div className="px-6 py-4 space-y-1">
                {sections.map(s => (
                  <button key={s.id} onClick={() => scrollTo(s.id)}
                    className="block w-full text-left px-3 py-2.5 text-sm font-medium text-neutral-300 hover:text-white hover:bg-white/5 rounded-lg">
                    {s.label}
                  </button>
                ))}
                <Link href="/login" className="block w-full text-center px-3 py-2.5 mt-2 bg-white text-neutral-950 rounded-xl text-sm font-bold">
                  Client Login
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ===== HERO ===== */}
      <section id="hero" data-section="hero" ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950" />
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(255,255,255,0.05) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(255,255,255,0.03) 0%, transparent 50%)' }} />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-8 hero-badge">
            <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-mono text-neutral-400">#ForDoctorsOnly</span>
            <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-mono text-neutral-400">Est. 2015</span>
          </div>

          <div className="flex justify-center mb-8 hero-badge">
            <Image src="/Logo(1).png" alt="Topclues Solutions" width={120} height={120} className="rounded-2xl w-24 md:w-28 lg:w-32" />
          </div>

          <h1 ref={taglineRef} className="text-4xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.05] mb-6">
            Next Level of{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-300 to-neutral-500">
              Creativity
            </span>
            <br />
            is{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
              Simplicity
            </span>
            <span className="text-white">!</span>
          </h1>

          <p ref={subtitleRef} className="text-base md:text-xl text-neutral-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            These Medicines Are Trusted by{' '}
            <span className="text-white font-semibold">40+ Doctors & Hospitals</span>
          </p>

          <div ref={ctaRef} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={() => scrollTo('doses')}
              className="px-8 py-3.5 bg-white text-neutral-950 rounded-2xl text-sm font-bold hover:bg-neutral-200 transition-all shadow-2xl shadow-white/10">
              View Our Digital Doses
            </button>
            <button onClick={() => scrollTo('dna')}
              className="px-8 py-3.5 border border-white/20 text-white rounded-2xl text-sm font-semibold hover:bg-white/5 transition-all">
              Discover Our Story
            </button>
          </div>

          <div className="mt-16 flex items-center justify-center gap-2 text-neutral-500 text-xs font-mono">
            <span className="w-8 h-px bg-neutral-800" />
            SCROLL TO EXPLORE
            <span className="w-8 h-px bg-neutral-800" />
          </div>
        </div>
      </section>

      {/* ===== OUR DNA ===== */}
      <section id="dna" data-section="dna" className="py-24 md:py-32 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="text-[10px] font-mono tracking-[0.3em] text-neutral-500 uppercase">Our DNA</span>
            <h2 className="text-3xl md:text-5xl font-bold mt-4 mb-6 split-line">Marketing Medicine for Healthcare</h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 items-center reveal-up">
            <div className="space-y-6">
              <p className="text-base md:text-lg text-neutral-300 leading-relaxed">
                <span className="text-white font-semibold">Topclues Solutions</span>, registered on 15 April 2015, is a result-driven marketing agency with a strong presence across Gujarat and an expanding PAN-India footprint.
              </p>
              <p className="text-neutral-400 leading-relaxed">
                We specialize in healthcare digital marketing — building distinctive brand identities, shaping powerful narratives, and driving sustainable growth for doctors, hospitals, and healthcare organizations.
              </p>
              <div className="flex flex-wrap gap-3 pt-4">
                {['Inbound Marketing', 'Outbound Marketing', 'Data-Driven Insights', 'Advanced Tools'].map(t => (
                  <span key={t} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs font-semibold text-neutral-300">{t}</span>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {highlights.map(h => (
                <div key={h.label} className="p-6 bg-white/[0.03] border border-white/5 rounded-2xl scale-in text-center">
                  <h3 className="text-3xl md:text-4xl font-bold text-white stat-number">{h.stat}</h3>
                  <p className="text-xs text-neutral-400 mt-1">{h.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== SERVICES ===== */}
      <section id="services" data-section="services" className="py-24 md:py-32 px-6 relative bg-neutral-900/50">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="text-[10px] font-mono tracking-[0.3em] text-neutral-500 uppercase">What We Do</span>
            <h2 className="text-3xl md:text-5xl font-bold mt-4 split-line">Our Services</h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((s, i) => (
              <motion.div key={s.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="p-6 bg-white/[0.03] border border-white/5 rounded-2xl hover:bg-white/[0.06] transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-4 group-hover:bg-white/10 transition-all">
                  <s.icon className="w-5 h-5 text-neutral-300" />
                </div>
                <h3 className="text-sm font-bold text-white mb-2">{s.title}</h3>
                <p className="text-xs text-neutral-400 leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ACHIEVEMENTS TIMELINE ===== */}
      <section id="highlights" data-section="highlights" className="py-24 md:py-32 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="text-[10px] font-mono tracking-[0.3em] text-neutral-500 uppercase">Milestones</span>
            <h2 className="text-3xl md:text-5xl font-bold mt-4 mb-4 split-line">Achievements & Recognition</h2>
          </motion.div>

          <div className="relative">
            <div className="absolute left-6 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-px bg-white/10" />
            {achievements.map((a, i) => (
              <motion.div key={`${a.year}-${i}`}
                initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
                className={`relative flex items-start gap-6 mb-12 md:mb-16 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
              >
                <div className={`flex-1 ${i % 2 === 0 ? 'md:text-right' : 'md:text-left'} hidden md:block`}>
                  <span className="text-[10px] font-mono text-emerald-400">{a.year}</span>
                  <h3 className="text-sm font-bold text-white mt-1">{a.title}</h3>
                  <p className="text-xs text-neutral-400 mt-1">{a.desc}</p>
                </div>
                <div className="relative z-10 w-12 h-12 rounded-full bg-neutral-900 border-2 border-white/10 flex items-center justify-center shrink-0">
                  <a.icon className="w-5 h-5 text-neutral-300" />
                </div>
                <div className="flex-1 md:hidden">
                  <span className="text-[10px] font-mono text-emerald-400">{a.year}</span>
                  <h3 className="text-sm font-bold text-white mt-1">{a.title}</h3>
                  <p className="text-xs text-neutral-400 mt-1">{a.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="mt-16 p-8 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-2xl text-center"
          >
            <ShieldCheck className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white">DPIIT Recognized Startup</h3>
            <p className="text-sm text-neutral-400 mt-1">Officially recognized by the Department for Promotion of Industry and Internal Trade</p>
          </motion.div>
        </div>
      </section>

      {/* ===== MISSION ===== */}
      <section className="py-20 px-6 relative bg-neutral-900/30">
        <div className="max-w-4xl mx-auto text-center reveal-up">
          <span className="text-[10px] font-mono tracking-[0.3em] text-neutral-500 uppercase">Our Mission</span>
          <h2 className="text-2xl md:text-4xl font-bold mt-6 mb-6 leading-snug text-neutral-200">
            &ldquo;Build distinctive brand identities, shape powerful narratives, and drive sustainable growth.&rdquo;
          </h2>
          <div className="w-12 h-px bg-emerald-500/50 mx-auto" />
        </div>
      </section>

      {/* ===== Rx GUIDELINES ===== */}
      <section className="py-20 px-6 relative">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-12">
            <span className="text-[10px] font-mono tracking-[0.3em] text-neutral-500 uppercase">Rx Guidelines</span>
            <h2 className="text-2xl md:text-4xl font-bold mt-4 split-line">Prescription for Partnership</h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 gap-4 reveal-up">
            {[
              'All content complies with Drugs and Magic Remedies Act, 1954',
              'Third-party payments are excluded',
              'White-label content is excluded',
              'One-month prior notice required for termination',
              'Additional content creation chargeable with prior approval',
              'Advance payment and work order mandatory',
              'One free revision after design/video delivery',
              'Min. 4 videos per shoot, considered final',
              'Reshoots or changes may incur extra charges',
              'Package non-exclusive; same content won\'t be reused for same specialization',
            ].map((g, i) => (
              <div key={i} className="flex items-start gap-3 p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-xs text-neutral-300 leading-relaxed">{g}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== OFFERS ===== */}
      <section className="py-20 px-6 relative bg-neutral-900/50">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-12">
            <span className="text-[10px] font-mono tracking-[0.3em] text-neutral-500 uppercase">Special Offers</span>
            <h2 className="text-2xl md:text-4xl font-bold mt-4 split-line">Save More with Advance Commitment</h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 gap-6 reveal-up">
            <div className="p-8 bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20 rounded-2xl">
              <h3 className="text-lg font-bold text-white">Package A & B</h3>
              <p className="text-3xl font-bold text-emerald-400 mt-3">15% OFF</p>
              <p className="text-xs text-neutral-400 mt-2">with 6-month advance payment</p>
            </div>
            <div className="p-8 bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20 rounded-2xl">
              <h3 className="text-lg font-bold text-white">Package D</h3>
              <p className="text-sm font-semibold text-purple-400 mt-3">Get 1 extra professionally shot & edited video every month</p>
              <p className="text-xs text-neutral-400 mt-2">with 6-month advance payment</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== DIGITAL DOSES ===== */}
      <section id="doses" data-section="doses" className="py-24 md:py-32 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="text-[10px] font-mono tracking-[0.3em] text-neutral-500 uppercase">Our Digital Doses</span>
            <h2 className="text-3xl md:text-5xl font-bold mt-4 split-line">Choose Your Treatment Plan</h2>
            <p className="text-sm text-neutral-400 mt-4 max-w-xl mx-auto">Each plan is carefully formulated to address specific marketing needs for your practice.</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {doses.map((d, i) => (
              <motion.div key={d.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className={`relative p-6 rounded-2xl border ${d.popular ? 'border-white/30 bg-white/[0.05]' : 'border-white/10 bg-white/[0.02]'} hover:bg-white/[0.05] transition-all flex flex-col`}
              >
                {d.popular && (
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-white text-neutral-950 rounded-full text-[9px] font-bold uppercase tracking-wider">Popular</span>
                )}
                <h3 className="text-sm font-bold text-white">{d.name}</h3>
                <div className="mt-4 mb-6">
                  <span className="text-3xl font-bold text-white">₹{d.price}</span>
                  <span className="text-xs text-neutral-400 ml-1">{d.period}</span>
                </div>
                <ul className="space-y-3 flex-1">
                  {d.features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-xs text-neutral-300">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
                {d.note && <p className="text-[10px] text-neutral-500 mt-4 italic">{d.note}</p>}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section id="testimonials" data-section="testimonials" className="py-24 md:py-32 px-6 relative bg-neutral-900/50">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="text-[10px] font-mono tracking-[0.3em] text-neutral-500 uppercase">Testimonials</span>
            <h2 className="text-3xl md:text-5xl font-bold mt-4 split-line">What Doctors Say</h2>
            <p className="text-sm text-neutral-400 mt-4">Doctors Who Tried Our Marketing Medicine Are Sharing Their Experience.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div key={t.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
                className="p-6 bg-white/[0.03] border border-white/5 rounded-2xl"
              >
                <Quote className="w-6 h-6 text-neutral-600 mb-4" />
                <p className="text-sm text-neutral-300 leading-relaxed mb-6">&ldquo;{t.quote}&rdquo;</p>
                <div>
                  <p className="text-sm font-semibold text-white">{t.name}</p>
                  <p className="text-[10px] text-neutral-500 font-mono">{t.specialty}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CONTACT ===== */}
      <section id="contact" data-section="contact" className="py-24 md:py-32 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="text-[10px] font-mono tracking-[0.3em] text-neutral-500 uppercase">Get In Touch</span>
            <h2 className="text-3xl md:text-5xl font-bold mt-4 split-line">Let&rsquo;s Start Your Journey</h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 reveal-up">
            <div className="space-y-6">
              <a href="https://topclues.in" target="_blank" className="flex items-center gap-4 p-4 bg-white/[0.02] border border-white/5 rounded-xl hover:bg-white/[0.05] transition-all group">
                <Globe className="w-5 h-5 text-neutral-400 group-hover:text-emerald-400 transition-colors" />
                <div>
                  <p className="text-[10px] text-neutral-500 font-mono">Website</p>
                  <p className="text-sm font-semibold text-white">topclues.in</p>
                </div>
                <ExternalLink className="w-4 h-4 text-neutral-600 ml-auto" />
              </a>
              <a href="tel:+919510133057" className="flex items-center gap-4 p-4 bg-white/[0.02] border border-white/5 rounded-xl hover:bg-white/[0.05] transition-all group">
                <Phone className="w-5 h-5 text-neutral-400 group-hover:text-emerald-400 transition-colors" />
                <div>
                  <p className="text-[10px] text-neutral-500 font-mono">Phone</p>
                  <p className="text-sm font-semibold text-white">+91 95101 33057</p>
                </div>
              </a>
              <a href="mailto:marketing@topclues.in" className="flex items-center gap-4 p-4 bg-white/[0.02] border border-white/5 rounded-xl hover:bg-white/[0.05] transition-all group">
                <Mail className="w-5 h-5 text-neutral-400 group-hover:text-emerald-400 transition-colors" />
                <div>
                  <p className="text-[10px] text-neutral-500 font-mono">Email</p>
                  <p className="text-sm font-semibold text-white">marketing@topclues.in</p>
                </div>
              </a>
            </div>

            <div className="space-y-6">
              <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                <div className="flex items-start gap-4">
                  <MapPin className="w-5 h-5 text-neutral-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-white">Unit 1 — Junagadh</p>
                    <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                      Merged Office No. 365–369, 3rd Floor, Applewood City Mall, Madhuram, Moti Palace Township, Junagadh, Gujarat – 362015
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                <div className="flex items-start gap-4">
                  <MapPin className="w-5 h-5 text-neutral-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-white">Unit 2 — Gandhinagar</p>
                    <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                      Office No. 225 A-5, Infocity Supermall-1, Gandhinagar, Gujarat – 382421
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="py-12 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Image src="/Logo(1).png" alt="Logo" width={28} height={28} className="rounded-md" />
            <span className="text-xs text-neutral-500">© 2026 Topclues Solutions. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-neutral-600 font-mono">
            <ShieldCheck className="w-3 h-3" />
            Drugs and Magic Remedies Act, 1954 Compliant
          </div>
        </div>
      </footer>

    </div>
  );
}
