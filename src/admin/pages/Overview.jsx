import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DollarSign, ShoppingBag, Package, Users, ArrowUpRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import PageHeader from '../layouts/PageHeader';
import { StatCard, SkeletonCard, StatusChip } from '../components/ui';
import { formatCurrency, formatDate } from '../lib/format';
import { mockData } from '../data/mockStore';

const chartData7Days = [
  { day: 'Mon', revenue: 42000, orders: 4 },
  { day: 'Tue', revenue: 68000, orders: 7 },
  { day: 'Wed', revenue: 51000, orders: 5 },
  { day: 'Thu', revenue: 95000, orders: 11 },
  { day: 'Fri', revenue: 84000, orders: 9 },
  { day: 'Sat', revenue: 122000, orders: 14 },
  { day: 'Sun', revenue: 105000, orders: 12 },
];

const chartData30Days = [
  { day: 'Week 1', revenue: 260000, orders: 32 },
  { day: 'Week 2', revenue: 310000, orders: 41 },
  { day: 'Week 3', revenue: 420000, orders: 53 },
  { day: 'Week 4', revenue: 487500, orders: 62 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-paper border border-hairline p-3 rounded-lg shadow-soft text-xs font-sans">
        <p className="font-semibold text-ink mb-1">{label}</p>
        <p className="text-gold font-medium">
          Revenue: {formatCurrency(payload[0]?.value || 0)}
        </p>
        {payload[1] && (
          <p className="text-taupe">Orders: {payload[1]?.value || 0}</p>
        )}
      </div>
    );
  }
  return null;
};

