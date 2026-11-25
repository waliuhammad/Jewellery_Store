import { NextResponse } from 'next/server';
import { FieldValue } from 'firebase-admin/firestore';
import { withAuth } from '@/lib/http';
import { adminDb } from '@/lib/firebase/admin';
import { productSchema } from '@/lib/validations/product';
import { writeAudit } from '@/lib/audit';

export const dynamic = 'force-dynamic';

export const POST = withAuth(['manager', 'admin'], async (req, user) => {
  const parsed = productSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Validation failed', issues: parsed.error.flatten().fieldErrors }, { status: 422 });
  }
  const db = adminDb();
  const dup = await db.collection('products').where('slug', '==', parsed.data.slug).limit(1).get();
  if (!dup.empty) return NextResponse.json({ error: 'Slug already in use' }, { status: 409 });

  const ref = await db.collection('products').add({
    ...parsed.data,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });
  await writeAudit(user, 'product.create', `products/${ref.id}`, { slug: parsed.data.slug, status: parsed.data.status });
  return NextResponse.json({ id: ref.id }, { status: 201 });
});
