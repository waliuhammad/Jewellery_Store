/**
 * Minha Jewellers API Client Service
 * Communicates with /api/v1 endpoints with seamless offline fallback.
 */

import { PRODUCTS, CATEGORIES } from '../data/products';

const API_BASE = '/api/v1';

async function request(endpoint, options = {}) {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      ...options,
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error?.message || 'API request failed');
    }
    return data;
  } catch (error) {
    console.warn(`[API Client] Request to ${endpoint} failed:`, error.message);
    throw error;
  }
}

export const api = {
  // Products
  async getProducts(params = {}) {
    const query = new URLSearchParams(params).toString();
    try {
      const res = await request(`/products${query ? `?${query}` : ''}`);
      return res.data;
    } catch {
      // Offline fallback
      return {
        products: PRODUCTS,
        pagination: { total: PRODUCTS.length, page: 1, limit: PRODUCTS.length, totalPages: 1 },
      };
    }
  },

  async getProductBySlug(slug) {
    try {
      const res = await request(`/products/${slug}`);
      return res.data;
    } catch {
      return PRODUCTS.find((p) => p.slug === slug || p.id === slug) || null;
    }
  },

  async search(query) {
    try {
      const res = await request(`/search?q=${encodeURIComponent(query)}`);
      return res.data;
    } catch {
      const q = query.toLowerCase();
      const matches = PRODUCTS.filter(
        (p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
      );
      return { suggestions: matches.map((m) => m.name).slice(0, 5), products: matches.slice(0, 8) };
    }
  },

  // Categories
  async getCategories() {
    try {
      const res = await request('/categories');
      return res.data;
    } catch {
      return CATEGORIES;
    }
  },

  // Cart Validation
  async validateCart(cartPayload) {
    return request('/cart/validate', {
      method: 'POST',
      body: JSON.stringify(cartPayload),
    });
  },

  // Orders
  async createOrder(orderPayload, authToken) {
    return request('/orders', {
      method: 'POST',
      headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
      body: JSON.stringify(orderPayload),
    });
  },

  async trackOrder(orderNumber, contact) {
    return request(
      `/orders/track?orderNumber=${encodeURIComponent(orderNumber)}&contact=${encodeURIComponent(contact)}`
    );
  },

  async getMyOrders(authToken) {
    return request('/orders/me', {
      headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
    });
  },

  async cancelOrder(orderNumber, reason, authToken) {
    return request(`/orders/${encodeURIComponent(orderNumber)}/cancel`, {
      method: 'POST',
      headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
      body: JSON.stringify({ reason }),
    });
  },

  async uploadReceipt(orderNumber, formData) {
    const res = await fetch(`${API_BASE}/orders/${encodeURIComponent(orderNumber)}/receipt`, {
      method: 'POST',
      body: formData,
    });
    return res.json();
  },

  // Contact & Newsletter
  async submitContact(contactPayload) {
    return request('/contact', {
      method: 'POST',
      body: JSON.stringify(contactPayload),
    });
  },

  async subscribeNewsletter(email) {
    return request('/newsletter', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  // Settings
  async getSettings() {
    return request('/settings');
  },
};

