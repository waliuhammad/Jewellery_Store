import { z } from 'zod';

export const MAX_QTY_PER_LINE = 10;

export const cartItemsSchema = z
  .array(
    z.object({
      productId: z.string().min(1).max(128).regex(/^[A-Za-z0-9_-]+$/, 'Invalid product.'),
      quantity: z.number().int().min(1).max(MAX_QTY_PER_LINE),
    }),
  )
  .min(1, 'Your bag is empty.')
  .max(20)
  .refine((items) => new Set(items.map((i) => i.productId)).size === items.length, {
    message: 'Each product can appear only once in your bag.',
  });

export const customerSchema = z.object({
  fullName: z.string().trim().min(2, 'Please enter your full name.').max(100),
  email: z.string().trim().toLowerCase().email('Please enter a valid email address.').max(254),
  phone: z.string().trim().min(7, 'Please enter a phone number.').max(20),
  address1: z.string().trim().min(5, 'Please enter your street address.').max(150),
  address2: z.string().trim().max(150).optional().or(z.literal('')),
  city: z.string().trim().min(2, 'Please enter your city.').max(80),
  postalCode: z.string().trim().max(20).optional().or(z.literal('')),
  country: z.string().trim().min(2, 'Please enter your country.').max(80),
});

export const cartRequestSchema = z.object({ items: cartItemsSchema });

export const orderRequestSchema = z.object({
  items: cartItemsSchema,
  customer: customerSchema,
});

export type CustomerInput = z.infer<typeof customerSchema>;
