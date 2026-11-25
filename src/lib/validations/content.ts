import { z } from 'zod';

/** A Cloudinary image as stored by the uploader. Shared by collections and brand content. */
export const imageSchema = z.object({
  url: z.string().regex(/^https:\/\/res\.cloudinary\.com\//, 'Images must be hosted on Cloudinary.'),
  publicId: z.string().min(1).max(200),
  alt: z.string().trim().max(200),
});

export const aboutContentSchema = z.object({
  heroTitle: z.string().trim().min(2, 'Enter a heading.').max(120),
  heroIntro: z.string().trim().max(400),
  heroImage: imageSchema.nullable(),
  storyHeading: z.string().trim().min(2).max(120),
  story: z.array(z.string().trim().min(1).max(2000)).min(1, 'Add at least one paragraph.').max(12),
  philosophyHeading: z.string().trim().min(2).max(120),
  philosophyBody: z.string().trim().max(2000),
  craftsmanshipHeading: z.string().trim().min(2).max(120),
  craftsmanship: z
    .array(z.object({ title: z.string().trim().min(1).max(120), body: z.string().trim().max(1000) }))
    .max(8),
  materials: z
    .array(z.object({ name: z.string().trim().min(1).max(80), description: z.string().trim().max(600) }))
    .max(12),
});

export type AboutContent = z.infer<typeof aboutContentSchema>;
