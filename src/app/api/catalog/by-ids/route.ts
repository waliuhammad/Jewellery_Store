import { NextResponse } from 'next/server';
import { z } from 'zod';
import { isAdminConfigured } from '@/lib/firebase/admin';
import { getActiveProductsByIds } from '@/lib/catalog/repository';

export const dynamic = 'force-dynamic';

const body = z.object({
  ids: z.array(z.string().regex(/^[A-Za-z0-9_-]{1,128}$/)).max(50),
});

export async function POST(req: Request) {
  if (!isAdminConfigured()) return NextResponse.json({ error: 'Store not connected' }, { status: 503 });
  const parsed = body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Invalid request' }, { status: 422 });

  try {
    const products = await getActiveProductsByIds(parsed.data.ids);
    // Public fields only.
    return NextResponse.json({
      products: products.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        price: p.price,
        compareAtPrice: p.compareAtPrice ?? null,
        currency: p.currency,
        stock: p.stock,
        image: p.images[0] ?? null,
      })),
    });
  } catch (err) {
    console.error('[catalog] by-ids failed', err);
    return NextResponse.json({ error: 'Could not load products.' }, { status: 500 });
  }
}
