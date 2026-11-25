import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/http';
import { setStock } from '@/lib/admin/inventory';
import { stockSchema } from '@/lib/validations/admin';

export const dynamic = 'force-dynamic';

const ID = /^[A-Za-z0-9_-]{1,128}$/;

export const PATCH = withAuth(['manager', 'admin'], async (req, user, { params }) => {
  if (!ID.test(params.id!)) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const parsed = stockSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Check the stock figure.' }, { status: 422 });
  }
  const result = await setStock(user, params.id!, parsed.data.stock, parsed.data.reason);
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: result.status });
  return NextResponse.json({ ok: true });
});
