import { notFound } from 'next/navigation';
import { adminDb } from '@/lib/firebase/admin';
import { siteConfig } from '@/config/site';
import { CategoryForm } from '@/components/admin/CategoryForm';

export const dynamic = 'force-dynamic';

export default async function EditCategoryPage({ params }: { params: { slug: string } }) {
  const known = siteConfig.categories.find((c) => c.slug === params.slug);
  if (!known) notFound();

  const snap = await adminDb().collection('categories').doc(params.slug).get();
  const d = snap.data() ?? {};

  return (
    <div>
      <h1 className="font-heading text-4xl">{known.name}</h1>
      <p className="mt-2 text-sm text-muted">/{known.slug}</p>
      <div className="mt-8">
        <CategoryForm
          slug={known.slug}
          initial={{
            description: String(d.description ?? ''),
            sortOrder: Number(d.sortOrder ?? 0),
            isActive: d.isActive !== false,
          }}
        />
      </div>
    </div>
  );
}
