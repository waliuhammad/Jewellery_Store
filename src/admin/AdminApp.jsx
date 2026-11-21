import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminAuthProvider } from './hooks/useAdminAuth';
import { AdminToastProvider } from './components/ui';

import AdminShell from './layouts/AdminShell';
import AdminLogin from './pages/AdminLogin';
import Overview from './pages/Overview';
import Products from './pages/Products';
import Categories from './pages/Categories';
import Orders from './pages/Orders';
import Transactions from './pages/Transactions';
import Customers from './pages/Customers';
import Coupons from './pages/Coupons';
import Reviews from './pages/Reviews';
import Messages from './pages/Messages';
import SiteContent from './pages/SiteContent';
import Settings from './pages/Settings';
import Team from './pages/Team';
import NoAccess from './pages/NoAccess';

export default function AdminApp() {
  return (
    <AdminAuthProvider>
      <AdminToastProvider>
        <Routes>
          {/* Standalone Admin Login (No Shell) */}
          <Route path="login" element={<AdminLogin />} />

          {/* Protected Admin Shell */}
          <Route path="" element={<AdminShell />}>
            <Route index element={<Overview />} />
            <Route path="products" element={<Products />} />
            <Route path="categories" element={<Categories />} />
            <Route path="orders" element={<Orders />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="customers" element={<Customers />} />
            <Route path="coupons" element={<Coupons />} />
            <Route path="reviews" element={<Reviews />} />
            <Route path="messages" element={<Messages />} />
            <Route path="site-content" element={<SiteContent />} />
            <Route path="settings" element={<Settings />} />
            <Route path="team" element={<Team />} />
            <Route path="*" element={<NoAccess />} />
          </Route>
        </Routes>
      </AdminToastProvider>
    </AdminAuthProvider>
  );
}
