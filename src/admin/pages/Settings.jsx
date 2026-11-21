import React, { useState } from 'react';
import {
  Truck,
  Smartphone,
  Building,
  Package,
  Bell,
  Store,
  Eye,
  EyeOff,
  Save,
  Check,
} from 'lucide-react';
import PageHeader from '../layouts/PageHeader';
import { Toggle, SelectInput, useAdminToast } from '../components/ui';
import { BRAND } from '../../config/brand';
import { formatCurrency } from '../lib/format';

export default function Settings() {
  const toast = useAdminToast();

  // Card 1: Shipping Rules
  const [shippingFee, setShippingFee] = useState(250);
  const [freeThreshold, setFreeThreshold] = useState(5000);
  const [dirtyShipping, setDirtyShipping] = useState(false);

  // Card 2: Wallets
  const [wallets, setWallets] = useState({
    jazzcashNumber: '0300 1234567',
    jazzcashTitle: 'Minha Jewellers',
    easypaisaNumber: '0300 1234567',
    easypaisaTitle: 'Minha Jewellers',
  });
  const [dirtyWallets, setDirtyWallets] = useState(false);

  // Card 3: Bank Transfer
  const [bank, setBank] = useState({
    bankName: 'Meezan Bank Limited',
    accountTitle: 'Minha Jewellers Pvt Ltd',
    accountNumber: '02010108923412',
    iban: 'PK45MEZN0002010108923412',
    branch: 'Gulberg Main Boulevard Branch, Lahore',
  });
  const [showBankAcc, setShowBankAcc] = useState(false);
  const [dirtyBank, setDirtyBank] = useState(false);

  // Card 4: Order & Stock
  const [orderStock, setOrderStock] = useState({
    lowStockThreshold: 5,
    orderPrefix: 'MJ-',
    guestCheckout: true,
    prepaidDiscount: 5,
    giftWrapFee: 350,
  });
  const [dirtyOrderStock, setDirtyOrderStock] = useState(false);

  // Card 5: Notifications
  const [notifications, setNotifications] = useState({
    ownerEmail: 'orders@minhajewellers.com',
    alertNewOrder: true,
    alertNewMessage: true,
    alertLowStock: true,
    emailOrderPlaced: true,
    emailOrderConfirmed: true,
    emailOrderShipped: true,
    emailOrderDelivered: true,
  });
  const [dirtyNotifications, setDirtyNotifications] = useState(false);

  // Card 6: Store Info
  const [storeInfo, setStoreInfo] = useState({
    storeName: 'Minha Jewellers',
    currencySymbol: 'Rs.',
    timezone: 'Asia/Karachi (PKT +05:00)',
  });
  const [dirtyStoreInfo, setDirtyStoreInfo] = useState(false);

  const saveCard = (name, setDirty) => {
    setDirty(false);
    toast?.show(`${name} settings updated successfully`, 'success');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Configuration"
        subtitle="Manage global store settings, payments and fulfillment rules"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Shipping Rules */}
        <div className="bg-paper p-6 rounded-lg border border-hairline flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#EAE2D6] flex items-center justify-center text-taupe">
                <Truck size={18} strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="font-display text-lg font-semibold text-ink">Shipping Rules</h3>
                <p className="text-xs font-sans text-taupe">Delivery fees &amp; thresholds</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-sans uppercase tracking-wider text-taupe font-medium mb-1">
                  Standard Fee (Rs.)
                </label>
                <input
                  type="number"
                  value={shippingFee}
                  onChange={(e) => {
                    setShippingFee(Number(e.target.value));
                    setDirtyShipping(true);
                  }}
                  className="w-full px-3 py-2 text-xs font-sans bg-cream border border-hairline rounded text-ink"
                />
              </div>
              <div>
                <label className="block text-xs font-sans uppercase tracking-wider text-taupe font-medium mb-1">
                  Free Above (Rs.)
                </label>
                <input
                  type="number"
                  value={freeThreshold}
                  onChange={(e) => {
                    setFreeThreshold(Number(e.target.value));
                    setDirtyShipping(true);
                  }}
                  className="w-full px-3 py-2 text-xs font-sans bg-cream border border-hairline rounded text-ink"
                />
              </div>
            </div>

            <div className="p-3 bg-cream/60 rounded border border-hairline text-xs font-sans text-taupe">
              <span className="font-semibold text-ink">Live Preview: </span>
              Orders below {formatCurrency(freeThreshold)} incur {formatCurrency(shippingFee)}{' '}
              shipping. Free above.
            </div>
          </div>

          <div className="pt-4 border-t border-hairline flex justify-end">
            <button
              onClick={() => saveCard('Shipping', setDirtyShipping)}
              disabled={!dirtyShipping}
              className="px-4 py-2 text-xs font-sans font-medium rounded bg-ink text-ivory hover:bg-gold hover:text-ink disabled:opacity-40 transition-colors"
            >
              Save Shipping
            </button>
          </div>
        </div>

        {/* 2. JazzCash & EasyPaisa */}
        <div className="bg-paper p-6 rounded-lg border border-hairline flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#F1DDD6] flex items-center justify-center text-taupe">
                <Smartphone size={18} strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="font-display text-lg font-semibold text-ink">Mobile Wallets</h3>
                <p className="text-xs font-sans text-taupe">JazzCash &amp; EasyPaisa account details</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="JazzCash Number"
                  value={wallets.jazzcashNumber}
                  onChange={(e) => {
                    setWallets({ ...wallets, jazzcashNumber: e.target.value });
                    setDirtyWallets(true);
                  }}
                  className="px-3 py-2 text-xs font-sans bg-cream border border-hairline rounded text-ink"
                />
                <input
                  type="text"
                  placeholder="JazzCash Title"
                  value={wallets.jazzcashTitle}
                  onChange={(e) => {
                    setWallets({ ...wallets, jazzcashTitle: e.target.value });
                    setDirtyWallets(true);
                  }}
                  className="px-3 py-2 text-xs font-sans bg-cream border border-hairline rounded text-ink"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="EasyPaisa Number"
                  value={wallets.easypaisaNumber}
                  onChange={(e) => {
                    setWallets({ ...wallets, easypaisaNumber: e.target.value });
                    setDirtyWallets(true);
                  }}
                  className="px-3 py-2 text-xs font-sans bg-cream border border-hairline rounded text-ink"
                />
                <input
                  type="text"
                  placeholder="EasyPaisa Title"
                  value={wallets.easypaisaTitle}
                  onChange={(e) => {
                    setWallets({ ...wallets, easypaisaTitle: e.target.value });
                    setDirtyWallets(true);
                  }}
                  className="px-3 py-2 text-xs font-sans bg-cream border border-hairline rounded text-ink"
                />
              </div>
            </div>

            <p className="text-[11px] text-taupe font-sans italic">
              Customers see these details at checkout. Leave number empty to hide that option.
            </p>
          </div>

          <div className="pt-4 border-t border-hairline flex justify-end">
            <button
              onClick={() => saveCard('Mobile Wallets', setDirtyWallets)}
              disabled={!dirtyWallets}
              className="px-4 py-2 text-xs font-sans font-medium rounded bg-ink text-ivory hover:bg-gold hover:text-ink disabled:opacity-40 transition-colors"
            >
              Save Wallets
            </button>
          </div>
        </div>

        {/* 3. Bank Transfer */}
        <div className="bg-paper p-6 rounded-lg border border-hairline flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#DDE9DE] flex items-center justify-center text-taupe">
                <Building size={18} strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="font-display text-lg font-semibold text-ink">Bank Transfer</h3>
                <p className="text-xs font-sans text-taupe">Direct deposit details</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Bank Name"
                  value={bank.bankName}
                  onChange={(e) => {
                    setBank({ ...bank, bankName: e.target.value });
                    setDirtyBank(true);
                  }}
                  className="px-3 py-2 text-xs font-sans bg-cream border border-hairline rounded text-ink"
                />
                <input
                  type="text"
                  placeholder="Account Title"
                  value={bank.accountTitle}
                  onChange={(e) => {
                    setBank({ ...bank, accountTitle: e.target.value });
                    setDirtyBank(true);
                  }}
                  className="px-3 py-2 text-xs font-sans bg-cream border border-hairline rounded text-ink"
                />
              </div>

              <div className="relative">
                <input
                  type={showBankAcc ? 'text' : 'password'}
                  placeholder="Account Number"
                  value={bank.accountNumber}
                  onChange={(e) => {
                    setBank({ ...bank, accountNumber: e.target.value });
                    setDirtyBank(true);
                  }}
                  className="w-full px-3 py-2 text-xs font-mono bg-cream border border-hairline rounded text-ink pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowBankAcc(!showBankAcc)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-taupe"
                >
                  {showBankAcc ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>

              <input
                type="text"
                placeholder="IBAN"
                value={bank.iban}
                onChange={(e) => {
                  setBank({ ...bank, iban: e.target.value });
                  setDirtyBank(true);
                }}
                className="w-full px-3 py-2 text-xs font-mono uppercase bg-cream border border-hairline rounded text-ink"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-hairline flex justify-end">
            <button
              onClick={() => saveCard('Bank Transfer', setDirtyBank)}
              disabled={!dirtyBank}
              className="px-4 py-2 text-xs font-sans font-medium rounded bg-ink text-ivory hover:bg-gold hover:text-ink disabled:opacity-40 transition-colors"
            >
              Save Bank
            </button>
          </div>
        </div>

        {/* 4. Order & Stock */}
        <div className="bg-paper p-6 rounded-lg border border-hairline flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#F6E9CF] flex items-center justify-center text-taupe">
                <Package size={18} strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="font-display text-lg font-semibold text-ink">Order &amp; Inventory</h3>
                <p className="text-xs font-sans text-taupe">Prefixes, incentives and thresholds</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-sans uppercase tracking-wider text-taupe font-medium mb-1">
                  Low Stock Threshold
                </label>
                <input
                  type="number"
                  value={orderStock.lowStockThreshold}
                  onChange={(e) => {
                    setOrderStock({ ...orderStock, lowStockThreshold: Number(e.target.value) });
                    setDirtyOrderStock(true);
                  }}
                  className="w-full px-3 py-2 text-xs font-sans bg-cream border border-hairline rounded text-ink"
                />
              </div>
              <div>
                <label className="block text-xs font-sans uppercase tracking-wider text-taupe font-medium mb-1">
                  Order ID Prefix
                </label>
                <input
                  type="text"
                  value={orderStock.orderPrefix}
                  onChange={(e) => {
                    setOrderStock({ ...orderStock, orderPrefix: e.target.value });
                    setDirtyOrderStock(true);
                  }}
                  className="w-full px-3 py-2 text-xs font-mono uppercase bg-cream border border-hairline rounded text-ink"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-sans uppercase tracking-wider text-taupe font-medium mb-1">
                  Prepaid Discount (%)
                </label>
                <input
                  type="number"
                  value={orderStock.prepaidDiscount}
                  onChange={(e) => {
                    setOrderStock({ ...orderStock, prepaidDiscount: Number(e.target.value) });
                    setDirtyOrderStock(true);
                  }}
                  className="w-full px-3 py-2 text-xs font-sans bg-cream border border-hairline rounded text-ink"
                />
              </div>
              <div>
                <label className="block text-xs font-sans uppercase tracking-wider text-taupe font-medium mb-1">
                  Gift Wrap Fee (Rs.)
                </label>
                <input
                  type="number"
                  value={orderStock.giftWrapFee}
                  onChange={(e) => {
                    setOrderStock({ ...orderStock, giftWrapFee: Number(e.target.value) });
                    setDirtyOrderStock(true);
                  }}
                  className="w-full px-3 py-2 text-xs font-sans bg-cream border border-hairline rounded text-ink"
                />
              </div>
            </div>

            <Toggle
              checked={orderStock.guestCheckout}
              onChange={(val) => {
                setOrderStock({ ...orderStock, guestCheckout: val });
                setDirtyOrderStock(true);
              }}
              label="Allow Guest Checkout"
            />
          </div>

          <div className="pt-4 border-t border-hairline flex justify-end">
            <button
              onClick={() => saveCard('Order & Stock', setDirtyOrderStock)}
              disabled={!dirtyOrderStock}
              className="px-4 py-2 text-xs font-sans font-medium rounded bg-ink text-ivory hover:bg-gold hover:text-ink disabled:opacity-40 transition-colors"
            >
              Save Order Rules
            </button>
          </div>
        </div>

        {/* 5. Notifications */}
        <div className="bg-paper p-6 rounded-lg border border-hairline flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-cream flex items-center justify-center text-taupe">
                <Bell size={18} strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="font-display text-lg font-semibold text-ink">Notifications</h3>
                <p className="text-xs font-sans text-taupe">Alerts &amp; automated client emails</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-sans uppercase tracking-wider text-taupe font-medium mb-1">
                Store Owner Notification Email
              </label>
              <input
                type="email"
                value={notifications.ownerEmail}
                onChange={(e) => {
                  setNotifications({ ...notifications, ownerEmail: e.target.value });
                  setDirtyNotifications(true);
                }}
                className="w-full px-3 py-2 text-xs font-sans bg-cream border border-hairline rounded text-ink"
              />
            </div>

            <div className="space-y-2 pt-2">
              <Toggle
                checked={notifications.alertNewOrder}
                onChange={(v) => {
                  setNotifications({ ...notifications, alertNewOrder: v });
                  setDirtyNotifications(true);
                }}
                label="Alert owner on new orders"
              />
              <Toggle
                checked={notifications.alertLowStock}
                onChange={(v) => {
                  setNotifications({ ...notifications, alertLowStock: v });
                  setDirtyNotifications(true);
                }}
                label="Alert owner on low inventory (< 5 units)"
              />
              <Toggle
                checked={notifications.emailOrderShipped}
                onChange={(v) => {
                  setNotifications({ ...notifications, emailOrderShipped: v });
                  setDirtyNotifications(true);
                }}
                label="Send automatic shipping emails to customers"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-hairline flex justify-end">
            <button
              onClick={() => saveCard('Notifications', setDirtyNotifications)}
              disabled={!dirtyNotifications}
              className="px-4 py-2 text-xs font-sans font-medium rounded bg-ink text-ivory hover:bg-gold hover:text-ink disabled:opacity-40 transition-colors"
            >
              Save Notifications
            </button>
          </div>
        </div>

        {/* 6. Store Info */}
        <div className="bg-paper p-6 rounded-lg border border-hairline flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-champagne flex items-center justify-center text-ink">
                <Store size={18} strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="font-display text-lg font-semibold text-ink">Store Profile</h3>
                <p className="text-xs font-sans text-taupe">Branding and localized parameters</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-sans uppercase tracking-wider text-taupe font-medium mb-1">
                  Store Legal Name
                </label>
                <input
                  type="text"
                  value={storeInfo.storeName}
                  onChange={(e) => {
                    setStoreInfo({ ...storeInfo, storeName: e.target.value });
                    setDirtyStoreInfo(true);
                  }}
                  className="w-full px-3 py-2 text-xs font-sans bg-cream border border-hairline rounded text-ink"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-sans uppercase tracking-wider text-taupe font-medium mb-1">
                    Currency Symbol
                  </label>
                  <input
                    type="text"
                    value={storeInfo.currencySymbol}
                    onChange={(e) => {
                      setStoreInfo({ ...storeInfo, currencySymbol: e.target.value });
                      setDirtyStoreInfo(true);
                    }}
                    className="w-full px-3 py-2 text-xs font-sans bg-cream border border-hairline rounded text-ink"
                  />
                </div>
                <div>
                  <label className="block text-xs font-sans uppercase tracking-wider text-taupe font-medium mb-1">
                    Timezone
                  </label>
                  <input
                    type="text"
                    disabled
                    value={storeInfo.timezone}
                    className="w-full px-3 py-2 text-xs font-sans bg-cream border border-hairline rounded text-taupe cursor-not-allowed"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-hairline flex justify-end">
            <button
              onClick={() => saveCard('Store Info', setDirtyStoreInfo)}
              disabled={!dirtyStoreInfo}
              className="px-4 py-2 text-xs font-sans font-medium rounded bg-ink text-ivory hover:bg-gold hover:text-ink disabled:opacity-40 transition-colors"
            >
              Save Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
