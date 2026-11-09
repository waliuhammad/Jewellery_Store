import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { WishlistProvider } from './context/WishlistContext';
import { CartProvider } from './context/CartContext';

import Header from './components/Header';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import ScrollToTop from './components/ScrollToTop';
import Preloader from './components/Preloader';

import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import TrackOrder from './pages/TrackOrder';
import Wishlist from './pages/Wishlist';
import Auth from './pages/Auth';
import Account from './pages/Account';
import About from './pages/About';
import Contact from './pages/Contact';
import FAQs from './pages/FAQs';
import Legal from './pages/Legal';
import NotFound from './pages/NotFound';

/**
 * Scroll to top on route change
 */
function ScrollRestoration() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <WishlistProvider>
          <CartProvider>
            <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
              <ScrollRestoration />
              <Preloader />

              {/* Global Header */}
              <Header />

              {/* Main Routing Views */}
              <main className="min-h-screen">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/shop/:category" element={<Shop />} />
                  <Route path="/product/:slug" element={<ProductDetail />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/order-success/:orderId" element={<OrderSuccess />} />
                  <Route path="/track-order" element={<TrackOrder />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route path="/login" element={<Auth />} />
                  <Route path="/register" element={<Auth />} />
                  <Route path="/forgot-password" element={<Auth />} />
                  <Route path="/account" element={<Account />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/faqs" element={<FAQs />} />
                  <Route path="/privacy-policy" element={<Legal />} />
                  <Route path="/terms" element={<Legal />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>

              {/* Global Overlays */}
              <CartDrawer />
              <ScrollToTop />

              {/* Global Noir Footer - Strictly without Admin Panel link */}
              <Footer />
            </Router>
          </CartProvider>
        </WishlistProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

