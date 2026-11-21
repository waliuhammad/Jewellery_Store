/**
 * Admin shared UI components — refined for high contrast, WCAG AA legibility, and luxury clarity.
 * StatusChip, StatCard, Skeleton, EmptyState, Toggle, Badge, FilterPills,
 * ConfirmDialog, AdminToast, Tabs, Pagination, SearchInput, SelectInput, Drawer
 */
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, CheckCircle, Info, X, ChevronLeft, ChevronRight, Search } from 'lucide-react';

// ─── STATUS CHIP ─────────────────────────────────────────────────────────────
const STATUS_MAP = {
  pending:          { bg: '#FFF5E0', border: '#E0B554', text: '#7A5408', label: 'Pending' },
  confirmed:        { bg: '#FDEAE4', border: '#DDA091', text: '#7E3627', label: 'Confirmed' },
  packed:           { bg: '#F2EBE1', border: '#C4B4A2', text: '#4D4137', label: 'Packed' },
  shipped:          { bg: '#E6F3E6', border: '#92BE93', text: '#1E5823', label: 'Shipped' },
  out_for_delivery: { bg: '#F8EEDB', border: '#D1AF73', text: '#2A2019', label: 'Out for Delivery' },
  delivered:        { bg: '#E2F3E2', border: '#78B87B', text: '#17501C', label: 'Delivered' },
  paid:             { bg: '#E2F3E2', border: '#78B87B', text: '#17501C', label: 'Paid' },
  active:           { bg: '#E2F3E2', border: '#78B87B', text: '#17501C', label: 'Active' },
  cancelled:        { bg: '#FCE7E6', border: '#E79795', text: '#8E1D1D', label: 'Cancelled' },
  failed:           { bg: '#FCE7E6', border: '#E79795', text: '#8E1D1D', label: 'Failed' },
  blocked:          { bg: '#FCE7E6', border: '#E79795', text: '#8E1D1D', label: 'Blocked' },
  returned:         { bg: '#F2EBE1', border: '#C4B4A2', text: '#4D4137', label: 'Returned' },
  refunded:         { bg: '#F2EBE1', border: '#C4B4A2', text: '#4D4137', label: 'Refunded' },
  awaiting:         { bg: '#FFF5E0', border: '#E0B554', text: '#7A5408', label: 'Awaiting' },
  draft:            { bg: '#F2EBE1', border: '#C4B4A2', text: '#4D4137', label: 'Draft' },
  expired:          { bg: '#F2EBE1', border: '#C4B4A2', text: '#4D4137', label: 'Expired' },
  disabled:         { bg: '#F2EBE1', border: '#C4B4A2', text: '#4D4137', label: 'Disabled' },
  cod:              { bg: '#F2EBE1', border: '#C4B4A2', text: '#4D4137', label: 'Cash on Delivery' },
  jazzcash:         { bg: '#FDEAE4', border: '#DDA091', text: '#7E3627', label: 'JazzCash' },
  easypaisa:        { bg: '#E6F3E6', border: '#92BE93', text: '#1E5823', label: 'EasyPaisa' },
  bank_transfer:    { bg: '#FFF5E0', border: '#E0B554', text: '#7A5408', label: 'Bank Transfer' },
};

export function StatusChip({ status, className = '' }) {
  const key = status?.toLowerCase().replace(/\s+/g, '_');
  const cfg = STATUS_MAP[key] || { bg: '#F2EBE1', border: '#C4B4A2', text: '#4D4137', label: status };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold font-sans whitespace-nowrap shadow-xs ${className}`}
      style={{ backgroundColor: cfg.bg, color: cfg.text, border: `1px solid ${cfg.border}` }}
    >
      {cfg.label}
    </span>
  );
}

// ─── STAT CARD ───────────────────────────────────────────────────────────────
export function StatCard({ icon: Icon, iconBg, label, value, tag, tagColor, delay = 0 }) {
  const [displayed, setDisplayed] = useState(0);
  const numeric = typeof value === 'number' ? value : parseFloat(String(value).replace(/[^0-9.]/g, ''));
  const prefix = typeof value === 'string' ? value.match(/^[^0-9]*/)?.[0] || '' : '';

  useEffect(() => {
    if (isNaN(numeric)) return;
    let start = 0;
    const duration = 600;
    const startTime = Date.now();
    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed(Math.floor(eased * numeric));
      if (progress < 1) requestAnimationFrame(tick);
    };
    const tid = setTimeout(() => requestAnimationFrame(tick), delay);
    return () => clearTimeout(tid);
  }, [numeric, delay]);

  const displayValue = isNaN(numeric)
    ? value
    : `${prefix}${displayed.toLocaleString('en-PK')}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: delay / 1000 }}
      className="bg-paper rounded-lg border border-hairline p-6 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 border border-hairline/40 shadow-xs"
          style={{ backgroundColor: iconBg || '#F5EEE4' }}
        >
          {Icon && <Icon size={18} strokeWidth={1.8} className="text-ink" />}
        </div>
        {tag && (
          <span
            className="text-[10px] font-sans font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border"
            style={{ backgroundColor: tagColor || '#F5EEE4', color: '#3A302A', borderColor: 'rgba(0,0,0,0.1)' }}
          >
            {tag}
          </span>
        )}
      </div>
      <div>
        <p className="text-xs font-sans font-bold uppercase tracking-wider text-taupe mb-1">{label}</p>
        <p
          className="font-sans font-bold text-ink whitespace-nowrap overflow-hidden tracking-tight"
          style={{ fontSize: 'clamp(22px, 2.2vw, 32px)' }}
        >
          {displayValue}
        </p>
      </div>
    </motion.div>
  );
}

