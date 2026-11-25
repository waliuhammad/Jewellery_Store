import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/http';
import { updateProfile } from '@/lib/account/profile';
import { profileSchema } from '@/lib/validations/account';

export const dynamic = 'force-dynamic';

export const PATCH = withAuth(['customer', 'manager', 'admin'], async (req, user) => {
  const parsed = profileSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Please check your details.' }, { status: 422 });
  }
  await updateProfile(user.uid, parsed.data);
  return NextResponse.json({ ok: true });
});
