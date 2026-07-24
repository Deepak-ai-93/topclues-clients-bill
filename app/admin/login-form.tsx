'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loginUserAction, getServerSession, setupInitialAdmin, hasAdminUser } from '../../lib/actions';
import { motion } from 'motion/react';
import Image from 'next/image';
import { Lock, Mail, Eye, EyeOff, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

export default function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // First-time admin setup
  const [needsSetup, setNeedsSetup] = useState(false);
  const [setupEmail, setSetupEmail] = useState('');
  const [setupPassword, setSetupPassword] = useState('');
  const [setupLoading, setSetupLoading] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      const session = await getServerSession();
      if (session) {
        if (session.role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/client');
        }
        return;
      }
      const { hasAdmin } = await hasAdminUser();
      setNeedsSetup(!hasAdmin);
      setPageLoading(false);
    }
    checkAuth();
  }, [router]);

  const handleSetupAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!setupEmail || !setupPassword) {
      setError('Please fill in all fields.');
      return;
    }
    setSetupLoading(true);
    setError(null);
    try {
      const res = await setupInitialAdmin({ email: setupEmail, password: setupPassword });
      if (res.success) {
        const loginRes = await loginUserAction(setupEmail, setupPassword);
        if (loginRes.success) {
          router.push('/admin');
        }
      } else {
        setError(res.error || 'Setup failed.');
        setSetupLoading(false);
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
      setSetupLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      const res = await loginUserAction(email, password);
      if (res.success) {
        if (res.role === 'admin') {
          router.push('/admin');
        } else {
          setError('Access denied. This portal is for administrators only.');
          setLoading(false);
        }
      } else {
        setError(res.error || 'Authentication failed.');
        setLoading(false);
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-xs text-neutral-500 font-mono tracking-wider">SECURE CONNECTION STARTING...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="flex flex-col items-center gap-3 mb-8">
          <div className="bg-white p-3 rounded-xl">
            <Image
              src="/Logo(1).png"
              alt="Logo"
              width={120}
              height={120}
              className="w-20 md:w-24"
            />
          </div>
          <span className="text-[10px] text-neutral-500 font-mono border border-neutral-300 px-1.5 py-0.5 rounded">Powered by TopClues Solution</span>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-lg">
          {needsSetup ? (
            <>
              <div className="mb-6">
                <h2 className="text-xl font-bold tracking-tight text-neutral-900">Initialize System</h2>
                <p className="text-sm text-neutral-500 mt-1">Create the first admin account.</p>
              </div>

              <form onSubmit={handleSetupAdmin} className="space-y-5">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-red-50 border border-red-100 rounded-lg flex items-start gap-2 text-xs text-red-600 font-medium"
                  >
                    <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </motion.div>
                )}

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wider" htmlFor="setup_email">
                    Admin Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input
                      id="setup_email"
                      type="email"
                      required
                      placeholder="admin@company.com"
                      value={setupEmail}
                      onChange={(e) => setSetupEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-black focus:bg-white transition-all font-sans"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wider" htmlFor="setup_password">
                    Admin Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input
                      id="setup_password"
                      type="password"
                      required
                      placeholder="Choose a strong password"
                      value={setupPassword}
                      onChange={(e) => setSetupPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-black focus:bg-white transition-all font-mono"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={setupLoading}
                  className="w-full py-2.5 px-4 bg-black text-white hover:bg-neutral-800 disabled:bg-neutral-300 rounded-xl text-sm font-semibold tracking-tight transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  {setupLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Setting up...</span>
                    </>
                  ) : (
                    <>
                      <span>Initialize Portal</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </>
          ) : (
            <>
              <div className="mb-6">
                <h2 className="text-xl font-bold tracking-tight text-neutral-900">Admin Sign In</h2>
                <p className="text-sm text-neutral-500 mt-1">Enter your admin credentials.</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-5">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-red-50 border border-red-100 rounded-lg flex items-start gap-2 text-xs text-red-600 font-medium"
                  >
                    <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </motion.div>
                )}

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wider" htmlFor="admin_email">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input
                      id="admin_email"
                      type="email"
                      required
                      placeholder="admin@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-black focus:bg-white transition-all font-sans"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wider" htmlFor="admin_password">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input
                      id="admin_password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-black focus:bg-white transition-all font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-900 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 bg-black text-white hover:bg-neutral-800 disabled:bg-neutral-300 rounded-xl text-sm font-semibold tracking-tight transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Verifying Credentials...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In as Admin</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 pt-4 border-t border-neutral-100 text-center">
                <Link href="/client/login" className="text-xs text-neutral-500 hover:text-black transition-colors font-medium">
                  Client Portal Login →
                </Link>
              </div>
            </>
          )}

          <div className="mt-4 pt-4 border-t border-neutral-100 flex items-center gap-2 text-neutral-400 text-xs justify-center">
            <ShieldCheck className="w-4 h-4 text-neutral-500 shrink-0" />
            <span>Encrypted Admin Channel</span>
          </div>
        </div>
      </div>
    </div>
  );
}