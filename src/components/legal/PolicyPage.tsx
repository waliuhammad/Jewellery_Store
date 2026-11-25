import Link from 'next/link';
import type { ReactNode } from 'react';
import { PageIntro } from '@/components/ui/PageIntro';

const policies = [
  { label: 'Shipping & Delivery', href: '/shipping-delivery' },
  { label: 'Returns & Refunds', href: '/returns-refunds' },
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Terms & Conditions', href: '/terms-conditions' },
];

/** Shared layout for policy pages: page intro, a policy index beside the text, consistent prose. */
export function PolicyPage({ title, updated, children }: { title: string; updated?: string; children: ReactNode }) {
  return (
    <>
      <PageIntro crumbs={[{ label: title }]} eyebrow="Policies" title={title} lead={updated ? `Last updated: ${updated}` : undefined} />
      <div className="mx-auto grid max-w-content gap-12 px-4 py-16 sm:px-6 lg:grid-cols-12 lg:px-8 lg:py-20">
        <nav aria-label="Policies" className="lg:sticky lg:top-32 lg:col-span-3 lg:self-start">
          <ul className="flex flex-wrap gap-x-6 gap-y-3 lg:flex-col">
            {policies.map((p) => (
              <li key={p.href}>
                <Link href={p.href} className="link-draw text-[11px] font-semibold uppercase tracking-[0.18em] text-espresso">
                  {p.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <article className="max-w-2xl space-y-6 leading-relaxed text-ink lg:col-span-8 lg:col-start-5 [&_h2]:mt-12 [&_h2]:border-t [&_h2]:border-line [&_h2]:pt-8 [&_h2]:font-heading [&_h2]:text-3xl [&_h2:first-child]:mt-0 [&_p]:text-muted">
          {children}
        </article>
      </div>
    </>
  );
}
