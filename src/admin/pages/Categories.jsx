/**
 * Categories page — Store Categories
 * Grid of category cards with drawer editor and delete protection.
 */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, Tag } from 'lucide-react';

import PageHeader from '../layouts/PageHeader.jsx';
import {
  Toggle, Drawer, ConfirmDialog, useAdminToast,
  EmptyState, Skeleton, SearchInput,
} from '../components/ui.jsx';
import { mockData } from '../data/mockStore.js';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

const EMPTY_FORM = {
  name: '',
  slug: '',
  description: '',
  active: true,
  imageUrl: '',
};

const inputCls =
  'w-full px-3 py-2 text-sm font-sans bg-cream border border-hairline rounded-md text-ink ' +
  'placeholder:text-taupe/60 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-colors';

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

// ─── Category Drawer ──────────────────────────────────────────────────────────

function CategoryDrawer({ isOpen, onClose, editingCategory, onSave }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [autoSlug, setAutoSlug] = useState(true);

  useEffect(() => {
    if (isOpen) {
      if (editingCategory) {
        setForm({ ...EMPTY_FORM, ...editingCategory });
        setAutoSlug(false);
      } else {
        setForm(EMPTY_FORM);
        setAutoSlug(true);
      }
    }
  }, [isOpen, editingCategory]);

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleName = (val) => {
    set('name', val);
    if (autoSlug) set('slug', slugify(val));
  };

  const handleSlug = (val) => {
    setAutoSlug(false);
    set('slug', val);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={editingCategory ? 'Edit Category' : 'New Category'}
    >
      <form onSubmit={handleSubmit} className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Category Name */}
          <Field label="Category Name">
            <input
              required
              className={inputCls}
              value={form.name}
              onChange={(e) => handleName(e.target.value)}
              placeholder="e.g. Necklaces"
            />
          </Field>

          {/* Slug */}
          <Field label="Slug" hint="Auto-generated from name. URL-safe identifier.">
            <input
              className={`${inputCls} font-mono text-[12px]`}
              value={form.slug}
              onChange={(e) => handleSlug(e.target.value)}
              placeholder="necklaces"
            />
          </Field>

          {/* Description */}
          <Field label="Description">
            <textarea
              rows={3}
              className={inputCls}
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              placeholder="Brief description of this category…"
            />
          </Field>

          {/* Active toggle */}
          <div className="flex items-center justify-between py-1">
            <div>
              <p className="text-xs font-sans font-medium uppercase tracking-wider text-taupe mb-0.5">
                Active
              </p>
              <p className="text-[11px] text-taupe font-sans">
                {form.active ? 'Visible in store' : 'Hidden from store'}
              </p>
            </div>
            <Toggle
              checked={form.active}
              onChange={(v) => set('active', v)}
            />
          </div>

          {/* Image URL */}
          <Field label="Image URL" hint="Paste a direct image URL (HTTPS recommended).">
            <input
              type="url"
              className={inputCls}
              value={form.imageUrl}
              onChange={(e) => set('imageUrl', e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
          </Field>

          {/* Image preview */}
          <AnimatePresence>
            {form.imageUrl && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <p className="text-[11px] font-sans text-taupe mb-2">Preview</p>
                <div className="rounded-md overflow-hidden border border-hairline h-40 bg-cream">
                  <img
                    src={form.imageUrl}
                    alt="Category preview"
                    className="w-full h-full object-cover"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
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
            Save Category
          </button>
        </div>
      </form>
    </Drawer>
  );
}

// ─── Category Card ────────────────────────────────────────────────────────────

function CategoryCard({ category, onEdit, onDelete, onToggleActive }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      layout
      className="bg-paper rounded-lg border border-hairline overflow-hidden group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <div className="relative h-40 overflow-hidden bg-cream">
        {category.imageUrl ? (
          <img
            src={category.imageUrl}
            alt={category.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Tag size={32} strokeWidth={1} className="text-taupe/40" />
          </div>
        )}

        {/* Hover overlay with actions */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-noir/40 backdrop-blur-[2px] flex items-center justify-center gap-3"
            >
              <button
                onClick={() => onEdit(category)}
                className="p-2.5 rounded-full bg-paper text-ink hover:bg-champagne transition-colors shadow"
                aria-label="Edit category"
              >
                <Pencil size={16} />
              </button>
              <button
                onClick={() => onDelete(category)}
                className="p-2.5 rounded-full bg-paper text-garnet hover:bg-[#F3D9D6] transition-colors shadow"
                aria-label="Delete category"
              >
                <Trash2 size={16} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Body */}
      <div className="p-4">
        <h3 className="font-display text-lg font-semibold text-ink leading-tight mb-1">
          {category.name}
        </h3>
        <p className="text-xs text-taupe font-sans font-mono mb-3">
          {category.productCount} {category.productCount === 1 ? 'Product' : 'Products'} &bull; {category.slug}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-xs font-sans text-taupe">
            {category.active ? 'Active' : 'Inactive'}
          </span>
          <Toggle
            checked={category.active}
            onChange={(v) => onToggleActive(category.id, v)}
          />
        </div>
      </div>
    </motion.div>
  );
}

// ─── Skeleton grid ────────────────────────────────────────────────────────────

function CategorySkeleton() {
  return (
    <div className="bg-paper rounded-lg border border-hairline overflow-hidden">
      <div className="h-40 bg-gradient-to-r from-cream to-champagne animate-pulse" />
      <div className="p-4 space-y-2">
        <div className="h-5 w-32 rounded bg-gradient-to-r from-cream to-champagne animate-pulse" />
        <div className="h-3 w-24 rounded bg-gradient-to-r from-cream to-champagne animate-pulse" />
        <div className="h-5 w-16 rounded bg-gradient-to-r from-cream to-champagne animate-pulse mt-3" />
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function Categories() {
  const toast = useAdminToast();

  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  // deleteConfirm holds the category object (or null)
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, category: null });

  // Simulate load
  useEffect(() => {
    const t = setTimeout(() => {
      setCategories(mockData.categories);
      setLoading(false);
    }, 500);
    return () => clearTimeout(t);
  }, []);

  // ─── Handlers ───────────────────────────────────────────────────────────────

  const openNew = () => {
    setEditingCategory(null);
    setDrawerOpen(true);
  };

  const openEdit = (cat) => {
    setEditingCategory(cat);
    setDrawerOpen(true);
  };

  const handleSave = (formData) => {
    if (editingCategory) {
      setCategories((prev) =>
        prev.map((c) => (c.id === editingCategory.id ? { ...c, ...formData } : c)),
      );
      toast.show('Category updated successfully', 'success');
    } else {
      setCategories((prev) => [
        { ...formData, id: `cat-${Date.now()}`, productCount: 0 },
        ...prev,
      ]);
      toast.show('Category created successfully', 'success');
    }
    setDrawerOpen(false);
  };

  const handleDeleteRequest = (category) => {
    setDeleteConfirm({ open: true, category });
  };

  const handleDeleteConfirm = () => {
    const cat = deleteConfirm.category;
    if (!cat) return;
    if (cat.productCount > 0) {
      // Should not reach here — handled in dialog — but safety guard
      toast.show(`Reassign ${cat.productCount} products first`, 'error');
      setDeleteConfirm({ open: false, category: null });
      return;
    }
    setCategories((prev) => prev.filter((c) => c.id !== cat.id));
    toast.show('Category deleted', 'info');
    setDeleteConfirm({ open: false, category: null });
  };

  const handleToggleActive = (id, active) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, active } : c)),
    );
  };

  // ─── Delete dialog content (depends on productCount) ───────────────────────
  const deletingCat = deleteConfirm.category;
  const hasProducts = deletingCat && deletingCat.productCount > 0;

  return (
    <div>
      <PageHeader
        title="Categories"
        subtitle="Manage product categories and their display order"
        action={
          <button
            onClick={openNew}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-sans font-semibold rounded-md bg-ink text-ivory hover:bg-gold hover:text-ink transition-colors"
          >
            <Plus size={15} />
            New Category
          </button>
        }
      />

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <CategorySkeleton key={i} />
          ))}
        </div>
      ) : categories.length === 0 ? (
        <EmptyState
          icon={Tag}
          title="No categories yet"
          message="Create your first category to organise your products."
          action={
            <button
              onClick={openNew}
              className="px-5 py-2 text-sm font-sans font-semibold rounded-md bg-ink text-ivory hover:bg-gold hover:text-ink transition-colors"
            >
              + New Category
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {categories.map((cat) => (
            <CategoryCard
              key={cat.id}
              category={cat}
              onEdit={openEdit}
              onDelete={handleDeleteRequest}
              onToggleActive={handleToggleActive}
            />
          ))}
        </div>
      )}

      {/* Category Drawer */}
      <CategoryDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        editingCategory={editingCategory}
        onSave={handleSave}
      />

      {/* Delete Confirm Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirm.open}
        title={hasProducts ? 'Cannot Delete Category' : `Delete "${deletingCat?.name}"`}
        message={
          hasProducts
            ? `This category has ${deletingCat.productCount} product${
                deletingCat.productCount === 1 ? '' : 's'
              }. Please reassign them before deleting.`
            : 'This category will be permanently deleted. This action cannot be undone.'
        }
        confirmLabel={hasProducts ? 'Got it' : 'Delete'}
        danger={!hasProducts}
        onConfirm={
          hasProducts
            ? () => setDeleteConfirm({ open: false, category: null })
            : handleDeleteConfirm
        }
        onCancel={() => setDeleteConfirm({ open: false, category: null })}
      />
    </div>
  );
}
