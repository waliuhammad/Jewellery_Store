import http from 'http';
import app from './server.js';

const PORT = 5099;

const server = app.listen(PORT, async () => {
  console.log(`\n🧪 Running Aurelle API Integration Test Suite on port ${PORT}...`);

  try {
    const baseUrl = `http://localhost:${PORT}/api/v1`;

    // 1. Health Check
    console.log('[Test 1] Checking GET /health');
    const healthRes = await fetch(`${baseUrl}/health`).then((r) => r.json());
    if (!healthRes.success) throw new Error('Health check failed');
    console.log('  ✓ Passed: Health status healthy');

    // 2. Products List
    console.log('[Test 2] Checking GET /products');
    const prodRes = await fetch(`${baseUrl}/products`).then((r) => r.json());
    if (!prodRes.success || !prodRes.data.products.length) throw new Error('Products fetch failed');
    console.log(`  ✓ Passed: Fetched ${prodRes.data.products.length} products`);

    // 3. Product Detail by Slug
    console.log('[Test 3] Checking GET /products/:slug');
    const slug = prodRes.data.products[0].slug;
    const detailRes = await fetch(`${baseUrl}/products/${slug}`).then((r) => r.json());
    if (!detailRes.success || detailRes.data.slug !== slug) throw new Error('Product detail failed');
    console.log(`  ✓ Passed: Fetched product "${detailRes.data.name}" by slug`);

    // 4. Categories List
    console.log('[Test 4] Checking GET /categories');
    const catRes = await fetch(`${baseUrl}/categories`).then((r) => r.json());
    if (!catRes.success || !catRes.data.length) throw new Error('Categories fetch failed');
    console.log(`  ✓ Passed: Fetched ${catRes.data.length} categories`);

    // 5. Cart Validation & Re-pricing
    console.log('[Test 5] Checking POST /cart/validate');
    const cartRes = await fetch(`${baseUrl}/cart/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: [{ productId: 'aj-001', quantity: 2 }],
        paymentMethod: 'bank',
        couponCode: 'AURELLE10',
      }),
    }).then((r) => r.json());

    if (!cartRes.success || !cartRes.data.total) throw new Error('Cart validation failed');
    console.log(`  ✓ Passed: Cart priced server-side: Subtotal PKR ${cartRes.data.subtotal}, Discount PKR ${cartRes.data.discount}, Total PKR ${cartRes.data.total}`);

    // 6. Order Creation (COD)
    console.log('[Test 6] Checking POST /orders');
    const orderRes = await fetch(`${baseUrl}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer: {
          name: 'Fatima Noor',
          email: 'fatima@example.com',
          phone: '+92 300 9876543',
        },
        shippingAddress: {
          fullName: 'Fatima Noor',
          phone: '+92 300 9876543',
          line1: 'House 12, Street 4, DHA Phase 5',
          city: 'Lahore',
          province: 'Punjab',
          postalCode: '54000',
        },
        items: [{ productId: 'aj-002', quantity: 1, finish: '18k Warm Gold', size: 'Size 7' }],
        paymentMethod: 'cod',
      }),
    }).then((r) => r.json());

    if (!orderRes.success || !orderRes.data.orderNumber) throw new Error('Order creation failed');
    const orderNumber = orderRes.data.orderNumber;
    console.log(`  ✓ Passed: Order created with ID "${orderNumber}"`);

    // 7. Track Order
    console.log('[Test 7] Checking GET /orders/track');
    const trackRes = await fetch(
      `${baseUrl}/orders/track?orderNumber=${encodeURIComponent(orderNumber)}&contact=${encodeURIComponent('fatima@example.com')}`
    ).then((r) => r.json());
    if (!trackRes.success || trackRes.data.orderNumber !== orderNumber) throw new Error('Order tracking failed');
    console.log(`  ✓ Passed: Order tracked successfully (Status: ${trackRes.data.status})`);

    // 8. Search
    console.log('[Test 8] Checking GET /search?q=pearl');
    const searchRes = await fetch(`${baseUrl}/search?q=pearl`).then((r) => r.json());
    if (!searchRes.success || !searchRes.data.products.length) throw new Error('Search failed');
    console.log(`  ✓ Passed: Found ${searchRes.data.products.length} products matching "pearl"`);

    // 9. Store Settings
    console.log('[Test 9] Checking GET /settings');
    const settingsRes = await fetch(`${baseUrl}/settings`).then((r) => r.json());
    if (!settingsRes.success) throw new Error('Settings failed');
    console.log(`  ✓ Passed: Settings loaded with currency "${settingsRes.data.currency}"`);

    // 10. Newsletter Subscription
    console.log('[Test 10] Checking POST /newsletter');
    const newsRes = await fetch(`${baseUrl}/newsletter`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'client.test@aurelle.com' }),
    }).then((r) => r.json());
    if (!newsRes.success) throw new Error('Newsletter subscription failed');
    console.log(`  ✓ Passed: Newsletter subscribed with coupon ${newsRes.data.couponCode}`);

    console.log('\n🎉 ALL 10 INTEGRATION TESTS PASSED CLEANLY!\n');
    server.close(() => process.exit(0));
  } catch (err) {
    console.error('\n❌ Test failure:', err.message);
    server.close(() => process.exit(1));
  }
});

