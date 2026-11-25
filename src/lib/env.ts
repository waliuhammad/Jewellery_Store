import { z } from 'zod';

// A key left blank in .env.local (`KEY=`) means "not configured", same as leaving it out.
const optionalVar = z.preprocess((v) => (typeof v === 'string' && v.trim() === '' ? undefined : v), z.string().min(1).optional());

const publicSchema = z.object({
  NEXT_PUBLIC_FIREBASE_API_KEY: optionalVar,
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: optionalVar,
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: optionalVar,
  NEXT_PUBLIC_FIREBASE_APP_ID: optionalVar,
  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: optionalVar,
});

export const publicEnv = publicSchema.parse({
  NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
});

export const isFirebaseConfigured = Boolean(
  publicEnv.NEXT_PUBLIC_FIREBASE_API_KEY && publicEnv.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
);
