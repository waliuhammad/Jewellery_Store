import { NextResponse } from 'next/server';
import { FieldValue } from 'firebase-admin/firestore';
import { adminDb, isAdminConfigured } from '@/lib/firebase/admin';
import { contactSchema } from '@/lib/validations/contact';

export const dynamic = 'force-dynamic';

/** Same origin check as the session route: a post from another site is refused. */
function sameOrigin(req: Request): boolean {
  const origin = req.headers.get('origin');
  if (!origin) return true;
  try {
    return new URL(origin).host === req.headers.get('host');
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  if (!sameOrigin(req)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  if (!isAdminConfigured()) return NextResponse.json({ error: 'Store not connected' }, { status: 503 });

  const parsed = contactSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Please check the highlighted fields.', fields: parsed.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  // Filled-in honeypot: pretend success so the bot learns nothing, and store nothing.
  if (parsed.data.website) return NextResponse.json({ ok: true }, { status: 201 });

  try {
    await adminDb().collection('enquiries').add({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone ?? '',
      topic: parsed.data.topic,
      message: parsed.data.message,
      status: 'new',
      createdAt: FieldValue.serverTimestamp(),
    });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    console.error('[contact] could not save enquiry', err);
    return NextResponse.json({ error: 'We could not send your message. Please try again.' }, { status: 500 });
  }
}
