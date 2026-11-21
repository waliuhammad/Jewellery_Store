/**
 * AdminLogin — standalone admin login page.
 * No storefront header/footer. Protected by noindex meta.
 */
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useAdminAuth } from '../hooks/useAdminAuth';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login, loading, error, setError, isAuthenticated } = useAdminAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Set page title
  useEffect(() => {
    document.title = 'Admin Login — Minha Jewellers';
    return () => { document.title = 'Minha Jewellers'; };
  }, []);

  // Noindex meta
  useEffect(() => {
    let meta = document.querySelector('meta[name="robots"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'robots');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', 'noindex, nofollow');
    return () => { meta.setAttribute('content', 'index, follow'); };
  }, []);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) navigate('/admin', { replace: true });
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const ok = await login(email.trim(), password);
    if (ok) navigate('/admin', { replace: true });
  };

  return (
    <div className="min-h-screen bg-ivory flex flex-col items-center justify-center px-4 py-16">

      {/* ── Top section ──────────────────────────────────────── */}
      <div className="flex flex-col items-center mb-8">
        {/* Brand Logo */}
        <img
          src="/logo.png"
          alt="Minha Jewellers"
          className="h-16 w-auto object-contain mb-4"
        />

        {/* Staff Only pill */}
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5 font-sans text-[11px] font-bold uppercase tracking-widest text-ink bg-champagne border border-[#D4C6B1] shadow-xs"
        >
          <Shield size={13} strokeWidth={2} />
          Staff Only
        </div>

        {/* Large heading */}
        <h1 className="font-display text-[48px] font-semibold leading-none text-center">
          <span className="text-ink">ADMIN</span>
          <span className="text-gold"> PORTAL</span>
        </h1>

        {/* Subtitle */}
        <p className="font-sans text-taupe text-sm text-center mt-3 max-w-xs leading-relaxed">
          Not a customer page. This is where the store is managed from.
        </p>
      </div>

      {/* ── Card ─────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-sm bg-paper rounded-lg border border-hairline shadow-soft"
        style={{ boxShadow: '0 4px 24px rgba(28,25,23,0.08)' }}
      >
        <div className="p-8">
          {/* Lock icon */}
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
            style={{ backgroundColor: 'var(--color-cream, #F5EDE2)' }}
          >
            <Lock size={22} className="text-ink" strokeWidth={1.75} />
          </div>

          {/* Card heading */}
          <h2 className="font-display text-[24px] font-semibold text-ink mb-1">
            Admin Portal
          </h2>
          <p className="font-sans text-taupe text-sm mb-6">
            Sign in to manage Minha Jewellers.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Email */}
            <div>
              <label
                htmlFor="admin-email"
                className="block font-sans text-[12px] font-semibold text-ink uppercase tracking-wider mb-1.5"
              >
                Email Address
              </label>
              <input
                id="admin-email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@minhajewellers.com"
                className="w-full h-11 px-3.5 rounded-md font-sans text-sm text-ink placeholder:text-taupe/70 bg-paper border border-hairline outline-none transition shadow-xs focus:ring-2 focus:ring-gold/30 focus:border-gold"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="admin-password"
                className="block font-sans text-[12px] font-semibold text-ink uppercase tracking-wider mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-11 pl-3.5 pr-10 rounded-md font-sans text-sm text-ink placeholder:text-taupe/70 bg-paper border border-hairline outline-none transition shadow-xs focus:ring-2 focus:ring-gold/30 focus:border-gold"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-taupe hover:text-ink transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error display */}
            {error && (
              <div
                className="rounded-md px-4 py-3 font-sans text-xs font-semibold bg-[#FCE7E6] border border-garnet/30 text-garnet"
              >
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-md font-sans font-semibold text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                backgroundColor: loading ? undefined : '#1C1917',
                color: '#FAF7F2',
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.backgroundColor = 'var(--color-gold, #C9A96E)';
                  e.currentTarget.style.color = '#1C1917';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.currentTarget.style.backgroundColor = '#1C1917';
                  e.currentTarget.style.color = '#FAF7F2';
                }
              }}
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          {/* Demo credentials hint */}
          <p className="font-sans text-[11px] text-taupe text-center mt-5 leading-relaxed">
            Demo: admin@minhajewellers.com / admin123
          </p>
        </div>
      </motion.div>

      {/* ── Back to store ─────────────────────────────────────── */}
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 mt-8 font-sans text-sm text-taupe hover:text-ink transition-colors"
      >
        <ArrowLeft size={14} />
        Back to Store
      </Link>
    </div>
  );
}
