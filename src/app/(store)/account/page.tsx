import type { Metadata } from 'next';
import Link from 'next/link';
import { getSessionUser } from '@/lib/auth/session';
import { getProfile } from '@/lib/account/profile';

export const metadata: Metadata = { title: 'My account' };
export const dynamic = 'force-dynamic';

export default async function AccountPage() {
  const user = await getSessionUser();
  const profile = user ? await getProfile(user.uid) : null;

  return (
    <div>
      <h1 className="font-heading text-4xl">
        {profile?.name ? `Hello, ${profile.name}` : 'My account'}
      </h1>
      <p className="mt-3 text-sm text-muted">{profile?.email}</p>

      <ul className="mt-10 grid gap-4 sm:grid-cols-2">
        {[
          { href: '/account/orders', title: 'Orders', body: 'Track and review your purchases.' },
          { href: '/account/addresses', title: 'Addresses', body: 'Save delivery addresses for faster checkout.' },
          { href: '/account/profile', title: 'Profile', body: 'Update your name and phone number.' },
          { href: '/wishlist', title: 'Wishlist', body: 'Pieces you have saved on this device.' },
        ].map((c) => (
          <li key={c.href}>
            <Link href={c.href} className="block rounded-card border border-rose-border bg-card p-6 hover:border-rose">
              <p className="font-heading text-2xl">{c.title}</p>
              <p className="mt-2 text-sm text-muted">{c.body}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
