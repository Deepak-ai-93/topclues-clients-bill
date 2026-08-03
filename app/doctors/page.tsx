import React from 'react';
import { Metadata } from 'next';
import { allDoctors, allSpecialties, allCities } from '@/lib/doctors-data';
import DoctorDirectory from './_components/DoctorDirectory';

export const metadata: Metadata = {
  title: 'Find Specialist Doctors | Topclues Doctor Directory',
  description: 'Search and connect with leading specialist doctors across Gujarat and Mumbai. View OPD timings, qualifications, clinic locations, and verified patient reviews.',
  openGraph: {
    title: 'Find Specialist Doctors | Topclues Doctor Directory',
    description: 'Search and connect with leading specialist doctors across Gujarat and Mumbai.',
    type: 'website',
  },
};

export default function DoctorsPage() {
  return (
    <DoctorDirectory
      doctors={allDoctors}
      specialties={allSpecialties}
      cities={allCities}
    />
  );
}
