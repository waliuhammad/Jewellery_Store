/**
 * Admin API client — talks to /api/v1/admin/* with the Firebase ID token.
 * Falls back to mock data when the server is unreachable in dev mode.
 */

const BASE = '/api/v1/admin';

async function getToken() {
  // In production this would call firebase.auth().currentUser.getIdToken()
  // For now we read from sessionStorage (set on login)
  return sessionStorage.getItem('admin_id_token') || '';
}

async function request(path, options = {}) {
  const token = await getToken();
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.error?.message || `Request failed: ${res.status}`);
  }
  return data.data ?? data;
}

// ─── Overview ───────────────────────────────────────────────────────────────
export const adminApi = {
  getOverview: () => request('/overview'),

  // Products
  getProducts: (params) => request(`/products?${new URLSearchParams(params)}`),
  getProduct: (id) => request(`/products/${id}`),
  createProduct: (body) => request('/products', { method: 'POST', body: JSON.stringify(body) }),
  updateProduct: (id, body) => request(`/products/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteProduct: (id) => request(`/products/${id}`, { method: 'DELETE' }),
  uploadProductImages: async (id, formData) =>
    fetch(`${BASE}/products/${id}/images`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${await getToken()}` },
      body: formData,
    }).then((r) => r.json()),

  // Categories
  getCategories: () => request('/categories'),
  createCategory: (body) => request('/categories', { method: 'POST', body: JSON.stringify(body) }),
  updateCategory: (id, body) => request(`/categories/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteCategory: (id) => request(`/categories/${id}`, { method: 'DELETE' }),
  reorderCategories: (ids) => request('/categories/reorder', { method: 'PUT', body: JSON.stringify({ ids }) }),

  // Orders
  getOrders: (params) => request(`/orders?${new URLSearchParams(params)}`),
  getOrder: (id) => request(`/orders/${id}`),
  updateOrderStatus: (id, body) => request(`/orders/${id}/status`, { method: 'PUT', body: JSON.stringify(body) }),
  updateOrderPayment: (id, body) => request(`/orders/${id}/payment`, { method: 'PUT', body: JSON.stringify(body) }),
  updateOrderTracking: (id, body) => request(`/orders/${id}/tracking`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteOrder: (id) => request(`/orders/${id}`, { method: 'DELETE' }),

  // Transactions
  getTransactions: (params) => request(`/transactions?${new URLSearchParams(params)}`),
  exportTransactions: (params) => request(`/transactions/export?${new URLSearchParams(params)}`),

  // Customers
  getCustomers: (params) => request(`/customers?${new URLSearchParams(params)}`),
  getCustomer: (id) => request(`/customers/${id}`),
  blockCustomer: (id, blocked) => request(`/customers/${id}/block`, { method: 'PUT', body: JSON.stringify({ blocked }) }),
  exportCustomers: () => request('/customers/export'),

  // Coupons
  getCoupons: (params) => request(`/coupons?${new URLSearchParams(params)}`),
  createCoupon: (body) => request('/coupons', { method: 'POST', body: JSON.stringify(body) }),
  updateCoupon: (id, body) => request(`/coupons/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteCoupon: (id) => request(`/coupons/${id}`, { method: 'DELETE' }),

  // Reviews
  getReviews: (params) => request(`/reviews?${new URLSearchParams(params)}`),
  updateReview: (id, body) => request(`/reviews/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteReview: (id) => request(`/reviews/${id}`, { method: 'DELETE' }),

  // Messages
  getMessages: (params) => request(`/messages?${new URLSearchParams(params)}`),
  markMessageRead: (id, read) => request(`/messages/${id}/read`, { method: 'PUT', body: JSON.stringify({ read }) }),
  deleteMessage: (id) => request(`/messages/${id}`, { method: 'DELETE' }),
  getSubscribers: () => request('/subscribers'),
  exportSubscribers: () => request('/subscribers/export'),

  // Site Content
  getSiteContent: () => request('/site-content'),
  updateSiteContent: (body) => request('/site-content', { method: 'PUT', body: JSON.stringify(body) }),

  // Settings
  getSettings: () => request('/settings'),
  updateSettings: (body) => request('/settings', { method: 'PUT', body: JSON.stringify(body) }),

  // Team
  getTeam: () => request('/team'),
  createMember: (body) => request('/team', { method: 'POST', body: JSON.stringify(body) }),
  updateMember: (id, body) => request(`/team/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteMember: (id) => request(`/team/${id}`, { method: 'DELETE' }),
};
