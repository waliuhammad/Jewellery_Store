import { publicEnv } from '@/lib/env';

/**
 * Builds an optimised Cloudinary delivery URL from a publicId.
 * Falls back to the stored url when the cloud name is not configured.
 */
export function cloudinaryUrl(
  image: { url: string; publicId?: string },
  opts: { width: number; aspect?: string } = { width: 800 },
): string {
  const cloud = publicEnv.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!image.publicId || !cloud) return image.url;
  const aspect = opts.aspect ? `,ar_${opts.aspect},c_fill` : '';
  return `https://res.cloudinary.com/${cloud}/image/upload/f_auto,q_auto,w_${opts.width}${aspect}/${image.publicId}`;
}

export function formatPrice(amount: number, currency = 'PKR'): string {
  return new Intl.NumberFormat('en-PK', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount);
}