// ─── SKELETON ────────────────────────────────────────────────────────────────
export function Skeleton({ className = '' }) {
  return (
    <div className={`animate-pulse bg-gradient-to-r from-cream to-champagne/40 rounded ${className}`} />
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-paper rounded-lg border border-hairline p-6 space-y-3 shadow-sm">
      <Skeleton className="h-10 w-10 rounded-lg" />
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-8 w-32" />
    </div>
  );
}

export function SkeletonTable({ rows = 5 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full rounded" />
      ))}
    </div>
  );
}

// ─── EMPTY STATE ─────────────────────────────────────────────────────────────
export function EmptyState({ icon: Icon, title, message, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {Icon && (
        <div className="w-14 h-14 rounded-full bg-cream border border-hairline flex items-center justify-center mb-4">
          <Icon size={24} strokeWidth={1.5} className="text-ink" />
        </div>
      )}
      <h3 className="font-display text-2xl font-bold text-ink mb-1.5">{title}</h3>
      {message && <p className="text-xs text-taupe font-sans max-w-sm font-medium">{message}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

// ─── ERROR STATE ─────────────────────────────────────────────────────────────
export function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-14 h-14 rounded-full bg-[#FCE7E6] border border-garnet/30 flex items-center justify-center mb-4">
        <AlertTriangle size={22} strokeWidth={2} className="text-garnet" />
      </div>
      <h3 className="font-display text-2xl font-bold text-ink mb-1">Something went wrong</h3>
      <p className="text-xs text-taupe font-sans max-w-sm mb-6 font-medium">{message || 'An unexpected error occurred.'}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-5 py-2 text-xs font-sans font-semibold uppercase tracking-wider bg-ink text-ivory rounded-md hover:bg-gold hover:text-ink transition-colors shadow-sm"
        >
          Try again
        </button>
      )}
    </div>
  );
}

// ─── TOGGLE ──────────────────────────────────────────────────────────────────
export function Toggle({ checked, onChange, label, disabled }) {
  return (
    <label className="inline-flex items-center gap-2.5 cursor-pointer select-none">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`relative w-10 h-5.5 rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 ${
          checked ? 'bg-[#2D663B]' : 'bg-[#C8BAA7]'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-4.5 h-4.5 rounded-full bg-paper shadow-sm transition-transform duration-200 ${
            checked ? 'translate-x-4.5' : 'translate-x-0'
          }`}
        />
      </button>
      {label && <span className="text-xs font-sans font-semibold text-ink">{label}</span>}
    </label>
  );
}

