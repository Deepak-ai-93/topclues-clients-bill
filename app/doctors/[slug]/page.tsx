import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { 
  Award, CheckCircle2, Clock, Globe, MapPin, 
  Phone, Star, ShieldCheck, Stethoscope, ThumbsUp, 
  Building2, BookOpen, GraduationCap, 
  HelpCircle, HeartPulse, UserCheck, HeartHandshake, MessageCircle, ArrowRight
} from 'lucide-react';
import { allDoctors, getDoctorBySlug } from '@/lib/doctors-data';
import DoctorCard from '../_components/DoctorCard';

interface DoctorProfilePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return allDoctors.map((doc) => ({
    slug: doc.slug,
  }));
}

export async function generateMetadata({ params }: DoctorProfilePageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const doctor = getDoctorBySlug(resolvedParams.slug);

  if (!doctor) {
    return {
      title: 'Doctor Not Found | Topclues',
    };
  }

  return {
    title: `${doctor.name} - ${doctor.designation} in ${doctor.city} | Topclues`,
    description: doctor.bio.about.slice(0, 160),
    openGraph: {
      title: `${doctor.name} - ${doctor.specialtyTag} Specialist in ${doctor.city}`,
      description: doctor.bio.about.slice(0, 160),
      images: [doctor.photo],
    },
  };
}

