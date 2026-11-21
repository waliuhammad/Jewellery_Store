import React, { useState } from 'react';
import { Download, User, Users, ShoppingBag, ShieldAlert, X, Phone, Mail, MapPin } from 'lucide-react';
import PageHeader from '../layouts/PageHeader';
import { StatCard, SearchInput, StatusChip, useAdminToast, Pagination, Drawer } from '../components/ui';
import { formatCurrency, formatDate, exportCSV } from '../lib/format';
import { mockData } from '../data/mockStore';

export default function Customers() {
  const toast = useAdminToast();
  const [customers, setCustomers] = useState(mockData.customers);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const itemsPerPage = 8;

  const totalRegistered = customers.length;
  const withOrdersCount = customers.filter((c) => c.orderCount > 0).length;
  const guestOrdersCount = 14; // demo stat

  const filtered = customers.filter((c) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      c.name?.toLowerCase().includes(q) ||
      c.email?.toLowerCase().includes(q) ||
      c.phone?.includes(q)
    );
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const handleToggleBlock = (e, customerId) => {
    e.stopPropagation();
    setCustomers((prev) =>
      prev.map((c) => {
        if (c.id === customerId) {
          const nextBlocked = !c.blocked;
          toast?.show(
            nextBlocked
              ? `${c.name} has been blocked from purchasing`
              : `${c.name} has been unblocked`,
            nextBlocked ? 'error' : 'success'
          );
          return { ...c, blocked: nextBlocked };
        }
        return c;
      })
    );
  };

  const handleExport = () => {
    exportCSV(
      'minha-jewellers-customers',
      customers.map((c) => ({
        Name: c.name,
        Email: c.email,
        Phone: c.phone || '—',
        Joined: formatDate(c.joinedAt),
        Orders: c.orderCount,
        TotalSpent: c.totalSpent,
        Status: c.blocked ? 'Blocked' : 'Active',
      })),
      ['Name', 'Email', 'Phone', 'Joined', 'Orders', 'TotalSpent', 'Status']
    );
    toast?.show('Customer list exported as CSV', 'success');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Customers"
        subtitle="Registered customer accounts and their order history"
        action={
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-sans font-medium bg-noir text-ivory hover:bg-ink rounded-md transition-colors"
          >
            <Download size={15} /> Export CSV
          </button>
        }
      />

      {/* 3 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          icon={Users}
          iconBg="#F5EEE4"
          label="Registered"
          value={totalRegistered}
          tag="ACCOUNTS"
          delay={0}
        />
        <StatCard
          icon={ShoppingBag}
          iconBg="#DDE9DE"
          label="With Orders"
          value={withOrdersCount}
          tag="ACTIVE BUYERS"
          tagColor="#DDE9DE"
          delay={60}
        />
        <StatCard
          icon={User}
          iconBg="#F1DDD6"
          label="Guest Orders"
          value={guestOrdersCount}
          tag="ONE-TIME"
          tagColor="#F1DDD6"
          delay={120}
        />
      </div>

      {/* Search Toolbar */}
      <div className="flex justify-between items-center">
        <div className="w-full sm:w-80">
          <SearchInput
            value={search}
            onChange={(val) => {
              setSearch(val);
              setPage(1);
            }}
            placeholder="Search name, email or phone…"
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-paper rounded-lg border border-hairline overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans text-xs">
            <thead className="bg-cream border-b border-hairline text-[11px] text-taupe uppercase tracking-wider font-bold">
              <tr>
                <th scope="col" className="py-3 px-4 font-bold sticky left-0 bg-cream">Customer</th>
                <th scope="col" className="py-3 px-4 font-bold">Joined</th>
                <th scope="col" className="py-3 px-4 font-bold text-center">Orders</th>
                <th scope="col" className="py-3 px-4 font-bold text-right">Spent</th>
                <th scope="col" className="py-3 px-4 font-bold">Status</th>
                <th scope="col" className="py-3 px-4 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-taupe font-medium">
                    No customers found matching "{search}".
                  </td>
                </tr>
              ) : (
                paginated.map((c) => (
                  <tr
                    key={c.id}
                    onClick={() => setSelectedCustomer(c)}
                    className="hover:bg-cream/40 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4 sticky left-0 bg-paper">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-champagne text-ink font-bold flex items-center justify-center text-xs border border-hairline/60 shadow-xs">
                          {c.name?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <p className="font-bold text-ink">{c.name}</p>
                          <p className="text-[11px] text-taupe font-medium">{c.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-ink font-medium">{formatDate(c.joinedAt)}</td>
                    <td className="py-3 px-4 text-center font-bold text-ink">{c.orderCount}</td>
                    <td className="py-3 px-4 text-right font-bold text-ink">
                      {formatCurrency(c.totalSpent)}
                    </td>
                    <td className="py-3 px-4">
                      <StatusChip status={c.blocked ? 'blocked' : 'active'} />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={(e) => handleToggleBlock(e, c.id)}
                        className={`px-3 py-1 text-[11px] font-bold rounded transition-colors shadow-xs ${
                          c.blocked
                            ? 'bg-[#E2F3E2] border border-[#78B87B] text-[#17501C] hover:bg-[#17501C] hover:text-ivory'
                            : 'bg-[#FCE7E6] border border-garnet/30 text-garnet hover:bg-garnet hover:text-ivory'
                        }`}
                      >
                        {c.blocked ? 'Unblock' : 'Block'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-hairline">
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </div>
      </div>

      {/* Footnote */}
      <p className="text-center text-xs text-taupe font-sans">
        Blocking stops a signed-in account from ordering and reviewing. Someone could still check
        out as a guest, so decline those orders from the Orders page.
      </p>

      {/* Customer Detail Drawer */}
      <Drawer
        isOpen={!!selectedCustomer}
        onClose={() => setSelectedCustomer(null)}
        title={selectedCustomer?.name || 'Customer Details'}
      >
        {selectedCustomer && (
          <div className="p-6 space-y-6">
            <div className="flex items-center gap-4 pb-6 border-b border-hairline">
              <div className="w-14 h-14 rounded-full bg-champagne text-ink font-display text-2xl font-semibold flex items-center justify-center">
                {selectedCustomer.name?.charAt(0)}
              </div>
              <div>
                <h3 className="font-display text-xl font-semibold text-ink">
                  {selectedCustomer.name}
                </h3>
                <p className="text-xs text-taupe">{selectedCustomer.email}</p>
                <div className="mt-1">
                  <StatusChip status={selectedCustomer.blocked ? 'blocked' : 'active'} />
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-cream rounded-lg border border-hairline">
                <p className="text-[11px] uppercase tracking-wider text-taupe font-medium">Orders Placed</p>
                <p className="font-display text-2xl font-semibold text-ink mt-1">
                  {selectedCustomer.orderCount}
                </p>
              </div>
              <div className="p-4 bg-cream rounded-lg border border-hairline">
                <p className="text-[11px] uppercase tracking-wider text-taupe font-medium">Lifetime Spend</p>
                <p className="font-display text-2xl font-semibold text-gold mt-1">
                  {formatCurrency(selectedCustomer.totalSpent)}
                </p>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-2">
              <h4 className="text-xs font-sans uppercase tracking-wider text-taupe font-semibold">
                Contact Information
              </h4>
              <div className="p-4 bg-paper rounded-lg border border-hairline text-xs space-y-2">
                <p className="flex items-center gap-2 text-ink">
                  <Phone size={14} className="text-taupe" />
                  {selectedCustomer.phone || '+92 300 1234567'}
                </p>
                <p className="flex items-center gap-2 text-ink">
                  <Mail size={14} className="text-taupe" />
                  {selectedCustomer.email}
                </p>
                <p className="flex items-center gap-2 text-ink">
                  <MapPin size={14} className="text-taupe" />
                  {selectedCustomer.address || 'Gulberg III, Lahore, Pakistan'}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-hairline">
              <button
                onClick={(e) => {
                  handleToggleBlock(e, selectedCustomer.id);
                  setSelectedCustomer((prev) => ({ ...prev, blocked: !prev.blocked }));
                }}
                className={`w-full py-2.5 text-xs uppercase tracking-wider font-semibold rounded transition-colors ${
                  selectedCustomer.blocked
                    ? 'bg-[#DDE9DE] text-[#3F6B45] hover:bg-sage hover:text-ivory'
                    : 'bg-[#F3D9D6] text-garnet hover:bg-garnet hover:text-ivory'
                }`}
              >
                {selectedCustomer.blocked ? 'Unblock Customer Account' : 'Block Customer Account'}
              </button>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
