'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { KeyRound, Bell, Languages, ShieldCheck, Lock, CheckCircle, AlertCircle, Globe, FileText } from 'lucide-react';
import { changeClientPassword } from '../../../lib/actions';

type Tab = 'security' | 'notifications' | 'language' | 'privacy';

export default function ClientSettingsPage() {
  const [tab, setTab] = useState<Tab>('security');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changing, setChanging] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [prefs, setPrefs] = useState<Record<string, boolean>>({
    content: true,
    invoice: true,
    package: true,
    lead: true,
    report: true,
    offer: true,
    support: true,
    meeting: true,
  });
  const [language, setLanguage] = useState('English');

  const triggerToast = (msg: string, isError = false) => {
    if (isError) {
      setErrorMsg(msg);
      setTimeout(() => setErrorMsg(null), 5000);
    } else {
      setSuccessMsg(msg);
      setTimeout(() => setSuccessMsg(null), 5000);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      triggerToast('New passwords do not match.', true);
      return;
    }
    if (newPassword.length < 6) {
      triggerToast('New password must be at least 6 characters.', true);
      return;
    }
    setChanging(true);
    try {
      const res = await changeClientPassword(currentPassword, newPassword);
      if (res.success) {
        triggerToast('Password changed successfully.');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        triggerToast(res.error || 'Failed to change password.', true);
      }
    } catch (err: any) {
      triggerToast(err.message || 'An error occurred.', true);
    } finally {
      setChanging(false);
    }
  };

  const tabs: { id: Tab; label: string; Icon: any }[] = [
    { id: 'security', label: 'Account & Security', Icon: Lock },
    { id: 'notifications', label: 'Notifications', Icon: Bell },
    { id: 'language', label: 'Language & Time Zone', Icon: Languages },
    { id: 'privacy', label: 'Privacy & Data', Icon: ShieldCheck },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-5xl mx-auto font-sans">
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

      <div>
        <span className="text-[10px] font-mono font-bold tracking-widest text-neutral-400 uppercase">Doctor Portal</span>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 mt-1">Settings</h1>
        <p className="text-xs sm:text-sm text-neutral-500 mt-1">Manage your account, security, preferences and privacy.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-6">
        <nav className="sm:w-56 shrink-0 space-y-1">
          {tabs.map(t => {
            const Icon = t.Icon;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-xs font-bold transition-colors text-left cursor-pointer ${
                  tab === t.id ? 'bg-primary text-white' : 'text-neutral-600 hover:bg-neutral-100'
                }`}
              >
                <Icon className="w-4 h-4" /> {t.label}
              </button>
            );
          })}
        </nav>

        <div className="flex-1 border border-primary rounded-xl bg-white p-6">
          {tab === 'security' && (
            <div className="space-y-5">
              <div className="flex items-center gap-3 border-b border-neutral-200 pb-3">
                <KeyRound className="w-5 h-5 text-primary" />
                <h2 className="text-base font-bold text-neutral-900">Change Password</h2>
              </div>
              <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
                <div>
                  <label className="block text-xs font-mono font-bold text-neutral-700 uppercase mb-1">Current Password</label>
                  <input
                    type="password"
                    required
                    value={currentPassword}
                    onChange={e => setCurrentPassword(e.target.value)}
                    className="w-full p-2.5 border border-primary rounded-lg text-xs font-semibold outline-none focus:ring-1 focus:ring-black"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono font-bold text-neutral-700 uppercase mb-1">New Password</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    className="w-full p-2.5 border border-primary rounded-lg text-xs font-semibold outline-none focus:ring-1 focus:ring-black"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono font-bold text-neutral-700 uppercase mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    className="w-full p-2.5 border border-primary rounded-lg text-xs font-semibold outline-none focus:ring-1 focus:ring-black"
                  />
                </div>
                <button
                  type="submit"
                  disabled={changing}
                  className="px-5 py-2.5 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary-700 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {changing ? 'Updating...' : 'Update Password'}
                </button>
              </form>
              <p className="text-[11px] text-neutral-400 font-mono">
                For security, login sessions expire automatically after 7 days.
              </p>
            </div>
          )}

          {tab === 'notifications' && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 border-b border-neutral-200 pb-3">
                <Bell className="w-5 h-5 text-primary" />
                <h2 className="text-base font-bold text-neutral-900">Notification Preferences</h2>
              </div>
              <p className="text-xs text-neutral-500">
                Choose which in-portal alerts you receive. Security and account notices cannot be disabled.
              </p>
              <div className="space-y-2.5">
                {Object.entries(prefs).map(([key, value]) => (
                  <label key={key} className="flex items-center justify-between p-3 border border-neutral-200 rounded-lg bg-neutral-50 cursor-pointer">
                    <span className="text-xs font-bold text-neutral-800 capitalize">{key.replace('_', ' ')} updates</span>
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={() => setPrefs(prev => ({ ...prev, [key]: !prev[key] }))}
                      className="accent-primary"
                    />
                  </label>
                ))}
              </div>
              <button
                onClick={() => triggerToast('Notification preferences saved (in this session).')}
                className="px-5 py-2.5 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary-700 transition-colors cursor-pointer"
              >
                Save Preferences
              </button>
            </div>
          )}

          {tab === 'language' && (
            <div className="space-y-5">
              <div className="flex items-center gap-3 border-b border-neutral-200 pb-3">
                <Globe className="w-5 h-5 text-primary" />
                <h2 className="text-base font-bold text-neutral-900">Language & Time Zone</h2>
              </div>
              <div className="max-w-md space-y-4">
                <div>
                  <label className="block text-xs font-mono font-bold text-neutral-700 uppercase mb-1">Interface Language</label>
                  <select
                    value={language}
                    onChange={e => setLanguage(e.target.value)}
                    className="w-full p-2.5 border border-primary rounded-lg text-xs font-semibold bg-white"
                  >
                    <option value="English">English</option>
                    <option value="Gujarati">Gujarati (ગુજરાતી)</option>
                    <option value="Hindi">Hindi (हिन्दी)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-mono font-bold text-neutral-700 uppercase mb-1">Time Zone</label>
                  <select className="w-full p-2.5 border border-primary rounded-lg text-xs font-semibold bg-white">
                    <option>Asia/Kolkata (IST, UTC+5:30)</option>
                    <option>UTC</option>
                    <option>Asia/Dubai (GST, UTC+4)</option>
                  </select>
                </div>
                <p className="text-[11px] text-neutral-400 font-mono">
                  Gujarati and Hindi translations are being prepared for a future release.
                </p>
              </div>
            </div>
          )}

          {tab === 'privacy' && (
            <div className="space-y-5">
              <div className="flex items-center gap-3 border-b border-neutral-200 pb-3">
                <ShieldCheck className="w-5 h-5 text-primary" />
                <h2 className="text-base font-bold text-neutral-900">Privacy & Data</h2>
              </div>
              <div className="space-y-3">
                <div className="p-4 border border-neutral-200 rounded-lg bg-neutral-50">
                  <h3 className="text-sm font-bold text-neutral-900">Request a copy of your data</h3>
                  <p className="text-xs text-neutral-500 mt-1">We will prepare an export of your profile, invoices, reports and documents.</p>
                  <Link href="/client/support" className="inline-block mt-2.5 text-xs font-bold text-primary hover:underline">
                    Submit a data request →
                  </Link>
                </div>
                <div className="p-4 border border-neutral-200 rounded-lg bg-neutral-50">
                  <h3 className="text-sm font-bold text-neutral-900">Account deletion request</h3>
                  <p className="text-xs text-neutral-500 mt-1">
                    Deletion is a verified workflow — financial and service records may have retention requirements.
                  </p>
                  <Link href="/client/support" className="inline-block mt-2.5 text-xs font-bold text-rose-600 hover:underline">
                    Request account deletion →
                  </Link>
                </div>
                <div className="p-4 border border-neutral-200 rounded-lg bg-neutral-50">
                  <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                    <FileText className="w-4 h-4" /> Policies
                  </h3>
                  <p className="text-xs text-neutral-500 mt-1">View the terms that govern your account and our services.</p>
                  <div className="flex gap-4 mt-2.5">
                    <Link href="/" className="text-xs font-bold text-primary hover:underline">Privacy Policy</Link>
                    <Link href="/" className="text-xs font-bold text-primary hover:underline">Terms & Conditions</Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}