export default async function PublicDoctorProfilePage({ params }: DoctorProfilePageProps) {
  const resolvedParams = await params;
  const doctor = getDoctorBySlug(resolvedParams.slug);

  if (!doctor) {
    notFound();
  }

  // Related doctors (3 other doctors from list)
  const relatedDoctors = allDoctors
    .filter((d) => d.slug !== doctor.slug)
    .slice(0, 3);

  const whatsappNum = doctor.contactWhatsApp || doctor.clinic.emergencyNumber;
  const whatsappUrl = `https://wa.me/${whatsappNum.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
    `Hello Dr. ${doctor.name}, I would like to inquire about a consultation.`
  )}`;

  // Structured Data Schemas
  const jsonLdDoctorSchema = {
    "@context": "https://schema.org",
    "@type": "Physician",
    "name": doctor.name,
    "image": `https://topclues.com${doctor.photo}`,
    "medicalSpecialty": doctor.specialtyTag,
    "telephone": doctor.clinic.emergencyNumber,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": doctor.clinic.address,
      "addressLocality": doctor.city,
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": doctor.statistics.rating,
      "reviewCount": doctor.statistics.reviewCount,
    },
  };

  const jsonLdFaqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": doctor.faq.map((item) => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer,
      },
    })),
  };

  const jsonLdBreadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://topclues.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Doctors",
        "item": "https://topclues.com/doctors"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": doctor.name,
        "item": `https://topclues.com/doctors/${doctor.slug}`
      }
    ]
  };

  return (
    <div className="bg-white text-black font-sans antialiased pb-20">
      {/* Schema Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdDoctorSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumbSchema) }}
      />

      {/* Breadcrumb Navigation */}
      <div className="border-b border-primary/10 bg-neutral-50 px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center gap-2 text-xs font-mono text-neutral-500">
          <Link href="/" className="hover:text-primary">Home</Link>
          <span>/</span>
          <Link href="/doctors" className="hover:text-primary">Doctors</Link>
          <span>/</span>
          <span className="text-black font-bold truncate">{doctor.name}</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 pt-8 pb-12">

        {/* Hero Section */}
        <section className="border border-primary p-6 md:p-8 bg-white mb-10 relative">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* Photo Column */}
            <div className="md:col-span-4 flex flex-col items-center">
              <div className="relative w-48 h-48 md:w-56 md:h-56 border border-primary bg-neutral-100 overflow-hidden shrink-0">
                <Image
                  src={doctor.photo || "/doctor-demo.jpg"}
                  alt={doctor.name}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute top-3 left-3 bg-primary text-white text-[10px] font-mono px-2 py-0.5 uppercase tracking-wider">
                  Topclues Client
                </div>
              </div>

              <div className="mt-4 flex flex-wrap justify-center gap-2 text-xs font-mono">
                <span className="border border-primary px-2.5 py-1 flex items-center gap-1.5">
                  <Stethoscope className="w-3.5 h-3.5" />
                  {doctor.registrationNumber}
                </span>
                <span className="border border-primary bg-primary text-white px-2.5 py-1">
                  {doctor.specialtyTag}
                </span>
              </div>
            </div>

            {/* Doctor Info Details */}
            <div className="md:col-span-8 flex flex-col justify-between">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-black">
                    {doctor.name}
                  </h1>
                </div>

                <p className="text-base font-semibold text-neutral-800 mb-1">
                  {doctor.designation}
                </p>

                <p className="text-xs text-neutral-600 font-mono mb-4">
                  {doctor.qualification}
                </p>

                {/* Rating & Stats Bar */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 border border-primary bg-neutral-50 mb-6">
                  <div>
                    <div className="flex items-center gap-1 font-bold text-base">
                      <Star className="w-4 h-4 fill-black text-black" />
                      <span>{doctor.statistics.rating}</span>
                    </div>
                    <span className="text-[11px] font-mono text-neutral-500">
                      {doctor.statistics.reviewCount} Reviews
                    </span>
                  </div>

                  <div className="border-l border-primary/20 pl-3">
                    <span className="text-base font-bold">{doctor.experienceYears}+ Yrs</span>
                    <div className="text-[11px] font-mono text-neutral-500">Experience</div>
                  </div>

                  <div className="border-l border-primary/20 pl-3">
                    <span className="text-base font-bold">
                      {doctor.statistics.surgeriesCompleted > 0
                        ? `${doctor.statistics.surgeriesCompleted.toLocaleString()}+`
                        : `${doctor.statistics.patientsTreated.toLocaleString()}+`}
                    </span>
                    <div className="text-[11px] font-mono text-neutral-500">
                      {doctor.statistics.surgeriesCompleted > 0 ? 'Surgeries' : 'Patients'}
                    </div>
                  </div>

                  <div className="border-l border-primary/20 pl-3">
                    <span className="text-base font-bold">{doctor.statistics.recommendationRate}%</span>
                    <div className="text-[11px] font-mono text-neutral-500">Recommended</div>
                  </div>
                </div>

                {/* Quick Info */}
                <div className="space-y-2 text-xs font-mono text-neutral-700">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-black shrink-0" />
                    <span className="font-bold text-black">Clinic:</span>
                    <span>{doctor.clinic.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-black shrink-0" />
                    <span className="font-bold text-black">City:</span>
                    <span>{doctor.city} ({doctor.clinic.address})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-black shrink-0" />
                    <span className="font-bold text-black">Languages:</span>
                    <span>{doctor.languages.join(', ')}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex flex-wrap items-center gap-3 pt-4 border-t border-primary/10">
                <a
                  href={`tel:${doctor.clinic.emergencyNumber}`}
                  className="px-6 py-3 bg-primary text-white text-xs font-mono uppercase font-bold flex items-center gap-2 hover:bg-primary-700 transition-colors border border-primary"
                >
                  <Phone className="w-4 h-4" />
                  Call Clinic: {doctor.clinic.emergencyNumber}
                </a>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-6 py-3 bg-white text-black text-xs font-mono uppercase font-bold flex items-center gap-2 hover:bg-neutral-100 transition-colors border border-primary"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp Consult
                </a>
              </div>
            </div>

          </div>
        </section>

        {/* Content & Sidebar Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Main Left Content Column */}
          <div className="md:col-span-8 space-y-8">

            {/* About Doctor */}
            <section id="about" className="border border-primary p-6 bg-white">
              <h2 className="text-xl font-bold tracking-tight mb-4 flex items-center gap-2 border-b border-primary/10 pb-3">
                <UserCheck className="w-5 h-5 text-black" />
                About {doctor.name}
              </h2>

              <p className="text-neutral-700 text-sm leading-relaxed mb-6 font-light">
                {doctor.bio.about}
              </p>

              {/* Philosophy Callout */}
              {doctor.bio.philosophy && (
                <div className="p-4 border border-primary bg-neutral-50 mb-6">
                  <span className="text-xs font-mono uppercase font-bold text-neutral-500 block mb-1">
                    // Treatment Philosophy
                  </span>
                  <p className="text-xs italic text-black font-serif">
                    &ldquo;{doctor.bio.philosophy}&rdquo;
                  </p>
                </div>
              )}

              {/* Achievements */}
              <div>
                <h3 className="text-xs font-mono uppercase font-bold text-neutral-500 mb-3">
                  Key Achievements
                </h3>
                <ul className="space-y-2">
                  {doctor.bio.achievements.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-neutral-800">
                      <CheckCircle2 className="w-4 h-4 text-black shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Specializations & Conditions Treated */}
            <section id="expertise" className="border border-primary p-6 bg-white">
              <h2 className="text-xl font-bold tracking-tight mb-4 flex items-center gap-2 border-b border-primary/10 pb-3">
                <HeartPulse className="w-5 h-5 text-black" />
                Conditions Treated & Expertise
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {doctor.conditions.map((cond, idx) => (
                  <div
                    key={idx}
                    className="p-3 border border-primary/20 bg-neutral-50 flex items-center gap-2 text-xs font-medium"
                  >
                    <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                    <span>{cond}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Services & Procedures Offered */}
            <section id="services" className="border border-primary p-6 bg-white">
              <h2 className="text-xl font-bold tracking-tight mb-4 flex items-center gap-2 border-b border-primary/10 pb-3">
                <Stethoscope className="w-5 h-5 text-black" />
                Services & Procedures
              </h2>

              <div className="space-y-4">
                {doctor.services.map((srv) => (
                  <div key={srv.id} className="p-4 border border-primary/20 bg-neutral-50">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h3 className="font-bold text-sm text-black">{srv.title}</h3>
                      <span className="text-xs font-mono font-bold">₹{srv.fee}</span>
                    </div>
                    <p className="text-xs text-neutral-600 mb-3">{srv.description}</p>
                    <div className="flex flex-wrap gap-4 text-[11px] font-mono text-neutral-500 pt-2 border-t border-primary/10">
                      <span>Duration: {srv.time}</span>
                      <span>•</span>
                      <span>Recovery: {srv.recovery}</span>
                      <span>•</span>
                      <span>Suitable for: {srv.suitableFor}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Experience & Education */}
            <section id="experience" className="border border-primary p-6 bg-white">
              <h2 className="text-xl font-bold tracking-tight mb-6 flex items-center gap-2 border-b border-primary/10 pb-3">
                <GraduationCap className="w-5 h-5 text-black" />
                Experience & Education
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {/* Clinical Experience */}
                <div>
                  <h3 className="text-xs font-mono uppercase font-bold text-neutral-500 mb-4 flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5 text-black" /> Work Experience
                  </h3>
                  <div className="space-y-4 border-l border-primary pl-4">
                    {doctor.experience.map((exp, idx) => (
                      <div key={idx} className="relative">
                        <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 bg-primary" />
                        <span className="text-[10px] font-mono uppercase border border-primary px-1.5 py-0.5 bg-neutral-100">
                          {exp.period}
                        </span>
                        <h4 className="text-xs font-bold text-black mt-1">{exp.position}</h4>
                        <p className="text-xs font-semibold text-neutral-700">{exp.hospital}</p>
                        <p className="text-[11px] text-neutral-500 mt-0.5">{exp.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Education */}
                <div>
                  <h3 className="text-xs font-mono uppercase font-bold text-neutral-500 mb-4 flex items-center gap-2">
                    <BookOpen className="w-3.5 h-3.5 text-black" /> Education & Degrees
                  </h3>
                  <div className="space-y-4 border-l border-primary pl-4">
                    {doctor.education.map((edu, idx) => (
                      <div key={idx} className="relative">
                        <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 bg-primary" />
                        <span className="text-[10px] font-mono uppercase border border-primary px-1.5 py-0.5 bg-neutral-100">
                          {edu.year}
                        </span>
                        <h4 className="text-xs font-bold text-black mt-1">{edu.degree}</h4>
                        <p className="text-xs text-neutral-700">{edu.institution}, {edu.country}</p>
                        {edu.achievement && (
                          <p className="text-[11px] font-mono font-bold text-black mt-0.5">
                            ★ {edu.achievement}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Awards & Certifications */}
            <section className="border border-primary p-6 bg-white">
              <h2 className="text-xl font-bold tracking-tight mb-4 flex items-center gap-2 border-b border-primary/10 pb-3">
                <Award className="w-5 h-5 text-black" />
                Awards & Certifications
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                {doctor.awards.map((award, idx) => (
                  <div key={idx} className="p-3 border border-primary/20 bg-neutral-50">
                    <span className="text-[10px] font-mono font-bold text-neutral-400 block">{award.year}</span>
                    <h3 className="text-xs font-bold text-black">{award.name}</h3>
                    <p className="text-[11px] text-neutral-600">{award.organization}</p>
                  </div>
                ))}
              </div>

              {doctor.certifications.length > 0 && (
                <div className="pt-3 border-t border-primary/10">
                  <h3 className="text-xs font-mono uppercase font-bold text-neutral-500 mb-2">
                    Professional Certifications
                  </h3>
                  <ul className="space-y-1 text-xs font-mono">
                    {doctor.certifications.map((c, idx) => (
                      <li key={idx}>• {c.name} — {c.authority} ({c.year})</li>
                    ))}
                  </ul>
                </div>
              )}
            </section>

            {/* Patient Reviews */}
            <section id="reviews" className="border border-primary p-6 bg-white">
              <div className="flex items-center justify-between border-b border-primary/10 pb-3 mb-6">
                <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
                  <Star className="w-5 h-5 fill-black text-black" />
                  Patient Reviews ({doctor.statistics.reviewCount})
                </h2>
                <span className="text-xs font-mono border border-primary px-2 py-1 bg-primary text-white">
                  Rating: {doctor.statistics.rating} / 5.0
                </span>
              </div>

              <div className="space-y-4">
                {doctor.reviews.map((rev) => (
                  <div key={rev.id} className="p-4 border border-primary/20 bg-neutral-50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-xs text-black">{rev.patientName}</span>
                      <span className="text-[11px] font-mono text-neutral-400">{rev.date}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex text-black">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-black text-black" />
                        ))}
                      </div>
                      <span className="text-[11px] font-mono text-neutral-500">• Treatment: {rev.treatment}</span>
                    </div>
                    <p className="text-xs text-neutral-700 leading-relaxed mb-3">{rev.comment}</p>
                    <div className="text-[11px] font-mono text-neutral-500 flex items-center gap-1">
                      <ThumbsUp className="w-3 h-3 text-black" />
                      Helpful ({rev.helpfulCount})
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Clinic Info & OPD Timings */}
            <section id="clinic" className="border border-primary p-6 bg-white">
              <h2 className="text-xl font-bold tracking-tight mb-4 flex items-center gap-2 border-b border-primary/10 pb-3">
                <Building2 className="w-5 h-5 text-black" />
                Clinic Details & Location
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-bold text-base text-black mb-1">{doctor.clinic.name}</h3>
                  <p className="text-xs text-neutral-600 mb-4">{doctor.clinic.address}</p>

                  <h4 className="text-xs font-mono uppercase font-bold text-neutral-500 mb-2">Facilities</h4>
                  <ul className="space-y-1.5 mb-4 text-xs font-mono">
                    {doctor.clinic.facilities.map((fac, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-black" />
                        <span>{fac}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border border-primary p-4 bg-neutral-50 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-mono uppercase font-bold text-neutral-500 mb-2 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-black" /> OPD Timings
                    </h4>
                    <div className="space-y-1.5 text-xs font-mono">
                      {doctor.availability.map((av, idx) => (
                        <div key={idx} className="flex justify-between border-b border-primary/10 pb-1">
                          <span className="font-bold">{av.day}:</span>
                          <span>{av.isClosed ? 'Closed' : av.slots.join(', ')}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <a
                    href={doctor.clinic.mapUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 w-full py-2 bg-primary text-white text-center text-xs font-mono uppercase border border-primary hover:bg-primary-700"
                  >
                    View on Google Maps
                  </a>
                </div>
              </div>
            </section>

            {/* FAQ */}
            <section id="faq" className="border border-primary p-6 bg-white">
              <h2 className="text-xl font-bold tracking-tight mb-4 flex items-center gap-2 border-b border-primary/10 pb-3">
                <HelpCircle className="w-5 h-5 text-black" />
                Frequently Asked Questions
              </h2>

              <div className="space-y-4">
                {doctor.faq.map((item, idx) => (
                  <div key={idx} className="border border-primary/20 p-4 bg-neutral-50">
                    <h3 className="font-bold text-xs text-black mb-1">Q: {item.question}</h3>
                    <p className="text-xs text-neutral-600 leading-relaxed">A: {item.answer}</p>
                  </div>
                ))}
              </div>
            </section>

          </div>

          {/* Right Column Sticky Contact Panel */}
          <div className="md:col-span-4 sticky top-24 space-y-6">

            <div className="border-2 border-primary bg-white p-6 shadow-sm">
              <div className="border-b border-primary/10 pb-4 mb-4">
                <span className="text-[10px] font-mono uppercase font-bold text-neutral-500">
                  TOPCLUES VERIFIED CLIENT
                </span>
                <h3 className="text-xl font-bold tracking-tight mt-1 text-black">
                  Book Consultation
                </h3>
                <p className="text-xs text-neutral-600 mt-1">
                  Connect with Dr. {doctor.name.split(' ')[1] || doctor.name} clinic team directly for appointment slots.
                </p>
              </div>

              {/* Consultation Fees */}
              <div className="p-3 border border-primary bg-neutral-50 mb-4 text-xs font-mono space-y-1">
                <div className="flex justify-between">
                  <span>In-Clinic OPD Fee:</span>
                  <span className="font-bold text-black">₹{doctor.clinic.consultationFee}</span>
                </div>
                <div className="flex justify-between">
                  <span>Follow-Up Fee:</span>
                  <span className="font-bold text-black">₹{doctor.clinic.followUpFee}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 mb-6">
                <a
                  href={`tel:${doctor.clinic.emergencyNumber}`}
                  className="w-full py-3 bg-primary text-white text-xs font-mono uppercase font-bold text-center flex items-center justify-center gap-2 hover:bg-primary-700 transition-colors border border-primary"
                >
                  <Phone className="w-4 h-4" />
                  Call {doctor.clinic.emergencyNumber}
                </a>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 bg-white text-black text-xs font-mono uppercase font-bold text-center flex items-center justify-center gap-2 hover:bg-neutral-100 transition-colors border border-primary"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp Direct
                </a>
              </div>

              {/* Insurance */}
              {doctor.insurance.length > 0 && (
                <div className="border-t border-primary/10 pt-4">
                  <h4 className="text-[11px] font-mono uppercase font-bold text-neutral-500 mb-2">
                    Accepted Health Insurance
                  </h4>
                  <div className="flex flex-wrap gap-1.5 text-[11px] font-mono">
                    {doctor.insurance.map((ins, idx) => (
                      <span key={idx} className="border border-primary px-2 py-0.5 bg-neutral-100">
                        {ins.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>

        {/* Related Doctors Section */}
        <section className="mt-16 pt-12 border-t border-primary">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-xs font-mono uppercase text-neutral-500 block mb-1">
                // Network Specialists
              </span>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                Other Specialist Doctors
              </h2>
            </div>
            <Link
              href="/doctors"
              className="text-xs font-mono uppercase font-bold underline underline-offset-4 flex items-center gap-1 hover:text-neutral-600"
            >
              View All Doctors <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedDoctors.map((doc) => (
              <DoctorCard key={doc.id} doctor={doc} variant="featured" />
            ))}
          </div>
        </section>

      </div>

      {/* Mobile Sticky Bottom Call/WhatsApp Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-primary p-3 flex items-center gap-2">
        <a
          href={`tel:${doctor.clinic.emergencyNumber}`}
          className="flex-1 py-3 bg-primary text-white text-xs font-mono uppercase font-bold flex items-center justify-center gap-1.5 border border-primary"
        >
          <Phone className="w-3.5 h-3.5" /> Call Clinic
        </a>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          className="flex-1 py-3 bg-white text-black text-xs font-mono uppercase font-bold flex items-center justify-center gap-1.5 border border-primary"
        >
          <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
        </a>
      </div>
    </div>
  );
}
