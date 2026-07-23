'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loginUserAction, getServerSession, setupInitialAdmin, hasAdminUser } from '../lib/actions';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  CheckCircle, 
  Briefcase, 
  ShieldCheck, 
  Key, 
  HelpCircle,
  AlertCircle,
  BookOpen
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Forgot Password state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccessMsg, setForgotSuccessMsg] = useState<string | null>(null);

  // First-time admin setup
  const [needsSetup, setNeedsSetup] = useState(false);
  const [setupEmail, setSetupEmail] = useState('');
  const [setupPassword, setSetupPassword] = useState('');
  const [setupLoading, setSetupLoading] = useState(false);

  // Auto redirect if already logged in
  useEffect(() => {
    setMounted(true);
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
          router.push('/client');
        }
      } else {
        setError(res.error || 'Authentication failed.');
        setLoading(false);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;

    setForgotSuccessMsg(
      `If an account with ${forgotEmail} exists, a password reset link has been sent. Please contact an administrator if you do not receive it.`
    );
  };

  if (!mounted || pageLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-xs text-neutral-400 font-mono tracking-wider">SECURE CONNECTION STARTING...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row text-neutral-900 font-sans">
      
      {/* Left Column: Split visual screen */}
      <div className="w-full md:w-1/2 bg-neutral-950 text-white flex flex-col justify-between p-8 md:p-16 relative overflow-hidden select-none border-b md:border-b-0 md:border-r border-neutral-800">
        {/* Ambient Grid Accent */}
        <div className="absolute inset-0 bg-[radial-gradient(#262626_1px,transparent_1px)] [background-size:24px_24px] opacity-30 pointer-events-none" />
        
        {/* Brand Header */}
        <div className="relative z-10 flex items-center gap-2">
          <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center text-black font-extrabold text-lg shadow-md">
            T
          </div>
          <div>
            <span className="font-semibold text-lg tracking-tight">TOPCLUES</span>
            <span className="text-xs text-neutral-400 font-mono ml-2 border border-neutral-800 px-1.5 py-0.5 rounded uppercase">Managements</span>
          </div>
        </div>

        {/* Hero Concept Content */}
        <div className="my-auto py-12 md:py-0 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-xs font-semibold tracking-wider font-mono text-neutral-400 uppercase bg-neutral-900 border border-neutral-800 px-3 py-1 rounded-full inline-block mb-6">
              PARTNER CLIENT SYSTEM
            </span>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 max-w-lg leading-[1.15]">
              The premium hub for custom corporate services.
            </h1>
            <p className="text-neutral-400 text-base max-w-md mb-8 leading-relaxed">
              Securely access professional billing matrices, custom corporate service packages, active upgrade requests, and prioritized technical support pipelines.
            </p>
          </motion.div>

          {/* Highlights Checklist */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 bg-white/10 rounded-md flex items-center justify-center mt-0.5 border border-white/5">
                <CheckCircle className="w-3.5 h-3.5 text-white" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-neutral-200">Role-Based Gateways</h4>
                <p className="text-xs text-neutral-400">Strict isolation between Administrator and Client portal routing.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-5 h-5 bg-white/10 rounded-md flex items-center justify-center mt-0.5 border border-white/5">
                <Briefcase className="w-3.5 h-3.5 text-white" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-neutral-200">Secure Billing Vault</h4>
                <p className="text-xs text-neutral-400">Chronological PDF invoice repository with instant web printing support.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-5 h-5 bg-white/10 rounded-md flex items-center justify-center mt-0.5 border border-white/5">
                <ShieldCheck className="w-3.5 h-3.5 text-white" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-neutral-200">Zero-Self Registration Policy</h4>
                <p className="text-xs text-neutral-400">Only authorized administrator-provisioned client keys grant system entry.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 pt-6 border-t border-neutral-900 flex items-center justify-between text-xs text-neutral-500">
          <span>© 2026 TopClues Client Managements. All rights reserved.</span>
        </div>
      </div>

      {/* Right Column */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-16 bg-white">
        <div className="max-w-md w-full">
          {needsSetup ? (
            <>
              <div className="mb-8">
                <h2 className="text-2xl font-bold tracking-tight text-neutral-900">Initialize System</h2>
                <p className="text-sm text-neutral-500 mt-1.5">No administrator account found. Create the first admin account to set up the portal.</p>
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
              <div className="mb-8">
                <h2 className="text-2xl font-bold tracking-tight text-neutral-900">Sign in to your portal</h2>
                <p className="text-sm text-neutral-500 mt-1.5">Enter your administrator-assigned credentials below.</p>
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
                  <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wider" htmlFor="email">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input
                      id="email"
                      type="email"
                      required
                      placeholder="name@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-black focus:bg-white transition-all font-sans"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wider" htmlFor="password">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowForgotModal(true)}
                      className="text-xs font-medium text-neutral-500 hover:text-black transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input
                      id="password"
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

                <div className="flex items-center">
                  <input
                    id="remember_me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-black border-neutral-300 rounded focus:ring-black accent-black cursor-pointer"
                  />
                  <label htmlFor="remember_me" className="text-xs font-medium text-neutral-500 select-none ml-2 cursor-pointer hover:text-neutral-800 transition-colors">
                    Remember my secure session
                  </label>
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
                      <span>Verify and Authenticate</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </>
          )}

          <div className="mt-8 pt-6 border-t border-neutral-100 flex flex-col items-center gap-3 text-neutral-400 text-xs">
            <a href="/admin" className="text-xs text-neutral-500 hover:text-black transition-colors font-medium">
              Admin Portal Login →
            </a>
            <a href="/tutorial" className="text-xs text-neutral-500 hover:text-black transition-colors font-medium flex items-center gap-1">
              <BookOpen className="w-3 h-3" />
              View Step-by-Step Tutorial
            </a>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-neutral-500 shrink-0" />
              <span>Encrypted with SHA-256 local verification protocols.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <AnimatePresence>
        {showForgotModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-neutral-200 rounded-2xl p-6 max-w-md w-full shadow-lg relative"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-neutral-900">Forgot Password?</h3>
                  <p className="text-xs text-neutral-500 mt-1">Submit your registered email address to receive password retrieval steps.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotModal(false);
                    setForgotSuccessMsg(null);
                    setForgotEmail('');
                  }}
                  className="text-neutral-400 hover:text-neutral-900 font-semibold text-lg"
                >
                  ×
                </button>
              </div>

              {forgotSuccessMsg ? (
                <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl text-xs text-emerald-700 leading-relaxed">
                  <CheckCircle className="w-4 h-4 text-emerald-500 mb-1" />
                  {forgotSuccessMsg}
                </div>
              ) : (
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wider" htmlFor="forgot_email">
                      Registered Email
                    </label>
                    <input
                      id="forgot_email"
                      type="email"
                      required
                      placeholder="client@stripe.com"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-black transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 bg-black text-white hover:bg-neutral-800 rounded-xl text-sm font-semibold tracking-tight transition-all shadow-sm"
                  >
                    Send Recovery Email
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
