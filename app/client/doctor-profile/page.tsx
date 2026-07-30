'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { 
  Award, CheckCircle2, Clock, Globe, MapPin, 
  Phone, Star, ShieldCheck, Stethoscope, ThumbsUp, 
  ChevronDown, ChevronUp, Share2, Building2, BookOpen, GraduationCap, 
  HelpCircle, MessageSquare, HeartPulse, UserCheck, HeartHandshake, MessageCircle
} from 'lucide-react';
import { demoDoctorProfile, DoctorProfile } from '@/lib/doctor-demo-data';

export default function DoctorProfilePage() {
  const doctor: DoctorProfile = demoDoctorProfile;
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [helpfulCount, setHelpfulCount] = useState<Record<string, number>>({});

  const toggleFaq = (idx: number) => {
    setOpenFaqIndex(openFaqIndex === idx ? null : idx);
  };

  const handleHelpful = (id: string) => {
    setHelpfulCount(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const whatsappNumber = "+919876543210";
  const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello Dr. ${doctor.name}, I would like to inquire about a consultation.`)}`;

  // Structured Data (JSON-LD Schemas for SEO/E-E-A-T)
  const jsonLdDoctorSchema = {
    "@context": "https://schema.org",
    "@type": "Physician",
    "name": doctor.name,
    "image": `https://topclues.com${doctor.photo}`,
    "medicalSpecialty": doctor.specialization,
    "telephone": doctor.clinic.emergencyNumber,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": doctor.clinic.address
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": doctor.statistics.rating,
      "reviewCount": doctor.statistics.reviewCount
    }
  };

  const jsonLdFaqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": doctor.faq.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans antialiased pb-20">
      {/* Schema Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdDoctorSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaqSchema) }}
      />

      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <Image
              src="/Logo(1).png"
              alt="TopClues"
              width={160}
              height={48}
              className="h-8 sm:h-9 md:h-10 w-auto max-w-[120px] sm:max-w-[140px] md:max-w-[160px] object-contain"
              priority
            />
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <a href="#about" className="hover:text-[#0F6CBD] transition-colors">About</a>
            <a href="#expertise" className="hover:text-[#0F6CBD] transition-colors">Expertise</a>
            <a href="#experience" className="hover:text-[#0F6CBD] transition-colors">Experience</a>
            <a href="#reviews" className="hover:text-[#0F6CBD] transition-colors">Reviews</a>
            <a href="#clinic" className="hover:text-[#0F6CBD] transition-colors">Clinic & Location</a>
            <a href="#faq" className="hover:text-[#0F6CBD] transition-colors">FAQ</a>
          </div>
          <div className="flex items-center gap-3">
            <a 
              href={`tel:${doctor.clinic.emergencyNumber}`} 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border border-slate-300 text-slate-700 hover:bg-slate-50 transition"
            >
              <Phone className="w-4 h-4 text-[#0F6CBD]" />
              <span className="hidden sm:inline">Call Clinic:</span>
              <span className="font-bold">{doctor.clinic.emergencyNumber}</span>
            </a>
            <a 
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-md flex items-center gap-2 transition"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">

        {/* Hero & Quick Specs Section */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/50 border border-slate-100 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-50 to-emerald-50 rounded-full blur-3xl opacity-60 pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
            
            {/* Doctor Photo Card */}
            <div className="lg:col-span-4 flex flex-col items-center">
              <div className="relative w-48 h-48 sm:w-60 sm:h-60 rounded-2xl overflow-hidden ring-4 ring-white shadow-2xl border border-slate-100 group">
                <Image
                  src={doctor.photo}
                  alt={doctor.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  priority
                />
                <div className="absolute top-3 right-3 bg-emerald-500 text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-lg">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Verified
                </div>
              </div>

              {/* Badges under photo */}
              <div className="mt-4 flex flex-wrap justify-center gap-2 text-xs font-semibold text-slate-600">
                <span className="bg-slate-100 px-3 py-1.5 rounded-full flex items-center gap-1.5">
                  <Stethoscope className="w-3.5 h-3.5 text-[#0F6CBD]" />
                  {doctor.registrationNumber}
                </span>
                <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-full flex items-center gap-1.5">
                  <ThumbsUp className="w-3.5 h-3.5" />
                  {doctor.statistics.recommendationRate}% Recommended
                </span>
              </div>
            </div>

            {/* Doctor Details */}
            <div className="lg:col-span-8 flex flex-col justify-between">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                    {doctor.name}
                  </h1>
                  <button className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition" title="Share Profile">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>

                <p className="text-base sm:text-lg text-[#0F6CBD] font-semibold mb-2">
                  {doctor.designation}
                </p>

                <p className="text-sm text-slate-600 font-medium mb-4">
                  {doctor.qualification}
                </p>

                {/* Rating & Fast Stats Banner */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100 mb-6">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1 text-amber-500 font-bold text-lg">
                      <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                      <span>{doctor.statistics.rating}</span>
                    </div>
                    <span className="text-xs text-slate-500 font-medium">{doctor.statistics.reviewCount} Reviews</span>
                  </div>

                  <div className="flex flex-col border-l border-slate-200 pl-3">
                    <span className="text-lg font-bold text-slate-900">{doctor.experienceYears}+ Years</span>
                    <span className="text-xs text-slate-500 font-medium">Clinical Exp.</span>
                  </div>

                  <div className="flex flex-col border-l border-slate-200 pl-3">
                    <span className="text-lg font-bold text-slate-900">{doctor.statistics.surgeriesCompleted.toLocaleString()}+</span>
                    <span className="text-xs text-slate-500 font-medium">Surgeries Done</span>
                  </div>

                  <div className="flex flex-col border-l border-slate-200 pl-3">
                    <span className="text-lg font-bold text-slate-900">{doctor.statistics.patientsTreated.toLocaleString()}+</span>
                    <span className="text-xs text-slate-500 font-medium">Happy Patients</span>
                  </div>
                </div>

                {/* Quick Info Items */}
                <div className="space-y-2.5 text-sm text-slate-700">
                  <div className="flex items-center gap-2.5">
                    <Building2 className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <span className="font-semibold text-slate-900">Hospital:</span>
                    <span>{doctor.clinic.name}</span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <span className="font-semibold text-slate-900">Location:</span>
                    <span>CG Road, Ahmedabad, India</span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <Globe className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <span className="font-semibold text-slate-900">Languages Spoken:</span>
                    <span className="flex flex-wrap gap-1.5">
                      {doctor.languages.map((lang, idx) => (
                        <span key={idx} className="bg-slate-100 text-slate-700 text-xs px-2 py-0.5 rounded font-medium">
                          {lang}
                        </span>
                      ))}
                    </span>
                  </div>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <a 
                  href={`tel:${doctor.clinic.emergencyNumber}`} 
                  className="flex-1 sm:flex-initial px-6 py-3.5 rounded-xl bg-[#0F6CBD] hover:bg-[#0c5999] text-white font-semibold text-sm shadow-lg shadow-[#0F6CBD]/25 flex items-center justify-center gap-2 transition"
                >
                  <Phone className="w-4.5 h-4.5" />
                  Call Direct: {doctor.clinic.emergencyNumber}
                </a>
                <a 
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 sm:flex-initial px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 font-semibold text-sm text-white shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition"
                >
                  <MessageCircle className="w-4.5 h-4.5" />
                  WhatsApp Us
                </a>
              </div>

            </div>

          </div>
        </section>

        {/* Content Layout with Sticky Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Left Column (Content) */}
          <div className="lg:col-span-8 space-y-10">

            {/* About Doctor */}
            <section id="about" className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-blue-50 text-[#0F6CBD] flex items-center justify-center">
                  <UserCheck className="w-5 h-5" />
                </span>
                About {doctor.name}
              </h2>

              <p className="text-slate-600 leading-relaxed text-base mb-6">
                {doctor.bio.about}
              </p>

              {/* Philosophy Callout */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50/70 to-emerald-50/70 border border-blue-100/60 mb-6">
                <h3 className="text-sm font-bold text-[#0F6CBD] uppercase tracking-wider mb-1 flex items-center gap-2">
                  <HeartHandshake className="w-4 h-4" /> Patient-First Philosophy
                </h3>
                <p className="text-slate-700 italic text-sm">
                  &ldquo;{doctor.bio.philosophy}&rdquo;
                </p>
              </div>

              {/* Key Achievements List */}
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">Key Highlights</h3>
                <ul className="space-y-2">
                  {doctor.bio.achievements.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Specializations & Conditions Treated */}
            <section id="expertise" className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-emerald-50 text-[#12B981] flex items-center justify-center">
                  <HeartPulse className="w-5 h-5" />
                </span>
                Areas of Expertise & Conditions Treated
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {doctor.conditions.map((cond, idx) => (
                  <div 
                    key={idx} 
                    className="p-4 rounded-2xl bg-slate-50 hover:bg-blue-50/40 border border-slate-100 hover:border-blue-200 transition duration-200 flex items-center gap-3"
                  >
                    <div className="w-2.5 h-2.5 rounded-full bg-[#0F6CBD]" />
                    <span className="font-semibold text-slate-800 text-sm">{cond}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Featured Treatments & Procedures */}
            <section id="treatments" className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-blue-50 text-[#0F6CBD] flex items-center justify-center">
                  <Stethoscope className="w-5 h-5" />
                </span>
                Treatments & Surgeries Offered
              </h2>

              <div className="space-y-4">
                {doctor.services.map((srv) => (
                  <div key={srv.id} className="p-5 rounded-2xl border border-slate-200 hover:shadow-md transition bg-slate-50/50">
                    <h3 className="text-lg font-bold text-slate-900 mb-2">{srv.title}</h3>
                    <p className="text-sm text-slate-600 mb-4">{srv.description}</p>

                    <div className="flex flex-wrap gap-4 text-xs font-semibold text-slate-500 pt-3 border-t border-slate-200/60">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#0F6CBD]" /> Duration: {srv.time}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <HeartPulse className="w-3.5 h-3.5 text-emerald-500" /> Recovery: {srv.recovery}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Experience & Education Timeline */}
            <section id="experience" className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <GraduationCap className="w-5 h-5" />
                </span>
                Experience & Education
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Clinical Work Experience */}
                <div>
                  <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-[#0F6CBD]" /> Clinical Work Experience
                  </h3>

                  <div className="space-y-6 relative pl-4 border-l-2 border-slate-200">
                    {doctor.experience.map((exp, idx) => (
                      <div key={idx} className="relative group">
                        <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-[#0F6CBD] ring-4 ring-white" />
                        <span className="text-xs font-bold text-[#0F6CBD] bg-blue-50 px-2 py-0.5 rounded">
                          {exp.period}
                        </span>
                        <h4 className="text-base font-bold text-slate-900 mt-1">{exp.position}</h4>
                        <p className="text-sm font-semibold text-slate-700">{exp.hospital}</p>
                        <p className="text-xs text-slate-500 mt-1">{exp.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Educational Qualifications */}
                <div>
                  <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-emerald-600" /> Qualifications & Degrees
                  </h3>

                  <div className="space-y-6 relative pl-4 border-l-2 border-slate-200">
                    {doctor.education.map((edu, idx) => (
                      <div key={idx} className="relative">
                        <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-white" />
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          {edu.year}
                        </span>
                        <h4 className="text-base font-bold text-slate-900 mt-1">{edu.degree}</h4>
                        <p className="text-sm font-semibold text-slate-700">{edu.institution}, {edu.country}</p>
                        {edu.achievement && (
                          <p className="text-xs text-amber-600 font-semibold mt-1">★ {edu.achievement}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </section>

            {/* Certifications & Memberships */}
            <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Award className="w-5 h-5" />
                </span>
                Certifications & Associations
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {doctor.certifications.map((cert, idx) => (
                  <div key={idx} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-start gap-3">
                    <Award className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{cert.name}</h3>
                      <p className="text-xs text-slate-600">{cert.authority} ({cert.year})</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-slate-100">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">Professional Memberships</h3>
                <div className="flex flex-wrap gap-2">
                  {doctor.bio.memberships.map((mem, idx) => (
                    <span key={idx} className="text-xs font-semibold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg">
                      {mem}
                    </span>
                  ))}
                </div>
              </div>
            </section>

            {/* Patient Reviews Section */}
            <section id="reviews" className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-amber-50 text-amber-500 flex items-center justify-center">
                      <Star className="w-5 h-5 fill-amber-400" />
                    </span>
                    Patient Feedback & Reviews
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">Verified patient experiences and ratings</p>
                </div>

                <div className="flex items-center gap-3 bg-amber-50/70 border border-amber-200 px-4 py-2 rounded-2xl">
                  <span className="text-3xl font-extrabold text-amber-600">{doctor.statistics.rating}</span>
                  <div className="text-xs text-amber-800">
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="font-semibold">Based on {doctor.statistics.reviewCount} reviews</span>
                  </div>
                </div>
              </div>

              {/* Reviews List */}
              <div className="space-y-4">
                {doctor.reviews.map((rev) => (
                  <div key={rev.id} className="p-5 rounded-2xl border border-slate-100 bg-slate-50/50">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{rev.patientName}</span>
                        {rev.verified && (
                          <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                            <ShieldCheck className="w-3 h-3" /> Verified Patient
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-slate-400">{rev.date}</span>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex text-amber-400">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <span className="text-xs font-semibold text-slate-500">Treatment: {rev.treatment}</span>
                    </div>

                    <p className="text-sm text-slate-700 mb-3">{rev.comment}</p>

                    <button 
                      onClick={() => handleHelpful(rev.id)}
                      className="text-xs font-semibold text-slate-500 hover:text-[#0F6CBD] flex items-center gap-1 transition"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      Helpful ({rev.helpfulCount + (helpfulCount[rev.id] || 0)})
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* Clinic & Location */}
            <section id="clinic" className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </span>
                Clinic Information & Facilities
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{doctor.clinic.name}</h3>
                  <p className="text-sm text-slate-600 mb-4">{doctor.clinic.address}</p>

                  <div className="space-y-2 text-xs font-semibold text-slate-700 mb-4">
                    <p className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      Wheelchair Accessible: {doctor.clinic.wheelchairAccess ? 'Yes' : 'No'}
                    </p>
                    <p className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      Parking Available: {doctor.clinic.parkingAvailable ? 'Yes' : 'No'}
                    </p>
                  </div>

                  <h4 className="text-xs font-bold uppercase text-slate-400 mb-2">Clinic Facilities</h4>
                  <ul className="space-y-1.5">
                    {doctor.clinic.facilities.map((fac, idx) => (
                      <li key={idx} className="text-xs text-slate-700 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#0F6CBD]" />
                        <span>{fac}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Map Mock representation */}
                <div className="bg-slate-100 rounded-2xl h-56 relative overflow-hidden border border-slate-200 flex flex-col items-center justify-center text-center p-4">
                  <MapPin className="w-10 h-10 text-[#0F6CBD] mb-2 animate-bounce" />
                  <p className="text-sm font-bold text-slate-800">TopClues Health Hub - Ahmedabad</p>
                  <p className="text-xs text-slate-500">CG Road, Near Swastik Cross Roads</p>
                  <a 
                    href="https://maps.google.com" 
                    target="_blank" 
                    rel="noreferrer"
                    className="mt-3 px-4 py-2 bg-white text-xs font-bold text-[#0F6CBD] rounded-xl shadow border border-slate-200 hover:bg-slate-50"
                  >
                    Open in Google Maps
                  </a>
                </div>
              </div>
            </section>

            {/* Frequently Asked Questions */}
            <section id="faq" className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center">
                  <HelpCircle className="w-5 h-5" />
                </span>
                Frequently Asked Questions (FAQ)
              </h2>

              <div className="space-y-3">
                {doctor.faq.map((item, idx) => (
                  <div key={idx} className="border border-slate-200 rounded-2xl overflow-hidden">
                    <button
                      onClick={() => toggleFaq(idx)}
                      className="w-full p-4 text-left font-semibold text-slate-800 text-sm flex items-center justify-between bg-slate-50/50 hover:bg-slate-100/50 transition"
                    >
                      <span>{item.question}</span>
                      {openFaqIndex === idx ? (
                        <ChevronUp className="w-4 h-4 text-slate-500" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-500" />
                      )}
                    </button>
                    {openFaqIndex === idx && (
                      <div className="p-4 bg-white text-sm text-slate-600 border-t border-slate-100 leading-relaxed">
                        {item.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

          </div>

          {/* Right Column: Contact & Helpline Card (Replaces instant booking & pricing) */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">

            <div className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/60 border border-slate-100">
              <div className="border-b border-slate-100 pb-4 mb-4">
                <span className="text-xs font-bold uppercase text-[#0F6CBD]">Contact Doctor & Clinic</span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">Get in Touch</h3>
                <p className="text-xs text-slate-500 mt-1">Call directly or send a message via WhatsApp to inquire about appointments and consultations.</p>
              </div>

              <div className="space-y-3 mb-6">
                <a 
                  href={`tel:${doctor.clinic.emergencyNumber}`} 
                  className="w-full py-3.5 rounded-xl bg-[#0F6CBD] hover:bg-[#0c5999] text-white font-bold text-sm shadow-md shadow-[#0F6CBD]/20 flex items-center justify-center gap-2.5 transition"
                >
                  <Phone className="w-4.5 h-4.5" />
                  Call: {doctor.clinic.emergencyNumber}
                </a>

                <a 
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2.5 transition"
                >
                  <MessageCircle className="w-4.5 h-4.5" />
                  Chat on WhatsApp
                </a>
              </div>

              {/* Consultation OPD Timings */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 mb-4">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#0F6CBD]" /> OPD Availability Timings
                </h4>
                <div className="space-y-1.5 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-800">Mon - Sat (Morning):</span>
                    <span>09:00 AM - 01:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-800">Mon - Sat (Evening):</span>
                    <span>05:00 PM - 08:00 PM</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-200/60 pt-1.5 mt-1.5">
                    <span className="font-semibold text-slate-800">Sunday:</span>
                    <span className="text-rose-500 font-semibold">Closed (Emergency Only)</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Insurance Acceptance Widget */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Accepted Insurance</h4>
              <div className="flex flex-wrap gap-2">
                {doctor.insurance.map((ins, idx) => (
                  <span key={idx} className="text-xs font-semibold text-slate-700 bg-slate-100 px-3 py-1 rounded-lg">
                    {ins.name}
                  </span>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Mobile Bottom Sticky Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 flex items-center gap-2 shadow-2xl">
        <a 
          href={`tel:${doctor.clinic.emergencyNumber}`} 
          className="flex-1 py-3 rounded-xl bg-[#0F6CBD] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md"
        >
          <Phone className="w-4 h-4" /> Call Clinic
        </a>
        <a 
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          className="flex-1 py-3 rounded-xl bg-emerald-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md"
        >
          <MessageCircle className="w-4 h-4" /> WhatsApp
        </a>
      </div>

    </div>
  );
}
