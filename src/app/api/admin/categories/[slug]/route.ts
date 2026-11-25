import { NextResponse } from 'next/server';
import { FieldValue } from 'firebase-admin/firestore';
import { withAuth } from '@/lib/http';
import { adminDb } from '@/lib/firebase/admin';
import { writeAudit } from '@/lib/audit';
import { categorySchema, knownCategorySlugs } from '@/lib/validations/admin';
import { siteConfig } from '@/config/site';

export const dynamic = 'force-dynamic';

export const PUT = withAuth(['manager', 'admin'], async (req, user, { params }) => {
  // Only the categories the store defines can be edited. Other slugs are not created.
  if (!knownCategorySlugs.includes(params.slug!)) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const parsed = categorySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Check the category details.' }, { status: 422 });

  const name = siteConfig.categories.find((c) => c.slug === params.slug!)?.name ?? params.slug!;
  await adminDb()
    .collection('categories')
    .doc(params.slug!)
    .set(
      { ...parsed.data, name, slug: params.slug!, updatedAt: FieldValue.serverTimestamp() },
      { merge: true },
    );
  await writeAudit(user, 'category.update', `categories/${params.slug!}`, {
    isActive: parsed.data.isActive,
    sortOrder: parsed.data.sortOrder,
  });
  return NextResponse.json({ ok: true });
});
