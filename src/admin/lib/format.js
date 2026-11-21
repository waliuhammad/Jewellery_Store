/**
 * Admin utility: currency formatting, date helpers, CSV export.
 */

export const CURRENCY = 'Rs.';

export function formatCurrency(amount) {
  if (amount === null || amount === undefined || isNaN(amount)) return `${CURRENCY}0`;
  return `${CURRENCY}${Number(amount).toLocaleString('en-PK')}`;
}

export function formatDate(dateVal) {
  if (!dateVal) return '—';
  const d = dateVal?.toDate ? dateVal.toDate() : new Date(dateVal);
  return d.toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function formatDateTime(dateVal) {
  if (!dateVal) return '—';
  const d = dateVal?.toDate ? dateVal.toDate() : new Date(dateVal);
  return d.toLocaleString('en-PK', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export function relativeTime(dateVal) {
  if (!dateVal) return '—';
  const d = dateVal?.toDate ? dateVal.toDate() : new Date(dateVal);
  const diff = Date.now() - d.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export function exportCSV(filename, rows, headers) {
  const escape = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const lines = [
    headers.map(escape).join(','),
    ...rows.map((r) => headers.map((h) => escape(r[h])).join(',')),
  ];
  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
