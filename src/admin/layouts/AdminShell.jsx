/**
 * AdminShell — outer layout wrapper for all admin pages.
 * Renders Sidebar (desktop) + MobileHeader (mobile) + main content area.
 * Guards routes: redirects to /admin/login when not authenticated.
 */
import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { AdminAuthProvider, useAdminAuth } from '../hooks/useAdminAuth';
import { AdminToastProvider } from '../components/ui';
import Sidebar from './Sidebar';
import { Menu, X } from 'lucide-react';
import { useLocation } from 'react-router-dom';

// ─── MOBILE HEADER ──────────────────────────────────────────────────────────
function MobileHeader({ onMenuOpen }) {
  const location = useLocation();

  // Derive a readable title from the path
  const pageTitle = (() => {
    const seg = location.pathname.replace('/admin', '').replace('/', '');
    if (!seg) return 'Overview';
    return seg
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  })();

  return (
    <header className="lg:hidden fixed top-0 left-0 right-0 z-30 h-14 bg-paper border-b border-hairline flex items-center px-4 gap-3">
      <button
        onClick={onMenuOpen}
        aria-label="Open menu"
        className="w-9 h-9 flex items-center justify-center rounded-md hover:bg-cream transition-colors"
      >
        <Menu size={20} className="text-ink" />
      </button>
      <span className="font-display text-ink font-semibold text-lg tracking-wide">{pageTitle}</span>
    </header>
  );
}

// ─── MOBILE SIDEBAR OVERLAY ─────────────────────────────────────────────────
function MobileSidebarOverlay({ open, onClose }) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  return (
    <div className="lg:hidden fixed inset-0 z-40 flex">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-noir/40 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Drawer */}
      <div className="relative z-50 w-[280px] h-full bg-paper border-r border-hairline flex flex-col">
        <div className="flex items-center justify-end p-3 border-b border-hairline">
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-cream transition-colors"
          >
            <X size={18} className="text-ink" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          <Sidebar onNavigate={onClose} />
        </div>
      </div>
    </div>
  );
}

// ─── SHELL INNER (uses auth context) ────────────────────────────────────────
function AdminShellInner() {
  const { isAuthenticated } = useAdminAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Noindex meta
  useEffect(() => {
    let meta = document.querySelector('meta[name="robots"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'robots');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', 'noindex, nofollow');
    return () => {
      meta.setAttribute('content', 'index, follow');
    };
  }, []);

  // Guard: redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-ivory flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-[280px] flex-shrink-0 bg-paper border-r border-hairline h-screen sticky top-0">
        <Sidebar />
      </aside>

      {/* Mobile header & overlay */}
      <MobileHeader onMenuOpen={() => setMobileOpen(true)} />
      <MobileSidebarOverlay open={mobileOpen} onClose={() => setMobileOpen(false)} />

      {/* Main content */}
      <main className="flex-1 min-w-0 bg-ivory pt-14 lg:pt-0">
        <div className="p-4 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

// ─── EXPORT: wraps providers ─────────────────────────────────────────────────
export default function AdminShell() {
  return (
    <AdminAuthProvider>
      <AdminToastProvider>
        <AdminShellInner />
      </AdminToastProvider>
    </AdminAuthProvider>
  );
}
