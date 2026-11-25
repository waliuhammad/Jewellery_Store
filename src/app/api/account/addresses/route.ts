import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/http';
import { addAddress } from '@/lib/account/profile';
import { addressSchema } from '@/lib/validations/account';

export const dynamic = 'force-dynamic';

export const POST = withAuth(['customer', 'manager', 'admin'], async (req, user) => {
  const parsed = addressSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Please check the address details.' }, { status: 422 });
  }
  const result = await addAddress(user.uid, parsed.data);
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 409 });
  return NextResponse.json({ ok: true }, { status: 201 });
});
