import React, { useState } from 'react';
import { Star, CheckCircle, EyeOff, Trash2, MessageSquare, Reply } from 'lucide-react';
import PageHeader from '../layouts/PageHeader';
import { FilterPills, StatusChip, useAdminToast, EmptyState, ConfirmDialog } from '../components/ui';
import { formatDate } from '../lib/format';
import { mockData } from '../data/mockStore';

const RATING_FILTERS = [
  { value: 'all', label: 'All Reviews' },
  { value: 'approved', label: 'Approved' },
  { value: 'pending', label: 'Pending' },
  { value: 'low', label: '1–2 Stars' },
  { value: 'mid', label: '3 Stars' },
  { value: 'high', label: '4–5 Stars' },
];

export default function Reviews() {
  const toast = useAdminToast();
  const [reviews, setReviews] = useState(mockData.reviews || []);
  const [filter, setFilter] = useState('all');
  const [replyOpen, setReplyOpen] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, id: null });

  const totalReviews = reviews.length;
  const avgRating = totalReviews > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1)
    : '5.0';

  const filterCounts = RATING_FILTERS.map((rf) => {
    let count = reviews.length;
    if (rf.value === 'approved') count = reviews.filter((r) => r.approved).length;
    else if (rf.value === 'pending') count = reviews.filter((r) => !r.approved).length;
    else if (rf.value === 'low') count = reviews.filter((r) => r.rating <= 2).length;
    else if (rf.value === 'mid') count = reviews.filter((r) => r.rating === 3).length;
    else if (rf.value === 'high') count = reviews.filter((r) => r.rating >= 4).length;
    return { ...rf, count };
  });

  const filtered = reviews.filter((r) => {
    if (filter === 'approved') return r.approved;
    if (filter === 'pending') return !r.approved;
    if (filter === 'low') return r.rating <= 2;
    if (filter === 'mid') return r.rating === 3;
    if (filter === 'high') return r.rating >= 4;
    return true;
  });

  const handleToggleApproval = (id, currentApproved) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, approved: !currentApproved } : r))
    );
    toast?.show(
      currentApproved ? 'Review hidden from store' : 'Review approved for public display',
      'success'
    );
  };

  const handleSendReply = (reviewId) => {
    if (!replyText.trim()) return;
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, storeReply: replyText } : r))
    );
    toast?.show('Store reply posted', 'success');
    setReplyOpen(null);
    setReplyText('');
  };

  const handleDelete = () => {
    const { id } = deleteConfirm;
    setReviews((prev) => prev.filter((r) => r.id !== id));
    toast?.show('Review permanently deleted', 'info');
    setDeleteConfirm({ open: false, id: null });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reviews"
        subtitle="Moderate product reviews from verified customers"
      />

      {/* Summary Card */}
      <div className="bg-paper p-6 rounded-lg border border-hairline flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="text-center sm:text-left">
            <span className="font-display text-4xl font-semibold text-ink">{avgRating}</span>
            <div className="flex items-center gap-1 text-gold mt-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  fill={i < Math.round(avgRating) ? '#B88F45' : 'none'}
                  stroke="#B88F45"
                />
              ))}
            </div>
          </div>
          <div className="h-10 w-[1px] bg-hairline hidden sm:block" />
          <div>
            <p className="font-sans text-sm font-semibold text-ink">Overall Customer Sentiment</p>
            <p className="text-xs font-sans text-taupe mt-0.5">
              Based on {totalReviews} verified client reviews across all collections
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-sans text-taupe">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-sage" /> Approved:{' '}
            {reviews.filter((r) => r.approved).length}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-gold" /> Pending:{' '}
            {reviews.filter((r) => !r.approved).length}
          </span>
        </div>
      </div>

      {/* Filter Pills */}
      <FilterPills filters={filterCounts} active={filter} onChange={setFilter} />

      {/* Reviews List */}
      {filtered.length === 0 ? (
        <div className="bg-paper rounded-lg border border-hairline p-12">
          <EmptyState
            icon={Star}
            title="No reviews to show"
            message="No reviews match your selected filter."
          />
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((rev) => (
            <div
              key={rev.id}
              className="bg-paper p-5 rounded-lg border border-hairline shadow-sm space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={rev.productImage || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=100'}
                    alt={rev.productName}
                    className="w-12 h-12 object-cover rounded border border-hairline"
                  />
                  <div>
                    <p className="font-sans text-sm font-semibold text-ink">{rev.productName}</p>
                    <p className="text-xs font-sans text-taupe">
                      by <span className="font-medium text-ink">{rev.reviewerName}</span> ·{' '}
                      {formatDate(rev.date)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-gold">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        fill={i < rev.rating ? '#B88F45' : 'none'}
                        stroke="#B88F45"
                      />
                    ))}
                  </div>
                  <span
                    className={`text-[10px] uppercase font-sans font-medium px-2 py-0.5 rounded ${
                      rev.approved ? 'bg-[#DDE9DE] text-sage' : 'bg-[#F6E9CF] text-[#8A6A1F]'
                    }`}
                  >
                    {rev.approved ? 'Approved' : 'Pending'}
                  </span>
                </div>
              </div>

              <div>
                {rev.title && (
                  <h4 className="font-sans text-sm font-semibold text-ink mb-1">{rev.title}</h4>
                )}
                <p className="text-xs font-sans text-taupe leading-relaxed">{rev.comment}</p>
              </div>

              {/* Public Store Reply Display */}
              {rev.storeReply && (
                <div className="bg-cream/60 p-3 rounded border border-hairline text-xs font-sans">
                  <p className="font-medium text-ink mb-0.5 flex items-center gap-1.5">
                    <Reply size={13} className="text-gold" /> Response from Minha Jewellers:
                  </p>
                  <p className="text-taupe italic">"{rev.storeReply}"</p>
                </div>
              )}

              {/* Reply Form */}
              {replyOpen === rev.id && (
                <div className="pt-3 border-t border-hairline space-y-2">
                  <textarea
                    rows={2}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Write a public response on behalf of Minha Jewellers…"
                    className="w-full p-2.5 text-xs font-sans bg-cream border border-hairline rounded text-ink focus:outline-none focus:border-gold resize-none"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setReplyOpen(null)}
                      className="px-3 py-1.5 text-xs font-sans text-taupe hover:bg-cream rounded"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleSendReply(rev.id)}
                      className="px-3 py-1.5 text-xs font-sans font-medium bg-ink text-ivory rounded hover:bg-gold hover:text-ink transition-colors"
                    >
                      Post Reply
                    </button>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="pt-3 border-t border-hairline flex items-center justify-between">
                <button
                  onClick={() => {
                    setReplyOpen(replyOpen === rev.id ? null : rev.id);
                    setReplyText(rev.storeReply || '');
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-sans font-medium text-taupe hover:text-ink"
                >
                  <MessageSquare size={14} /> {rev.storeReply ? 'Edit Reply' : 'Reply to Client'}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleApproval(rev.id, rev.approved)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-sans font-medium rounded transition-colors ${
                      rev.approved
                        ? 'bg-cream text-taupe hover:bg-hairline'
                        : 'bg-[#DDE9DE] text-sage hover:bg-sage hover:text-ivory'
                    }`}
                  >
                    {rev.approved ? <EyeOff size={14} /> : <CheckCircle size={14} />}
                    {rev.approved ? 'Hide' : 'Approve'}
                  </button>

                  <button
                    onClick={() => setDeleteConfirm({ open: true, id: rev.id })}
                    className="p-1.5 text-taupe hover:text-garnet hover:bg-[#F3D9D6] rounded transition-colors"
                    aria-label="Delete review"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={deleteConfirm.open}
        title="Delete Review"
        message="Are you sure you want to permanently delete this customer review?"
        confirmLabel="Delete"
        danger
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirm({ open: false, id: null })}
      />
    </div>
  );
}
