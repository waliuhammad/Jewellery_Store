import { z } from 'zod';

export const ENQUIRY_TOPICS = [
  'General enquiry',
  'Order help',
  'Product question',
  'Custom or bespoke request',
  'Other',
] as const;

export const contactSchema = z.object({
  name: z.string().trim().min(2, 'Please enter your name.').max(100),
  email: z.string().trim().toLowerCase().email('Please enter a valid email address.').max(254),
  phone: z.string().trim().max(20).optional().or(z.literal('')),
  topic: z.enum(ENQUIRY_TOPICS),
  message: z.string().trim().min(10, 'Please write a little more detail.').max(2000),
  // Hidden from people; bots tend to fill it in. Must stay empty.
  website: z.string().max(0).optional().or(z.literal('')),
});

export type ContactInput = z.infer<typeof contactSchema>;
