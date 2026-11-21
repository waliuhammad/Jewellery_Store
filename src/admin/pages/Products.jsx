/**
 * Products page — Store Inventory
 * Full-featured products table with search, filters, bulk actions, and drawer editor.
 */
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Gem, Pencil, Copy, Trash2, Plus, ChevronDown,
} from 'lucide-react';

import PageHeader from '../layouts/PageHeader.jsx';
import {
  SearchInput, SelectInput, FilterPills, Toggle,
  ConfirmDialog, useAdminToast, EmptyState, SkeletonTable,
  Drawer, Pagination, StatusChip,
} from '../components/ui.jsx';
import { formatCurrency } from '../lib/format.js';
import { useDebounce } from '../hooks/useDebounce.js';
import { mockData } from '../data/mockStore.js';

// ─── helpers ────────────────────────────────────────────────────────────────

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

const STOCK_FILTERS = [
  { value: 'all',       label: 'All' },
  { value: 'in_stock',  label: 'In Stock' },
  { value: 'low_stock', label: 'Low Stock' },
  { value: 'out',       label: 'Out of Stock' },
];

const EMPTY_FORM = {
  name: '',
  slug: '',
  category: '',
  description: '',
  price: '',
  compareAtPrice: '',
  material: '',
  finish: '',
  stock: '',
  lowStockThreshold: 5,
  status: 'active',
  featured: false,
  imageUrl: '',
};

// ─── Stock progress bar ──────────────────────────────────────────────────────

function StockBar({ stock, threshold }) {
  if (stock === 0) {
    return (
      <div>
        <div className="w-24 h-1.5 rounded-full bg-hairline mb-1 overflow-hidden">
          <div className="h-full w-0 rounded-full bg-garnet" />
        </div>
        <span className="text-[11px] font-sans text-garnet font-medium">Out of stock</span>
      </div>
    );
  }
  const isLow = stock <= threshold;
  const pct = Math.min(100, (stock / (threshold * 4)) * 100);
  const color = isLow ? 'bg-gold' : 'bg-sage';
  const textColor = isLow ? 'text-gold' : 'text-taupe';
  return (
    <div>
      <div className="w-24 h-1.5 rounded-full bg-hairline mb-1 overflow-hidden">
        <div
          className={`h-full rounded-full ${color} transition-all`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className={`text-[11px] font-sans ${textColor}`}>{stock} in stock</span>
    </div>
  );
}

// ─── Field wrapper ───────────────────────────────────────────────────────────

function Field({ label, children, hint }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-sans font-medium uppercase tracking-wider text-taupe">
        {label}
      </label>
      {children}
      {hint && <p className="text-[11px] text-taupe font-sans">{hint}</p>}
    </div>
  );
}

const inputCls =
  'w-full px-3 py-2 text-sm font-sans bg-cream border border-hairline rounded-md text-ink ' +
  'placeholder:text-taupe/60 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-colors';

// ─── Product Drawer form ─────────────────────────────────────────────────────

