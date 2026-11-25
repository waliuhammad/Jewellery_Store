'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { siteConfig } from '@/config/site';
import { Logo } from './Logo';

const EASE = [0.22, 1, 0.36, 1] as const;

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  const links = [...siteConfig.nav.left.filter((n) => !('mega' in n)), ...siteConfig.nav.right];
  const close = () => setOpen(false);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label="Open menu"
        onClick={() => setOpen(true)}
        className="-ml-2 p-2 text-espresso"
      >
        <Menu size={22} strokeWidth={1.5} aria-hidden />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="scrim"
              aria-hidden
              onClick={close}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-espresso/40"
            />
            <motion.nav
              key="drawer"
              id="mobile-menu"
              aria-label="Mobile"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.45, ease: EASE }}
              className="fixed inset-y-0 left-0 z-50 flex w-[86%] max-w-sm flex-col overflow-y-auto bg-ivory"
            >
              <div className="flex items-center justify-between border-b border-line px-6 py-5">
                <Logo />
                <button type="button" onClick={close} aria-label="Close menu" className="-mr-2 p-2 text-espresso">
                  <X size={22} strokeWidth={1.5} aria-hidden />
                </button>
              </div>

              <div className="flex-1 px-6 py-8">
                <p className="eyebrow">Jewellery</p>
                <ul className="mt-4 space-y-3">
                  {siteConfig.categories.map((c) => (
                    <li key={c.slug}>
                      <Link href={`/categories/${c.slug}`} onClick={close} className="font-heading text-[1.7rem] leading-tight text-espresso">
                        {c.name}
                      </Link>
                    </li>
                  ))}
                </ul>

                <div className="hairline my-8" />

                <ul className="space-y-4 text-sm font-medium tracking-wide">
                  {links.map((item) => (
                    <li key={item.label}>
                      <Link href={item.href} onClick={close} className="text-espresso">
                        {item.label}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link href="/wishlist" onClick={close} className="text-espresso">Wishlist</Link>
                  </li>
                  <li>
                    <Link href="/account" onClick={close} className="text-espresso">My Account</Link>
                  </li>
                </ul>
              </div>

              <p className="border-t border-line px-6 py-5 font-heading text-sm italic text-muted">{siteConfig.tagline}</p>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
