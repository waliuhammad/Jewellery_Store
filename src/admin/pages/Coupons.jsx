import React, { useState } from 'react';
import { Plus, TicketPercent, Trash2, Edit2, Copy, Check } from 'lucide-react';
import PageHeader from '../layouts/PageHeader';
import { StatusChip, Toggle, Drawer, useAdminToast, EmptyState, ConfirmDialog } from '../components/ui';
import { formatCurrency, formatDate } from '../lib/format';
import { mockData } from '../data/mockStore';

export default function Coupons() {
  const toast = useAdminToast();
  const [coupons, setCoupons] = useState(mockData.coupons || []);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, id: null });

  // Form State
  const [formData, setFormData] = useState({
    code: '',
    discountType: 'percentage', // 'percentage' | 'fixed'
    discountValue: 10,
    minOrderAmount: 2000,
    maxDiscountAmount: 1000,
    usageLimit: 100,
    validUntil: '2026-12-31',
    active: true,
  });

  const handleOpenDrawer = (coupon = null) => {
    if (coupon) {
      setEditingCoupon(coupon);
      setFormData({
        code: coupon.code,
        discountType: coupon.discountType || 'percentage',
        discountValue: coupon.discountValue || 10,
        minOrderAmount: coupon.minOrderAmount || 0,
        maxDiscountAmount: coupon.maxDiscountAmount || 0,
        usageLimit: coupon.usageLimit || 100,
        validUntil: coupon.validUntil || '2026-12-31',
        active: coupon.active ?? true,
      });
    } else {
      setEditingCoupon(null);
      setFormData({
        code: `MINHA${Math.floor(10 + Math.random() * 90)}`,
        discountType: 'percentage',
        discountValue: 10,
        minOrderAmount: 3000,
        maxDiscountAmount: 1500,
        usageLimit: 50,
        validUntil: '2026-12-31',
        active: true,
      });
    }
    setDrawerOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.code.trim()) {
      toast?.show('Coupon code cannot be empty', 'error');
      return;
    }

    if (editingCoupon) {
      setCoupons((prev) =>
        prev.map((c) => (c.id === editingCoupon.id ? { ...c, ...formData } : c))
      );
      toast?.show(`Coupon ${formData.code} updated`, 'success');
    } else {
      const newCoupon = {
        ...formData,
        id: `cpn-${Date.now()}`,
        usedCount: 0,
      };
      setCoupons((prev) => [newCoupon, ...prev]);
      toast?.show(`Coupon ${formData.code} created`, 'success');
    }
    setDrawerOpen(false);
  };

  const handleToggleActive = (id, currentActive) => {
    setCoupons((prev) =>
      prev.map((c) => (c.id === id ? { ...c, active: !currentActive } : c))
    );
    toast?.show('Coupon status updated', 'success');
  };

  const handleDelete = () => {
    const { id } = deleteConfirm;
    setCoupons((prev) => prev.filter((c) => c.id !== id));
    toast?.show('Coupon deleted', 'info');
    setDeleteConfirm({ open: false, id: null });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Coupons"
        subtitle="Discount codes customers can enter at checkout"
        action={
          <button
            onClick={() => handleOpenDrawer()}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-sans font-medium bg-ink text-ivory hover:bg-gold hover:text-ink rounded-md transition-colors"
          >
            <Plus size={16} /> New Coupon
          </button>
        }
      />

      {coupons.length === 0 ? (
        <div className="bg-paper rounded-lg border border-hairline p-12">
          <EmptyState
            icon={TicketPercent}
            title="No coupons yet"
            message="Create promotional codes to boost your store sales."
            action={
              <button
                onClick={() => handleOpenDrawer()}
                className="px-4 py-2 text-xs font-sans font-medium bg-ink text-ivory rounded-md hover:bg-gold hover:text-ink transition-colors"
              >
                + Create First Coupon
              </button>
            }
          />
        </div>
      ) : (
        <div className="bg-paper rounded-lg border border-hairline overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans text-xs">
              <thead className="bg-cream border-b border-hairline text-[11px] text-taupe uppercase tracking-wider font-bold">
                <tr>
                  <th scope="col" className="py-3 px-4 font-bold">Code</th>
                  <th scope="col" className="py-3 px-4 font-bold">Discount</th>
                  <th scope="col" className="py-3 px-4 font-bold">Min. Order</th>
                  <th scope="col" className="py-3 px-4 font-bold">Expires</th>
                  <th scope="col" className="py-3 px-4 font-bold">Used / Limit</th>
                  <th scope="col" className="py-3 px-4 font-bold">Status</th>
                  <th scope="col" className="py-3 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline">
                {coupons.map((c) => (
                  <tr key={c.id} className="hover:bg-cream/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-ink text-sm">
                      {c.code}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-ink">
                      {c.discountType === 'percentage'
                        ? `${c.discountValue}% off`
                        : formatCurrency(c.discountValue)}
                    </td>
                    <td className="py-3.5 px-4 text-ink font-medium">
                      {c.minOrderAmount ? formatCurrency(c.minOrderAmount) : 'None'}
                    </td>
                    <td className="py-3.5 px-4 text-taupe font-medium">{formatDate(c.validUntil)}</td>
                    <td className="py-3.5 px-4 font-mono text-ink font-semibold">
                      {c.usedCount || 0} / {c.usageLimit || '∞'}
                    </td>
                    <td className="py-3.5 px-4">
                      <Toggle
                        checked={c.active}
                        onChange={() => handleToggleActive(c.id, c.active)}
                        label={c.active ? 'Active' : 'Disabled'}
                      />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenDrawer(c)}
                          className="p-1.5 text-taupe hover:text-ink hover:bg-cream rounded transition-colors"
                          aria-label="Edit coupon"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm({ open: true, id: c.id })}
                          className="p-1.5 text-taupe hover:text-garnet hover:bg-[#F3D9D6] rounded transition-colors"
                          aria-label="Delete coupon"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Coupon Drawer */}
      <Drawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={editingCoupon ? 'Edit Coupon' : 'New Coupon'}
      >
        <form onSubmit={handleSave} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-sans uppercase tracking-wider text-taupe font-medium mb-1">
              Coupon Code
            </label>
            <input
              type="text"
              required
              value={formData.code}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, code: e.target.value.toUpperCase() }))
              }
              placeholder="e.g. MINHA10"
              className="w-full px-3 py-2 text-sm font-mono uppercase bg-cream border border-hairline rounded-md text-ink focus:outline-none focus:border-gold"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-sans uppercase tracking-wider text-taupe font-medium mb-1">
                Discount Type
              </label>
              <select
                value={formData.discountType}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, discountType: e.target.value }))
                }
                className="w-full px-3 py-2 text-sm font-sans bg-cream border border-hairline rounded-md text-ink"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount (Rs.)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-sans uppercase tracking-wider text-taupe font-medium mb-1">
                Discount Value
              </label>
              <input
                type="number"
                required
                min={1}
                value={formData.discountValue}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, discountValue: Number(e.target.value) }))
                }
                className="w-full px-3 py-2 text-sm font-sans bg-cream border border-hairline rounded-md text-ink"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-sans uppercase tracking-wider text-taupe font-medium mb-1">
                Min. Order Amount (Rs.)
              </label>
              <input
                type="number"
                min={0}
                value={formData.minOrderAmount}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, minOrderAmount: Number(e.target.value) }))
                }
                className="w-full px-3 py-2 text-sm font-sans bg-cream border border-hairline rounded-md text-ink"
              />
            </div>
            <div>
              <label className="block text-xs font-sans uppercase tracking-wider text-taupe font-medium mb-1">
                Max Usage Limit
              </label>
              <input
                type="number"
                min={1}
                value={formData.usageLimit}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, usageLimit: Number(e.target.value) }))
                }
                className="w-full px-3 py-2 text-sm font-sans bg-cream border border-hairline rounded-md text-ink"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-sans uppercase tracking-wider text-taupe font-medium mb-1">
              Valid Until
            </label>
            <input
              type="date"
              value={formData.validUntil}
              onChange={(e) => setFormData((prev) => ({ ...prev, validUntil: e.target.value }))}
              className="w-full px-3 py-2 text-sm font-sans bg-cream border border-hairline rounded-md text-ink"
            />
          </div>

          <div className="pt-2">
            <Toggle
              checked={formData.active}
              onChange={(val) => setFormData((prev) => ({ ...prev, active: val }))}
              label="Coupon is Active"
            />
          </div>

          <div className="pt-6 border-t border-hairline flex gap-3">
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              className="flex-1 py-2 text-xs font-sans font-medium border border-ink/20 rounded text-taupe hover:bg-cream"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2 text-xs font-sans font-medium bg-ink text-ivory rounded hover:bg-gold hover:text-ink transition-colors"
            >
              Save Coupon
            </button>
          </div>
        </form>
      </Drawer>

      <ConfirmDialog
        isOpen={deleteConfirm.open}
        title="Delete Coupon"
        message="Are you sure you want to delete this coupon? Customers will no longer be able to use it."
        confirmLabel="Delete"
        danger
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirm({ open: false, id: null })}
      />
    </div>
  );
}
