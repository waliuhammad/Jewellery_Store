import Link from 'next/link';
import { LogoutButton } from '@/components/auth/LogoutButton';

const links = [
  { href: '/account', label: 'Overview' },
  { href: '/account/orders', label: 'Orders' },
  { href: '/account/addresses', label: 'Addresses' },
  { href: '/account/profile', label: 'Profile' },
  { href: '/wishlist', label: 'Wishlist' },
];

export function AccountNav() {
  return (
    <nav aria-label="Account" className="flex flex-col gap-1 text-sm">
      <ul className="flex flex-wrap gap-x-6 gap-y-2 md:flex-col md:gap-1">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="block py-2 text-ink hover:text-rose">{l.label}</Link>
          </li>
        ))}
      </ul>
      <div className="mt-4 border-t border-rose-border pt-4">
        <LogoutButton />
      </div>
    </nav>
  );
}
