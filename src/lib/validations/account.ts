import { z } from 'zod';

export const profileSchema = z.object({
  name: z.string().trim().min(2, 'Please enter your name.').max(80),
  phone: z
    .string()
    .trim()
    .max(20)
    .refine((v) => v === '' || v.length >= 7, 'Please enter a valid phone number.'),
});

export const addressSchema = z.object({
  label: z.string().trim().min(1, 'Give this address a name, such as Home.').max(40),
  fullName: z.string().trim().min(2, 'Please enter a name.').max(100),
  phone: z.string().trim().min(7, 'Please enter a phone number.').max(20),
  address1: z.string().trim().min(5, 'Please enter the street address.').max(150),
  address2: z.string().trim().max(150).optional().or(z.literal('')),
  city: z.string().trim().min(2, 'Please enter the city.').max(80),
  postalCode: z.string().trim().max(20).optional().or(z.literal('')),
  country: z.string().trim().min(2, 'Please enter the country.').max(80),
});

export type ProfileInput = z.infer<typeof profileSchema>;
export type AddressInput = z.infer<typeof addressSchema>;
