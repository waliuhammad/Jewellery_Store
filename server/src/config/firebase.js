import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { INITIAL_PRODUCTS } from '../data/initialProducts.js';
import { INITIAL_CATEGORIES } from '../data/initialCategories.js';
import { INITIAL_COUPONS } from '../data/initialCoupons.js';
import { INITIAL_SETTINGS } from '../data/initialSettings.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let isFirebaseConnected = false;
let db = null;
let auth = null;
let storage = null;

// Determine service account file path
const candidatePaths = [
  process.env.FIREBASE_SERVICE_ACCOUNT_PATH,
  path.resolve(__dirname, '../../serviceAccountKey.json'),
  path.resolve(process.cwd(), 'serviceAccountKey.json'),
].filter(Boolean);

let serviceAccount = null;

for (const p of candidatePaths) {
  if (fs.existsSync(p)) {
    try {
      const content = fs.readFileSync(p, 'utf8');
      serviceAccount = JSON.parse(content);
      console.log(`[Firebase] Loaded service account credentials from: ${p}`);
      break;
    } catch (e) {
      console.warn(`[Firebase] Failed reading service account from ${p}:`, e.message);
    }
  }
}

// Fallback to environment variable JSON
if (!serviceAccount && process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
  try {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
    console.log('[Firebase] Loaded service account credentials from FIREBASE_SERVICE_ACCOUNT_JSON');
  } catch (e) {
    console.warn('[Firebase] Failed parsing FIREBASE_SERVICE_ACCOUNT_JSON:', e.message);
  }
}

if (serviceAccount) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET || `${serviceAccount.project_id}.appspot.com`,
    });
    db = admin.firestore();
    auth = admin.auth();
    storage = admin.storage();
    isFirebaseConnected = true;
    console.log(`[Firebase] Connected successfully to Cloud Firestore (${serviceAccount.project_id})`);
  } catch (e) {
    console.error('[Firebase] Failed to initialize Firebase Admin SDK:', e);
  }
}

/**
 * In-memory fallback repository when running locally without active Firebase credentials.
 * Matches Firestore API so controllers work seamlessly in both modes.
 */
class MemoryDocRef {
  constructor(collection, id) {
    this.collection = collection;
    this.id = id;
  }

  async get() {
    const data = this.collection._data.get(this.id);
    return {
      id: this.id,
      exists: !!data,
      data: () => (data ? JSON.parse(JSON.stringify(data)) : undefined),
    };
  }

  async set(data, options = {}) {
    const existing = this.collection._data.get(this.id) || {};
    const merged = options.merge ? { ...existing, ...data } : { ...data };
    this.collection._data.set(this.id, merged);
    return { writeTime: new Date().toISOString() };
  }

  async update(data) {
    const existing = this.collection._data.get(this.id);
    if (!existing) {
      const err = new Error(`Document ${this.id} does not exist.`);
      err.code = 5;
      throw err;
    }
    const updated = { ...existing, ...data };
    this.collection._data.set(this.id, updated);
    return { writeTime: new Date().toISOString() };
  }

  async delete() {
    this.collection._data.delete(this.id);
    return { writeTime: new Date().toISOString() };
  }
}

class MemoryQuery {
  constructor(collection, filters = [], orderByField = null, orderDir = 'asc', limitCount = null) {
    this.collection = collection;
    this.filters = filters;
    this.orderByField = orderByField;
    this.orderDir = orderDir;
    this.limitCount = limitCount;
  }

  where(field, op, value) {
    return new MemoryQuery(this.collection, [...this.filters, { field, op, value }], this.orderByField, this.orderDir, this.limitCount);
  }

  orderBy(field, dir = 'asc') {
    return new MemoryQuery(this.collection, this.filters, field, dir, this.limitCount);
  }

  limit(count) {
    return new MemoryQuery(this.collection, this.filters, this.orderByField, this.orderDir, count);
  }