export default function Overview() {
  const [loading, setLoading] = useState(true);
  const [chartRange, setChartRange] = useState('7'); // '7' | '30'

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  const recentOrders = (mockData.orders || []).slice(0, 5).map((ord, idx) => ({
    ...ord,
    orderNumber: ord.orderNumber || ord.id?.replace('ORD-', 'MJ-') || `MJ-2611${String(idx + 1).padStart(2, '0')}`,
    customerName: ord.customerName || (typeof ord.customer === 'object' ? ord.customer?.name : ord.customer) || 'Client',
  }));
  const lowStockProducts = mockData.products.filter((p) => p.stock <= 5).slice(0, 4);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <PageHeader
          title="Insights"
          subtitle="Your store at a glance — live overview & performance"
        />
        <div className="flex items-center gap-2 self-start sm:self-auto bg-cream px-3 py-1.5 rounded-full border border-hairline text-xs font-sans text-taupe">
          <span className="w-2 h-2 rounded-full bg-sage animate-pulse" />
          <span className="font-medium tracking-wide">DATABASE: CONNECTED</span>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          <>
            <StatCard
              icon={DollarSign}
              iconBg="#F6E9CF"
              label="Revenue Received"
              value={487500}
              tag="PAID"
              tagColor="#DDE9DE"
              delay={0}
            />
            <StatCard
              icon={ShoppingBag}
              iconBg="#F1DDD6"
              label="Total Orders"
              value={34}
              tag="7 PENDING"
              tagColor="#F1DDD6"
              delay={60}
            />
            <StatCard
              icon={Package}
              iconBg="#EAE2D6"
              label="Units in Stock"
              value={312}
              tag={`${mockData.products.length} PRODUCTS`}
              tagColor="#EAE2D6"
              delay={120}
            />
            <StatCard
              icon={Users}
              iconBg="#DDE9DE"
              label="Registered Users"
              value={28}
              tag="ACCOUNTS"
              tagColor="#DDE9DE"
              delay={180}
            />
          </>
        )}
      </div>

      {/* Sales Chart & Store Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart Card (2 cols) */}
        <div className="lg:col-span-2 bg-paper rounded-lg border border-hairline p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-display text-xl font-semibold text-ink">
                {chartRange === '7' ? 'Last 7 Days Sales' : 'Last 30 Days Sales'}
              </h3>
              <p className="text-xs font-sans text-taupe mt-0.5">
                Revenue in PKR and total order volume
              </p>
            </div>
            <div className="flex items-center p-1 bg-cream rounded-md border border-hairline text-xs font-sans">
              <button
                onClick={() => setChartRange('7')}
                className={`px-3 py-1 rounded transition-colors ${
                  chartRange === '7'
                    ? 'bg-paper text-ink shadow-sm font-medium'
                    : 'text-taupe hover:text-ink'
                }`}
              >
                7 Days
              </button>
              <button
                onClick={() => setChartRange('30')}
                className={`px-3 py-1 rounded transition-colors ${
                  chartRange === '30'
                    ? 'bg-paper text-ink shadow-sm font-medium'
                    : 'text-taupe hover:text-ink'
                }`}
              >
                30 Days
              </button>
            </div>
          </div>

          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={chartRange === '7' ? chartData7Days : chartData30Days}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#D4C6B1" vertical={false} />
                <XAxis
                  dataKey="day"
                  stroke="#4A3F39"
                  fontSize={12}
                  tickLine={false}
                  axisLine={{ stroke: '#D4C6B1' }}
                />
                <YAxis
                  yAxisId="left"
                  stroke="#4A3F39"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `${val / 1000}k`}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="#B88F45"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ fontSize: 12, paddingTop: 10 }}
                  iconType="circle"
                />
                <Bar
                  yAxisId="left"
                  dataKey="revenue"
                  name="Revenue (Rs.)"
                  fill="#B88F45"
                  radius={[4, 4, 0, 0]}
                  barSize={24}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="orders"
                  name="Orders"
                  stroke="#1E2A25"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: '#1E2A25' }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Store Summary Card (Noir style per Section 5.2) */}
        <div className="bg-noir rounded-lg p-6 text-ivory flex flex-col justify-between shadow-soft border border-white/10">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-white/15 mb-5">
              <h3 className="font-display text-xl font-bold text-ivory">Store Summary</h3>
              <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-champagne bg-white/15 px-2 py-0.5 rounded border border-white/20">
                Live
              </span>
            </div>

            <div className="space-y-4 text-sm font-sans">
              <div className="flex items-center justify-between">
                <span className="text-ivory/85 font-medium">Revenue Received</span>
                <span className="font-mono text-champagne font-bold">
                  {formatCurrency(487500)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-ivory/85 font-medium">Pending Orders</span>
                <span className="font-mono text-champagne font-bold">7</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-ivory/85 font-medium">Total Products</span>
                <span className="font-mono text-champagne font-bold">
                  {mockData.products.length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-ivory/85 font-medium">Low Stock Alert</span>
                <span className="font-mono text-rose font-bold">
                  {lowStockProducts.length} items
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-ivory/85 font-medium">Unread Messages</span>
                <span className="font-mono text-champagne font-bold">
                  {mockData.messages.filter((m) => !m.read).length}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-white/15 mt-6 flex gap-3">
            <Link
              to="/admin/orders"
              className="flex-1 py-2 text-center text-xs font-sans font-bold uppercase tracking-wider bg-champagne text-noir rounded hover:bg-gold transition-colors"
            >
              Manage Orders
            </Link>
            <Link
              to="/admin/products"
              className="flex-1 py-2 text-center text-xs font-sans font-semibold uppercase tracking-wider bg-white/15 text-ivory rounded hover:bg-white/25 border border-white/20 transition-colors"
            >
              Inventory
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom 2-col Grid: Recent Orders & Low Stock */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-paper rounded-lg border border-hairline p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display text-xl font-bold text-ink">Recent Orders</h3>
              <p className="text-xs font-sans text-taupe font-medium">Latest purchases across all channels</p>
            </div>
            <Link
              to="/admin/orders"
              className="text-xs font-sans font-bold text-ink hover:text-gold flex items-center gap-1 transition-colors underline decoration-hairline underline-offset-4"
            >
              View all <ArrowUpRight size={14} />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans text-sm">
              <thead>
                <tr className="border-b border-hairline text-[11px] text-taupe uppercase tracking-wider font-bold">
                  <th className="pb-2.5 font-bold">Order</th>
                  <th className="pb-2.5 font-bold">Customer</th>
                  <th className="pb-2.5 font-bold">Status</th>
                  <th className="pb-2.5 font-bold text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline text-xs font-medium">
                {recentOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-cream/40 transition-colors">
                    <td className="py-3 font-mono font-bold text-ink">{ord.orderNumber}</td>
                    <td className="py-3 text-ink">{ord.customerName}</td>
                    <td className="py-3">
                      <StatusChip status={ord.status} />
                    </td>
                    <td className="py-3 text-right font-bold text-ink">
                      {formatCurrency(ord.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock */}
        <div className="bg-paper rounded-lg border border-hairline p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display text-xl font-bold text-ink">Low Stock Warning</h3>
              <p className="text-xs font-sans text-taupe font-medium">Items at or under threshold</p>
            </div>
            <Link
              to="/admin/products"
              className="text-xs font-sans font-bold text-ink hover:text-gold flex items-center gap-1 transition-colors underline decoration-hairline underline-offset-4"
            >
              View inventory <ArrowUpRight size={14} />
            </Link>
          </div>

          <div className="divide-y divide-hairline">
            {lowStockProducts.map((p) => (
              <div key={p.id} className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={p.images?.[0] || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=100'}
                    alt={p.name}
                    className="w-10 h-10 object-cover rounded border border-hairline shadow-xs"
                  />
                  <div>
                    <p className="font-sans text-xs font-bold text-ink line-clamp-1">{p.name}</p>
                    <p className="font-mono text-[11px] text-taupe font-medium">{p.slug}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold font-sans border shadow-xs ${
                      p.stock === 0
                        ? 'bg-[#FCE7E6] border-garnet/30 text-garnet'
                        : p.stock <= 3
                        ? 'bg-[#F8EEDB] border-[#D1AF73] text-[#2A2019]'
                        : 'bg-[#FFF5E0] border-[#E0B554] text-[#7A5408]'
                    }`}
                  >
                    {p.stock === 0 ? 'Out of stock' : `${p.stock} units left`}
                  </span>
                  <p className="text-xs font-sans font-bold text-ink mt-0.5">
                    {formatCurrency(p.price)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
