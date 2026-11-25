import { NextResponse } from 'next/server';
import { FieldValue } from 'firebase-admin/firestore';
import { withAuth } from '@/lib/http';
import { adminDb } from '@/lib/firebase/admin';
import { writeAudit } from '@/lib/audit';
import { collectionSchema } from '@/lib/validations/admin';

export const dynamic = 'force-dynamic';

export const POST = withAuth(['manager', 'admin'], async (req, user) => {
  const parsed = collectionSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Check the collection details.', issues: parsed.error.flatten().fieldErrors }, { status: 422 });
  }
  const db = adminDb();
  const dup = await db.collection('collections').where('slug', '==', parsed.data.slug).limit(1).get();
  if (!dup.empty) return NextResponse.json({ error: 'That slug is already used by another collection.' }, { status: 409 });

  const ref = await db.collection('collections').add({
    ...parsed.data,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });
  await writeAudit(user, 'collection.create', `collections/${ref.id}`, { slug: parsed.data.slug });
  return NextResponse.json({ id: ref.id }, { status: 201 });
});
