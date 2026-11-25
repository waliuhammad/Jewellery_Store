import Link from 'next/link';
import { adminDb, isAdminConfigured } from '@/lib/firebase/admin';
import { ButtonLink } from '@/components/ui/Button';
import { EmptyState } from '@/components/products/EmptyState';

export const dynamic = 'force-dynamic';

export default async function CollectionsPage() {
  if (!isAdminConfigured()) {
    return <EmptyState title="Database not connected" body="Set the Firebase Admin environment variables first." />;
  }
  const snap = await adminDb().collection('collections').limit(200).get();
  const collections = snap.docs
    .map((d) => ({
      id: d.id,
      name: String(d.data().name ?? ''),
      slug: String(d.data().slug ?? ''),
      isActive: d.data().isActive === true,
      count: Array.isArray(d.data().productIds) ? d.data().productIds.length : 0,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-heading text-4xl">Collections</h1>
        <ButtonLink href="/admin/collections/new">New collection</ButtonLink>
      </div>

      {collections.length === 0 ? (
        <div className="mt-8"><EmptyState title="No collections yet" body="Group pieces into collections, such as a bridal edit or a seasonal range." /></div>
      ) : (
        <ul className="mt-8 divide-y divide-rose-border rounded-card border border-rose-border bg-card">
          {collections.map((c) => (
            <li key={c.id} className="flex flex-wrap items-center justify-between gap-4 px-6 py-4">
              <div>
                <p className="font-medium">{c.name}</p>
                <p className="text-xs text-muted">/{c.slug} · {c.count} {c.count === 1 ? 'piece' : 'pieces'} · {c.isActive ? 'visible' : 'hidden'}</p>
              </div>
              <Link href={`/admin/collections/${c.id}`} className="text-sm underline-offset-4 hover:underline">Edit</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
