import { siteConfig } from '@/config/site';
import type { ShopFilters, ShopSort } from '@/types/catalog';

type Raw = Record<string, string | string[] | undefined>;

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

const num = (v: string | undefined) => {
  if (v === undefined || v.trim() === '') return undefined;
  const n = Number(v);
  return Number.isFinite(n) && n >= 0 ? n : undefined;
};

const SORTS: ShopSort[] = ['newest', 'price-asc', 'price-desc', 'popular'];

/** Parses and sanitises URL search params. Unknown values are ignored, never passed to queries. */
export function parseFilters(raw: Raw, fixedCategory?: string): ShopFilters {
  const sortRaw = one(raw.sort) as ShopSort | undefined;
  const sort: ShopSort = sortRaw && SORTS.includes(sortRaw) ? sortRaw : 'newest';
  const q = one(raw.q)?.trim().slice(0, 80);
  const min = num(one(raw.min));
  const max = num(one(raw.max));
  const materialRaw = one(raw.material);
  const material = materialRaw && siteConfig.materials.includes(materialRaw) ? materialRaw : undefined;
  const pageNum = Number(one(raw.page));
  const page = Number.isInteger(pageNum) && pageNum >= 1 && pageNum <= 1000 ? pageNum : 1;

  return {
    category: (fixedCategory ?? one(raw.category)?.slice(0, 60)) || undefined,
    q: q || undefined,
    min,
    max: min !== undefined && max !== undefined && max < min ? min : max,
    sort,
    featured: one(raw.featured) === 'true',
    material,
    inStock: one(raw.availability) === 'in-stock',
    page,
  };
}