// ─── FILTER PILLS ────────────────────────────────────────────────────────────
export function FilterPills({ filters, active, onChange }) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {filters.map((f) => {
        const isActive = active === f.value;
        return (
          <button
            key={f.value}
            onClick={() => onChange(f.value)}
            className={`flex-shrink-0 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-sans font-semibold border transition-all whitespace-nowrap shadow-xs ${
              isActive
                ? 'bg-ink border-ink text-ivory shadow-sm'
                : 'bg-paper border-hairline text-ink hover:bg-cream hover:border-taupe/40'
            }`}
          >
            {f.label}
            {f.count !== undefined && (
              <span
                className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                  isActive ? 'bg-gold text-ink' : 'bg-cream text-taupe'
                }`}
              >
                {f.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

// ─── CONFIRM DIALOG ──────────────────────────────────────────────────────────
export function ConfirmDialog({ isOpen, title, message, confirmLabel = 'Confirm', danger, onConfirm, onCancel }) {
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => { if (e.key === 'Escape') onCancel(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onCancel]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-noir/50 backdrop-blur-xs"
            onClick={onCancel}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}
            className="relative bg-paper rounded-lg border border-hairline shadow-soft p-6 w-full max-w-sm z-10"
          >
            {danger && (
              <div className="w-10 h-10 rounded-full bg-[#FCE7E6] border border-garnet/20 flex items-center justify-center mb-4">
                <AlertTriangle size={18} className="text-garnet" />
              </div>
            )}
            <h3 className="font-display text-xl font-bold text-ink mb-2">{title}</h3>
            <p className="text-xs font-sans text-taupe leading-relaxed mb-6 font-medium">{message}</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={onCancel}
                className="px-4 py-2 text-xs font-sans font-semibold border border-hairline rounded-md text-taupe hover:bg-cream hover:text-ink transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className={`px-4 py-2 text-xs font-sans font-semibold rounded-md transition-colors shadow-xs ${
                  danger
                    ? 'bg-[#FCE7E6] border border-garnet/30 text-garnet hover:bg-garnet hover:text-ivory'
                    : 'bg-ink text-ivory hover:bg-gold hover:text-ink'
                }`}
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// ─── TABS ─────────────────────────────────────────────────────────────────────
export function Tabs({ tabs, active, onChange }) {
  return (
    <div className="flex items-center gap-1.5 p-1 bg-cream/70 rounded-lg border border-hairline">
      {tabs.map((t) => (
        <button
          key={t.value}
          onClick={() => onChange(t.value)}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-xs font-sans font-semibold transition-all whitespace-nowrap ${
            active === t.value
              ? 'bg-paper text-ink shadow-sm border border-hairline'
              : 'text-taupe hover:text-ink hover:bg-paper/50'
          }`}
        >
          {t.label}
          {t.count !== undefined && (
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
              active === t.value ? 'bg-champagne text-ink' : 'bg-hairline/60 text-taupe'
            }`}>
              {t.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

// ─── PAGINATION ──────────────────────────────────────────────────────────────
export function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-between pt-4 border-t border-hairline">
      <p className="text-xs text-taupe font-sans font-semibold">Page {page} of {totalPages}</p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onChange(page - 1)} disabled={page <= 1}
          className="p-1.5 rounded border border-hairline bg-paper text-ink hover:bg-cream disabled:opacity-30 disabled:cursor-not-allowed transition-colors shadow-xs"
          aria-label="Previous page"
        >
          <ChevronLeft size={15} />
        </button>
        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
          const p = Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
          return (
            <button
              key={p}
              onClick={() => onChange(p)}
              className={`w-7 h-7 text-xs font-sans font-bold rounded border transition-colors shadow-xs ${
                p === page
                  ? 'bg-ink text-ivory border-ink'
                  : 'bg-paper border-hairline text-ink hover:bg-cream'
              }`}
            >
              {p}
            </button>
          );
        })}
        <button
          onClick={() => onChange(page + 1)} disabled={page >= totalPages}
          className="p-1.5 rounded border border-hairline bg-paper text-ink hover:bg-cream disabled:opacity-30 disabled:cursor-not-allowed transition-colors shadow-xs"
          aria-label="Next page"
        >
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}

// ─── ADMIN TOAST ─────────────────────────────────────────────────────────────
const AdminToastContext = React.createContext(null);
export function useAdminToast() {
  return React.useContext(AdminToastContext);
}

export function AdminToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const show = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  };

  return (
    <AdminToastContext.Provider value={{ show }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[300] flex flex-col gap-2 pointer-events-none" aria-live="polite">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
              className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-lg shadow-soft border text-xs font-sans font-semibold max-w-xs ${
                t.type === 'error'
                  ? 'bg-[#FCE7E6] border-garnet/30 text-garnet'
                  : t.type === 'info'
                  ? 'bg-[#FFF5E0] border-[#E0B554] text-[#7A5408]'
                  : 'bg-[#E2F3E2] border-[#78B87B] text-[#17501C]'
              }`}
            >
              {t.type === 'error' ? <AlertTriangle size={16} /> : t.type === 'info' ? <Info size={16} /> : <CheckCircle size={16} />}
              {t.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </AdminToastContext.Provider>
  );
}

// ─── SEARCH INPUT ─────────────────────────────────────────────────────────────
export function SearchInput({ value, onChange, placeholder = 'Search…', className = '' }) {
  return (
    <div className={`relative ${className}`}>
      <Search size={15} strokeWidth={2} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-taupe pointer-events-none" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-9 pr-3.5 py-2 text-xs font-sans bg-paper border border-hairline rounded-md text-ink placeholder:text-taupe/70 font-medium shadow-xs focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/25 transition-all"
      />
    </div>
  );
}

// ─── SELECT INPUT ─────────────────────────────────────────────────────────────
export function SelectInput({ value, onChange, options, className = '', placeholder }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`px-3 py-2 text-xs font-sans font-medium bg-paper border border-hairline rounded-md text-ink shadow-xs focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/25 transition-all ${className}`}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}

// ─── DRAWER ───────────────────────────────────────────────────────────────────
export function Drawer({ isOpen, onClose, title, children, width = 'max-w-[560px]' }) {
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] overflow-hidden">
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-noir/50 backdrop-blur-xs"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className={`absolute inset-y-0 right-0 w-full ${width} bg-paper flex flex-col shadow-soft border-l border-hairline z-10`}
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-6 py-4.5 border-b border-hairline flex-shrink-0 bg-cream/30">
              <h2 className="font-display text-2xl font-bold text-ink">{title}</h2>
              <button
                onClick={onClose}
                className="p-1.5 rounded text-taupe hover:bg-cream hover:text-ink transition-colors"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>
            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
