import { NextResponse } from 'next/server';
import { FieldValue } from 'firebase-admin/firestore';
import { withAuth } from '@/lib/http';
import { adminDb } from '@/lib/firebase/admin';
import { writeAudit } from '@/lib/audit';
import { collectionSchema } from '@/lib/validations/admin';

export const dynamic = 'force-dynamic';

const ID = /^[A-Za-z0-9_-]{1,128}$/;

export const PATCH = withAuth(['manager', 'admin'], async (req, user, { params }) => {
  if (!ID.test(params.id!)) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const parsed = collectionSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Check the collection details.', issues: parsed.error.flatten().fieldErrors }, { status: 422 });
  }
  const db = adminDb();
  const ref = db.collection('collections').doc(params.id!);
  if (!(await ref.get()).exists) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const same = await db.collection('collections').where('slug', '==', parsed.data.slug).limit(2).get();
  if (same.docs.some((d) => d.id !== params.id!)) {
    return NextResponse.json({ error: 'That slug is already used by another collection.' }, { status: 409 });
  }
  await ref.update({ ...parsed.data, updatedAt: FieldValue.serverTimestamp() });
  await writeAudit(user, 'collection.update', `collections/${params.id!}`, { isActive: parsed.data.isActive });
  return NextResponse.json({ ok: true });
});

export const DELETE = withAuth(['manager', 'admin'], async (_req, user, { params }) => {
  if (!ID.test(params.id!)) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  await adminDb().collection('collections').doc(params.id!).delete();
  await writeAudit(user, 'collection.delete', `collections/${params.id!}`);
  return NextResponse.json({ ok: true });
});
