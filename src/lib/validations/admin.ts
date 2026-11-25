import { z } from 'zod';
import { ORDER_STATUSES } from '@/lib/orders/status';
import { siteConfig } from '@/config/site';
import { imageSchema } from '@/lib/validations/content';

const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const ID = /^[A-Za-z0-9_-]{1,128}$/;

export const orderStatusSchema = z.object({ status: z.enum(ORDER_STATUSES) });

export const stockSchema = z.object({
  stock: z.number().int().min(0).max(1_000_000),
  reason: z.string().trim().min(2, 'Give a short reason for the change.').max(120),
});

export const categorySchema = z.object({
  description: z.string().trim().max(1000),
  sortOrder: z.number().int().min(0).max(999),
  isActive: z.boolean(),
});

export const collectionSchema = z.object({
  name: z.string().trim().min(2, 'Enter a name.').max(100),
  slug: z.string().trim().toLowerCase().min(2).max(120).regex(SLUG, 'Use lowercase letters, numbers and hyphens only.'),
  description: z.string().trim().max(1000),
  kind: z.enum(['curated', 'seasonal']),
  season: z.string().trim().max(60),
  tagline: z.string().trim().max(160),
  banner: imageSchema.nullable(),
  isActive: z.boolean(),
  productIds: z.array(z.string().regex(ID)).max(200),
});

export const knownCategorySlugs = siteConfig.categories.map((c) => c.slug);
export type CollectionInput = z.infer<typeof collectionSchema>;
export type CategoryInput = z.infer<typeof categorySchema>;
