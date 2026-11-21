import React, { useState } from 'react';
import { useNavigate, useLocation, useSearchParams, Link } from 'react-router-dom';
import { Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { BRAND } from '../config/brand';

export default function Auth() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/account';
  const isCheckoutIntent = redirectUrl === '/checkout';

  const { login, register } = useAuth();

  const isRegisterInitial = location.pathname === '/register';
  const isForgotInitial = location.pathname === '/forgot-password';

  const [mode, setMode] = useState(
    isForgotInitial ? 'forgot' : isRegisterInitial ? 'register' : 'login'
  );

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === 'login') {
      login(email, password);
      navigate(redirectUrl);
    } else if (mode === 'register') {
      register(name, email, password, phone);
      navigate(redirectUrl);
    } else if (mode === 'forgot') {
      setForgotSent(true);
    }
  };

  return (
    <div className="min-h-screen bg-ivory flex">
      {/* Left Column: Full-Height Editorial Photo with Quote per Design.md Section 5.6 */}
      <div className="hidden lg:block lg:w-1/2 relative bg-deep overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1200&auto=format&fit=crop"
          alt={`${BRAND.name} Editorial`}
          className="w-full h-full object-cover filter brightness-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-deep/90 via-deep/40 to-transparent" />
        <div className="absolute bottom-16 left-12 right-12 text-ivory">
          <span className="text-[10px] uppercase tracking-label text-champagne block mb-2">
            The {BRAND.shortName} Realm
          </span>
          <blockquote className="font-display text-3xl xl:text-4xl leading-snug font-normal italic">
            &ldquo;Every piece begins with an intention: to capture morning light and stay close through every quiet hour.&rdquo;
          </blockquote>
          <p className="text-xs uppercase tracking-label text-ivory/60 mt-4">
            {BRAND.name} Atelier
          </p>
        </div>
      </div>

      {/* Right Column: Centered Form per Design.md Section 5.6 */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-16 pt-28 lg:pt-16">
        <div className="w-full max-w-md space-y-8">
          <div>
            <Link
              to="/"
              className="inline-block mb-6"
              aria-label={BRAND.name}
            >
              <img
                src={BRAND.logo}
                alt={BRAND.name}
                className="h-[44px] w-auto object-contain"
              />
            </Link>
            <h1 className="font-display text-3xl sm:text-4xl text-forest font-normal">
              {mode === 'login'
                ? 'Sign In to Continue'
                : mode === 'register'
                ? 'Create Your Account'
                : 'Reset Password'}
            </h1>
            <p className="text-xs text-moss mt-1 font-light">
              {mode === 'login'
                ? 'Enter your credentials to access your bag, saved addresses, and checkout.'
                : mode === 'register'
                ? `Join ${BRAND.name} to place orders, track parcels, and receive previews.`
                : 'Enter your email address and we will send a password reset link.'}
            </p>
          </div>

          {/* Checkout requirement banner if redirected from checkout */}
          {isCheckoutIntent && (
            <div className="p-4 bg-champagne/30 border border-champagne text-xs text-forest flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-forest flex-shrink-0" />
              <span>
                <strong>Account Required:</strong> Please sign in or register to place your order and track delivery.
              </span>
            </div>
          )}

          {/* Mode Switcher Tabs */}
          {mode !== 'forgot' && (
            <div className="flex border-b border-hairline text-xs uppercase tracking-label">
              <button
                type="button"
                onClick={() => setMode('login')}
                className={`flex-1 py-3 border-b-2 font-medium transition-colors ${
                  mode === 'login' ? 'border-forest text-forest' : 'border-transparent text-moss hover:text-forest'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setMode('register')}
                className={`flex-1 py-3 border-b-2 font-medium transition-colors ${
                  mode === 'register' ? 'border-forest text-forest' : 'border-transparent text-moss hover:text-forest'
                }`}
              >
                Register
              </button>
            </div>
          )}

          {forgotSent ? (
            <div className="p-6 bg-cream border border-hairline text-xs text-forest space-y-3">
              <p className="font-medium">Password Reset Email Dispatched</p>
              <p className="text-moss leading-relaxed">
                If an account exists with <strong className="text-forest">{email}</strong>, a secure reset link has been emailed.
              </p>
              <button
                type="button"
                onClick={() => {
                  setForgotSent(false);
                  setMode('login');
                }}
                className="text-forest underline uppercase tracking-label text-[11px] block pt-2 hover:text-emerald"
              >
                &larr; Return to Sign In
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 text-xs font-sans">
              {mode === 'register' && (
                <div>
                  <label className="block text-moss uppercase tracking-label mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Zara Abbasi"
                    className="input-luxe"
                  />
                </div>
              )}

              <div>
                <label className="block text-moss uppercase tracking-label mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="input-luxe"
                />
              </div>

              {mode === 'register' && (
                <div>
                  <label className="block text-moss uppercase tracking-label mb-1">Pakistani Mobile No.</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0300 1234567"
                    className="input-luxe"
                  />
                </div>
              )}

              {mode !== 'forgot' && (
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-moss uppercase tracking-label">Password *</label>
                    {mode === 'login' && (
                      <button
                        type="button"
                        onClick={() => setMode('forgot')}
                        className="text-[11px] text-moss hover:text-forest"
                      >
                        Forgot?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="input-luxe pr-8"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-0 top-1/2 -translate-y-1/2 text-moss hover:text-forest p-1"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full relative overflow-hidden bg-forest text-ivory py-4 text-xs uppercase tracking-label font-medium group transition-colors"
              >
                <span className="absolute inset-0 -translate-x-full bg-gold transition-transform duration-300 ease-luxe group-hover:translate-x-0" />
                <span className="relative z-10 transition-colors duration-300 group-hover:text-ink">
                  {mode === 'login'
                    ? isCheckoutIntent ? 'Sign In & Proceed to Checkout' : 'Sign In'
                    : mode === 'register'
                    ? isCheckoutIntent ? 'Register & Proceed to Checkout' : 'Create Account'
                    : 'Send Reset Link'}
                </span>
              </button>
            </form>
          )}

          {mode === 'forgot' && (
            <button
              onClick={() => setMode('login')}
              className="text-xs text-moss hover:text-forest underline block text-center"
            >
              &larr; Back to Sign In
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
