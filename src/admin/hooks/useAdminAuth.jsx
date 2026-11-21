/**
 * Admin Auth Context — manages admin session state.
 * Uses localStorage for the mock demo; swap for Firebase Auth in production.
 */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AdminAuthContext = createContext(null);

const ADMIN_SESSION_KEY = 'minha_admin_session';
const SESSION_TIMEOUT_MS = 8 * 60 * 60 * 1000; // 8 hours

// Demo staff accounts (replace with Firebase Auth in production)
const DEMO_STAFF = [
  { uid: 'admin-001', name: 'Minha Admin', email: 'admin@minhajewellers.com', role: 'admin', active: true },
  { uid: 'mgr-001', name: 'Store Manager', email: 'manager@minhajewellers.com', role: 'manager', active: true },
  { uid: 'sup-001', name: 'Support Agent', email: 'support@minhajewellers.com', role: 'support', active: true },
];

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(() => {
    try {
      const saved = localStorage.getItem(ADMIN_SESSION_KEY);
      if (!saved) return null;
      const { user, loginAt } = JSON.parse(saved);
      if (Date.now() - loginAt > SESSION_TIMEOUT_MS) {
        localStorage.removeItem(ADMIN_SESSION_KEY);
        return null;
      }
      return user;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError('');
    try {
      await new Promise((r) => setTimeout(r, 600)); // simulate API call
      const staff = DEMO_STAFF.find(
        (s) => s.email.toLowerCase() === email.toLowerCase()
      );
      if (!staff) throw new Error('No staff account found for this email.');
      if (!staff.active) throw new Error('This account has been deactivated. Contact your administrator.');
      // In production: verify password with Firebase Auth, get ID token, verify staff doc server-side
      if (password !== 'admin123' && password !== 'manager123' && password !== 'support123') {
        throw new Error('Incorrect password. Please try again.');
      }
      const session = { user: staff, loginAt: Date.now() };
      localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
      sessionStorage.setItem('admin_id_token', `demo-token-${staff.uid}`);
      setAdmin(staff);
      return true;
    } catch (e) {
      setError(e.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(ADMIN_SESSION_KEY);
    sessionStorage.removeItem('admin_id_token');
    setAdmin(null);
  }, []);

  // Auto-logout on timeout
  useEffect(() => {
    if (!admin) return;
    const saved = localStorage.getItem(ADMIN_SESSION_KEY);
    if (!saved) return;
    const { loginAt } = JSON.parse(saved);
    const remaining = SESSION_TIMEOUT_MS - (Date.now() - loginAt);
    if (remaining <= 0) { logout(); return; }
    const t = setTimeout(logout, remaining);
    return () => clearTimeout(t);
  }, [admin, logout]);

  return (
    <AdminAuthContext.Provider value={{ admin, loading, error, setError, login, logout, isAuthenticated: !!admin }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return ctx;
}
