import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Reveal } from './Reveal';

/**
 * Eyebrow + editorial heading, with an optional "view all" link.
 * `accent` is appended to the title in italic gold.
 */
export function SectionHeading({
  id,
  eyebrow,
  title,
  accent,
  action,
  align = 'left',
}: {
  id?: string;
  eyebrow?: string;
  title: string;
  accent?: string;
  action?: { label: string; href: string };
  align?: 'left' | 'center';
}) {
  const centered = align === 'center';
  return (
    <Reveal
      as="header"
      className={`mb-10 flex flex-col gap-5 md:mb-14 ${centered ? 'items-center text-center' : 'md:flex-row md:items-end md:justify-between'}`}
    >
      <div>
        {eyebrow && (
          <p className={`eyebrow flex items-center gap-4 ${centered ? 'justify-center' : ''}`}>
            {centered && <span aria-hidden className="h-px w-10 bg-antique/60" />}
            {eyebrow}
            <span aria-hidden className="h-px w-10 bg-antique/60" />
          </p>
        )}
        <h2 id={id} className="text-h2 mt-3">
          {title}
          {accent && <> <span className="accent">{accent}</span></>}
        </h2>
      </div>
      {action && (
        <Link href={action.href} className="group inline-flex shrink-0 items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-espresso">
          <span className="link-draw">{action.label}</span>
          <ArrowRight size={14} aria-hidden className="transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      )}
    </Reveal>
  );
}
