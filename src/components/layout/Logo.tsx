import Link from 'next/link';
import { siteConfig } from '@/config/site';

/** Faceted diamond mark drawn as a single-weight line icon. */
export function DiamondMark({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 24" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" aria-hidden className={className}>
      <path d="M8 1h16l7 7.5L16 23 1 8.5z" />
      <path d="M1 8.5h30M8 1l3.5 7.5L16 23l4.5-14.5L24 1M11.5 8.5 16 1l4.5 7.5" />
    </svg>
  );
}

/** Jewelora wordmark. `tagline` adds the brand line beneath it. */
export function Logo({ tagline = false, tone = 'dark' }: { tagline?: boolean; tone?: 'dark' | 'light' }) {
  const color = tone === 'light' ? 'text-ivory' : 'text-espresso';
  return (
    <Link href="/" aria-label={`${siteConfig.brandName} home`} className={`inline-flex flex-col items-center ${color}`}>
      <DiamondMark className="mb-1 h-3.5 w-5 text-antique" />
      <span className="font-heading text-[1.65rem] font-medium leading-none tracking-[0.32em] [margin-right:-0.32em]">
        {siteConfig.brandName.toUpperCase()}
      </span>
      {tagline && (
        <span className={`mt-1.5 font-heading text-[11px] italic tracking-wide ${tone === 'light' ? 'text-ivory/70' : 'text-muted'}`}>
          {siteConfig.tagline}
        </span>
      )}
    </Link>
  );
}
