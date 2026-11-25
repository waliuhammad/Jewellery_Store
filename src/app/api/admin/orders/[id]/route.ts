import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/http';
import { transitionOrder } from '@/lib/admin/orders';
import { orderStatusSchema } from '@/lib/validations/admin';

export const dynamic = 'force-dynamic';

const ID = /^[A-Za-z0-9_-]{1,128}$/;

export const PATCH = withAuth(['manager', 'admin'], async (req, user, { params }) => {
  if (!ID.test(params.id!)) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const parsed = orderStatusSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Choose a valid status.' }, { status: 422 });

  const result = await transitionOrder(user, params.id!, parsed.data.status);
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: result.status });
  return NextResponse.json({ ok: true });
});
