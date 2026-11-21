import dotenv from 'dotenv';
dotenv.config();

import { db, isFirebaseConnected } from '../config/firebase.js';
import { INITIAL_PRODUCTS } from '../data/initialProducts.js';
import { INITIAL_CATEGORIES } from '../data/initialCategories.js';
import { INITIAL_COUPONS } from '../data/initialCoupons.js';
import { INITIAL_SETTINGS } from '../data/initialSettings.js';

async function runSeed() {
  console.log('\n--- 💎 Aurelle Jewels Database Seed Script ---');
  console.log(`Mode: ${isFirebaseConnected ? 'Live Cloud Firestore' : 'In-Memory Repository'}`);

  try {
    // 1. Seed Categories
    console.log(`\n[1/4] Seeding ${INITIAL_CATEGORIES.length} categories...`);
    for (const cat of INITIAL_CATEGORIES) {
      await db.collection('categories').doc(cat.id).set(cat, { merge: true });
      console.log(`  ✓ Category: ${cat.name} (${cat.id})`);
    }

    // 2. Seed Products
    console.log(`\n[2/4] Seeding ${INITIAL_PRODUCTS.length} curated jewelry pieces...`);
    for (const prod of INITIAL_PRODUCTS) {
      await db.collection('products').doc(prod.id).set(prod, { merge: true });
      console.log(`  ✓ Product: ${prod.name} [PKR ${prod.price.toLocaleString()}]`);
    }

    // 3. Seed Promotional Coupons
    console.log(`\n[3/4] Seeding ${INITIAL_COUPONS.length} promotional coupons...`);
    for (const coupon of INITIAL_COUPONS) {
      await db.collection('coupons').doc(coupon.code).set(coupon, { merge: true });
      console.log(`  ✓ Coupon: ${coupon.code} (${coupon.discountPercent}% off)`);
    }

    // 4. Seed Store Settings
    console.log(`\n[4/4] Seeding store configuration...`);
    await db.collection('settings').doc('store').set(INITIAL_SETTINGS, { merge: true });
    console.log(`  ✓ Store settings saved.`);

    console.log('\n✨ Database seeding completed successfully!\n');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error during database seeding:', error);
    process.exit(1);
  }
}

runSeed();

