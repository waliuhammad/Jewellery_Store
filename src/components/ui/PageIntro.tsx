import Link from 'next/link';
import type { ReactNode } from 'react';
import { Reveal } from './Reveal';

export type Crumb = { label: string; href?: string };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-muted">
        {items.map((c, i) => (
          <li key={c.label} className="flex items-center gap-2">
            {i > 0 && <span aria-hidden className="text-antique">/</span>}
            {c.href ? (
              <Link href={c.href} className="link-draw hover:text-espresso">
                {c.label}
              </Link>
            ) : (
              <span aria-current="page" className="text-espresso">
                {c.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/**
 * Standard page opening: breadcrumbs, eyebrow, editorial title and a short lead.
 * `aside` sits to the right on desktop (counts, actions).
 */
export function PageIntro({
  title,
  accent,
  eyebrow,
  lead,
  crumbs,
  aside,
  align = 'left',
}: {
  title: string;
  accent?: string;
  eyebrow?: string;
  lead?: ReactNode;
  crumbs?: Crumb[];
  aside?: ReactNode;
  align?: 'left' | 'center';
}) {
  const centered = align === 'center';
  return (
    <header className="border-b border-line bg-[linear-gradient(180deg,#efe6da_0%,#f6f0e8_100%)]">
      <div className="mx-auto max-w-content px-4 pb-12 pt-8 sm:px-6 lg:px-8 lg:pb-16">
        {crumbs && <Breadcrumbs items={[{ label: 'Home', href: '/' }, ...crumbs]} />}
        <Reveal className={`mt-10 flex flex-col gap-6 lg:mt-14 ${centered ? 'items-center text-center' : 'lg:flex-row lg:items-end lg:justify-between'}`}>
          <div className={centered ? 'max-w-2xl' : 'max-w-3xl'}>
            {eyebrow && <p className="eyebrow">{eyebrow}</p>}
            <h1 className="text-h1 mt-3 text-espresso lg:text-6xl">
              {title}
              {accent && <> <span className="accent">{accent}</span></>}
            </h1>
            {lead && <div className="text-lead mt-5 max-w-xl">{lead}</div>}
          </div>
          {aside && <div className="shrink-0">{aside}</div>}
        </Reveal>
      </div>
    </header>
  );
}
