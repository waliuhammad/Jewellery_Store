import Link from 'next/link';
import { adminDb, isAdminConfigured } from '@/lib/firebase/admin';
import { siteConfig } from '@/config/site';
import { EmptyState } from '@/components/products/EmptyState';

export const dynamic = 'force-dynamic';

export default async function CategoriesPage() {
  if (!isAdminConfigured()) {
    return <EmptyState title="Database not connected" body="Set the Firebase Admin environment variables first." />;
  }
  const snap = await adminDb().collection('categories').get();
  const saved = new Map(snap.docs.map((d) => [d.id, d.data()]));

  return (
    <div>
      <h1 className="font-heading text-4xl">Categories</h1>
      <p className="mt-3 text-sm text-muted">
        Category names are set in the store configuration. Here you can edit each category&apos;s description and display order.
      </p>
      <ul className="mt-8 divide-y divide-rose-border rounded-card border border-rose-border bg-card">
        {siteConfig.categories.map((c) => {
          const d = saved.get(c.slug);
          return (
            <li key={c.slug} className="flex flex-wrap items-center justify-between gap-4 px-6 py-4">
              <div>
                <p className="font-medium">{c.name}</p>
                <p className="text-xs text-muted">
                  /{c.slug} · order {d?.sortOrder ?? 0} · {d?.isActive === false ? 'hidden' : 'shown'}
                </p>
              </div>
              <Link href={`/admin/categories/${c.slug}`} className="text-sm underline-offset-4 hover:underline">Edit</Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
