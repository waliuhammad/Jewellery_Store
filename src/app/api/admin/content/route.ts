import { NextResponse } from 'next/server';
import { FieldValue } from 'firebase-admin/firestore';
import { withAuth } from '@/lib/http';
import { adminDb } from '@/lib/firebase/admin';
import { writeAudit } from '@/lib/audit';
import { aboutContentSchema } from '@/lib/validations/content';

export const dynamic = 'force-dynamic';

export const PUT = withAuth(['manager', 'admin'], async (req, user) => {
  const parsed = aboutContentSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return NextResponse.json({ error: first?.message ?? 'Check the content.' }, { status: 422 });
  }
  await adminDb()
    .collection('settings')
    .doc('about')
    .set({ ...parsed.data, updatedAt: FieldValue.serverTimestamp() });
  await writeAudit(user, 'content.update', 'settings/about');
  return NextResponse.json({ ok: true });
});
