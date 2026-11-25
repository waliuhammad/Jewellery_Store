/** Shop URL for a gifting price band, using the existing min / max price filters. */
export function priceBandHref(band: { min?: number; max?: number }) {
  const params = new URLSearchParams();
  if (band.min !== undefined) params.set('min', String(band.min));
  if (band.max !== undefined) params.set('max', String(band.max));
  const qs = params.toString();
  return qs ? `/shop?${qs}` : '/shop';
}
