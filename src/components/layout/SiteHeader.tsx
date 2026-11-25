'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence } from 'framer-motion';
import { ChevronDown, Heart, Search, User } from 'lucide-react';
import { siteConfig } from '@/config/site';
import { AnnouncementBar } from './AnnouncementBar';
import { Logo } from './Logo';
import { MegaMenu } from './MegaMenu';
import { MobileNav } from './MobileNav';
import { CartLink } from '@/components/cart/CartLink';

const iconClass = 'p-2 text-espresso transition-colors hover:text-gold-deep';
const navLink = 'link-draw py-1 text-[13px] font-medium tracking-[0.04em] text-espresso';

type NavItem = { label: string; href: string; mega?: boolean };

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the mega-menu on navigation and on Escape.
  useEffect(() => setMegaOpen(false), [pathname]);
  useEffect(() => {
    if (!megaOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMegaOpen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [megaOpen]);

  const openMega = () => {
    clearTimeout(closeTimer.current);
    setMegaOpen(true);
  };
  const closeMegaSoon = () => {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setMegaOpen(false), 150);
  };

  const isActive = (href: string) => {
    const path = href.split('?')[0] ?? href;
    return path !== '/shop' && pathname.startsWith(path);
  };

  const renderItem = (item: NavItem) =>
    item.mega ? (
      <li key={item.label} onMouseEnter={openMega} onMouseLeave={closeMegaSoon}>
        <button
          type="button"
          aria-expanded={megaOpen}
          aria-controls="mega-jewellery"
          onClick={() => setMegaOpen((v) => !v)}
          className={`${navLink} inline-flex items-center gap-1`}
        >
          {item.label}
          <ChevronDown size={14} aria-hidden className={`transition-transform duration-300 ${megaOpen ? 'rotate-180' : ''}`} />
        </button>
      </li>
    ) : (
      <li key={item.label}>
        <Link href={item.href} aria-current={isActive(item.href) ? 'page' : undefined} className={navLink}>
          {item.label}
        </Link>
      </li>
    );

  return (
    <>
      <AnnouncementBar />
      <header
        className={`sticky top-0 z-30 border-b bg-ivory/95 backdrop-blur-sm transition-[box-shadow,border-color] duration-500 ${
          scrolled || megaOpen ? 'border-line shadow-soft' : 'border-transparent'
        }`}
        onMouseLeave={closeMegaSoon}
      >
        <div
          className={`mx-auto grid max-w-content grid-cols-[1fr_auto_1fr] items-center gap-4 px-4 transition-[height] duration-500 ease-luxe sm:px-6 lg:px-8 ${
            scrolled ? 'h-16' : 'h-20 lg:h-24'
          }`}
        >
          <div className="flex items-center">
            <MobileNav />
            <nav aria-label="Primary" className="hidden lg:block">
              <ul className="flex items-center gap-5 xl:gap-8">{(siteConfig.nav.left as NavItem[]).map(renderItem)}</ul>
            </nav>
          </div>

          <Logo />

          <div className="flex items-center justify-end gap-4 xl:gap-6">
            <nav aria-label="Secondary" className="hidden lg:block">
              <ul className="flex items-center gap-5 xl:gap-8">{(siteConfig.nav.right as NavItem[]).map(renderItem)}</ul>
            </nav>
            <div className="flex items-center">
              <Link href="/search" aria-label="Search" className={iconClass}>
                <Search size={19} strokeWidth={1.5} aria-hidden />
              </Link>
              <Link href="/account" aria-label="Account" className={`${iconClass} hidden sm:inline-flex`}>
                <User size={19} strokeWidth={1.5} aria-hidden />
              </Link>
              <Link href="/wishlist" aria-label="Wishlist" className={`${iconClass} hidden sm:inline-flex`}>
                <Heart size={19} strokeWidth={1.5} aria-hidden />
              </Link>
              <CartLink />
            </div>
          </div>
        </div>

        <div className="hidden lg:block" onMouseEnter={openMega}>
          <AnimatePresence>{megaOpen && <MegaMenu id="mega-jewellery" onNavigate={() => setMegaOpen(false)} />}</AnimatePresence>
        </div>
      </header>
    </>
  );
}
