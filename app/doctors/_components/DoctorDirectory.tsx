'use client';

import React, { useState, useMemo } from 'react';
import { 
  Search, SlidersHorizontal, X, RotateCcw, 
  ChevronDown, Check 
} from 'lucide-react';
import { motion } from 'motion/react';
import { DoctorProfile } from '@/lib/doctor-demo-data';
import DoctorCard from './DoctorCard';

interface DoctorDirectoryProps {
  doctors: DoctorProfile[];
  specialties: string[];
  cities: string[];
}

export default function DoctorDirectory({
  doctors,
  specialties,
  cities,
}: DoctorDirectoryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'rating' | 'experience' | 'reviews'>('rating');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Toggle selection for checkboxes
  const toggleSpecialty = (spec: string) => {
    setSelectedSpecialties(prev =>
      prev.includes(spec) ? prev.filter(s => s !== spec) : [...prev, spec]
    );
  };

  const toggleCity = (city: string) => {
    setSelectedCities(prev =>
      prev.includes(city) ? prev.filter(c => c !== city) : [...prev, city]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedSpecialties([]);
    setSelectedCities([]);
    setSortBy('rating');
  };

  // Filter and sort doctors
  const filteredDoctors = useMemo(() => {
    return doctors
      .filter(doc => {
        // Search query match (name, specialtyTag, specialization, conditions)
        if (searchQuery.trim() !== '') {
          const q = searchQuery.toLowerCase();
          const nameMatch = doc.name.toLowerCase().includes(q);
          const tagMatch = doc.specialtyTag.toLowerCase().includes(q);
          const specMatch = doc.specialization.toLowerCase().includes(q);
          const condMatch = doc.conditions.some(c => c.toLowerCase().includes(q));
          if (!nameMatch && !tagMatch && !specMatch && !condMatch) {
            return false;
          }
        }

        // Specialty filter
        if (selectedSpecialties.length > 0) {
          if (!selectedSpecialties.includes(doc.specialtyTag)) {
            return false;
          }
        }

        // City filter
        if (selectedCities.length > 0) {
          if (!selectedCities.includes(doc.city)) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') {
          return b.statistics.rating - a.statistics.rating;
        } else if (sortBy === 'experience') {
          return b.experienceYears - a.experienceYears;
        } else if (sortBy === 'reviews') {
          return b.statistics.reviewCount - a.statistics.reviewCount;
        }
        return 0;
      });
  }, [doctors, searchQuery, selectedSpecialties, selectedCities, sortBy]);

  // JSON-LD ItemList Schema
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Topclues Doctor Directory",
    "numberOfItems": filteredDoctors.length,
    "itemListElement": filteredDoctors.map((doc, idx) => ({
      "@type": "ListItem",
      "position": idx + 1,
      "item": {
        "@type": "Physician",
        "name": doc.name,
        "medicalSpecialty": doc.specialtyTag,
        "address": {
          "@type": "PostalAddress",
          "addressLocality": doc.city
        },
        "url": `https://topclues.com/doctors/${doc.slug}`
      }
    }))
  };

  const hasActiveFilters = searchQuery !== '' || selectedSpecialties.length > 0 || selectedCities.length > 0;

  return (
    <div className="pb-24">
      {/* Schema Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />

      {/* Hero Section */}
      <section className="pt-12 pb-12 px-6 border-b border-primary/10 bg-neutral-50/50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="border border-primary px-2.5 py-0.5 text-xs font-mono tracking-widest uppercase">
                Public Directory
              </span>
              <span className="border border-primary bg-primary text-white px-2.5 py-0.5 text-xs font-mono tracking-widest uppercase">
                Topclues Clients
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4">
              Find specialist doctors.
            </h1>

            <p className="text-neutral-600 text-base md:text-lg max-w-2xl mb-8 font-light">
              Connect with leading doctors and clinics across Gujarat and Mumbai. Browse verified credentials, OPD timings, and consultation details.
            </p>

            {/* Live Search Bar */}
            <div className="relative max-w-2xl">
              <div className="flex items-center border-2 border-primary bg-white shadow-sm">
                <Search className="w-5 h-5 text-neutral-400 ml-4 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search doctor name, specialty (e.g. Oncology), or condition (e.g. Knee)..."
                  className="w-full px-4 py-3.5 text-sm outline-none text-black placeholder:text-neutral-400"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="p-2 text-neutral-400 hover:text-primary mr-2"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Directory Body */}
      <section className="max-w-6xl mx-auto px-6 pt-10">
        {/* Mobile Filter Toggle */}
        <div className="md:hidden flex items-center justify-between gap-4 mb-6">
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="flex items-center gap-2 px-4 py-2.5 border border-primary text-xs font-mono uppercase bg-white"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters {hasActiveFilters && '(Active)'}</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-neutral-500">Sort:</span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="text-xs font-mono border border-primary px-2 py-2 bg-white outline-none"
            >
              <option value="rating">Highest Rating</option>
              <option value="experience">Experience</option>
              <option value="reviews">Most Reviews</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Left Sidebar Filter Panel (Desktop & Mobile Drawer) */}
          <div
            className={`md:col-span-4 lg:col-span-3 ${
              mobileFilterOpen ? 'block' : 'hidden md:block'
            }`}
          >
            <div className="border border-primary bg-white p-6 sticky top-24 space-y-6">
              <div className="flex items-center justify-between border-b border-primary/10 pb-4">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-black" />
                  <h3 className="font-bold text-sm tracking-tight uppercase font-mono">
                    Filters
                  </h3>
                </div>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-xs font-mono underline text-neutral-500 hover:text-primary flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Reset
                  </button>
                )}
              </div>

              {/* Specialty Filter */}
              <div>
                <h4 className="text-xs font-mono uppercase font-bold text-neutral-500 mb-3">
                  Specialty
                </h4>
                <div className="space-y-2">
                  {specialties.map(spec => {
                    const isChecked = selectedSpecialties.includes(spec);
                    return (
                      <label
                        key={spec}
                        className="flex items-center gap-2.5 text-xs text-neutral-800 cursor-pointer hover:text-primary select-none"
                      >
                        <div
                          onClick={() => toggleSpecialty(spec)}
                          className={`w-4 h-4 border border-primary flex items-center justify-center shrink-0 ${
                            isChecked ? 'bg-primary text-white' : 'bg-white'
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3" />}
                        </div>
                        <span onClick={() => toggleSpecialty(spec)}>{spec}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* City Filter */}
              <div className="border-t border-primary/10 pt-5">
                <h4 className="text-xs font-mono uppercase font-bold text-neutral-500 mb-3">
                  City
                </h4>
                <div className="space-y-2">
                  {cities.map(city => {
                    const isChecked = selectedCities.includes(city);
                    return (
                      <label
                        key={city}
                        className="flex items-center gap-2.5 text-xs text-neutral-800 cursor-pointer hover:text-primary select-none"
                      >
                        <div
                          onClick={() => toggleCity(city)}
                          className={`w-4 h-4 border border-primary flex items-center justify-center shrink-0 ${
                            isChecked ? 'bg-primary text-white' : 'bg-white'
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3" />}
                        </div>
                        <span onClick={() => toggleCity(city)}>{city}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Sort By Desktop */}
              <div className="border-t border-primary/10 pt-5 hidden md:block">
                <h4 className="text-xs font-mono uppercase font-bold text-neutral-500 mb-3">
                  Sort Doctors
                </h4>
                <div className="space-y-2">
                  {[
                    { id: 'rating', label: 'Highest Rating' },
                    { id: 'experience', label: 'Years of Experience' },
                    { id: 'reviews', label: 'Most Patient Reviews' },
                  ].map(item => (
                    <button
                      key={item.id}
                      onClick={() => setSortBy(item.id as any)}
                      className={`w-full text-left px-3 py-2 text-xs font-mono border transition-colors ${
                        sortBy === item.id
                          ? 'border-primary bg-primary text-white font-bold'
                          : 'border-primary/20 text-neutral-600 hover:border-primary'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Doctor Cards Grid */}
          <div className="md:col-span-8 lg:col-span-9 space-y-6">
            {/* Header info bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-primary/10 pb-4">
              <span className="text-xs font-mono uppercase text-neutral-600">
                Showing <strong className="text-black font-bold">{filteredDoctors.length}</strong> of {doctors.length} Doctors
              </span>

              {hasActiveFilters && (
                <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                  <span className="text-neutral-400">Active Filters:</span>
                  {selectedSpecialties.map(s => (
                    <span key={s} className="border border-primary px-2 py-0.5 bg-neutral-100 flex items-center gap-1">
                      {s}
                      <X className="w-3 h-3 cursor-pointer" onClick={() => toggleSpecialty(s)} />
                    </span>
                  ))}
                  {selectedCities.map(c => (
                    <span key={c} className="border border-primary px-2 py-0.5 bg-neutral-100 flex items-center gap-1">
                      {c}
                      <X className="w-3 h-3 cursor-pointer" onClick={() => toggleCity(c)} />
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Doctor Cards */}
            {filteredDoctors.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredDoctors.map(doc => (
                  <DoctorCard key={doc.id} doctor={doc} variant="grid" />
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="border border-primary p-12 text-center bg-white">
                <h3 className="text-xl font-bold tracking-tight mb-2">No doctors found</h3>
                <p className="text-neutral-600 text-sm mb-6 max-w-md mx-auto">
                  We couldn&apos;t find any doctors matching your current filters. Try searching for a different specialty or clearing filters.
                </p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-2.5 bg-primary text-white text-xs font-mono uppercase border border-primary hover:bg-primary-700 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
