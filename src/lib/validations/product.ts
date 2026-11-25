import { z } from 'zod';
import { siteConfig } from '@/config/site';

// TODO: move categories to Firestore so admins can add them without a deploy.
const categoryIds = siteConfig.categories.map((c) => c.slug) as [string, ...string[]];
const materialIds = siteConfig.materials as [string, ...string[]];

export const productSchema = z
  .object({
    name: z.string().trim().min(2, 'Name is too short.').max(120),
    slug: z
      .string()
      .trim()
      .toLowerCase()
      .min(2)
      .max(120)
      .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'Use lowercase letters, numbers and hyphens only.'),
    description: z.string().trim().max(5000),
    categoryId: z.enum(categoryIds),
    price: z.number({ invalid_type_error: 'Enter a price.' }).int().positive().max(100_000_000),
    compareAtPrice: z.number().int().positive().max(100_000_000).nullable().optional(),
    currency: z.literal('PKR'),
    sku: z.string().trim().max(64),
    stock: z.number({ invalid_type_error: 'Enter a stock count.' }).int().min(0).max(1_000_000),
    status: z.enum(['draft', 'active', 'archived']),
    featured: z.boolean(),
    material: z.enum(materialIds).nullable().optional(),
    images: z
      .array(
        z.object({
          url: z.string().regex(/^https:\/\/res\.cloudinary\.com\//, 'Images must be hosted on Cloudinary.'),
          publicId: z.string().min(1).max(200),
          alt: z.string().trim().max(200),
        }),
      )
      .max(8),
  })
  .refine((d) => !d.compareAtPrice || d.compareAtPrice > d.price, {
    message: 'Compare-at price must be higher than the price.',
    path: ['compareAtPrice'],
  });

export type ProductInput = z.infer<typeof productSchema>;
