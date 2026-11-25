import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth/session';
import { LogoutButton } from '@/components/auth/LogoutButton';

export const dynamic = 'force-dynamic';

const links = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/orders', label: 'Orders' },
  { href: '/admin/products', label: 'Products' },
  { href: '/admin/inventory', label: 'Inventory' },
  { href: '/admin/categories', label: 'Categories' },
  { href: '/admin/collections', label: 'Collections' },
  { href: '/admin/content', label: 'Brand content' },
  { href: '/admin/enquiries', label: 'Enquiries' },
];

/** Server-side gate. Every admin API route also checks the role independently. */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();
  if (!user) redirect('/login?next=/admin');
  if (user.role === 'customer') redirect('/');

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="flex w-56 shrink-0 flex-col bg-espresso p-6 text-white">
        <p className="font-heading text-xl">Admin</p>
        <nav aria-label="Admin" className="mt-8 space-y-1 text-sm">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="block rounded-button px-3 py-2 hover:bg-white/10">
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto space-y-3">
          <p className="text-xs text-white/60">Signed in as {user.role}</p>
          <LogoutButton className="text-white/80 hover:text-white" />
        </div>
      </aside>
      <div className="flex-1 overflow-x-auto p-8">{children}</div>
    </div>
  );
}
