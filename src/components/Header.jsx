import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { Search, Heart, ShoppingBag, Menu, X, User, ChevronDown, LogOut, Package, MapPin } from 'lucide-react';
import { BRAND } from '../config/brand';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import SearchModal from './SearchModal';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const { totalItemCount, openCart } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, isAuthenticated, logout } = useAuth();

  const isHomePage = location.pathname === '/';
  const { scrollY } = useScroll();

  // Scroll direction detection per Design.md Section 6.3
  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    // Keep header visible if mobile menu or search is open
    if (isMobileMenuOpen || isSearchOpen) {
      setIsHidden(false);
    } else {
      setIsHidden(y > prev && y > 140);
    }
    setIsScrolled(y > 80);
  });

  // Close menus on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsUserDropdownOpen(false);
  }, [location.pathname]);

  // Click outside listener for user dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Determine if transparent on top of hero
  const isTransparent = isHomePage && !isScrolled;

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-transform duration-400 ease-luxe ${
          isHidden ? '-translate-y-full' : 'translate-y-0'
        }`}
      >
        {/* Main Navigation Bar */}
        <div
          className={`transition-colors duration-400 border-b ${
            isTransparent
              ? 'bg-transparent text-ivory border-transparent'
              : 'bg-ivory/95 backdrop-blur-md text-ink border-hairline'
          }`}
        >
          <div className="max-w-page mx-auto px-6 lg:px-12 h-16 lg:h-20 flex items-center justify-between">
            {/* Left: Brand Logo (44px desktop, 36px mobile per Design.md Section 2.7) */}
            <Link
              to="/"
              className="flex items-center transition-opacity hover:opacity-90 py-1"
              aria-label={BRAND.name}
            >
              <img
                src={isTransparent ? BRAND.logoWhite : BRAND.logo}
                alt={BRAND.name}
                className="h-[36px] lg:h-[44px] w-auto object-contain"
              />
            </Link>

            {/* Center: Desktop Nav Links (Montserrat 500, 13px, uppercase, tracking-label, 40px gap) */}
            <nav className="hidden lg:flex items-center gap-10">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`relative text-xs uppercase tracking-label font-medium transition-colors py-2 group ${
                      isTransparent
                        ? 'text-ivory/90 hover:text-ivory'
                        : isActive
                        ? 'text-forest'
                        : 'text-ink/85 hover:text-ink'
                    }`}
                  >
                    {link.name}
                    {/* Animated 1px Gold Underline */}
                    <span
                      className={`absolute bottom-0 left-0 h-[1.5px] bg-gold transition-all duration-300 ease-luxe ${
                        isActive ? 'w-full' : 'w-0 group-hover:w-full'
                      }`}
                    />
                  </Link>
                );
              })}
            </nav>

            {/* Right: Actions (Search, Account, Wishlist, Bag, Mobile Toggle) */}
            <div className="flex items-center gap-4 sm:gap-6">
              {/* Search Trigger */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className={`p-1.5 transition-colors hover:opacity-75 ${
                  isTransparent ? 'text-ivory' : 'text-ink'
                }`}
                aria-label="Search collection"
              >
                <Search className="w-5 h-5" strokeWidth={1.4} />
              </button>

              {/* Account / Login Trigger */}
              {isAuthenticated && user ? (
                <div className="relative hidden sm:block" ref={dropdownRef}>
                  <button
                    onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                    className={`flex items-center gap-1.5 text-xs uppercase tracking-label font-medium py-1 transition-colors hover:opacity-80 ${
                      isTransparent ? 'text-ivory' : 'text-forest'
                    }`}
                    aria-label="User account menu"
                  >
                    <span>{user?.name?.split(' ')[0] || 'Account'}</span>
                    <ChevronDown className="w-3.5 h-3.5 opacity-70" />
                  </button>

                  <AnimatePresence>
                    {isUserDropdownOpen && user && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-3 w-52 bg-ivory text-ink shadow-soft border border-hairline py-2 z-50"
                      >
                        <div className="px-4 py-2 border-b border-hairline/60">
                          <p className="text-xs font-medium text-forest truncate">{user?.name || 'Client'}</p>
                          <p className="text-[11px] text-moss truncate">{user?.email}</p>
                        </div>

                        <Link
                          to="/account"
                          onClick={() => setIsUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-xs uppercase tracking-label hover:bg-cream transition-colors text-ink"
                        >
                          <Package className="w-4 h-4 text-moss" />
                          <span>My Orders</span>
                        </Link>
                        <Link
                          to="/account?tab=profile"
                          onClick={() => setIsUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-xs uppercase tracking-label hover:bg-cream transition-colors text-ink"
                        >
                          <User className="w-4 h-4 text-moss" />
                          <span>Profile &amp; Addresses</span>
                        </Link>
                        <button
                          onClick={() => {
                            setIsUserDropdownOpen(false);
                            logout();
                          }}
                          className="w-full text-left flex items-center gap-2.5 px-4 py-2.5 text-xs uppercase tracking-label text-maroon hover:bg-cream transition-colors border-t border-hairline/60 mt-1"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  to="/login"
                  className={`hidden sm:inline-block text-xs uppercase tracking-label font-medium transition-colors hover:opacity-80 ${
                    isTransparent ? 'text-ivory' : 'text-forest'
                  }`}
                >
                  Sign In
                </Link>
              )}

              {/* Wishlist Link */}
              <Link
                to="/wishlist"
                className={`relative p-1.5 transition-colors hover:opacity-75 ${
                  isTransparent ? 'text-ivory' : 'text-ink'
                }`}
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5" strokeWidth={1.4} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-maroon text-ivory text-[10px] flex items-center justify-center font-medium">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart Drawer Trigger */}
              <button
                onClick={openCart}
                className={`relative p-1.5 transition-colors hover:opacity-75 ${
                  isTransparent ? 'text-ivory' : 'text-ink'
                }`}
                aria-label={`Shopping bag, ${totalItemCount} items`}
              >
                <ShoppingBag className="w-5 h-5" strokeWidth={1.4} />
                {totalItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-forest text-ivory text-[10px] flex items-center justify-center font-medium">
                    {totalItemCount}
                  </span>
                )}
              </button>

              {/* Mobile Hamburger Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className={`lg:hidden p-1.5 transition-colors ${
                  isTransparent ? 'text-ivory' : 'text-ink'
                }`}
                aria-label="Open mobile menu"
              >
                <Menu className="w-6 h-6" strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Slide-In Navigation Panel (Design.md Section 4.1) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute inset-0 bg-deep/50 backdrop-blur-sm"
            />

            {/* Slide-out Menu Panel in Pearl Ivory */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-y-0 right-0 w-[85%] max-w-sm bg-ivory text-ink flex flex-col justify-between p-8 shadow-soft border-l border-hairline z-10"
            >
              <div>
                {/* Header Row */}
                <div className="flex items-center justify-between pb-6 border-b border-hairline">
                  <Link
                    to="/"
                    onClick={() => setIsMobileMenuOpen(false)}
                    aria-label={BRAND.name}
                  >
                    <img
                      src={BRAND.logo}
                      alt={BRAND.name}
                      className="h-[36px] w-auto object-contain"
                    />
                  </Link>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 -mr-2 text-ink hover:text-forest transition-colors"
                    aria-label="Close menu"
                  >
                    <X className="w-6 h-6" strokeWidth={1.5} />
                  </button>
                </div>

                {/* Staggered Navigation Links */}
                <nav className="flex flex-col gap-6 pt-10">
                  {navLinks.map((link, idx) => (
                    <motion.div
                      key={link.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + idx * 0.07, duration: 0.4 }}
                    >
                      <Link
                        to={link.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`font-display text-3xl transition-colors block ${
                          location.pathname === link.path ? 'text-forest font-semibold' : 'text-ink hover:text-forest'
                        }`}
                      >
                        {link.name}
                      </Link>
                    </motion.div>
                  ))}

                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4, duration: 0.4 }}
                    className="pt-4 border-t border-hairline"
                  >
                    {isAuthenticated ? (
                      <Link
                        to="/account"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="font-display text-2xl text-forest hover:text-emerald transition-colors block"
                      >
                        My Account ({user?.name?.split(' ')[0]})
                      </Link>
                    ) : (
                      <Link
                        to="/login"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="font-display text-2xl text-forest hover:text-emerald transition-colors block"
                      >
                        Client Sign In
                      </Link>
                    )}
                  </motion.div>
                </nav>
              </div>

              {/* Bottom Concierge Details */}
              <div className="pt-8 border-t border-hairline space-y-3 text-xs text-moss font-sans">
                <p className="flex items-center gap-2">
                  <span className="text-forest">Concierge:</span> {BRAND.contact.displayPhone}
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-forest">Studio:</span> Lahore, Pakistan
                </p>
                <p className="text-[11px] text-moss/80 pt-2">
                  Complimentary delivery across Pakistan on orders above PKR {BRAND.shipping.freeThreshold.toLocaleString()}
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Global Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
