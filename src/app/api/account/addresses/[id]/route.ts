import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/http';
import { removeAddress } from '@/lib/account/profile';

export const dynamic = 'force-dynamic';

const ID = /^[A-Za-z0-9-]{1,64}$/;

export const DELETE = withAuth(['customer', 'manager', 'admin'], async (_req, user, { params }) => {
  if (!ID.test(params.id!)) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const result = await removeAddress(user.uid, params.id!);
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 404 });
  return NextResponse.json({ ok: true });
});
