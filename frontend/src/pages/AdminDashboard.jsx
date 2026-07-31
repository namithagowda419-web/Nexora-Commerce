import React, { useState, useEffect } from 'react';
import { DollarSign, ShoppingBag, Users, Package, AlertTriangle, TrendingUp } from 'lucide-react';
import API from '../services/api';
import { formatCurrency } from '../utils/formatters';
import AdminLayout from '../components/AdminLayout';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await API.get('/analytics/dashboard');
        setData(res.data);
      } catch (e) {
        console.error('Error fetching admin analytics:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="py-20 text-center font-playfair text-xl text-plum-primary">Loading Analytics...</div>
      </AdminLayout>
    );
  }

  const { totalRevenue, totalOrders, totalCustomers, totalProducts, recentOrders = [], lowStockProducts = [], monthlySales = [] } = data || {};

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="border-b border-lilac-soft dark:border-darkbg-border pb-4">
          <h1 className="font-playfair font-bold text-3xl text-charcoal dark:text-white">
            Analytics Overview
          </h1>
          <p className="text-xs text-gray-400 mt-1">Real-time revenue, customer metrics, and inventory alerts.</p>
        </div>

        {/* Top 4 Stat Widgets */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-darkbg-card p-6 rounded-3xl border border-lilac-soft dark:border-darkbg-border shadow-luxury flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-mauve-dusty uppercase">Total Revenue</p>
              <h3 className="font-playfair font-bold text-2xl text-plum-primary dark:text-lavender-soft mt-1">
                {formatCurrency(totalRevenue)}
              </h3>
            </div>
            <div className="p-3 bg-plum-primary/10 text-plum-primary rounded-2xl">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white dark:bg-darkbg-card p-6 rounded-3xl border border-lilac-soft dark:border-darkbg-border shadow-luxury flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-mauve-dusty uppercase">Total Orders</p>
              <h3 className="font-playfair font-bold text-2xl text-charcoal dark:text-white mt-1">
                {totalOrders}
              </h3>
            </div>
            <div className="p-3 bg-lavender-soft/20 text-plum-dark rounded-2xl">
              <ShoppingBag className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white dark:bg-darkbg-card p-6 rounded-3xl border border-lilac-soft dark:border-darkbg-border shadow-luxury flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-mauve-dusty uppercase">Total Clients</p>
              <h3 className="font-playfair font-bold text-2xl text-charcoal dark:text-white mt-1">
                {totalCustomers}
              </h3>
            </div>
            <div className="p-3 bg-mauve-dusty/20 text-plum-primary rounded-2xl">
              <Users className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white dark:bg-darkbg-card p-6 rounded-3xl border border-lilac-soft dark:border-darkbg-border shadow-luxury flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-mauve-dusty uppercase">Active Catalogue</p>
              <h3 className="font-playfair font-bold text-2xl text-charcoal dark:text-white mt-1">
                {totalProducts}
              </h3>
            </div>
            <div className="p-3 bg-plum-rich/10 text-plum-rich rounded-2xl">
              <Package className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Monthly Revenue Bar Graph Visualization */}
        <div className="bg-white dark:bg-darkbg-card p-6 sm:p-8 rounded-3xl border border-lilac-soft dark:border-darkbg-border shadow-luxury space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-playfair font-bold text-lg text-charcoal dark:text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-plum-primary" />
              <span>Monthly Revenue Growth ($)</span>
            </h3>
          </div>

          <div className="h-48 flex items-end justify-between gap-4 pt-8 px-4 border-b pb-2">
            {monthlySales.map((item, idx) => {
              const maxRev = Math.max(...monthlySales.map((m) => m.revenue));
              const heightPercent = Math.round((item.revenue / maxRev) * 100);
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                  <span className="text-[10px] font-bold text-plum-primary opacity-0 group-hover:opacity-100 transition">
                    ${(item.revenue / 1000).toFixed(1)}k
                  </span>
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className="w-full max-w-[40px] bg-gradient-to-t from-plum-rich to-lavender-soft rounded-t-xl group-hover:scale-105 transition-transform"
                  />
                  <span className="text-[11px] font-semibold text-gray-500">{item.month}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Low Stock & Recent Orders */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Low Stock Alerts */}
          <div className="bg-white dark:bg-darkbg-card p-6 rounded-3xl border border-lilac-soft dark:border-darkbg-border shadow-luxury space-y-4">
            <h3 className="font-playfair font-bold text-base text-rose-600 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              <span>Low Stock Alerts</span>
            </h3>
            {lowStockProducts.length > 0 ? (
              <div className="space-y-3">
                {lowStockProducts.map((p) => (
                  <div key={p._id} className="flex items-center justify-between text-xs p-3 bg-rose-50 dark:bg-rose-950/20 rounded-2xl border border-rose-100">
                    <span className="font-semibold text-charcoal dark:text-white truncate max-w-[200px]">{p.title}</span>
                    <span className="bg-rose-500 text-white font-bold px-2.5 py-0.5 rounded-full text-[10px]">
                      Only {p.stock} Left
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400">All product stock levels are healthy.</p>
            )}
          </div>

          {/* Recent Orders Table */}
          <div className="bg-white dark:bg-darkbg-card p-6 rounded-3xl border border-lilac-soft dark:border-darkbg-border shadow-luxury space-y-4">
            <h3 className="font-playfair font-bold text-base text-charcoal dark:text-white">
              Recent Orders
            </h3>
            <div className="space-y-3">
              {recentOrders.map((o) => (
                <div key={o._id} className="flex items-center justify-between text-xs p-3 bg-cream-warm dark:bg-darkbg-input rounded-2xl">
                  <div>
                    <span className="font-bold text-plum-primary">#{o.orderNumber}</span>
                    <p className="text-[10px] text-gray-400">{o.user?.name || 'Client'}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-bold">{formatCurrency(o.totalPrice)}</span>
                    <p className="text-[10px] text-emerald-600 font-semibold">{o.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
