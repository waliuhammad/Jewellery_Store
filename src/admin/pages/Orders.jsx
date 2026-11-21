import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag,
  ChevronDown,
  Phone,
  Mail,
  MessageCircle,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  Printer,
  FileText,
  AlertCircle,
  DollarSign,
} from 'lucide-react';
import PageHeader from '../layouts/PageHeader';
import {
  FilterPills,
  SearchInput,
  SelectInput,
  StatusChip,
  ConfirmDialog,
  useAdminToast,
  EmptyState,
  Pagination,
} from '../components/ui';
import { formatCurrency, formatDate, formatDateTime } from '../lib/format';
import { mockData } from '../data/mockStore';
import { useAdminAuth } from '../hooks/useAdminAuth';

const STATUS_FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'packed', label: 'Packed' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'out_for_delivery', label: 'Out for delivery' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'returned', label: 'Returned' },
];

export default function Orders() {
  const { admin } = useAdminAuth();
  const toast = useAdminToast();

  const [orders, setOrders] = useState(() => {
    return (mockData.orders || []).map((ord, idx) => ({
      ...ord,
      id: ord.id || `ORD-${20241100 + idx}`,
      orderNumber: ord.orderNumber || ord.id?.replace('ORD-', 'MJ-') || `MJ-2611${String(idx + 1).padStart(2, '0')}`,
      customerName: ord.customerName || (typeof ord.customer === 'object' ? ord.customer?.name : ord.customer) || 'Client',
      customerEmail: ord.customerEmail || (typeof ord.customer === 'object' ? ord.customer?.email : '') || 'client@minhajewellers.com',
      customerPhone: ord.customerPhone || (typeof ord.customer === 'object' ? ord.customer?.phone : '') || '+92 300 1234567',
      paymentMethod: ord.paymentMethod || ord.payment?.method || 'Cash on Delivery',
      paymentStatus: ord.paymentStatus || ord.payment?.status || 'pending',
      courier: ord.courier || ord.tracking?.courier || '',
      trackingNumber: ord.trackingNumber || ord.tracking?.trackingNumber || '',
      trackingUrl: ord.trackingUrl || ord.tracking?.trackingUrl || '',
    }));
  });
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [page, setPage] = useState(1);
  const itemsPerPage = 8;

  // Dialog states
  const [statusConfirm, setStatusConfirm] = useState({ open: false, orderId: null, newStatus: '' });
  const [cancelConfirm, setCancelConfirm] = useState({ open: false, orderId: null });

  // Tracking inputs per order
  const [trackingData, setTrackingData] = useState({});

  const filterCounts = STATUS_FILTERS.map((sf) => ({
    ...sf,
    count:
      sf.value === 'all'
        ? orders.length
        : orders.filter((o) => o.status?.toLowerCase() === sf.value).length,
  }));

  const filteredOrders = orders.filter((ord) => {
    if (filter !== 'all' && ord.status?.toLowerCase() !== filter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchNum = ord.orderNumber?.toLowerCase().includes(q);
      const matchName = ord.customerName?.toLowerCase().includes(q);
      const matchPhone = ord.shippingAddress?.phone?.includes(q);
      if (!matchNum && !matchName && !matchPhone) return false;
    }
    return true;
  });

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleStatusChange = (orderId, newStatus) => {
    setStatusConfirm({ open: true, orderId, newStatus });
  };

  const confirmStatusUpdate = () => {
    const { orderId, newStatus } = statusConfirm;
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const historyEntry = {
            status: newStatus,
            at: new Date().toISOString(),
            byName: admin?.name || 'Staff Member',
            note: `Status updated to ${newStatus}`,
          };
          return {
            ...ord,
            status: newStatus,
            timeline: [...(ord.timeline || []), historyEntry],
          };
        }
        return ord;
      })
    );
    toast?.show(`Order status updated to ${newStatus}`, 'success');
    setStatusConfirm({ open: false, orderId: null, newStatus: '' });
  };

  const handleCancelOrder = (orderId) => {
    setCancelConfirm({ open: true, orderId });
  };

  const confirmCancel = () => {
    const { orderId } = cancelConfirm;
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status: 'cancelled' } : ord))
    );
    toast?.show('Order cancelled and inventory restored', 'info');
    setCancelConfirm({ open: false, orderId: null });
  };

  const handlePaymentApproval = (orderId, approved) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          return {
            ...ord,
            paymentStatus: approved ? 'paid' : 'failed',
          };
        }
        return ord;
      })
    );
    toast?.show(approved ? 'Payment approved' : 'Payment rejected', approved ? 'success' : 'error');
  };

  const handleSaveTracking = (orderId) => {
    const data = trackingData[orderId] || {};
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          return {
            ...ord,
            courier: data.courier || ord.courier,
            trackingNumber: data.trackingNumber || ord.trackingNumber,
            trackingUrl: data.trackingUrl || ord.trackingUrl,
          };
        }
        return ord;
      })
    );
    toast?.show('Tracking information updated', 'success');
  };

  const handlePrint = (ord) => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Orders"
        subtitle="Process and track customer orders"
        action={
          <button
            onClick={() => window.print()}
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-xs font-sans font-medium bg-paper border border-hairline text-taupe hover:text-ink hover:bg-cream rounded-md transition-colors"
          >
            <Printer size={15} /> Print Batch Slips
          </button>
        }
      />

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
        <FilterPills
          filters={filterCounts}
          active={filter}
          onChange={(val) => {
            setFilter(val);
            setPage(1);
          }}
        />
        <div className="w-full md:w-72">
          <SearchInput
            value={search}
            onChange={(val) => {
              setSearch(val);
              setPage(1);
            }}
            placeholder="Order #, name, phone…"
          />
        </div>
      </div>

      {/* Orders List */}
      {paginatedOrders.length === 0 ? (
        <div className="bg-paper rounded-lg border border-hairline p-12">
          <EmptyState
            icon={ShoppingBag}
            title="No orders found"
            message="No orders match your filter criteria or search query."
          />
        </div>
      ) : (
        <div className="space-y-3">
          {paginatedOrders.map((ord) => {
            const isExpanded = expandedId === ord.id;
            return (
              <div
                key={ord.id}
                className="bg-paper rounded-lg border border-hairline overflow-hidden transition-all shadow-sm"
              >
                {/* Collapsed Header Bar */}
                <div
                  onClick={() => toggleExpand(ord.id)}
                  className="px-5 py-4 flex flex-wrap items-center justify-between gap-4 cursor-pointer hover:bg-cream/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-cream border border-hairline/60 flex items-center justify-center text-ink flex-shrink-0 shadow-xs">
                      <ShoppingBag size={18} strokeWidth={1.8} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-bold text-ink">
                          {ord.orderNumber}
                        </span>
                        <StatusChip status={ord.status} />
                        <span className="text-[10px] font-sans font-bold uppercase px-2.5 py-0.5 rounded bg-cream text-ink border border-hairline shadow-xs">
                          {ord.paymentMethod} · {ord.paymentStatus}
                        </span>
                      </div>
                      <p className="text-xs font-sans text-taupe font-semibold mt-0.5">
                        {ord.customerName} · {formatDate(ord.date || ord.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 ml-auto">
                    <div className="text-right">
                      <p className="font-sans font-bold text-sm text-ink">
                        {formatCurrency(ord.total)}
                      </p>
                      <p className="text-[11px] font-sans text-taupe font-medium">
                        {ord.items?.length || 1} item{ord.items?.length > 1 ? 's' : ''}
                      </p>
                    </div>
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-taupe"
                    >
                      <ChevronDown size={18} />
                    </motion.div>
                  </div>
                </div>

                {/* Expanded Details Panel */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="border-t border-hairline bg-ivory/40"
                    >
                      <div className="p-6 space-y-6">
                        {/* Section 1: Item List */}
                        <div>
                          <h4 className="text-xs font-sans uppercase tracking-wider text-taupe font-semibold mb-3">
                            Ordered Items
                          </h4>
                          <div className="divide-y divide-hairline bg-paper rounded-lg border border-hairline px-4">
                            {(ord.items || []).map((item, idx) => (
                              <div key={idx} className="py-3 flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                  <img
                                    src={item.image || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=100'}
                                    alt={item.name}
                                    className="w-12 h-12 object-cover rounded border border-hairline"
                                  />
                                  <div>
                                    <p className="font-sans text-sm font-medium text-ink">{item.name}</p>
                                    <p className="text-xs font-sans text-taupe">
                                      {item.finish} {item.size ? `· ${item.size}` : ''}
                                    </p>
                                  </div>
                                </div>
                                <div className="text-right font-sans text-xs">
                                  <span className="text-taupe">Qty: {item.quantity} × </span>
                                  <span className="font-medium text-ink">
                                    {formatCurrency(item.price)}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Section 2: Contact, Address, Payment in 3 cols */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {/* Customer Contact */}
                          <div className="bg-paper p-4 rounded-lg border border-hairline">
                            <h5 className="text-[11px] font-sans uppercase tracking-wider text-taupe font-semibold mb-2">
                              Customer Contact
                            </h5>
                            <p className="font-medium text-sm text-ink">{ord.customerName}</p>
                            <p className="text-xs text-taupe mt-1 flex items-center gap-1.5">
                              <Phone size={13} />
                              <a
                                href={`tel:${ord.shippingAddress?.phone || ord.customerPhone}`}
                                className="hover:underline text-ink"
                              >
                                {ord.shippingAddress?.phone || ord.customerPhone || '0300-1234567'}
                              </a>
                            </p>
                            <p className="text-xs text-taupe mt-1 flex items-center gap-1.5">
                              <Mail size={13} />
                              <a
                                href={`mailto:${ord.customerEmail}`}
                                className="hover:underline text-ink"
                              >
                                {ord.customerEmail || 'client@example.com'}
                              </a>
                            </p>
                            <div className="mt-3 pt-3 border-t border-hairline">
                              <a
                                href={`https://wa.me/92${(ord.shippingAddress?.phone || '03001234567').replace(/[^0-9]/g, '').slice(-10)}`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-sans font-bold rounded bg-[#E6F3E6] border border-[#92BE93] text-[#1E5823] hover:bg-[#1E5823] hover:text-ivory transition-colors shadow-xs"
                              >
                                <MessageCircle size={14} /> WhatsApp Client
                              </a>
                            </div>
                          </div>

                          {/* Shipping Address */}
                          <div className="bg-paper p-4 rounded-lg border border-hairline shadow-xs">
                            <h5 className="text-[11px] font-sans uppercase tracking-wider text-taupe font-bold mb-2">
                              Shipping Address
                            </h5>
                            <p className="text-xs text-ink leading-relaxed font-medium">
                              {ord.shippingAddress?.address || 'House 42-B, Sector F-7/2'}
                              <br />
                              {ord.shippingAddress?.city || 'Lahore'},{' '}
                              {ord.shippingAddress?.province || 'Punjab'}
                            </p>
                            {ord.isGiftWrap && (
                              <p className="mt-2 text-xs font-bold text-ink bg-[#FFF5E0] border border-[#E0B554] p-1.5 rounded">
                                🎁 Gift packaging requested (+PKR 350)
                              </p>
                            )}
                            {ord.orderNote && (
                              <p className="mt-2 text-xs italic text-ink font-medium bg-cream p-2 rounded border border-hairline/60">
                                "{ord.orderNote}"
                              </p>
                            )}
                          </div>

                          {/* Payment Details */}
                          <div className="bg-paper p-4 rounded-lg border border-hairline">
                            <h5 className="text-[11px] font-sans uppercase tracking-wider text-taupe font-semibold mb-2">
                              Payment Details
                            </h5>
                            <div className="text-xs space-y-1.5">
                              <div className="flex justify-between">
                                <span className="text-taupe">Method:</span>
                                <span className="font-medium text-ink uppercase">
                                  {ord.paymentMethod}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-taupe">Status:</span>
                                <StatusChip status={ord.paymentStatus} />
                              </div>
                              <div className="flex justify-between">
                                <span className="text-taupe">Subtotal:</span>
                                <span>{formatCurrency(ord.subtotal || ord.total - 250)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-taupe">Shipping:</span>
                                <span>{formatCurrency(ord.shippingFee || 250)}</span>
                              </div>
                              <div className="flex justify-between font-semibold border-t border-hairline pt-1 text-ink">
                                <span>Total:</span>
                                <span>{formatCurrency(ord.total)}</span>
                              </div>
                            </div>

                            {/* Approve / Reject buttons for manual transfers */}
                            {ord.paymentMethod !== 'Cash on Delivery' && ord.paymentStatus !== 'paid' && (
                              <div className="mt-3 pt-3 border-t border-hairline flex gap-2">
                                <button
                                  onClick={() => handlePaymentApproval(ord.id, true)}
                                  className="flex-1 py-1 text-xs font-sans font-medium rounded bg-[#DDE9DE] text-[#3F6B45] hover:bg-sage hover:text-ivory transition-colors"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => handlePaymentApproval(ord.id, false)}
                                  className="flex-1 py-1 text-xs font-sans font-medium rounded bg-[#F3D9D6] text-garnet hover:bg-garnet hover:text-ivory transition-colors"
                                >
                                  Reject
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Section 3: Status Advancement & Actions */}
                        <div className="bg-paper p-5 rounded-lg border border-hairline flex flex-wrap items-center justify-between gap-4">
                          <div className="flex flex-wrap items-center gap-3">
                            <span className="text-xs font-sans text-taupe font-medium">
                              Advance Status:
                            </span>
                            <SelectInput
                              value={ord.status}
                              onChange={(val) => handleStatusChange(ord.id, val)}
                              options={[
                                { value: 'pending', label: 'Pending' },
                                { value: 'confirmed', label: 'Confirmed' },
                                { value: 'packed', label: 'Packed' },
                                { value: 'shipped', label: 'Shipped' },
                                { value: 'out_for_delivery', label: 'Out for Delivery' },
                                { value: 'delivered', label: 'Delivered' },
                              ]}
                            />
                            <button
                              onClick={() => handleCancelOrder(ord.id)}
                              className="px-3 py-2 text-xs font-sans font-medium text-garnet bg-[#F3D9D6] rounded-md hover:bg-garnet hover:text-ivory transition-colors"
                            >
                              Cancel Order
                            </button>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handlePrint(ord)}
                              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-sans font-medium bg-cream border border-hairline text-ink rounded-md hover:bg-champagne transition-colors"
                            >
                              <Printer size={14} /> Print Invoice
                            </button>
                          </div>
                        </div>

                        {/* Section 4: Courier Tracking */}
                        <div className="bg-paper p-5 rounded-lg border border-hairline">
                          <h5 className="text-xs font-sans uppercase tracking-wider text-taupe font-semibold mb-3 flex items-center gap-2">
                            <Truck size={15} /> Courier &amp; Fulfillment
                          </h5>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <input
                              type="text"
                              placeholder="Courier (e.g. Trax, TCS)"
                              defaultValue={ord.courier || ''}
                              onChange={(e) =>
                                setTrackingData((prev) => ({
                                  ...prev,
                                  [ord.id]: { ...(prev[ord.id] || {}), courier: e.target.value },
                                }))
                              }
                              className="px-3 py-2 text-xs font-sans bg-cream border border-hairline rounded-md text-ink"
                            />
                            <input
                              type="text"
                              placeholder="Tracking Number"
                              defaultValue={ord.trackingNumber || ''}
                              onChange={(e) =>
                                setTrackingData((prev) => ({
                                  ...prev,
                                  [ord.id]: {
                                    ...(prev[ord.id] || {}),
                                    trackingNumber: e.target.value,
                                  },
                                }))
                              }
                              className="px-3 py-2 text-xs font-sans bg-cream border border-hairline rounded-md text-ink"
                            />
                            <div className="flex gap-2">
                              <input
                                type="text"
                                placeholder="Tracking URL"
                                defaultValue={ord.trackingUrl || ''}
                                onChange={(e) =>
                                  setTrackingData((prev) => ({
                                    ...prev,
                                    [ord.id]: {
                                      ...(prev[ord.id] || {}),
                                      trackingUrl: e.target.value,
                                    },
                                  }))
                                }
                                className="flex-1 px-3 py-2 text-xs font-sans bg-cream border border-hairline rounded-md text-ink"
                              />
                              <button
                                onClick={() => handleSaveTracking(ord.id)}
                                className="px-4 py-2 text-xs font-sans font-medium bg-ink text-ivory rounded-md hover:bg-gold hover:text-ink transition-colors"
                              >
                                Save
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}

          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </div>
      )}

      {/* Confirmation Dialogs */}
      <ConfirmDialog
        isOpen={statusConfirm.open}
        title="Confirm Status Change"
        message={`Are you sure you want to update this order's status to "${statusConfirm.newStatus}"? This will log in history.`}
        confirmLabel="Update Status"
        onConfirm={confirmStatusUpdate}
        onCancel={() => setStatusConfirm({ open: false, orderId: null, newStatus: '' })}
      />

      <ConfirmDialog
        isOpen={cancelConfirm.open}
        title="Cancel Order"
        message="Are you sure you want to cancel this order? Reserved stock will be restored to store inventory."
        confirmLabel="Cancel Order"
        danger
        onConfirm={confirmCancel}
        onCancel={() => setCancelConfirm({ open: false, orderId: null })}
      />
    </div>
  );
}
