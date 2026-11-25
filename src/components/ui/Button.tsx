import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'outline' | 'light' | 'ghost';
type Size = 'md' | 'sm';

const base =
  'group/btn inline-flex items-center justify-center gap-2.5 rounded-button font-semibold uppercase tracking-[0.18em] transition-[background-color,color,border-color,transform] duration-300 ease-luxe active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50';

const sizes: Record<Size, string> = {
  md: 'px-7 py-3.5 text-[11px]',
  sm: 'px-5 py-2.5 text-[10px]',
};

const variants: Record<Variant, string> = {
  primary: 'bg-espresso text-ivory hover:bg-[#3a2c24]',
  // `secondary` kept for existing pages; same look as outline
  secondary: 'border border-espresso/80 text-espresso hover:bg-espresso hover:text-ivory',
  outline: 'border border-espresso/80 text-espresso hover:bg-espresso hover:text-ivory',
  light: 'border border-ivory/80 text-ivory hover:bg-ivory hover:text-espresso',
  ghost: 'px-0 py-1 text-espresso link-draw',
};

function Arrow() {
  return <ArrowRight size={14} aria-hidden className="transition-transform duration-300 ease-luxe group-hover/btn:translate-x-1" />;
}

type Common = { variant?: Variant; size?: Size; arrow?: boolean; className?: string; children: ReactNode };

function classes(variant: Variant, size: Size, className: string) {
  return `${base} ${variant === 'ghost' ? '' : sizes[size]} ${variants[variant]} ${className}`;
}

export function Button({
  variant = 'primary',
  size = 'md',
  arrow = false,
  className = '',
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & Common) {
  return (
    <button className={classes(variant, size, className)} {...props}>
      {children}
      {arrow && <Arrow />}
    </button>
  );
}

export function ButtonLink({ href, variant = 'primary', size = 'md', arrow = false, className = '', children }: Common & { href: string }) {
  return (
    <Link href={href} className={classes(variant, size, className)}>
      {children}
      {arrow && <Arrow />}
    </Link>
  );
}
