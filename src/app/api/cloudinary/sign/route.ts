import { createHash } from 'crypto';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { withAuth } from '@/lib/http';

export const dynamic = 'force-dynamic';

// Brand folder root. Set to your brand slug once confirmed.
const FOLDER_ROOT = 'jewellery-store';
const PURPOSES = ['products', 'categories', 'banners'] as const;
const ALLOWED_FORMATS = 'jpg,jpeg,png,webp';

const body = z.object({ purpose: z.enum(PURPOSES) });

/**
 * Issues a short-lived signature so the browser can upload straight to Cloudinary.
 * The API secret never leaves the server. Folder and formats are fixed server-side.
 */
export const POST = withAuth(['manager', 'admin'], async (req) => {
  const parsed = body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Bad request' }, { status: 400 });

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) {
    return NextResponse.json({ error: 'Image uploads are not configured yet.' }, { status: 503 });
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const folder = `${FOLDER_ROOT}/${parsed.data.purpose}`;
  // Parameters must be sorted alphabetically before signing.
  const toSign = `allowed_formats=${ALLOWED_FORMATS}&folder=${folder}&timestamp=${timestamp}`;
  const signature = createHash('sha1').update(toSign + apiSecret).digest('hex');

  return NextResponse.json({ cloudName, apiKey, timestamp, folder, allowed_formats: ALLOWED_FORMATS, signature });
});
