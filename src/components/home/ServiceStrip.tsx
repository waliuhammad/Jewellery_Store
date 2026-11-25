import Link from 'next/link';
import { MessageCircle, RotateCcw, Sparkles, Truck } from 'lucide-react';
import { siteConfig } from '@/config/site';

/**
 * Customer-service strip. By default it only points to the help pages (no claims). Confirmed
 * promises added to siteConfig.trustPoints replace these links.
 */
const links = [
  { title: 'Delivery Information', body: 'How and where we deliver', href: '/shipping-delivery', Icon: Truck },
  { title: 'Returns & Refunds', body: 'Our returns policy', href: '/returns-refunds', Icon: RotateCcw },
  { title: 'Jewellery Care', body: 'Keep every piece radiant', href: '/jewellery-care', Icon: Sparkles },
  { title: 'Customer Care', body: 'Questions? Get in touch', href: '/contact', Icon: MessageCircle },
];

export function ServiceStrip() {
  const { trustPoints } = siteConfig;

  return (
    <section aria-label="Customer service" className="border-t border-line bg-champagne/50">
      <ul className="mx-auto grid max-w-content grid-cols-2 px-4 sm:px-6 lg:grid-cols-4 lg:px-8">
        {trustPoints.length > 0
          ? trustPoints.map((t) => (
              <li key={t.title} className="px-4 py-10 text-center">
                <p className="font-heading text-xl text-espresso">{t.title}</p>
                <p className="mt-1 text-xs text-muted">{t.body}</p>
              </li>
            ))
          : links.map(({ title, body, href, Icon }, i) => (
              <li key={href} className={`${i % 2 === 1 ? 'border-l' : ''} ${i >= 2 ? 'border-t lg:border-t-0' : ''} border-line lg:border-l lg:first:border-l-0`}>
                <Link href={href} className="group flex flex-col items-center gap-3 px-4 py-10 text-center">
                  <Icon size={22} strokeWidth={1.2} aria-hidden className="text-antique transition-transform duration-500 ease-luxe group-hover:-translate-y-1" />
                  <span className="font-heading text-xl text-espresso">{title}</span>
                  <span className="text-xs text-muted">{body}</span>
                </Link>
              </li>
            ))}
      </ul>
    </section>
  );
}