function ProductDrawer({ isOpen, onClose, editingProduct, categories, onSave }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [autoSlug, setAutoSlug] = useState(true);

  useEffect(() => {
    if (isOpen) {
      if (editingProduct) {
        setForm({ ...EMPTY_FORM, ...editingProduct });
        setAutoSlug(false);
      } else {
        setForm(EMPTY_FORM);
        setAutoSlug(true);
      }
    }
  }, [isOpen, editingProduct]);

  const set = (key, val) =>
    setForm((f) => ({ ...f, [key]: val }));

  const handleName = (val) => {
    set('name', val);
    if (autoSlug) set('slug', slugify(val));
  };

  const handleSlug = (val) => {
    setAutoSlug(false);
    set('slug', val);
  };

  const categoryOptions = [
    { value: '', label: 'Select category…' },
    ...categories.map((c) => ({ value: c.id, label: c.name })),
  ];

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'draft', label: 'Draft' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const cat = categories.find((c) => c.id === form.category);
    onSave({
      ...form,
      price: parseFloat(form.price) || 0,
      compareAtPrice: form.compareAtPrice ? parseFloat(form.compareAtPrice) : null,
      stock: parseInt(form.stock, 10) || 0,
      lowStockThreshold: parseInt(form.lowStockThreshold, 10) || 5,
      categoryName: cat?.name || '',
    });
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={editingProduct ? 'Edit Product' : 'New Product'}
    >
      <form onSubmit={handleSubmit} className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Product Name */}
          <Field label="Product Name">
            <input
              required
              className={inputCls}
              value={form.name}
              onChange={(e) => handleName(e.target.value)}
              placeholder="e.g. Rose Gold Layered Necklace"
            />
          </Field>

          {/* Slug */}
          <Field label="Slug" hint="Auto-generated from name. URL-safe identifier.">
            <input
              className={`${inputCls} font-mono text-[12px]`}
              value={form.slug}
              onChange={(e) => handleSlug(e.target.value)}
              placeholder="rose-gold-layered-necklace"
            />
          </Field>

          {/* Category */}
          <Field label="Category">
            <SelectInput
              value={form.category}
              onChange={(v) => set('category', v)}
              options={categoryOptions}
              className="w-full"
            />
          </Field>

          {/* Description */}
          <Field label="Short Description">
            <textarea
              rows={2}
              className={inputCls}
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              placeholder="Brief product description…"
            />
          </Field>

          {/* Price row */}
          <div className="grid grid-cols-2 gap-4">
            <Field label="Price">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-sans text-taupe select-none">
                  Rs.
                </span>
                <input
                  required
                  type="number"
                  min="0"
                  step="1"
                  className={`${inputCls} pl-9`}
                  value={form.price}
                  onChange={(e) => set('price', e.target.value)}
                  placeholder="0"
                />
              </div>
            </Field>
            <Field label="Compare-at Price" hint="Optional, shown as struck-through.">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-sans text-taupe select-none">
                  Rs.
                </span>
                <input
                  type="number"
                  min="0"
                  step="1"
                  className={`${inputCls} pl-9`}
                  value={form.compareAtPrice ?? ''}
                  onChange={(e) => set('compareAtPrice', e.target.value)}
                  placeholder="0"
                />
              </div>
            </Field>
          </div>

          {/* Material + Finish */}
          <div className="grid grid-cols-2 gap-4">
            <Field label="Material">
              <input
                className={inputCls}
                value={form.material}
                onChange={(e) => set('material', e.target.value)}
                placeholder="925 Sterling Silver"
              />
            </Field>
            <Field label="Finish / Plating">
              <input
                className={inputCls}
                value={form.finish}
                onChange={(e) => set('finish', e.target.value)}
                placeholder="Rose Gold Plated"
              />
            </Field>
          </div>

          {/* Stock row */}
          <div className="grid grid-cols-2 gap-4">
            <Field label="Stock Quantity">
              <input
                type="number"
                min="0"
                step="1"
                className={inputCls}
                value={form.stock}
                onChange={(e) => set('stock', e.target.value)}
                placeholder="0"
              />
            </Field>
            <Field label="Low Stock Threshold">
              <input
                type="number"
                min="1"
                step="1"
                className={inputCls}
                value={form.lowStockThreshold}
                onChange={(e) => set('lowStockThreshold', e.target.value)}
                placeholder="5"
              />
            </Field>
          </div>

          {/* Status + Featured */}
          <div className="flex flex-col gap-4 pt-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-sans font-medium uppercase tracking-wider text-taupe mb-0.5">
                  Status
                </p>
                <p className="text-[11px] text-taupe font-sans">
                  {form.status === 'active' ? 'Visible in store' : 'Hidden from store'}
                </p>
              </div>
              <Toggle
                checked={form.status === 'active'}
                onChange={(v) => set('status', v ? 'active' : 'draft')}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-sans font-medium uppercase tracking-wider text-taupe mb-0.5">
                  Featured
                </p>
                <p className="text-[11px] text-taupe font-sans">Show on homepage / featured sections</p>
              </div>
              <Toggle
                checked={!!form.featured}
                onChange={(v) => set('featured', v)}
              />
            </div>
          </div>
        </div>

        {/* Sticky footer */}
        <div className="flex-shrink-0 flex items-center justify-end gap-3 px-6 py-4 border-t border-hairline bg-paper">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-sans font-medium border border-hairline rounded-md text-taupe hover:bg-cream transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 text-sm font-sans font-semibold rounded-md bg-ink text-ivory hover:bg-gold hover:text-ink transition-colors"
          >
            Save Product
          </button>
        </div>
      </form>
    </Drawer>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function Products() {
  const toast = useAdminToast();

  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);

  // Filters
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [stockFilter, setStockFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const PER_PAGE = 10;

  // Selection
  const [selectedIds, setSelectedIds] = useState(new Set());

  // Drawer
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Delete confirm
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, productId: null });
  const [bulkDeleteConfirm, setBulkDeleteConfirm] = useState(false);

  const debouncedSearch = useDebounce(search, 300);

  // Simulate load
  useEffect(() => {
    const t = setTimeout(() => {
      setProducts(mockData.products);
      setLoading(false);
    }, 500);
    return () => clearTimeout(t);
  }, []);

  // Category options
  const categoryOptions = useMemo(() => [
    { value: '', label: 'All Categories' },
    ...mockData.categories.map((c) => ({ value: c.id, label: c.name })),
  ], []);

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'draft', label: 'Draft' },
  ];

  // Filtered products
  const filtered = useMemo(() => {
    let list = products;
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      list = list.filter(
        (p) => p.name.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q),
      );
    }
    if (categoryFilter) {
      list = list.filter((p) => p.category === categoryFilter);
    }
    if (stockFilter === 'in_stock') {
      list = list.filter((p) => p.stock > p.lowStockThreshold);
    } else if (stockFilter === 'low_stock') {
      list = list.filter((p) => p.stock > 0 && p.stock <= p.lowStockThreshold);
    } else if (stockFilter === 'out') {
      list = list.filter((p) => p.stock === 0);
    }
    if (statusFilter !== 'all') {
      list = list.filter((p) => p.status === statusFilter);
    }
    return list;
  }, [products, debouncedSearch, categoryFilter, stockFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  // Reset to page 1 when filters change
  useEffect(() => { setPage(1); }, [debouncedSearch, categoryFilter, stockFilter, statusFilter]);

  // ─── Handlers ─────────────────────────────────────────────────────────────

  const toggleSelect = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === paginated.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginated.map((p) => p.id)));
    }
  };

  const openNew = () => {
    setEditingProduct(null);
    setDrawerOpen(true);
  };

  const openEdit = (product) => {
    setEditingProduct(product);
    setDrawerOpen(true);
  };

  const handleDuplicate = (product) => {
    const dup = {
      ...product,
      id: `prod-${Date.now()}`,
      name: `${product.name} (Copy)`,
      slug: `${product.slug}-copy`,
      status: 'draft',
    };
    setProducts((prev) => [dup, ...prev]);
    toast.show('Product duplicated as Draft', 'info');
  };

  const handleSave = (formData) => {
    if (editingProduct) {
      setProducts((prev) =>
        prev.map((p) => (p.id === editingProduct.id ? { ...p, ...formData } : p)),
      );
    } else {
      setProducts((prev) => [
        { ...formData, id: `prod-${Date.now()}` },
        ...prev,
      ]);
    }
    toast.show('Product saved successfully', 'success');
    setDrawerOpen(false);
  };

  const handleDelete = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setSelectedIds((prev) => { const n = new Set(prev); n.delete(id); return n; });
    toast.show('Product deleted', 'info');
    setDeleteConfirm({ open: false, productId: null });
  };

  const handleStatusToggle = (id, checked) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: checked ? 'active' : 'draft' } : p)),
    );
  };

  // Bulk
  const bulkActivate = () => {
    setProducts((prev) =>
      prev.map((p) => (selectedIds.has(p.id) ? { ...p, status: 'active' } : p)),
    );
    toast.show(`${selectedIds.size} products activated`, 'success');
    setSelectedIds(new Set());
  };

  const bulkDeactivate = () => {
    setProducts((prev) =>
      prev.map((p) => (selectedIds.has(p.id) ? { ...p, status: 'draft' } : p)),
    );
    toast.show(`${selectedIds.size} products deactivated`, 'info');
    setSelectedIds(new Set());
  };

  const bulkDelete = () => {
    setProducts((prev) => prev.filter((p) => !selectedIds.has(p.id)));
    toast.show(`${selectedIds.size} products deleted`, 'info');
    setSelectedIds(new Set());
    setBulkDeleteConfirm(false);
  };

  const allOnPageSelected =
    paginated.length > 0 && paginated.every((p) => selectedIds.has(p.id));

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div>
      <PageHeader
        title="Inventory"
        subtitle="Manage your product catalogue and stock levels"
        action={
          <button
            onClick={openNew}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-sans font-semibold rounded-md bg-ink text-ivory hover:bg-gold hover:text-ink transition-colors"
          >
            <Plus size={15} />
            New Product
          </button>
        }
      />

      {/* Toolbar */}
      <div className="bg-paper border border-hairline rounded-lg p-4 mb-4 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search products…"
            className="flex-1"
          />
          <SelectInput
            value={categoryFilter}
            onChange={setCategoryFilter}
            options={categoryOptions}
            className="sm:w-44"
          />
          <SelectInput
            value={statusFilter}
            onChange={setStatusFilter}
            options={statusOptions}
            className="sm:w-36"
          />
        </div>
        <FilterPills
          filters={STOCK_FILTERS}
          active={stockFilter}
          onChange={setStockFilter}
        />
      </div>

      {/* Bulk action bar */}
      <AnimatePresence>
        {selectedIds.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="flex items-center gap-3 flex-wrap mb-4 px-4 py-3 bg-champagne/60 border border-champagne rounded-lg"
          >
            <span className="text-sm font-sans font-medium text-ink">
              {selectedIds.size} selected
            </span>
            <div className="flex gap-2 ml-auto flex-wrap">
              <button
                onClick={bulkActivate}
                className="px-3 py-1.5 text-xs font-sans font-medium border border-sage text-sage rounded-md hover:bg-sage hover:text-ivory transition-colors"
              >
                Activate All
              </button>
              <button
                onClick={bulkDeactivate}
                className="px-3 py-1.5 text-xs font-sans font-medium border border-hairline text-taupe rounded-md hover:bg-cream transition-colors"
              >
                Deactivate All
              </button>
              <button
                onClick={() => setBulkDeleteConfirm(true)}
                className="px-3 py-1.5 text-xs font-sans font-medium bg-[#F3D9D6] text-garnet rounded-md hover:bg-garnet hover:text-ivory transition-colors"
              >
                Delete Selected
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table */}
      <div className="bg-paper border border-hairline rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-6">
            <SkeletonTable rows={8} />
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={Gem}
            title="No products found"
            message="Try adjusting your filters or add a new product."
            action={
              <button
                onClick={openNew}
                className="px-5 py-2 text-sm font-sans font-semibold rounded-md bg-ink text-ivory hover:bg-gold hover:text-ink transition-colors"
              >
                + New Product
              </button>
            }
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead className="bg-cream">
                  <tr>
                    <th className="w-10 pl-4 py-3">
                      <input
                        type="checkbox"
                        checked={allOnPageSelected}
                        onChange={toggleSelectAll}
                        className="rounded border-hairline accent-gold cursor-pointer"
                        aria-label="Select all on page"
                      />
                    </th>
                    {['Product', 'Category', 'Price', 'Stock', 'Status', 'Actions'].map((h) => (
                      <th
                        key={h}
                        scope="col"
                        className="px-4 py-3 text-left text-[11px] font-sans font-semibold uppercase tracking-wider text-taupe whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-hairline">
                  {paginated.map((product) => {
                    const isSelected = selectedIds.has(product.id);
                    return (
                      <tr
                        key={product.id}
                        className={`transition-colors ${
                          isSelected ? 'bg-blush/30' : 'hover:bg-cream/50'
                        }`}
                      >
                        {/* Checkbox */}
                        <td className="pl-4 py-3 w-10">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelect(product.id)}
                            className="rounded border-hairline accent-gold cursor-pointer"
                            aria-label={`Select ${product.name}`}
                          />
                        </td>

                        {/* Product */}
                        <td className="px-4 py-3 sticky left-0 z-10 bg-inherit">
                          <div className="flex items-center gap-3">
                            {product.imageUrl ? (
                              <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="w-14 h-14 rounded object-cover flex-shrink-0 border border-hairline"
                              />
                            ) : (
                              <div className="w-14 h-14 rounded bg-cream flex items-center justify-center flex-shrink-0 border border-hairline">
                                <Gem size={18} strokeWidth={1.5} className="text-taupe" />
                              </div>
                            )}
                            <div className="min-w-0">
                              <p className="text-sm font-sans font-medium text-ink truncate max-w-[180px]">
                                {product.name}
                              </p>
                              <p className="text-[11px] font-mono text-taupe truncate max-w-[180px]">
                                {product.slug}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="px-4 py-3">
                          <StatusChip status={product.categoryName || 'Unknown'} />
                        </td>

                        {/* Price */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <p className="text-sm font-sans font-semibold text-ink">
                            {formatCurrency(product.price)}
                          </p>
                          {product.compareAtPrice && (
                            <p className="text-[11px] font-sans text-taupe line-through">
                              {formatCurrency(product.compareAtPrice)}
                            </p>
                          )}
                        </td>

                        {/* Stock */}
                        <td className="px-4 py-3">
                          <StockBar stock={product.stock} threshold={product.lowStockThreshold} />
                        </td>

                        {/* Status toggle */}
                        <td className="px-4 py-3">
                          <Toggle
                            checked={product.status === 'active'}
                            onChange={(v) => handleStatusToggle(product.id, v)}
                          />
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => openEdit(product)}
                              className="p-1.5 rounded text-taupe hover:bg-cream hover:text-ink transition-colors"
                              aria-label="Edit product"
                            >
                              <Pencil size={15} />
                            </button>
                            <button
                              onClick={() => handleDuplicate(product)}
                              className="p-1.5 rounded text-taupe hover:bg-cream hover:text-ink transition-colors"
                              aria-label="Duplicate product"
                            >
                              <Copy size={15} />
                            </button>
                            <button
                              onClick={() =>
                                setDeleteConfirm({ open: true, productId: product.id })
                              }
                              className="p-1.5 rounded text-taupe hover:bg-[#F3D9D6] hover:text-garnet transition-colors"
                              aria-label="Delete product"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-4 pb-4 pt-2">
              <Pagination page={page} totalPages={totalPages} onChange={setPage} />
            </div>
          </>
        )}
      </div>

      {/* Product Drawer */}
      <ProductDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        editingProduct={editingProduct}
        categories={mockData.categories}
        onSave={handleSave}
      />

      {/* Delete single confirm */}
      <ConfirmDialog
        isOpen={deleteConfirm.open}
        title="Delete Product"
        message="This product will be permanently deleted. This action cannot be undone."
        confirmLabel="Delete"
        danger
        onConfirm={() => handleDelete(deleteConfirm.productId)}
        onCancel={() => setDeleteConfirm({ open: false, productId: null })}
      />

      {/* Bulk delete confirm */}
      <ConfirmDialog
        isOpen={bulkDeleteConfirm}
        title={`Delete ${selectedIds.size} Products`}
        message="All selected products will be permanently deleted. This action cannot be undone."
        confirmLabel="Delete All"
        danger
        onConfirm={bulkDelete}
        onCancel={() => setBulkDeleteConfirm(false)}
      />
    </div>
  );
}
