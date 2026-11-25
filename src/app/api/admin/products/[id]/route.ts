import { NextResponse } from 'next/server';
import { FieldValue } from 'firebase-admin/firestore';
import { withAuth } from '@/lib/http';
import { adminDb } from '@/lib/firebase/admin';
import { productSchema } from '@/lib/validations/product';
import { writeAudit } from '@/lib/audit';

export const dynamic = 'force-dynamic';

const ID = /^[A-Za-z0-9_-]{1,128}$/;

export const PATCH = withAuth(['manager', 'admin'], async (req, user, { params }) => {
  if (!ID.test(params.id!)) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const parsed = productSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Validation failed', issues: parsed.error.flatten().fieldErrors }, { status: 422 });
  }

  const db = adminDb();
  const ref = db.collection('products').doc(params.id!);
  const existing = await ref.get();
  if (!existing.exists) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const sameSlug = await db.collection('products').where('slug', '==', parsed.data.slug).limit(2).get();
  if (sameSlug.docs.some((d) => d.id !== params.id!)) {
    return NextResponse.json({ error: 'Slug already in use' }, { status: 409 });
  }

  await ref.update({ ...parsed.data, updatedAt: FieldValue.serverTimestamp() });
  await writeAudit(user, 'product.update', `products/${params.id!}`, { status: parsed.data.status });
  return NextResponse.json({ ok: true });
});

/** Hard delete is admin-only. Managers archive products instead. */
export const DELETE = withAuth(['admin'], async (_req, user, { params }) => {
  if (!ID.test(params.id!)) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  await adminDb().collection('products').doc(params.id!).delete();
  await writeAudit(user, 'product.delete', `products/${params.id!}`);
  return NextResponse.json({ ok: true });
});
