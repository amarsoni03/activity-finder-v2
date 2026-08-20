import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Lock,
  Unlock,
  KeyRound,
  Eye,
  EyeOff,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Compass,
} from 'lucide-react';
import { useSiteProtection } from './useSiteProtection';

interface SitePasswordGateProps {
  children: React.ReactNode;
  onLockSession?: () => void;
}

export const SitePasswordGate: React.FC<SitePasswordGateProps> = ({ children }) => {
  const { isUnlocked, isChecking, isProtectionRequired, unlockSite, defaultHint } = useSiteProtection();

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isChecking && !isUnlocked && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isChecking, isUnlocked]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError('Please enter a password');
      triggerShake();
      return;
    }

    setIsSubmitting(true);
    setError(null);

    // Artificial slight micro-delay for polished interaction feel
    await new Promise((res) => setTimeout(res, 250));

    const success = await unlockSite(password, rememberMe);

    if (!success) {
      setError('Incorrect password. Please try again.');
      setIsSubmitting(false);
      triggerShake();
      if (inputRef.current) {
        inputRef.current.select();
      }
    } else {
      setIsSubmitting(false);
    }
  };

  const triggerShake = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
  };

  // If initial auth check is ongoing, render a sleek loader
  if (isChecking) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950 text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="relative flex items-center justify-center">
            <div className="w-12 h-12 rounded-full border-2 border-slate-700 border-t-[#A2FF00] animate-spin" />
            <Sparkles className="w-5 h-5 text-[#A2FF00] absolute animate-pulse" />
          </div>
          <p className="text-sm font-medium text-slate-400">Verifying session access...</p>
        </div>
      </div>
    );
  }

  // If unlocked or protection is not required for this domain/env, render children
  if (isUnlocked || !isProtectionRequired) {
    return <>{children}</>;
  }

  // Render Password Protection Gate Screen
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950 text-slate-100 overflow-y-auto px-4 py-8 select-none">
      {/* Dynamic Background Glow Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[25%] -left-[15%] w-[600px] h-[600px] rounded-full bg-[#A2FF00]/10 blur-[130px]" />
        <div className="absolute -bottom-[20%] -right-[15%] w-[650px] h-[650px] rounded-full bg-blue-600/10 blur-[140px]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(#A2FF00 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className={`relative w-full max-w-md bg-slate-900/90 border border-slate-800/80 rounded-3xl p-7 sm:p-8 shadow-2xl backdrop-blur-2xl transition-transform duration-150 ${
          isShaking ? 'animate-shake' : ''
        }`}
      >
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="relative mb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-slate-800 to-slate-700/80 border border-slate-700/60 flex items-center justify-center shadow-lg shadow-black/40">
              <KeyRound className="w-8 h-8 text-[#A2FF00]" />
            </div>
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#A2FF00] opacity-60"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-[#A2FF00]"></span>
            </span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#A2FF00]/10 border border-[#A2FF00]/25 text-[#A2FF00] text-xs font-semibold uppercase tracking-wider mb-2.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            Vercel Deployment Gate
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            Activity Finder
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-xs leading-relaxed">
            This deployment preview is password protected. Enter the access password to explore activities.
          </p>
        </div>

        {/* Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label
              htmlFor="site-password-input"
              className="block text-xs font-medium text-slate-300 ml-1"
            >
              Access Password
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-[#A2FF00] transition-colors">
                <Lock className="w-4 h-4" />
              </div>
              <input
                ref={inputRef}
                id="site-password-input"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="Enter password..."
                disabled={isSubmitting}
                className="w-full pl-10 pr-11 py-3 bg-slate-950/70 border border-slate-800 rounded-xl text-white placeholder-slate-500 text-sm font-medium focus:outline-none focus:border-[#A2FF00]/70 focus:ring-2 focus:ring-[#A2FF00]/20 transition-all"
                autoComplete="current-password"
                spellCheck="false"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 transition-colors focus:outline-none"
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -4 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0, y: -4 }}
                className="flex items-center gap-2 p-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium"
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Remember Me Option */}
          <div className="flex items-center justify-between text-xs text-slate-400 pt-1 pb-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-[#A2FF00] focus:ring-[#A2FF00]/30 focus:ring-offset-0 accent-[#A2FF00]"
              />
              <span>Remember this device for 30 days</span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || !password.trim()}
            className="w-full py-3 px-4 rounded-xl bg-[#A2FF00] hover:bg-[#91E600] active:scale-[0.98] text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#A2FF00]/15 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-slate-950 border-t-transparent animate-spin" />
                <span>Verifying...</span>
              </>
            ) : (
              <>
                <span>Unlock Website</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer / Helper notes */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 flex flex-col items-center gap-2 text-center text-xs text-slate-500">
          <div className="flex items-center gap-1.5 text-slate-400">
            <Compass className="w-3.5 h-3.5 text-[#A2FF00]" />
            <span>Discover activities fitting your free time</span>
          </div>

          {defaultHint && (
            <div className="mt-1 px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/50 text-[11px] text-slate-400">
              <span className="text-slate-300 font-semibold">Dev / Preview Hint:</span> Try password{' '}
              <code className="text-[#A2FF00] font-mono bg-slate-900 px-1 py-0.5 rounded">
                {defaultHint}
              </code>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
