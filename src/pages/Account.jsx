import React, { useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { Package, MapPin, User, Heart, LogOut, Plus, Trash2, CheckCircle2, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { BRAND } from '../config/brand';
import { PAKISTAN_CITIES } from '../data/cities';

export default function Account() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'orders';

  const {
    user,
    isAuthenticated,
    orders,
    addresses,
    logout,
    updateProfile,
    addAddress,
    deleteAddress,
    setDefaultAddress,
    cancelOrder,
  } = useAuth();

  const navigate = useNavigate();

  // Address Form Modal
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddr, setNewAddr] = useState({
    name: '',
    phone: '',
    address: '',
    city: 'Lahore',
    province: 'Punjab',
    isDefault: false,
  });

  // Profile Form
  const [profileName, setProfileName] = useState(user?.name || '');
  const [profilePhone, setProfilePhone] = useState(user?.phone || '');

  if (!isAuthenticated || !user) {
    return (
      <div className="pt-32 pb-24 bg-ivory min-h-[70vh] flex items-center justify-center">
        <div className="max-w-md mx-auto px-6 text-center">
          <h1 className="font-display text-4xl text-ink mb-4">Please Sign In</h1>
          <p className="text-sm text-taupe mb-8 font-light">
            You must be signed in to view your orders, addresses, and saved pieces.
          </p>
          <Link
            to="/login"
            className="relative inline-block overflow-hidden bg-ink text-ivory px-10 py-4 text-xs uppercase tracking-label font-medium group"
          >
            <span className="absolute inset-0 -translate-x-full bg-gold transition-transform duration-300 ease-luxe group-hover:translate-x-0" />
            <span className="relative transition-colors duration-300 group-hover:text-ink">
              Sign In to Account
            </span>
          </Link>
        </div>
      </div>
    );
  }

  const setTab = (tab) => {
    setSearchParams({ tab });
  };

  const handleSaveAddress = (e) => {
    e.preventDefault();
    addAddress(newAddr);
    setShowAddressForm(false);
    setNewAddr({
      name: '',
      phone: '',
      address: '',
      city: 'Lahore',
      province: 'Punjab',
      isDefault: false,
    });
  };

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    updateProfile({ name: profileName, phone: profilePhone });
  };

  return (
    <div className="pt-24 lg:pt-32 pb-24 bg-ivory min-h-screen">
      <div className="max-w-page mx-auto px-6 lg:px-12">
        {/* Top Header */}
        <div className="pb-8 border-b border-hairline mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-label text-taupe block mb-1">
              Private Client Area
            </span>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-ink font-normal">
              Greetings, <span className="italic">{user?.name ? user.name.split(' ')[0] : 'Client'}</span>
            </h1>
          </div>
          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="text-xs uppercase tracking-label text-garnet underline self-start sm:self-auto flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </button>
        </div>

        {/* Account Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Vertical Tabs Sidebar (3 cols) */}
          <aside className="lg:col-span-3 space-y-1 text-xs uppercase tracking-label">
            <button
              onClick={() => setTab('orders')}
              className={`w-full text-left p-3.5 flex items-center gap-3 transition-colors ${
                activeTab === 'orders' ? 'bg-cream text-ink font-semibold border-l-2 border-gold' : 'text-taupe hover:text-ink'
              }`}
            >
              <Package className="w-4 h-4 text-gold" strokeWidth={1.5} />
              <span>Orders ({orders.length})</span>
            </button>

            <button
              onClick={() => setTab('addresses')}
              className={`w-full text-left p-3.5 flex items-center gap-3 transition-colors ${
                activeTab === 'addresses' ? 'bg-cream text-ink font-semibold border-l-2 border-gold' : 'text-taupe hover:text-ink'
              }`}
            >
              <MapPin className="w-4 h-4 text-gold" strokeWidth={1.5} />
              <span>Saved Addresses</span>
            </button>

            <button
              onClick={() => setTab('profile')}
              className={`w-full text-left p-3.5 flex items-center gap-3 transition-colors ${
                activeTab === 'profile' ? 'bg-cream text-ink font-semibold border-l-2 border-gold' : 'text-taupe hover:text-ink'
              }`}
            >
              <User className="w-4 h-4 text-gold" strokeWidth={1.5} />
              <span>Account Profile</span>
            </button>

            <Link
              to="/wishlist"
              className="w-full text-left p-3.5 flex items-center gap-3 text-taupe hover:text-ink transition-colors block"
            >
              <Heart className="w-4 h-4 text-rose" strokeWidth={1.5} />
              <span>Wishlist Pieces</span>
            </Link>
          </aside>

          {/* Tab Content Panel (9 cols) */}
          <main className="lg:col-span-9 bg-white border border-hairline p-6 sm:p-8">
            {/* ORDERS TAB */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <h2 className="font-display text-2xl text-ink pb-4 border-b border-hairline">
                  Order History &amp; Tracking
                </h2>

                {orders.length === 0 ? (
                  <p className="text-xs text-taupe py-8">You have not placed any orders yet.</p>
                ) : (
                  <div className="space-y-6">
                    {orders.map((ord) => (
                      <div key={ord.orderId} className="border border-hairline p-5 bg-cream/30 space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-hairline gap-2 text-xs">
                          <div>
                            <span className="font-medium text-ink tracking-wide block font-sans">
                              {ord.orderId}
                            </span>
                            <span className="text-[11px] text-taupe">{ord.date}</span>
                          </div>

                          <div className="flex items-center gap-3">
                            {/* Color-coded Status Chip */}
                            <span
                              className={`px-3 py-1 text-[11px] uppercase tracking-label font-medium rounded-none ${
                                ord.status === 'delivered'
                                  ? 'bg-sage text-ivory'
                                  : ord.status === 'shipped'
                                  ? 'bg-champagne text-ink'
                                  : ord.status === 'cancelled'
                                  ? 'bg-garnet text-ivory'
                                  : 'bg-blush text-ink'
                              }`}
                            >
                              {ord.status.replace('_', ' ')}
                            </span>

                            <Link
                              to={`/track-order?id=${ord.orderId}`}
                              className="text-gold underline uppercase tracking-label text-[11px] font-medium"
                            >
                              Track &rarr;
                            </Link>
                          </div>
                        </div>

                        {/* Order Items List */}
                        <div className="space-y-3">
                          {ord.items.map((item, i) => (
                            <div key={i} className="flex items-center gap-3 text-xs">
                              {item.image && (
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-10 h-12 object-cover border border-hairline flex-shrink-0"
                                />
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="font-display text-sm text-ink font-semibold truncate">{item.name}</p>
                                <p className="text-[11px] text-taupe">{item.finish} &bull; Qty: {item.quantity}</p>
                              </div>
                              <span className="font-medium text-ink">
                                {BRAND.currency.format(item.price * item.quantity)}
                              </span>
                            </div>
                          ))}
                        </div>

                        <div className="pt-3 border-t border-hairline flex justify-between items-center text-xs">
                          <span className="text-taupe">Total: <strong className="text-ink font-medium">{BRAND.currency.format(ord.total)}</strong></span>
                          {ord.status === 'confirmed' && (
                            <button
                              onClick={() => cancelOrder(ord.orderId)}
                              className="text-garnet hover:underline"
                            >
                              Cancel Order
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ADDRESSES TAB */}
            {activeTab === 'addresses' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center pb-4 border-b border-hairline">
                  <h2 className="font-display text-2xl text-ink">Saved Delivery Addresses</h2>
                  <button
                    onClick={() => setShowAddressForm(true)}
                    className="text-xs uppercase tracking-label bg-ink text-ivory px-4 py-2 hover:bg-gold hover:text-ink transition-colors flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Address
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {addresses.map((addr) => (
                    <div key={addr.id} className="p-4 border border-hairline bg-cream/40 text-xs space-y-2 relative">
                      {addr.isDefault && (
                        <span className="inline-block px-2 py-0.5 bg-ink text-ivory text-[10px] uppercase tracking-label font-medium mb-1">
                          Default
                        </span>
                      )}
                      <p className="font-medium text-ink">{addr.name}</p>
                      <p className="text-taupe">{addr.phone}</p>
                      <p className="text-taupe">{addr.address}, {addr.city}, {addr.province}</p>

                      <div className="pt-2 flex items-center justify-between border-t border-hairline">
                        {!addr.isDefault ? (
                          <button
                            onClick={() => setDefaultAddress(addr.id)}
                            className="text-gold underline text-[11px]"
                          >
                            Set as default
                          </button>
                        ) : <span />}
                        <button
                          onClick={() => deleteAddress(addr.id)}
                          className="text-taupe hover:text-garnet p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Address Modal Form */}
                {showAddressForm && (
                  <form onSubmit={handleSaveAddress} className="border border-hairline p-6 bg-cream text-xs space-y-4 mt-6">
                    <h3 className="font-display text-xl text-ink">New Delivery Address</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-taupe mb-1">Full Name</label>
                        <input
                          required
                          type="text"
                          value={newAddr.name}
                          onChange={(e) => setNewAddr({ ...newAddr, name: e.target.value })}
                          className="input-luxe bg-white px-2"
                        />
                      </div>
                      <div>
                        <label className="block text-taupe mb-1">Phone</label>
                        <input
                          required
                          type="tel"
                          value={newAddr.phone}
                          onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                          placeholder="0300 1234567"
                          className="input-luxe bg-white px-2"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-taupe mb-1">Street Address</label>
                      <input
                        required
                        type="text"
                        value={newAddr.address}
                        onChange={(e) => setNewAddr({ ...newAddr, address: e.target.value })}
                        className="input-luxe bg-white px-2"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-taupe mb-1">City</label>
                        <select
                          value={newAddr.city}
                          onChange={(e) => {
                            const found = PAKISTAN_CITIES.find((c) => c.name === e.target.value);
                            setNewAddr({
                              ...newAddr,
                              city: e.target.value,
                              province: found ? found.province : newAddr.province,
                            });
                          }}
                          className="input-luxe bg-white px-2"
                        >
                          {PAKISTAN_CITIES.map((c) => (
                            <option key={c.name} value={c.name}>{c.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-taupe mb-1">Province</label>
                        <input
                          readOnly
                          type="text"
                          value={newAddr.province}
                          className="input-luxe bg-white px-2 text-taupe"
                        />
                      </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button
                        type="submit"
                        className="bg-ink text-ivory px-6 py-2.5 uppercase tracking-label font-medium hover:bg-gold hover:text-ink"
                      >
                        Save Address
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowAddressForm(false)}
                        className="border border-hairline px-6 py-2.5 text-taupe hover:text-ink uppercase tracking-label"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* PROFILE TAB */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <h2 className="font-display text-2xl text-ink pb-4 border-b border-hairline">
                  Profile Details
                </h2>

                <form onSubmit={handleUpdateProfile} className="space-y-5 text-xs max-w-md">
                  <div>
                    <label className="block text-taupe uppercase tracking-label mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      className="input-luxe"
                    />
                  </div>

                  <div>
                    <label className="block text-taupe uppercase tracking-label mb-1">Email Address</label>
                    <input
                      type="email"
                      readOnly
                      value={user.email}
                      className="input-luxe text-taupe cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-taupe uppercase tracking-label mb-1">Primary Phone</label>
                    <input
                      type="tel"
                      value={profilePhone}
                      onChange={(e) => setPhoneInput ? setProfilePhone(e.target.value) : null}
                      placeholder="0300 1234567"
                      className="input-luxe"
                    />
                  </div>

                  <button
                    type="submit"
                    className="bg-ink text-ivory px-8 py-3.5 uppercase tracking-label font-medium hover:bg-gold hover:text-ink transition-colors"
                  >
                    Save Changes
                  </button>
                </form>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

