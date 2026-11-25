import { NextResponse } from 'next/server';
import { isAdminConfigured } from '@/lib/firebase/admin';
import { placeOrder } from '@/lib/checkout/pricing';
import { orderRequestSchema } from '@/lib/validations/checkout';
import { getSessionUser } from '@/lib/auth/session';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  if (!isAdminConfigured()) {
    return NextResponse.json({ error: 'Store not connected' }, { status: 503 });
  }
  const parsed = orderRequestSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Please check the highlighted details.', fields: parsed.success ? {} : parsed.error.flatten().fieldErrors },
      { status: 422 },
    );
  }
  try {
    const user = await getSessionUser();
    const result = await placeOrder(parsed.data.items, parsed.data.customer, user?.uid ?? null);
    if ('issues' in result) {
      return NextResponse.json(
        { error: 'Some items in your bag have changed. Please review your bag.', issues: result.issues },
        { status: 409 },
      );
    }
    return NextResponse.json({ orderId: result.orderId }, { status: 201 });
  } catch (err) {
    console.error('[checkout] order failed', err);
    return NextResponse.json({ error: 'We could not place your order. Please try again.' }, { status: 500 });
  }
}
