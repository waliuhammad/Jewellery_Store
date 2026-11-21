import React, { useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { Package, MapPin, User, Heart, LogOut, Plus, Trash2, CheckCircle2, Clock, Eye } from 'lucide-react';
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
          <h1 className="font-display text-4xl text-forest mb-4">Please Sign In</h1>
          <p className="text-sm text-moss mb-8 font-light">
            You must be signed in to view your orders, addresses, and saved pieces.
          </p>
          <Link
            to="/login"
            className="relative inline-block overflow-hidden bg-forest text-ivory px-10 py-4 text-xs uppercase tracking-label font-medium group"
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

  // Helper for status chip color coding per Design.md Section 5.7: Softly coded Leaf, Champagne, Mist, Alert
  const getStatusChip = (status) => {
    switch (status) {
      case 'delivered':
        return 'bg-leaf/15 text-leaf border border-leaf/30';
      case 'shipped':
        return 'bg-champagne/40 text-forest border border-gold/40';
      case 'cancelled':
        return 'bg-alert/15 text-alert border border-alert/30';
      case 'confirmed':
      default:
        return 'bg-mist text-forest border border-hairline';
    }
  };

  return (
    <div className="pt-24 lg:pt-32 pb-24 bg-ivory min-h-screen">
      <div className="max-w-page mx-auto px-6 lg:px-12">
        {/* Top Header */}
        <div className="pb-8 border-b border-hairline mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-[11px] uppercase tracking-label text-gold font-medium block mb-1">
              Private Client Area
            </span>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-forest font-normal">
              Greetings, <span className="italic">{user?.name ? user.name.split(' ')[0] : 'Client'}</span>
            </h1>
          </div>
          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="text-xs uppercase tracking-label text-maroon hover:text-maroon/80 underline self-start sm:self-auto flex items-center gap-1.5 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </button>
        </div>

        {/* Account Split Layout per Design.md Section 5.7 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Vertical Tabs Sidebar (3 cols) with Gold active bar */}
          <aside className="lg:col-span-3 space-y-1 text-xs uppercase tracking-label">
            <button
              onClick={() => setTab('orders')}
              className={`w-full text-left p-3.5 flex items-center gap-3 transition-colors ${
                activeTab === 'orders'
                  ? 'bg-cream text-forest font-semibold border-l-2 border-gold shadow-xs'
                  : 'text-moss hover:text-forest'
              }`}
            >
              <Package className="w-4 h-4 text-gold" strokeWidth={1.5} />
              <span>Orders ({orders.length})</span>
            </button>

            <button
              onClick={() => setTab('addresses')}
              className={`w-full text-left p-3.5 flex items-center gap-3 transition-colors ${
                activeTab === 'addresses'
                  ? 'bg-cream text-forest font-semibold border-l-2 border-gold shadow-xs'
                  : 'text-moss hover:text-forest'
              }`}
            >
              <MapPin className="w-4 h-4 text-gold" strokeWidth={1.5} />
              <span>Saved Addresses</span>
            </button>

            <button
              onClick={() => setTab('profile')}
              className={`w-full text-left p-3.5 flex items-center gap-3 transition-colors ${
                activeTab === 'profile'
                  ? 'bg-cream text-forest font-semibold border-l-2 border-gold shadow-xs'
                  : 'text-moss hover:text-forest'
              }`}
            >
              <User className="w-4 h-4 text-gold" strokeWidth={1.5} />
              <span>Account Profile</span>
            </button>

            <Link
              to="/wishlist"
              className="w-full text-left p-3.5 flex items-center gap-3 text-moss hover:text-forest transition-colors block"
            >
              <Heart className="w-4 h-4 text-maroon" strokeWidth={1.5} />
              <span>Wishlist Pieces</span>
            </Link>
          </aside>

          {/* Tab Content Panel (9 cols) on White with Hairline border */}
          <main className="lg:col-span-9 bg-white border border-hairline p-6 sm:p-8 shadow-soft">
            {/* ORDERS TAB */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <h2 className="font-display text-2xl text-forest pb-4 border-b border-hairline">
                  Order History &amp; Tracking
                </h2>

                {orders.length === 0 ? (
                  <div className="py-12 text-center text-moss text-xs">
                    <p className="mb-4">You have not placed any orders yet.</p>
                    <Link
                      to="/shop"
                      className="text-xs uppercase tracking-label text-gold hover:text-forest underline"
                    >
                      Browse the archive &rarr;
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {orders.map((ord) => (
                      <div key={ord.orderId} className="border border-hairline p-5 bg-cream/30 space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-hairline gap-2 text-xs">
                          <div>
                            <span className="font-medium text-forest tracking-wide block font-sans">
                              {ord.orderId}
                            </span>
                            <span className="text-[11px] text-moss">{ord.date}</span>
                          </div>

                          <div className="flex items-center gap-3">
                            {/* Color-coded Status Chip */}
                            <span
                              className={`px-3 py-1 text-[10px] uppercase tracking-label font-medium rounded-none ${getStatusChip(
                                ord.status
                              )}`}
                            >
                              {ord.status.replace('_', ' ')}
                            </span>

                            <Link
                              to={`/track-order?id=${ord.orderId}`}
                              className="text-gold hover:text-forest underline uppercase tracking-label text-[11px] font-medium flex items-center gap-1 transition-colors"
                            >
                              <Eye className="w-3 h-3" /> View
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
                                  className="w-12 h-14 object-cover border border-hairline flex-shrink-0"
                                />
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="font-display text-sm text-forest font-semibold truncate">{item.name}</p>
                                <p className="text-[11px] text-moss">{item.finish} &bull; Qty: {item.quantity}</p>
                              </div>
                              <span className="font-medium text-forest">
                                {BRAND.currency.format(item.price * item.quantity)}
                              </span>
                            </div>
                          ))}
                        </div>

                        <div className="pt-3 border-t border-hairline flex justify-between items-center text-xs">
                          <span className="text-moss">
                            Total:{' '}
                            <strong className="text-forest font-medium">{BRAND.currency.format(ord.total)}</strong>
                          </span>
                          {ord.status === 'confirmed' && (
                            <button
                              onClick={() => cancelOrder(ord.orderId)}
                              className="text-maroon hover:underline text-[11px] uppercase tracking-label"
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
                  <h2 className="font-display text-2xl text-forest">Saved Delivery Addresses</h2>
                  <button
                    onClick={() => setShowAddressForm(true)}
                    className="relative overflow-hidden bg-forest text-ivory px-4 py-2 text-xs uppercase tracking-label font-medium group transition-colors flex items-center gap-1.5"
                  >
                    <span className="absolute inset-0 -translate-x-full bg-gold transition-transform duration-300 ease-luxe group-hover:translate-x-0" />
                    <span className="relative flex items-center gap-1.5 transition-colors duration-300 group-hover:text-ink">
                      <Plus className="w-3.5 h-3.5" /> Add Address
                    </span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {addresses.map((addr) => (
                    <div key={addr.id} className="p-4 border border-hairline bg-cream/40 text-xs space-y-2 relative">
                      {addr.isDefault && (
                        <span className="inline-block px-2 py-0.5 bg-forest text-ivory text-[10px] uppercase tracking-label font-medium mb-1">
                          Default
                        </span>
                      )}
                      <p className="font-medium text-forest">{addr.name}</p>
                      <p className="text-moss">{addr.phone}</p>
                      <p className="text-moss">{addr.address}, {addr.city}, {addr.province}</p>

                      <div className="pt-2 flex items-center justify-between border-t border-hairline">
                        {!addr.isDefault ? (
                          <button
                            onClick={() => setDefaultAddress(addr.id)}
                            className="text-gold hover:text-forest underline text-[11px]"
                          >
                            Set as default
                          </button>
                        ) : <span />}
                        <button
                          onClick={() => deleteAddress(addr.id)}
                          className="text-moss hover:text-maroon p-1 transition-colors"
                          aria-label="Delete address"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Address Form Modal */}
                {showAddressForm && (
                  <form onSubmit={handleSaveAddress} className="border border-hairline p-6 bg-cream text-xs space-y-4 mt-6">
                    <h3 className="font-display text-xl text-forest">New Delivery Address</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-moss mb-1">Full Name</label>
                        <input
                          required
                          type="text"
                          value={newAddr.name}
                          onChange={(e) => setNewAddr({ ...newAddr, name: e.target.value })}
                          className="w-full bg-white border border-hairline p-2 text-forest focus:outline-none focus:border-forest"
                        />
                      </div>
                      <div>
                        <label className="block text-moss mb-1">Phone</label>
                        <input
                          required
                          type="tel"
                          value={newAddr.phone}
                          onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                          placeholder="0300 1234567"
                          className="w-full bg-white border border-hairline p-2 text-forest focus:outline-none focus:border-forest"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-moss mb-1">Street Address</label>
                      <input
                        required
                        type="text"
                        value={newAddr.address}
                        onChange={(e) => setNewAddr({ ...newAddr, address: e.target.value })}
                        className="w-full bg-white border border-hairline p-2 text-forest focus:outline-none focus:border-forest"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-moss mb-1">City</label>
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
                          className="w-full bg-white border border-hairline p-2 text-forest focus:outline-none focus:border-forest cursor-pointer"
                        >
                          {PAKISTAN_CITIES.map((c) => (
                            <option key={c.name} value={c.name}>{c.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-moss mb-1">Province</label>
                        <input
                          readOnly
                          type="text"
                          value={newAddr.province}
                          className="w-full bg-white border border-hairline p-2 text-moss"
                        />
                      </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button
                        type="submit"
                        className="relative overflow-hidden bg-forest text-ivory px-6 py-2.5 uppercase tracking-label font-medium group transition-colors"
                      >
                        <span className="absolute inset-0 -translate-x-full bg-gold transition-transform duration-300 ease-luxe group-hover:translate-x-0" />
                        <span className="relative transition-colors duration-300 group-hover:text-ink">
                          Save Address
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowAddressForm(false)}
                        className="border border-hairline px-6 py-2.5 text-moss hover:text-forest uppercase tracking-label transition-colors"
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
                <h2 className="font-display text-2xl text-forest pb-4 border-b border-hairline">
                  Profile Details
                </h2>

                <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-md text-xs">
                  <div>
                    <label className="block text-moss uppercase tracking-label mb-1">Full Name</label>
                    <input
                      type="text"
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      className="w-full bg-transparent border-b border-hairline py-2 text-forest focus:outline-none focus:border-forest"
                    />
                  </div>

                  <div>
                    <label className="block text-moss uppercase tracking-label mb-1">Email Address</label>
                    <input
                      readOnly
                      disabled
                      type="email"
                      value={user.email}
                      className="w-full bg-transparent border-b border-hairline py-2 text-moss/70 cursor-not-allowed"
                    />
                    <span className="text-[10px] text-moss mt-1 block">Email address cannot be changed.</span>
                  </div>

                  <div>
                    <label className="block text-moss uppercase tracking-label mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={profilePhone}
                      onChange={(e) => setProfilePhone(e.target.value)}
                      placeholder="0300 1234567"
                      className="w-full bg-transparent border-b border-hairline py-2 text-forest focus:outline-none focus:border-forest"
                    />
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      className="relative overflow-hidden bg-forest text-ivory px-8 py-3 uppercase tracking-label font-medium group transition-colors"
                    >
                      <span className="absolute inset-0 -translate-x-full bg-gold transition-transform duration-300 ease-luxe group-hover:translate-x-0" />
                      <span className="relative transition-colors duration-300 group-hover:text-ink">
                        Update Profile
                      </span>
                    </button>
                  </div>
                </form>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
