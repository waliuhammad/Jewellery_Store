/**
 * Sidebar — full admin navigation sidebar.
 * Fixed-height, independent scroll for nav items.
 */
import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Gem,
  Tags,
  ShoppingBag,
  CreditCard,
  User,
  TicketPercent,
  Star,
  MessageSquare,
  FileText,
  Settings,
  Users,
  LogOut,
  ArrowLeft,
} from 'lucide-react';
import { useAdminAuth } from '../hooks/useAdminAuth';
import { usePermissions } from '../hooks/usePermissions';

// ─── NAV ITEMS ───────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { label: 'Overview',     icon: LayoutDashboard, to: '/admin',              area: 'overview',     exact: true },
  { label: 'Products',     icon: Gem,             to: '/admin/products',     area: 'products' },
  { label: 'Categories',   icon: Tags,            to: '/admin/categories',   area: 'categories' },
  { label: 'Orders',       icon: ShoppingBag,     to: '/admin/orders',       area: 'orders' },
  { label: 'Transactions', icon: CreditCard,      to: '/admin/transactions', area: 'transactions' },
  { label: 'Customers',    icon: User,            to: '/admin/customers',    area: 'customers' },
  { label: 'Coupons',      icon: TicketPercent,   to: '/admin/coupons',      area: 'coupons' },
  { label: 'Reviews',      icon: Star,            to: '/admin/reviews',      area: 'reviews' },
  { label: 'Messages',     icon: MessageSquare,   to: '/admin/messages',     area: 'messages', badge: true },
  { label: 'Site Content', icon: FileText,        to: '/admin/site-content', area: 'siteContent' },
  { label: 'Settings',     icon: Settings,        to: '/admin/settings',     area: 'settings' },
  { label: 'Team',         icon: Users,           to: '/admin/team',         area: 'team' },
];

// ─── USER AVATAR ─────────────────────────────────────────────────────────────
function AvatarCircle({ name }) {
  const initials = (name || 'A')
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
  return (
    <div
      className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 font-sans font-bold text-sm text-ink bg-champagne border border-hairline shadow-xs"
    >
      {initials}
    </div>
  );
}

// ─── ROLE BADGE ───────────────────────────────────────────────────────────────
function RoleBadge({ role }) {
  return (
    <span className="font-sans text-[10px] font-bold uppercase tracking-wider text-taupe bg-cream border border-hairline/60 rounded px-1.5 py-0.5 ml-1.5">
      {role}
    </span>
  );
}

// ─── NAV ITEM ────────────────────────────────────────────────────────────────
function SidebarNavItem({ item, unreadCount = 0, onNavigate }) {
  const { icon: Icon, label, to, exact, badge } = item;

  return (
    <NavLink
      to={to}
      end={exact}
      onClick={onNavigate}
      className={({ isActive }) =>
        [
          'relative flex items-center gap-3 px-4 py-2.5 mx-2 rounded-md text-sm font-sans font-semibold transition-colors duration-150 group select-none',
          isActive
            ? 'text-ink bg-[#F0DBD4] shadow-xs'
            : 'text-taupe hover:bg-cream hover:text-ink',
        ].join(' ')
      }
    >
      {({ isActive }) => (
        <>
          {/* Gold left border for active */}
          <AnimatePresence>
            {isActive && (
              <motion.span
                layoutId="sidebar-active-bar"
                className="absolute left-0 top-1 bottom-1 w-[3px] rounded-r-full bg-gold"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
          </AnimatePresence>

          <Icon size={17} className="flex-shrink-0" strokeWidth={isActive ? 2 : 1.75} />
          <span className="flex-1">{label}</span>

          {/* Unread badge for Messages */}
          {badge && unreadCount > 0 && (
            <span className="ml-auto flex h-5 min-w-[20px] items-center justify-center rounded-full bg-garnet text-ivory text-[10px] font-bold px-1.5">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </>
      )}
    </NavLink>
  );
}

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────
export default function Sidebar({ onNavigate, unreadMessages = 0 }) {
  const { admin, logout } = useAdminAuth();
  const { can } = usePermissions();
  const navigate = useNavigate();

  const handleSignOut = () => {
    logout();
    navigate('/admin/login', { replace: true });
  };

  const visibleItems = NAV_ITEMS.filter((item) => can(item.area));

  return (
    <div className="flex flex-col h-full bg-paper w-full">
      {/* ── TOP: Logo + Brand ─────────────────────────────── */}
      <div className="flex items-center gap-3 px-5 py-5 flex-shrink-0">
        {/* Logo tile */}
        <div
          className="w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: '#1C1917' /* ink */ }}
        >
          <span className="font-display text-ivory text-xl font-semibold leading-none select-none">
            M
          </span>
        </div>
        {/* Logo */}
        <img
          src="/logo.png"
          alt="Minha Jewellers"
          className="h-10 w-auto object-contain flex-shrink-0"
        />

        {/* Brand text */}
        <div>
          <div className="font-sans font-bold text-[13px] tracking-widest leading-tight">
            <span className="text-ink">MINHA </span>
            <span className="text-gold">JEWELLERS</span>
          </div>
          <div className="font-sans text-[11px] text-taupe tracking-wider mt-0.5">
            ADMIN PANEL • V1.0
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-4 border-t border-hairline mb-2" />

      {/* ── NAV ITEMS (scrollable) ─────────────────────────── */}
      <nav className="flex-1 overflow-y-auto py-1 space-y-0.5">
        {visibleItems.map((item) => (
          <SidebarNavItem
            key={item.to}
            item={item}
            unreadCount={item.badge ? unreadMessages : 0}
            onNavigate={onNavigate}
          />
        ))}
      </nav>

      {/* ── BOTTOM: User info + links ──────────────────────── */}
      <div className="flex-shrink-0 border-t border-hairline p-4 space-y-3">
        {/* User row */}
        <div className="flex items-center gap-3">
          <AvatarCircle name={admin?.name} />
          <div className="min-w-0 flex-1">
            <div className="font-sans font-bold text-sm text-ink truncate">
              {admin?.name ?? 'Admin'}
              <RoleBadge role={admin?.role ?? 'admin'} />
            </div>
            <div className="font-sans text-[11px] text-taupe truncate">
              {admin?.email}
            </div>
          </div>
        </div>

        {/* Back to store */}
        <Link
          to="/"
          className="flex items-center gap-1.5 text-[12px] font-sans text-taupe hover:text-ink transition-colors"
        >
          <ArrowLeft size={12} />
          Back to Store
        </Link>

        {/* Sign out */}
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 w-full text-[13px] font-sans font-medium text-garnet rounded-md px-2 py-1.5 hover:bg-[#F3D9D6] transition-colors"
        >
          <LogOut size={14} />
          Sign Out
        </button>
      </div>
    </div>
  );
}
