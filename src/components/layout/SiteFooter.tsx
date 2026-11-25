import Link from 'next/link';
import { Facebook, Instagram } from 'lucide-react';
import { siteConfig } from '@/config/site';
import { Logo } from './Logo';
import { FooterNewsletter } from './FooterNewsletter';

const columns = [
  {
    title: 'Discover',
    links: [
      { label: 'New Arrivals', href: '/shop?sort=newest' },
      { label: 'Shop All', href: '/shop' },
      { label: 'Collections', href: '/collections' },
      ...siteConfig.categories.slice(0, 4).map((c) => ({ label: c.name, href: `/categories/${c.slug}` })),
      { label: 'Personalized', href: '/personalized' },
      { label: 'Gifts', href: '/gifts' },
    ],
  },
  {
    title: 'Customer Care',
    links: [
      { label: 'Contact Us', href: '/contact' },
      { label: 'FAQs', href: '/faq' },
      { label: 'Jewellery Care', href: '/jewellery-care' },
      { label: 'My Account', href: '/account' },
      { label: 'Order History', href: '/account/orders' },
      { label: 'Wishlist', href: '/wishlist' },
    ],
  },
  {
    title: 'About Jewelora',
    links: [
      { label: 'Our Story', href: '/about' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    title: 'Policies',
    links: [
      { label: 'Shipping & Delivery', href: '/shipping-delivery' },
      { label: 'Returns & Refunds', href: '/returns-refunds' },
      { label: 'Privacy Policy', href: '/privacy-policy' },
      { label: 'Terms & Conditions', href: '/terms-conditions' },
    ],
  },
];

export function SiteFooter() {
  const { social } = siteConfig;
  const socials = [
    { label: 'Instagram', href: social.instagram, Icon: Instagram },
    { label: 'Facebook', href: social.facebook, Icon: Facebook },
  ].filter((s) => s.href);

  return (
    <footer className="bg-espresso text-ivory">
      <div className="mx-auto max-w-content px-4 pb-10 pt-16 sm:px-6 lg:px-8 lg:pt-20">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Logo tone="light" tagline />
            <div className="mt-10 max-w-sm">
              <p className="font-heading text-2xl">Stay close to beauty.</p>
              <p className="mt-2 text-sm text-ivory/70">New pieces and collection stories, now and then.</p>
              <FooterNewsletter />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-4 lg:col-span-8 lg:pl-10">
            {columns.map((col) => (
              <nav key={col.title} aria-label={col.title}>
                <h2 className="font-body text-[11px] font-semibold uppercase tracking-[0.22em] text-gold">{col.title}</h2>
                <ul className="mt-5 space-y-3 text-sm text-ivory/75">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <Link href={l.href} className="link-draw hover:text-ivory">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-ivory/15 pt-8 text-xs text-ivory/60 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {siteConfig.brandName}. All rights reserved. Prices in {siteConfig.currency}.
          </p>
          {socials.length > 0 && (
            <ul className="flex gap-4">
              {socials.map(({ label, href, Icon }) => (
                <li key={label}>
                  <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="hover:text-ivory">
                    <Icon size={18} strokeWidth={1.5} aria-hidden />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </footer>
  );
}
