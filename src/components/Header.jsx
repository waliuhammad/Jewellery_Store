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

  // Track scroll position for background styling
  useMotionValueEvent(scrollY, 'change', (latest) => {
    setIsScrolled(latest > 60);
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
      <header className="fixed top-0 left-0 right-0 z-40">
        {/* Main Navigation Bar */}
        <div
          className={`transition-colors duration-400 border-b ${
            isTransparent
              ? 'bg-transparent text-ivory border-transparent'
              : 'bg-ivory/95 backdrop-blur-md text-ink border-hairline'
          }`}
        >
          <div className="max-w-page mx-auto px-6 lg:px-12 h-16 lg:h-20 flex items-center justify-between">
            {/* Left: Brand Wordmark */}
            <Link
              to="/"
              className={`font-display text-xl lg:text-2xl font-semibold uppercase tracking-wordmark transition-colors hover:opacity-85 ${
                isTransparent ? 'text-ivory' : 'text-ink'
              }`}
            >
              {BRAND.name}
            </Link>

            {/* Center/Right: Desktop Nav Links */}
            <nav className="hidden lg:flex items-center gap-10">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`relative text-xs uppercase tracking-label font-medium transition-colors py-2 group ${
                      isTransparent ? 'text-ivory/90 hover:text-ivory' : 'text-ink/85 hover:text-ink'
                    }`}
                  >
                    {link.name}
                    {/* Animated Gold Underline */}
                    <span
                      className={`absolute bottom-0 left-0 h-[1.5px] bg-gold transition-all duration-300 ease-luxe ${
                        isActive
                          ? 'w-full'
                          : 'w-0 group-hover:w-full'
                      }`}
                    />
                  </Link>
                );
              })}
            </nav>

            {/* Right: Actions & User Dropdown */}
            <div className="flex items-center gap-4 lg:gap-6">
              {/* Search Trigger */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className={`p-1.5 transition-colors ${
                  isTransparent ? 'text-ivory hover:text-champagne' : 'text-ink hover:text-gold'
                }`}
                aria-label="Open search dialog"
              >
                <Search className="w-5 h-5" strokeWidth={1.4} />
              </button>

              {/* Account / Login link */}
              <div className="relative hidden lg:block" ref={dropdownRef}>
                {isAuthenticated && user ? (
                  <button
                    onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                    className={`flex items-center gap-1.5 text-xs uppercase tracking-label font-medium py-1 transition-colors ${
                      isTransparent ? 'text-ivory hover:text-champagne' : 'text-ink hover:text-gold'
                    }`}
                  >
                    <span>{user?.name ? user.name.split(' ')[0] : 'Account'}</span>
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <Link
                    to="/login"
                    className={`relative text-xs uppercase tracking-label font-medium transition-colors py-2 group ${
                      isTransparent ? 'text-ivory hover:text-champagne' : 'text-ink hover:text-gold'
                    }`}
                  >
                    Login
                  </Link>
                )}

                {/* Logged in User Dropdown */}
                <AnimatePresence>
                  {isUserDropdownOpen && user && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-3 w-48 bg-ivory border border-hairline shadow-soft py-2 text-ink z-50 text-xs"
                    >
                      <div className="px-4 py-2 border-b border-hairline">
                        <p className="font-medium text-ink truncate">{user?.name || ''}</p>
                        <p className="text-[11px] text-taupe truncate">{user?.email || ''}</p>
                      </div>
                      <Link
                        to="/account?tab=orders"
                        onClick={() => setIsUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-cream transition-colors text-ink"
                      >
                        <Package className="w-3.5 h-3.5 text-taupe" strokeWidth={1.5} />
                        My Orders
                      </Link>
                      <Link
                        to="/account?tab=addresses"
                        onClick={() => setIsUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-cream transition-colors text-ink"
                      >
                        <MapPin className="w-3.5 h-3.5 text-taupe" strokeWidth={1.5} />
                        Saved Addresses
                      </Link>
                      <Link
                        to="/account?tab=profile"
                        onClick={() => setIsUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-cream transition-colors text-ink"
                      >
                        <User className="w-3.5 h-3.5 text-taupe" strokeWidth={1.5} />
                        Account Profile
                      </Link>
                      <button
                        onClick={() => {
                          setIsUserDropdownOpen(false);
                          logout();
                          navigate('/');
                        }}
                        className="w-full text-left flex items-center gap-2.5 px-4 py-2.5 border-t border-hairline text-garnet hover:bg-cream transition-colors"
                      >
                        <LogOut className="w-3.5 h-3.5 text-garnet" strokeWidth={1.5} />
                        Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Wishlist Link */}
              <Link
                to="/wishlist"
                className={`p-1.5 relative transition-colors ${
                  isTransparent ? 'text-ivory hover:text-champagne' : 'text-ink hover:text-rose'
                }`}
                aria-label={`View wishlist, ${wishlistCount} items`}
              >
                <Heart className="w-5 h-5" strokeWidth={1.4} />
                {wishlistCount > 0 && (
                  <motion.span
                    key={wishlistCount}
                    initial={{ scale: 0.6 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-4 h-4 bg-ink text-ivory text-[10px] font-sans font-medium rounded-full flex items-center justify-center border border-ivory"
                  >
                    {wishlistCount}
                  </motion.span>
                )}
              </Link>

              {/* Bag Trigger */}
              <button
                onClick={openCart}
                className={`p-1.5 relative transition-colors ${
                  isTransparent ? 'text-ivory hover:text-champagne' : 'text-ink hover:text-gold'
                }`}
                aria-label={`Open shopping bag, ${totalItemCount} items`}
              >
                <ShoppingBag className="w-5 h-5" strokeWidth={1.4} />
                {totalItemCount > 0 && (
                  <motion.span
                    key={totalItemCount}
                    initial={{ scale: 0.6 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-4 h-4 bg-ink text-ivory text-[10px] font-sans font-medium rounded-full flex items-center justify-center border border-ivory"
                  >
                    {totalItemCount}
                  </motion.span>
                )}
              </button>

              {/* Mobile Menu Hamburger */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className={`lg:hidden p-1.5 transition-colors ${
                  isTransparent ? 'text-ivory' : 'text-ink'
                }`}
                aria-label="Open navigation menu"
              >
                <Menu className="w-6 h-6" strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Slide-in Menu Panel */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute inset-0 bg-noir/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-y-0 right-0 w-full sm:w-[380px] bg-ivory flex flex-col justify-between p-8 border-l border-hairline shadow-soft z-10"
            >
              <div>
                {/* Close Button & Brand Header */}
                <div className="flex items-center justify-between pb-8 border-b border-hairline">
                  <span className="font-display text-lg tracking-wordmark font-semibold uppercase text-ink">
                    {BRAND.name}
                  </span>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 -mr-2 text-taupe hover:text-ink"
                    aria-label="Close navigation menu"
                  >
                    <X className="w-6 h-6" strokeWidth={1.5} />
                  </button>
                </div>

                {/* Staggered Serif Links */}
                <nav className="mt-8 flex flex-col gap-6">
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
                        className="font-display text-3xl text-ink hover:text-gold transition-colors block"
                      >
                        {link.name}
                      </Link>
                    </motion.div>
                  ))}

                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.38, duration: 0.4 }}
                    className="pt-4 border-t border-hairline"
                  >
                    {isAuthenticated && user ? (
                      <Link
                        to="/account"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="font-display text-2xl text-ink hover:text-gold transition-colors block"
                      >
                        My Account ({user?.name ? user.name.split(' ')[0] : 'Account'})
                      </Link>
                    ) : (
                      <Link
                        to="/login"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="font-display text-2xl text-ink hover:text-gold transition-colors block"
                      >
                        Login / Register
                      </Link>
                    )}
                  </motion.div>
                </nav>
              </div>

              {/* Bottom Contact Info */}
              <div className="pt-6 border-t border-hairline text-xs text-taupe space-y-2">
                <p className="text-ink font-medium">{BRAND.contact.displayPhone}</p>
                <p>{BRAND.contact.email}</p>
                <p>{BRAND.contact.address}</p>
                <div className="pt-2 flex gap-4 text-ink">
                  <a href={BRAND.social.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-gold">
                    Instagram
                  </a>
                  <a href={BRAND.social.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-gold">
                    Facebook
                  </a>
                  <a href={`https://wa.me/${BRAND.contact.whatsapp}`} target="_blank" rel="noopener noreferrer" className="hover:text-gold">
                    WhatsApp
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Global Search Dialog */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}