  async get() {
    let items = Array.from(this.collection._data.entries()).map(([id, val]) => ({
      id,
      data: () => JSON.parse(JSON.stringify(val)),
    }));

    // Apply filters
    for (const f of this.filters) {
      items = items.filter((item) => {
        const d = item.data();
        const val = d[f.field];
        if (f.op === '==') return val === f.value;
        if (f.op === '!=') return val !== f.value;
        if (f.op === '<=') return val <= f.value;
        if (f.op === '>=') return val >= f.value;
        if (f.op === '<') return val < f.value;
        if (f.op === '>') return val > f.value;
        if (f.op === 'array-contains') return Array.isArray(val) && val.includes(f.value);
        if (f.op === 'in') return Array.isArray(f.value) && f.value.includes(val);
        return true;
      });
    }

    // Apply sorting
    if (this.orderByField) {
      const field = this.orderByField;
      const factor = this.orderDir === 'desc' ? -1 : 1;
      items.sort((a, b) => {
        const va = a.data()[field];
        const vb = b.data()[field];
        if (va < vb) return -1 * factor;
        if (va > vb) return 1 * factor;
        return 0;
      });
    }

    // Apply limit
    if (this.limitCount && this.limitCount > 0) {
      items = items.slice(0, this.limitCount);
    }

    return {
      empty: items.length === 0,
      size: items.length,
      docs: items,
      forEach: (cb) => items.forEach(cb),
    };
  }
}

class MemoryCollection {
  constructor(name) {
    this.name = name;
    this._data = new Map();
  }

  doc(id) {
    const docId = id || 'doc_' + Math.random().toString(36).substring(2, 9);
    return new MemoryDocRef(this, docId);
  }

  where(field, op, value) {
    return new MemoryQuery(this, [{ field, op, value }]);
  }

  orderBy(field, dir = 'asc') {
    return new MemoryQuery(this, [], field, dir);
  }

  limit(count) {
    return new MemoryQuery(this, [], null, 'asc', count);
  }

  async get() {
    return new MemoryQuery(this).get();
  }

  async add(data) {
    const id = 'doc_' + Math.random().toString(36).substring(2, 9);
    this._data.set(id, { ...data, id });
    return this.doc(id);
  }
}

class MemoryFirestore {
  constructor() {
    this.collections = new Map();
    this.seedDefaultData();
  }

  collection(name) {
    if (!this.collections.has(name)) {
      this.collections.set(name, new MemoryCollection(name));
    }
    return this.collections.get(name);
  }

  async runTransaction(updateFn) {
    const transaction = {
      get: async (docRef) => docRef.get(),
      set: async (docRef, data, opts) => docRef.set(data, opts),
      update: async (docRef, data) => docRef.update(data),
      delete: async (docRef) => docRef.delete(),
    };
    return updateFn(transaction);
  }

  seedDefaultData() {
    // Seed products
    const prodCol = this.collection('products');
    for (const p of INITIAL_PRODUCTS) {
      prodCol._data.set(p.id, p);
    }

    // Seed categories
    const catCol = this.collection('categories');
    for (const c of INITIAL_CATEGORIES) {
      catCol._data.set(c.id, c);
    }

    // Seed coupons
    const coupCol = this.collection('coupons');
    for (const c of INITIAL_COUPONS) {
      coupCol._data.set(c.code, c);
    }

    // Seed settings
    const setCol = this.collection('settings');
    setCol._data.set('store', INITIAL_SETTINGS);
  }
}

// Fallback in-memory database if Firebase Admin is not connected
if (!db) {
  console.log('[Firebase] Running with High-Fidelity Local Firestore Repository (Zero-Config mode)');
  db = new MemoryFirestore();
  auth = {
    verifyIdToken: async (token) => {
      // Mock decode for local development
      if (!token) throw new Error('No token provided');
      return {
        uid: 'usr_local_test',
        email: 'client@aurellejewels.com',
        role: 'customer',
      };
    },
  };
}

export { admin, db, auth, storage, isFirebaseConnected };

