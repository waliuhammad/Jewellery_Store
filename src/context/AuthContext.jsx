import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

const AUTH_USER_KEY = 'aurelle_user_session';
const ADDRESSES_KEY = 'aurelle_user_addresses';
const ORDERS_KEY = 'aurelle_user_orders';

// Clean up any stale or legacy mock user data from browser storage
try {
  localStorage.removeItem('aurelle_auth_user');
  localStorage.removeItem('aurelle_saved_addresses');
} catch (e) {
  // Ignore in non-browser environments
}

// Seed demo orders for testing and tracking
const INITIAL_ORDERS = [
  {
    orderId: 'AJ-261108-1042',
    date: '8 November 2026',
    status: 'shipped',
    paymentMethod: 'Cash on Delivery',
    courier: 'Trax Courier',
    trackingNumber: 'TRX-9982410-PK',
    trackingUrl: 'https://trax.pk/tracking',
    items: [
      {
        name: 'Solis Pearl Drop Necklace',
        finish: '18k Warm Gold',
        size: '16 inch + 2 inch extender',
        price: 4850,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=300&auto=format&fit=crop',
      },
    ],
    subtotal: 4850,
    shippingFee: 250,
    total: 5100,
    shippingAddress: {
      name: 'Client',
      phone: '0300 1234567',
      address: 'House 42-B, Sector F-7/2',
      city: 'Islamabad',
      province: 'Federal Capital',
    },
    timeline: [
      { status: 'placed', label: 'Order Placed', time: '8 Nov, 10:15 AM', done: true },
      { status: 'confirmed', label: 'Order Confirmed', time: '8 Nov, 11:30 AM', done: true },
      { status: 'packed', label: 'Artfully Packed', time: '8 Nov, 02:45 PM', done: true },
      { status: 'shipped', label: 'Handed to Courier', time: '8 Nov, 05:20 PM', done: true },
      { status: 'out_for_delivery', label: 'Out for Delivery', time: 'Pending arrival', done: false },
      { status: 'delivered', label: 'Delivered', time: 'Estimated 9 Nov', done: false },
    ],
  },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(AUTH_USER_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [addresses, setAddresses] = useState(() => {
    try {
      const saved = localStorage.getItem(ADDRESSES_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem(ORDERS_KEY);
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  const { showToast } = useToast();

  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_USER_KEY);
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem(ADDRESSES_KEY, JSON.stringify(addresses));
  }, [addresses]);

  useEffect(() => {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  }, [orders]);

  const login = (email, password) => {
    const displayName = email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    const newUser = {
      id: 'usr-' + Date.now().toString(36),
      name: displayName,
      email: email.trim().toLowerCase(),
      phone: '',
      role: 'customer',
    };
    setUser(newUser);
    showToast(`Welcome, ${displayName}.`, 'success');
    return true;
  };

  const register = (name, email, password, phone) => {
    const newUser = {
      id: 'usr-' + Date.now().toString(36),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone ? phone.trim() : '',
      role: 'customer',
    };
    setUser(newUser);
    showToast(`Welcome to Aurelle Jewels, ${newUser.name}.`, 'success');
    return true;
  };

  const logout = () => {
    setUser(null);
    showToast('You have been signed out.', 'info');
  };

  const updateProfile = (updatedData) => {
    setUser((prev) => {
      const updated = { ...prev, ...updatedData };
      return updated;
    });
    showToast('Your profile details have been saved.', 'success');
  };

  const addOrder = (order) => {
    setOrders((prev) => [order, ...prev]);
  };

  const cancelOrder = (orderId) => {
    setOrders((prev) =>
      prev.map((ord) =>
        ord.orderId === orderId ? { ...ord, status: 'cancelled' } : ord
      )
    );
    showToast(`Order #${orderId} has been cancelled.`, 'info');
  };

  const addAddress = (address) => {
    const newAddress = {
      ...address,
      id: 'addr-' + Date.now().toString(36),
    };
    setAddresses((prev) => {
      if (newAddress.isDefault) {
        return [newAddress, ...prev.map((a) => ({ ...a, isDefault: false }))];
      }
      return [...prev, newAddress];
    });
    showToast('Delivery address saved.', 'success');
  };

  const deleteAddress = (id) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
    showToast('Address removed.', 'info');
  };

  const setDefaultAddress = (id) => {
    setAddresses((prev) =>
      prev.map((a) => ({
        ...a,
        isDefault: a.id === id,
      }))
    );
    showToast('Default address updated.', 'success');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        addresses,
        orders,
        login,
        register,
        logout,
        updateProfile,
        addOrder,
        cancelOrder,
        addAddress,
        deleteAddress,
        setDefaultAddress,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

