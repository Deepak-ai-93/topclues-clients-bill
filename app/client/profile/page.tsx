'use client';

import React, { useState, useEffect } from 'react';
import { getServerSession } from '@/lib/actions';
import type { SessionData } from '@/lib/auth';
import {
  User,
  Stethoscope,
  Building,
  Share2,
  CheckCircle,
  AlertCircle,
  Save,
  Upload,
  Lock,
  Edit3
} from 'lucide-react';

export default function ProfilePage() {
  const [session, setSession] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<'personal' | 'professional' | 'clinic' | 'social'>('personal');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const [profileData, setProfileData] = useState({
    // Personal
    doctorName: 'Dr. Rajesh Sharma',
    mobile: '+91 98765 43210',
    email: '',
    dob: '1982-05-15',
    gender: 'Male',
    preferredLanguage: 'English',

    // Professional
    qualifications: 'MBBS, MD (General Medicine), DNB (Cardiology)',
    specialization: 'Interventional Cardiology',
    registrationNumber: 'MCI-2006-45892',
    yearsExperience: '18',
    languagesSpoken: 'English, Hindi, Gujarati',
    consultationFees: '₹1,000',
    bio: 'Senior Interventional Cardiologist with over 18 years of clinical experience in advanced cardiovascular interventions, angioplasty, and preventive cardiac care.',
    servicesOffered: 'Angioplasty, ECG, Echocardiography, TMT, Holter Monitoring, Hypertension Management, Cardiac Consultation',

    // Clinic
    clinicName: 'Apex Heart & Vascular Care Clinic',
    clinicAddress: 'Suite 402, Medical Enclave, CG Road, Ahmedabad, Gujarat 380009',
    googleMapsUrl: 'https://maps.google.com/?q=Apex+Heart+Clinic',
    primaryPhone: '+91 79 2654 3210',
    whatsappNumber: '+91 98765 43210',
    clinicEmail: 'contact@apexheartclinic.com',
    websiteUrl: 'https://www.apexheartclinic.com',
    workingHours: 'Mon - Sat: 10:00 AM - 07:00 PM',
    emergencyContact: '+91 98765 99999',

    // Social Media
    facebookUrl: 'https://facebook.com/drrajeshsharma',
    instagramUrl: 'https://instagram.com/drrajeshsharma_cardio',
    youtubeUrl: 'https://youtube.com/@drrajeshsharmacardio',
    linkedinUrl: 'https://linkedin.com/in/drrajeshsharma',
    googleBusinessUrl: 'https://g.co/kgs/apexheartclinic',
    xUrl: 'https://x.com/drrajeshcardio'
  });

  useEffect(() => {
    async function loadSession() {
      try {
        const s = await getServerSession();
        setSession(s);
        if (s?.email) {
          setProfileData(prev => ({ ...prev, email: s.email }));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadSession();
  }, []);

  const triggerToast = (msg: string, isError = false) => {
    if (isError) {
      setErrorMsg(msg);
      setTimeout(() => setErrorMsg(null), 5000);
    } else {
      setSuccessMsg(msg);
      setTimeout(() => setSuccessMsg(null), 5000);
    }
  };

  const handleInputChange = (field: keyof typeof profileData, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    triggerToast('Profile saved successfully');
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setLogoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // Calculate completeness percentage
  const totalFields = Object.keys(profileData).length;
  const filledFields = Object.values(profileData).filter(val => val && val.trim().length > 0).length;
  const completeness = Math.round((filledFields / totalFields) * 100);

  if (loading) {
    return (
      <div className="p-8 text-center flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl mx-auto font-sans">
      {successMsg && (
        <div className="fixed top-6 right-6 z-50 p-4 bg-primary text-white rounded-xl shadow-lg flex items-center gap-2.5 text-xs font-semibold border border-primary-800">
          <CheckCircle className="w-4 h-4 text-accent-400" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="fixed top-6 right-6 z-50 p-4 bg-rose-950 text-white border border-rose-900 rounded-xl shadow-lg flex items-center gap-2.5 text-xs font-semibold">
          <AlertCircle className="w-4 h-4 text-rose-400" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Header & Completeness */}
      <div className="border border-primary p-6 rounded-xl bg-white space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-mono font-bold tracking-widest text-neutral-400 uppercase">Doctor Portal</span>
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900 mt-0.5">My Profile & Clinic Details</h1>
            <p className="text-xs text-neutral-500 mt-1">Manage your professional credentials, clinic info, and online presence.</p>
          </div>
          <button
            onClick={handleSave}
            className="px-5 py-2.5 bg-primary text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 hover:bg-primary-700 transition-colors shadow-sm self-start sm:self-auto"
          >
            <Save className="w-4 h-4" /> Save Changes
          </button>
        </div>

        {/* Completeness Bar */}
        <div className="pt-4 border-t border-neutral-200 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="font-bold uppercase text-neutral-700">Profile Completeness</span>
            <span className="font-bold text-black">{completeness}%</span>
          </div>
          <div className="w-full h-2.5 bg-neutral-100 rounded-full overflow-hidden border border-neutral-300">
            <div
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${completeness}%` }}
            />
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-neutral-300 gap-2 overflow-x-auto pb-0.5">
        <button
          onClick={() => setActiveSection('personal')}
          className={`px-4 py-2.5 text-xs font-bold rounded-t-lg border-t border-x transition-colors whitespace-nowrap flex items-center gap-2 ${
            activeSection === 'personal'
              ? 'bg-white border-primary text-black -mb-[1px]'
              : 'border-transparent text-neutral-500 hover:text-primary'
          }`}
        >
          <User className="w-4 h-4" /> Personal Info
        </button>
        <button
          onClick={() => setActiveSection('professional')}
          className={`px-4 py-2.5 text-xs font-bold rounded-t-lg border-t border-x transition-colors whitespace-nowrap flex items-center gap-2 ${
            activeSection === 'professional'
              ? 'bg-white border-primary text-black -mb-[1px]'
              : 'border-transparent text-neutral-500 hover:text-primary'
          }`}
        >
          <Stethoscope className="w-4 h-4" /> Professional Info
        </button>
        <button
          onClick={() => setActiveSection('clinic')}
          className={`px-4 py-2.5 text-xs font-bold rounded-t-lg border-t border-x transition-colors whitespace-nowrap flex items-center gap-2 ${
            activeSection === 'clinic'
              ? 'bg-white border-primary text-black -mb-[1px]'
              : 'border-transparent text-neutral-500 hover:text-primary'
          }`}
        >
          <Building className="w-4 h-4" /> Clinic Info
        </button>
        <button
          onClick={() => setActiveSection('social')}
          className={`px-4 py-2.5 text-xs font-bold rounded-t-lg border-t border-x transition-colors whitespace-nowrap flex items-center gap-2 ${
            activeSection === 'social'
              ? 'bg-white border-primary text-black -mb-[1px]'
              : 'border-transparent text-neutral-500 hover:text-primary'
          }`}
        >
          <Share2 className="w-4 h-4" /> Social Media
        </button>
      </div>

      {/* Main Content Form */}
      <form onSubmit={handleSave} className="border border-primary p-6 rounded-b-xl rounded-tr-xl bg-white space-y-6">

        {/* Tab 1: Personal Info */}
        {activeSection === 'personal' && (
          <div className="space-y-6">
            <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-neutral-600 border-b border-neutral-200 pb-2">
              Personal Information
            </h2>

            {/* Profile Photo */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 border border-neutral-200 rounded-lg bg-neutral-50">
              <div className="w-20 h-20 rounded-full bg-neutral-200 border-2 border-primary flex items-center justify-center overflow-hidden shrink-0">
                {photoPreview ? (
                  <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-10 h-10 text-neutral-500" />
                )}
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-900 block">Profile Photo</label>
                <p className="text-[11px] text-neutral-500 font-mono">JPG, PNG or WEBP (Max 5MB)</p>
                <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white text-xs font-semibold rounded cursor-pointer hover:bg-primary-700 transition-colors">
                  <Upload className="w-3.5 h-3.5" /> Upload Photo
                  <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono font-bold text-neutral-700 uppercase mb-1">Doctor Name</label>
                <input
                  type="text"
                  value={profileData.doctorName}
                  onChange={e => handleInputChange('doctorName', e.target.value)}
                  className="w-full p-2.5 border border-primary rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-neutral-700 uppercase mb-1">Mobile Number</label>
                <input
                  type="text"
                  value={profileData.mobile}
                  onChange={e => handleInputChange('mobile', e.target.value)}
                  className="w-full p-2.5 border border-primary rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-neutral-700 uppercase mb-1">
                  Email Address <span className="text-[10px] text-neutral-400 font-normal">(Read Only)</span>
                </label>
                <div className="flex items-center justify-between p-2.5 bg-neutral-100 border border-neutral-300 rounded-lg text-xs font-mono text-neutral-600">
                  <span>{profileData.email || 'doctor@example.com'}</span>
                  <Lock className="w-3.5 h-3.5 text-neutral-400" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-neutral-700 uppercase mb-1">Date of Birth</label>
                <input
                  type="date"
                  value={profileData.dob}
                  onChange={e => handleInputChange('dob', e.target.value)}
                  className="w-full p-2.5 border border-primary rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-neutral-700 uppercase mb-1">Gender</label>
                <select
                  value={profileData.gender}
                  onChange={e => handleInputChange('gender', e.target.value)}
                  className="w-full p-2.5 border border-primary rounded-lg text-xs font-semibold bg-white focus:outline-none focus:ring-1 focus:ring-black"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-neutral-700 uppercase mb-1">Preferred Language</label>
                <input
                  type="text"
                  value={profileData.preferredLanguage}
                  onChange={e => handleInputChange('preferredLanguage', e.target.value)}
                  className="w-full p-2.5 border border-primary rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Professional Info */}
        {activeSection === 'professional' && (
          <div className="space-y-6">
            <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-neutral-600 border-b border-neutral-200 pb-2">
              Professional Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono font-bold text-neutral-700 uppercase mb-1">Qualifications</label>
                <input
                  type="text"
                  value={profileData.qualifications}
                  onChange={e => handleInputChange('qualifications', e.target.value)}
                  className="w-full p-2.5 border border-primary rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-neutral-700 uppercase mb-1">Specialization</label>
                <input
                  type="text"
                  value={profileData.specialization}
                  onChange={e => handleInputChange('specialization', e.target.value)}
                  className="w-full p-2.5 border border-primary rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-neutral-700 uppercase mb-1">Medical Registration Number</label>
                <input
                  type="text"
                  value={profileData.registrationNumber}
                  onChange={e => handleInputChange('registrationNumber', e.target.value)}
                  className="w-full p-2.5 border border-primary rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-neutral-700 uppercase mb-1">Years of Experience</label>
                <input
                  type="number"
                  value={profileData.yearsExperience}
                  onChange={e => handleInputChange('yearsExperience', e.target.value)}
                  className="w-full p-2.5 border border-primary rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-neutral-700 uppercase mb-1">Languages Spoken</label>
                <input
                  type="text"
                  value={profileData.languagesSpoken}
                  onChange={e => handleInputChange('languagesSpoken', e.target.value)}
                  placeholder="e.g. English, Hindi, Gujarati"
                  className="w-full p-2.5 border border-primary rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-neutral-700 uppercase mb-1">Consultation Fees</label>
                <input
                  type="text"
                  value={profileData.consultationFees}
                  onChange={e => handleInputChange('consultationFees', e.target.value)}
                  className="w-full p-2.5 border border-primary rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono font-bold text-neutral-700 uppercase mb-1">Professional Biography</label>
              <textarea
                rows={4}
                value={profileData.bio}
                onChange={e => handleInputChange('bio', e.target.value)}
                className="w-full p-2.5 border border-primary rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-bold text-neutral-700 uppercase mb-1">Services Offered</label>
              <textarea
                rows={3}
                value={profileData.servicesOffered}
                onChange={e => handleInputChange('servicesOffered', e.target.value)}
                className="w-full p-2.5 border border-primary rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>
          </div>
        )}

        {/* Tab 3: Clinic Info */}
        {activeSection === 'clinic' && (
          <div className="space-y-6">
            <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-neutral-600 border-b border-neutral-200 pb-2">
              Clinic & Hospital Information
            </h2>

            {/* Clinic Logo */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 border border-neutral-200 rounded-lg bg-neutral-50">
              <div className="w-20 h-20 rounded-lg bg-white border-2 border-primary flex items-center justify-center overflow-hidden shrink-0">
                {logoPreview ? (
                  <img src={logoPreview} alt="Logo" className="w-full h-full object-contain p-1" />
                ) : (
                  <Building className="w-8 h-8 text-neutral-500" />
                )}
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-900 block">Clinic Logo</label>
                <p className="text-[11px] text-neutral-500 font-mono">PNG or SVG with transparent background preferred</p>
                <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white text-xs font-semibold rounded cursor-pointer hover:bg-primary-700 transition-colors">
                  <Upload className="w-3.5 h-3.5" /> Upload Logo
                  <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-mono font-bold text-neutral-700 uppercase mb-1">Clinic / Hospital Name</label>
                <input
                  type="text"
                  value={profileData.clinicName}
                  onChange={e => handleInputChange('clinicName', e.target.value)}
                  className="w-full p-2.5 border border-primary rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-mono font-bold text-neutral-700 uppercase mb-1">Full Clinic Address</label>
                <textarea
                  rows={2}
                  value={profileData.clinicAddress}
                  onChange={e => handleInputChange('clinicAddress', e.target.value)}
                  className="w-full p-2.5 border border-primary rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-neutral-700 uppercase mb-1">Google Maps URL</label>
                <input
                  type="url"
                  value={profileData.googleMapsUrl}
                  onChange={e => handleInputChange('googleMapsUrl', e.target.value)}
                  className="w-full p-2.5 border border-primary rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-neutral-700 uppercase mb-1">Primary Phone</label>
                <input
                  type="text"
                  value={profileData.primaryPhone}
                  onChange={e => handleInputChange('primaryPhone', e.target.value)}
                  className="w-full p-2.5 border border-primary rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-neutral-700 uppercase mb-1">WhatsApp Number</label>
                <input
                  type="text"
                  value={profileData.whatsappNumber}
                  onChange={e => handleInputChange('whatsappNumber', e.target.value)}
                  className="w-full p-2.5 border border-primary rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-neutral-700 uppercase mb-1">Clinic Email</label>
                <input
                  type="email"
                  value={profileData.clinicEmail}
                  onChange={e => handleInputChange('clinicEmail', e.target.value)}
                  className="w-full p-2.5 border border-primary rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-neutral-700 uppercase mb-1">Website URL</label>
                <input
                  type="url"
                  value={profileData.websiteUrl}
                  onChange={e => handleInputChange('websiteUrl', e.target.value)}
                  className="w-full p-2.5 border border-primary rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-neutral-700 uppercase mb-1">Working Hours</label>
                <input
                  type="text"
                  value={profileData.workingHours}
                  onChange={e => handleInputChange('workingHours', e.target.value)}
                  className="w-full p-2.5 border border-primary rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-mono font-bold text-neutral-700 uppercase mb-1">Emergency Contact Number</label>
                <input
                  type="text"
                  value={profileData.emergencyContact}
                  onChange={e => handleInputChange('emergencyContact', e.target.value)}
                  className="w-full p-2.5 border border-primary rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Social Media */}
        {activeSection === 'social' && (
          <div className="space-y-6">
            <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-neutral-600 border-b border-neutral-200 pb-2">
              Social Media & Digital Profiles
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono font-bold text-neutral-700 uppercase mb-1">Facebook Page URL</label>
                <input
                  type="url"
                  value={profileData.facebookUrl}
                  onChange={e => handleInputChange('facebookUrl', e.target.value)}
                  placeholder="https://facebook.com/yourclinic"
                  className="w-full p-2.5 border border-primary rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-neutral-700 uppercase mb-1">Instagram Profile URL</label>
                <input
                  type="url"
                  value={profileData.instagramUrl}
                  onChange={e => handleInputChange('instagramUrl', e.target.value)}
                  placeholder="https://instagram.com/yourclinic"
                  className="w-full p-2.5 border border-primary rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-neutral-700 uppercase mb-1">YouTube Channel URL</label>
                <input
                  type="url"
                  value={profileData.youtubeUrl}
                  onChange={e => handleInputChange('youtubeUrl', e.target.value)}
                  placeholder="https://youtube.com/@yourclinic"
                  className="w-full p-2.5 border border-primary rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-neutral-700 uppercase mb-1">LinkedIn Profile URL</label>
                <input
                  type="url"
                  value={profileData.linkedinUrl}
                  onChange={e => handleInputChange('linkedinUrl', e.target.value)}
                  placeholder="https://linkedin.com/in/doctorname"
                  className="w-full p-2.5 border border-primary rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-neutral-700 uppercase mb-1">Google Business Profile URL</label>
                <input
                  type="url"
                  value={profileData.googleBusinessUrl}
                  onChange={e => handleInputChange('googleBusinessUrl', e.target.value)}
                  placeholder="https://g.co/kgs/clinic"
                  className="w-full p-2.5 border border-primary rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-neutral-700 uppercase mb-1">X (Twitter) Profile URL</label>
                <input
                  type="url"
                  value={profileData.xUrl}
                  onChange={e => handleInputChange('xUrl', e.target.value)}
                  placeholder="https://x.com/doctorname"
                  className="w-full p-2.5 border border-primary rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>
            </div>
          </div>
        )}

        <div className="pt-4 border-t border-neutral-200 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-primary text-white rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-primary-700 transition-colors shadow-sm"
          >
            <Save className="w-4 h-4" /> Save Profile Details
          </button>
        </div>
      </form>
    </div>
  );
}
