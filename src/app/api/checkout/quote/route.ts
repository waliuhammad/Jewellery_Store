import { NextResponse } from 'next/server';
import { isAdminConfigured } from '@/lib/firebase/admin';
import { quoteCart } from '@/lib/checkout/pricing';
import { cartRequestSchema } from '@/lib/validations/checkout';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  if (!isAdminConfigured()) {
    return NextResponse.json({ error: 'Store not connected' }, { status: 503 });
  }
  const parsed = cartRequestSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Your bag could not be read. Please refresh and try again.' }, { status: 422 });
  }
  try {
    return NextResponse.json(await quoteCart(parsed.data.items));
  } catch (err) {
    console.error('[checkout] quote failed', err);
    return NextResponse.json({ error: 'Could not load your bag. Please try again.' }, { status: 500 });
  }
}
