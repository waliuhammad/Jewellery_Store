import React, { useState } from 'react';
import { Download, CreditCard, DollarSign, Clock, CheckCircle } from 'lucide-react';
import PageHeader from '../layouts/PageHeader';
import { StatCard, SearchInput, StatusChip, useAdminToast, Pagination } from '../components/ui';
import { formatCurrency, formatDate, exportCSV } from '../lib/format';
import { mockData } from '../data/mockStore';

// Helper to normalize payment method names for display
const formatMethod = (m) => {
  if (!m) return 'Cash on Delivery';
  const lower = String(m).toLowerCase().replace(/_/g, ' ');
  if (lower.includes('cod') || lower.includes('cash')) return 'Cash on Delivery';
  if (lower.includes('jazz')) return 'JazzCash';
  if (lower.includes('easy')) return 'EasyPaisa';
  if (lower.includes('bank')) return 'Bank Transfer';
  return m;
};

export default function Transactions() {
  const toast = useAdminToast();

  const [transactions, setTransactions] = useState(() => {
    const rawOrders = mockData.orders || [];
    return rawOrders.map((ord, idx) => {
      const orderNum = ord.orderNumber || ord.id || `MJ-2611${String(idx + 1).padStart(2, '0')}`;
      const custName =
        ord.customerName ||
        (typeof ord.customer === 'object' ? ord.customer?.name : ord.customer) ||
        'Client';
      const custEmail =
        ord.customerEmail ||
        (typeof ord.customer === 'object' ? ord.customer?.email : '') ||
        'client@minhajewellers.com';
      const rawMethod = ord.paymentMethod || ord.payment?.method || 'Cash on Delivery';
      const method = formatMethod(rawMethod);
      const rawStatus = ord.paymentStatus || ord.payment?.status || (idx % 2 === 0 ? 'paid' : 'pending');
      const status = String(rawStatus).toLowerCase();
      const rawTid = ord.transactionId || ord.payment?.tid;
      const tid = rawTid || `TID-${String(orderNum).replace(/[^0-9]/g, '') || String(1040 + idx)}`;
      const date = ord.date || ord.createdAt || '2026-11-16T10:00:00Z';
      const amount = Number(ord.total || 4850);

      return {
        id: `tx-${ord.id || idx}`,
        orderId: ord.id || orderNum,
        orderNumber: orderNum,
        customerName: custName,
        customerEmail: custEmail,
        method,
        tid,
        date,
        amount,
        status,
      };
    });
  });

  const [search, setSearch] = useState('');
  const [methodFilter, setMethodFilter] = useState('all');
  const [page, setPage] = useState(1);
  const itemsPerPage = 8;

  const totalVolume = transactions.reduce((acc, t) => acc + (t.amount || 0), 0);
  const receivedVolume = transactions
    .filter((t) => t.status === 'paid')
    .reduce((acc, t) => acc + (t.amount || 0), 0);
  const awaitingVolume = transactions
    .filter((t) => t.status !== 'paid')
    .reduce((acc, t) => acc + (t.amount || 0), 0);
  const paidCount = transactions.filter((t) => t.status === 'paid').length;
  const avgPaid = paidCount > 0 ? Math.round(receivedVolume / paidCount) : 0;

  const filtered = transactions.filter((tx) => {
    if (
      methodFilter !== 'all' &&
      (tx.method || '').toLowerCase() !== methodFilter.toLowerCase()
    ) {
      return false;
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchNum = String(tx.orderNumber || '').toLowerCase().includes(q);
      const matchCust = String(tx.customerName || '').toLowerCase().includes(q);
      const matchTid = String(tx.tid || '').toLowerCase().includes(q);
      if (!matchNum && !matchCust && !matchTid) return false;
    }
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const paginated = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const handleExport = () => {
    exportCSV(
      'minha-jewellers-ledger',
      transactions.map((t) => ({
        Order: t.orderNumber,
        Customer: t.customerName,
        Method: t.method,
        TransactionID: t.tid,
        Date: formatDate(t.date),
        Amount: t.amount,
        Status: t.status,
      })),
      ['Order', 'Customer', 'Method', 'TransactionID', 'Date', 'Amount', 'Status']
    );
    toast?.show('Ledger exported successfully as CSV', 'success');
  };

  const handleMarkPaid = (id) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: 'paid' } : t))
    );
    toast?.show('Transaction marked as paid', 'success');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Ledger"
        subtitle="Payments across Cash on Delivery, JazzCash, EasyPaisa and Bank Transfer"
        action={
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-sans font-medium bg-noir text-ivory hover:bg-ink rounded-md transition-colors"
          >
            <Download size={15} /> Export CSV
          </button>
        }
      />

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={DollarSign}
          iconBg="#F5EEE4"
          label="Total Volume"
          value={totalVolume}
          tag="ALL TIME"
          delay={0}
        />
        <StatCard
          icon={CheckCircle}
          iconBg="#DDE9DE"
          label="Received"
          value={receivedVolume}
          tag="SETTLED"
          tagColor="#DDE9DE"
          delay={60}
        />
        <StatCard
          icon={Clock}
          iconBg="#F6E9CF"
          label="Awaiting Payment"
          value={awaitingVolume}
          tag="PENDING"
          tagColor="#F6E9CF"
          delay={120}
        />
        <StatCard
          icon={CreditCard}
          iconBg="#F1DDD6"
          label="Avg Paid Order"
          value={avgPaid}
          tag="AVERAGE"
          tagColor="#F1DDD6"
          delay={180}
        />
      </div>

      {/* Dark Ledger Table per Section 5.6 */}
      <div className="bg-noir rounded-lg p-6 shadow-soft text-ivory space-y-4 border border-white/10">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-4 border-b border-white/20">
          <div className="w-full sm:w-80">
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search Order #, customer or TID…"
              className="w-full px-3.5 py-2 text-xs font-sans bg-white/10 border border-white/25 rounded-md text-ivory placeholder:text-ivory/60 focus:outline-none focus:border-gold"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-ivory/90 font-sans font-medium">Payment Method:</span>
            <select
              value={methodFilter}
              onChange={(e) => {
                setMethodFilter(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 text-xs font-sans bg-white/10 border border-white/25 rounded-md text-ivory focus:outline-none focus:border-gold"
            >
              <option value="all" className="bg-noir text-ivory">All Methods</option>
              <option value="Cash on Delivery" className="bg-noir text-ivory">Cash on Delivery</option>
              <option value="JazzCash" className="bg-noir text-ivory">JazzCash</option>
              <option value="EasyPaisa" className="bg-noir text-ivory">EasyPaisa</option>
              <option value="Bank Transfer" className="bg-noir text-ivory">Bank Transfer</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans text-xs">
            <thead>
              <tr className="border-b border-white/20 uppercase tracking-wider text-[11px] text-champagne font-bold">
                <th scope="col" className="py-3 px-3 font-bold">Order</th>
                <th scope="col" className="py-3 px-3 font-bold">Customer</th>
                <th scope="col" className="py-3 px-3 font-bold">Method / TID</th>
                <th scope="col" className="py-3 px-3 font-bold">Date</th>
                <th scope="col" className="py-3 px-3 font-bold text-right">Amount</th>
                <th scope="col" className="py-3 px-3 font-bold">Status</th>
                <th scope="col" className="py-3 px-3 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/15">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-ivory/70">
                    No transactions match the selected criteria.
                  </td>
                </tr>
              ) : (
                paginated.map((tx) => (
                  <tr key={tx.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3.5 px-3 font-mono font-bold text-champagne">
                      {tx.orderNumber}
                    </td>
                    <td className="py-3.5 px-3 text-ivory font-medium">{tx.customerName}</td>
                    <td className="py-3.5 px-3">
                      <span className="font-semibold text-ivory">{tx.method}</span>
                      <span className="block font-mono text-[10px] text-ivory/70">{tx.tid}</span>
                    </td>
                    <td className="py-3.5 px-3 text-ivory/80 font-medium">{formatDate(tx.date)}</td>
                    <td className="py-3.5 px-3 font-mono font-bold text-right text-champagne">
                      {formatCurrency(tx.amount)}
                    </td>
                    <td className="py-3.5 px-3">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold font-sans uppercase tracking-wider ${
                          tx.status === 'paid'
                            ? 'bg-[#3F6B45]/40 text-[#A2D9AB] border border-[#78B87B]'
                            : tx.status === 'pending'
                            ? 'bg-[#8A6A1F]/40 text-[#F6E9CF] border border-[#D4A034]'
                            : 'bg-[#A33B3B]/40 text-[#FCE6E5] border border-[#E5918F]'
                        }`}
                      >
                        {tx.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      {tx.status !== 'paid' ? (
                        <button
                          onClick={() => handleMarkPaid(tx.id)}
                          className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider bg-champagne text-noir rounded hover:bg-gold transition-colors"
                        >
                          Mark Paid
                        </button>
                      ) : (
                        <span className="text-[11px] text-ivory/60 font-medium italic">Settled</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="pt-2">
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </div>
      </div>
    </div>
  );
}
