'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, MapPin, MessageCircle, ArrowRight, Award } from 'lucide-react';
import { DoctorProfile } from '@/lib/doctor-demo-data';

interface DoctorCardProps {
  doctor: DoctorProfile;
  variant?: 'featured' | 'grid';
}

export default function DoctorCard({ doctor, variant = 'grid' }: DoctorCardProps) {
  const whatsappNum = doctor.contactWhatsApp || doctor.clinic.emergencyNumber;
  const whatsappUrl = `https://wa.me/${whatsappNum.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
    `Hello Dr. ${doctor.name}, I would like to inquire about a consultation.`
  )}`;

  if (variant === 'featured') {
    return (
      <div className="border border-primary bg-white flex flex-col justify-between hover:bg-neutral-50 transition-colors group relative">
        <div>
          {/* Featured Top Bar Image */}
          <div className="relative w-full h-52 border-b border-primary overflow-hidden bg-neutral-100">
            <Image
              src={doctor.photo || "/doctor-demo.jpg"}
              alt={doctor.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute top-3 left-3 flex items-center gap-2">
              <span className="bg-primary text-white text-[10px] font-mono uppercase px-2 py-0.5 tracking-wider">
                Topclues Client
              </span>
            </div>
            <div className="absolute top-3 right-3 bg-white border border-primary px-2 py-0.5 text-[10px] font-mono font-bold uppercase">
              {doctor.specialtyTag}
            </div>
          </div>

          {/* Card Info */}
          <div className="p-6">
            <div className="flex items-center justify-between gap-2 mb-2 text-xs font-mono text-neutral-500">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-black" />
                {doctor.city}
              </span>
              <span>{doctor.experienceYears} Yrs Exp</span>
            </div>

            <h3 className="text-xl font-bold tracking-tight mb-1 text-black group-hover:underline underline-offset-2">
              {doctor.name}
            </h3>

            <p className="text-xs text-neutral-600 font-medium mb-3 line-clamp-1">
              {doctor.designation}
            </p>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4 bg-neutral-50 p-2 border border-primary/10">
              <div className="flex items-center text-black font-bold text-xs gap-1">
                <Star className="w-3.5 h-3.5 fill-black text-black" />
                <span>{doctor.statistics.rating}</span>
              </div>
              <span className="text-[11px] font-mono text-neutral-500">
                ({doctor.statistics.reviewCount} reviews)
              </span>
            </div>
          </div>
        </div>

        {/* Card Actions */}
        <div className="p-6 pt-0 flex items-center gap-2">
          <Link
            href={`/doctors/${doctor.slug}`}
            className="flex-1 py-2.5 px-3 bg-primary text-white text-xs font-medium text-center flex items-center justify-center gap-1 hover:bg-primary-700 transition-colors border border-primary"
          >
            <span>View Profile</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="p-2.5 border border-primary text-black hover:bg-primary hover:text-white transition-colors"
            title="Chat on WhatsApp"
            aria-label="Chat on WhatsApp"
          >
            <MessageCircle className="w-4 h-4" />
          </a>
        </div>
      </div>
    );
  }

  // Grid variant (horizontal layout card)
  return (
    <div className="border border-primary bg-white p-5 flex flex-col justify-between hover:bg-neutral-50 transition-colors group">
      <div>
        {/* Top meta row */}
        <div className="flex items-center justify-between mb-4">
          <span className="bg-primary text-white text-[10px] font-mono uppercase px-2 py-0.5">
            Topclues Client
          </span>
          <span className="border border-primary px-2 py-0.5 text-[10px] font-mono uppercase">
            {doctor.specialtyTag}
          </span>
        </div>

        {/* Doctor Main Info Row */}
        <div className="flex items-start gap-4 mb-4">
          <div className="relative w-16 h-16 rounded-full overflow-hidden border border-primary shrink-0 bg-neutral-100">
            <Image
              src={doctor.photo || "/doctor-demo.jpg"}
              alt={doctor.name}
              fill
              className="object-cover"
            />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold tracking-tight text-black truncate group-hover:underline underline-offset-2">
              {doctor.name}
            </h3>
            <p className="text-xs text-neutral-600 line-clamp-1 mb-1 font-medium">
              {doctor.designation}
            </p>

            <div className="flex items-center gap-3 text-[11px] font-mono text-neutral-500">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-black" />
                {doctor.city}
              </span>
              <span>•</span>
              <span>{doctor.experienceYears} Yrs Exp</span>
            </div>
          </div>
        </div>

        {/* Rating & Clinic Info */}
        <div className="flex items-center justify-between text-xs p-2.5 bg-neutral-50 border border-primary/10 mb-4">
          <div className="flex items-center gap-1 font-bold">
            <Star className="w-3.5 h-3.5 fill-black text-black" />
            <span>{doctor.statistics.rating}</span>
            <span className="text-[11px] font-mono font-normal text-neutral-500">
              ({doctor.statistics.reviewCount})
            </span>
          </div>

          <div className="text-[11px] font-mono text-neutral-500 truncate max-w-[160px]">
            {doctor.clinic.name}
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-2 pt-2 border-t border-primary/10">
        <Link
          href={`/doctors/${doctor.slug}`}
          className="flex-1 py-2 px-3 bg-primary text-white text-xs font-medium text-center flex items-center justify-center gap-1 hover:bg-primary-700 transition-colors border border-primary"
        >
          <span>View Profile</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          className="p-2 border border-primary text-black hover:bg-primary hover:text-white transition-colors"
          title="Chat on WhatsApp"
          aria-label="Chat on WhatsApp"
        >
          <MessageCircle className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}
