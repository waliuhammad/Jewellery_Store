// One-time (and safe to re-run) Firestore setup: creates the store's category records.
// Existing documents are never overwritten, so edits made in Admin > Categories are kept.
// Usage: node --env-file=.env.local scripts/setup-firebase.mjs
import { cert, initializeApp } from 'firebase-admin/app';
import { FieldValue, getFirestore } from 'firebase-admin/firestore';

// Keep in sync with `categories` in src/config/site.ts (the storefront only serves these slugs).
const CATEGORIES = [
  { name: 'Rings', slug: 'rings' },
  { name: 'Necklaces', slug: 'necklaces' },
  { name: 'Earrings', slug: 'earrings' },
  { name: 'Bracelets', slug: 'bracelets' },
  { name: 'Jewellery Sets', slug: 'jewellery-sets' },
];

const app = initializeApp({
  credential: cert({
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  }),
});
const db = getFirestore(app);

for (const [i, c] of CATEGORIES.entries()) {
  const ref = db.collection('categories').doc(c.slug);
  try {
    await ref.create({
      name: c.name,
      slug: c.slug,
      description: '',
      image: null,
      isActive: true,
      sortOrder: i,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
    console.log(`created  categories/${c.slug}`);
  } catch (err) {
    // 6 = ALREADY_EXISTS: leave the saved category as it is.
    if (err.code === 6) console.log(`kept     categories/${c.slug} (already exists)`);
    else throw err;
  }
}
console.log('Done.');
