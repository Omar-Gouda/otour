'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/storefront/Navbar';
import { Button } from '@/components/ui/Button';
import { StatCard } from '@/components/admin/StatCard';
import { getAllOrders, updateOrderStatus } from '@/services/orders.service';
import { getDashboardAnalytics } from '@/services/analytics.service';
import { getAllReviewsWithProduct, deleteReview } from '@/services/reviews.service';
import { Order } from '@/types';
import { SlidersHorizontal, DollarSign, Eye, Clock, CheckCircle2, Package, Star, Trash2, ArrowUpRight } from 'lucide-react';

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
    siteVisits: 20,
    totalProducts: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [fetchedOrders, fetchedAnalytics, fetchedReviews] = await Promise.all([
        getAllOrders(),
        getDashboardAnalytics(),
        getAllReviewsWithProduct(),
      ]);
      setOrders(fetchedOrders);
      setAnalytics(fetchedAnalytics as any);
      setReviews(fetchedReviews);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: Order['status']) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    try {
      await deleteReview(reviewId);
      setReviews((prev) => prev.filter((r) => r.id !== reviewId));
    } catch (err) {
      console.error('Failed to delete review:', err);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col selection:bg-amber-500 selection:text-black">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 w-full space-y-6 sm:space-y-10">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-800/80 pb-4 sm:pb-6">
          <div>
            <h1 className="text-xl sm:text-3xl font-serif font-bold text-amber-200 uppercase tracking-wider">
              Executive Dashboard
            </h1>
            <p className="text-xs text-zinc-500 mt-0.5">Live metrics, orders tracking, and review moderation</p>
          </div>

          <Link href="/admin/control-center" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs gap-2 py-2.5">
              <SlidersHorizontal className="w-4 h-4" /> Open Control Center
            </Button>
          </Link>
        </div>

        {/* Analytics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          <StatCard title="Delivered Revenue" value={`${analytics.totalRevenue} EGP`} icon={DollarSign} />
          <StatCard title="Total Visits" value={analytics.siteVisits} icon={Eye} />
          <StatCard title="Pending Orders" value={analytics.pendingOrders} icon={Clock} />
          <StatCard title="Delivered Orders" value={analytics.deliveredOrders} icon={CheckCircle2} />
          <StatCard title="Total Orders" value={analytics.totalOrders} icon={Package} />
          <StatCard title="Catalog Products" value={analytics.totalProducts} icon={SlidersHorizontal} />
        </div>

        {/* Customer Orders Tracking */}
        <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-4 sm:p-6 space-y-4">
          <h2 className="font-serif font-bold text-amber-300 text-base sm:text-lg">
            Customer Orders Tracking ({orders.length})
          </h2>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : orders.length === 0 ? (
            <p className="text-xs text-zinc-500 italic text-center py-6">No orders tracked yet.</p>
          ) : (
            <>
              {/* Desktop View Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-800 text-zinc-500 font-mono text-[10px] uppercase">
                      <th className="py-3 px-4">Order Code</th>
                      <th className="py-3 px-4">Customer</th>
                      <th className="py-3 px-4">Total Amount</th>
                      <th className="py-3 px-4">Tracking Status</th>
                      <th className="py-3 px-4 text-right">Receipt</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60">
                    {orders.map((o) => (
                      <tr key={o.id} className="hover:bg-zinc-900/60 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-amber-300">{o.order_code}</td>
                        <td className="py-3 px-4">
                          <p className="font-bold text-zinc-200">{o.customer_name}</p>
                          <p className="text-[10px] text-zinc-500">{o.customer_phone}</p>
                        </td>
                        <td className="py-3 px-4 font-serif font-bold text-amber-300">{o.total_amount} EGP</td>
                        <td className="py-3 px-4">
                          <select
                            value={o.status}
                            onChange={(e) => handleStatusChange(o.id, e.target.value as Order['status'])}
                            className="bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 rounded-lg px-2 py-1 focus:border-amber-500 focus:outline-none"
                          >
                            <option value="pending">Pending</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Link href={`/receipt/${o.order_code}`} target="_blank" className="text-amber-400 hover:underline inline-flex items-center gap-1 text-[11px]">
                            View Receipt <ArrowUpRight className="w-3 h-3" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Responsive Cards */}
              <div className="md:hidden space-y-3">
                {orders.map((o) => (
                  <div key={o.id} className="bg-zinc-950/80 border border-zinc-800 rounded-xl p-4 space-y-3">
                    <div className="flex justify-between items-center border-b border-zinc-800/60 pb-2">
                      <span className="font-mono font-bold text-amber-300 text-xs">{o.order_code}</span>
                      <span className="font-serif font-bold text-amber-300 text-xs">{o.total_amount} EGP</span>
                    </div>

                    <div className="flex justify-between items-center text-xs">
                      <div>
                        <p className="font-bold text-zinc-200">{o.customer_name}</p>
                        <p className="text-[10px] text-zinc-500">{o.customer_phone}</p>
                      </div>
                      <Link href={`/receipt/${o.order_code}`} target="_blank" className="text-amber-400 text-[10px] font-bold flex items-center gap-0.5">
                        Receipt <ArrowUpRight className="w-3 h-3" />
                      </Link>
                    </div>

                    <div className="pt-2 border-t border-zinc-800/60">
                      <label className="text-[9px] text-zinc-500 uppercase block mb-1">Update Status</label>
                      <select
                        value={o.status}
                        onChange={(e) => handleStatusChange(o.id, e.target.value as Order['status'])}
                        className="w-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 rounded-lg p-2 focus:border-amber-500 focus:outline-none"
                      >
                        <option value="pending">Pending</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Product Reviews Moderation */}
        <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-4 sm:p-6 space-y-4">
          <h2 className="font-serif font-bold text-amber-300 text-base sm:text-lg">
            Customer Product Reviews ({reviews.length})
          </h2>

          {reviews.length === 0 ? (
            <p className="text-xs text-zinc-500 italic text-center py-6">No customer reviews submitted yet.</p>
          ) : (
            <div className="space-y-3">
              {reviews.map((r) => (
                <div key={r.id} className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-serif font-bold text-xs text-amber-200">{r.products?.title || 'Perfume'}</span>
                      <span className="text-[10px] text-zinc-500">• by {r.author_name || r.customer_name}</span>
                    </div>
                    <p className="text-xs text-zinc-300 leading-relaxed">{r.comment}</p>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 border-t sm:border-t-0 border-zinc-800/60 pt-2 sm:pt-0">
                    <div className="flex items-center gap-1 text-amber-400 font-bold text-xs">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{r.rating} / 5</span>
                    </div>

                    <button
                      onClick={() => handleDeleteReview(r.id)}
                      className="p-1.5 text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                      title="Delete Review"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </main>
    </div>
  );
}