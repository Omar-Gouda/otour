'use client';

import { useState, useEffect } from 'react';
import { getAllOrders, updateOrderStatus } from '@/services/orders.service';
import { getDashboardAnalytics } from '@/services/analytics.service';
import { getAllReviewsWithProduct, deleteReview } from '@/services/reviews.service';
import { Order } from '@/types';
import { Button } from '@/components/ui/Button';
import { StatCard } from '@/components/admin/StatCard';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import Link from 'next/link';
import {
  Package,
  DollarSign,
  CheckCircle2,
  Sliders,
  ExternalLink,
  Eye,
  Clock,
  MessageSquare,
  Trash2,
  Star,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [deletingReviewId, setDeletingReviewId] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
    totalProducts: 0,
    siteVisits: 0,
  });

  const loadData = async () => {
    const ords = await getAllOrders();
    setOrders(ords);
    const stats = await getDashboardAnalytics();
    setAnalytics(stats);
    const revs = await getAllReviewsWithProduct();
    setReviews(revs);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusChange = async (orderId: string, status: Order['status']) => {
    await updateOrderStatus(orderId, status);
    await loadData();
  };

  const handleConfirmDeleteReview = async () => {
    if (deletingReviewId) {
      await deleteReview(deletingReviewId);
      setDeletingReviewId(null);
      await loadData();
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6 sm:p-10 selection:bg-amber-500 selection:text-black space-y-10">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-zinc-800 pb-6">
          <div>
            <h1 className="text-2xl font-serif font-bold text-amber-300">AURA LUXE Executive Dashboard</h1>
            <p className="text-xs text-zinc-400 mt-1">Live metrics, visits, order tracking, and review moderation</p>
          </div>
          <Link href="/admin/control-center">
            <Button className="gap-2 bg-amber-500 hover:bg-amber-400 text-black font-bold">
              <Sliders className="w-4 h-4" /> Open Control Center
            </Button>
          </Link>
        </div>

        {/* Analytics Cards Grid (6 Stat Cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard
            title="Delivered Revenue"
            value={`${analytics.totalRevenue} EGP`}
            icon={DollarSign}
            iconColor="text-amber-400"
            borderColor="border-amber-500/30"
          />
          <StatCard
            title="Total Site Visits"
            value={analytics.siteVisits}
            icon={Eye}
            iconColor="text-purple-400"
          />
          <StatCard
            title="Pending Orders"
            value={analytics.pendingOrders}
            icon={Clock}
            iconColor="text-yellow-400"
          />
          <StatCard
            title="Delivered Orders"
            value={analytics.deliveredOrders}
            icon={CheckCircle2}
            iconColor="text-emerald-400"
          />
          <StatCard
            title="Total Orders"
            value={analytics.totalOrders}
            icon={Package}
            iconColor="text-blue-400"
          />
          <StatCard
            title="Catalog Products"
            value={analytics.totalProducts}
            icon={Sliders}
            iconColor="text-zinc-400"
          />
        </div>

        {/* Orders Tracking Table */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-zinc-800">
            <h2 className="text-lg font-serif font-bold text-amber-200">Customer Orders Tracking</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-zinc-300">
              <thead className="bg-zinc-950/80 text-zinc-400 uppercase tracking-wider text-[10px] border-b border-zinc-800">
                <tr>
                  <th className="p-4">Order Code</th>
                  <th className="p-4">Customer Details</th>
                  <th className="p-4">Total Amount</th>
                  <th className="p-4">Tracking Status</th>
                  <th className="p-4 text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-zinc-500 font-serif">
                      No customer orders recorded yet.
                    </td>
                  </tr>
                ) : (
                  orders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-zinc-900/80 transition-colors">
                      <td className="p-4 font-mono font-bold text-amber-400">{ord.order_code}</td>
                      <td className="p-4">
                        <p className="font-semibold text-zinc-100">{ord.customer_name}</p>
                        <p className="text-[10px] text-zinc-500">{ord.customer_phone}</p>
                      </td>
                      <td className="p-4 font-bold text-amber-300">{ord.total_amount} EGP</td>
                      <td className="p-4">
                        <select
                          value={ord.status}
                          onChange={(e) => handleStatusChange(ord.id, e.target.value as Order['status'])}
                          className="bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1 text-xs text-zinc-200 focus:border-amber-500 focus:outline-none"
                        >
                          <option value="pending">Pending</option>
                          <option value="shipped">Shipped 🚚</option>
                          <option value="delivered">Delivered ✅</option>
                          <option value="cancelled">Cancelled ❌</option>
                        </select>
                      </td>
                      <td className="p-4 text-right">
                        <Link
                          href={`/receipt/${ord.order_code}`}
                          target="_blank"
                          className="inline-flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 font-semibold"
                        >
                          View Receipt <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Customer Reviews Moderation Section */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-amber-400" />
              <h2 className="text-lg font-serif font-bold text-amber-200">Customer Product Reviews ({reviews.length})</h2>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-zinc-300">
              <thead className="bg-zinc-950/80 text-zinc-400 uppercase tracking-wider text-[10px] border-b border-zinc-800">
                <tr>
                  <th className="p-4">Product</th>
                  <th className="p-4">Author</th>
                  <th className="p-4">Rating</th>
                  <th className="p-4">Comment</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {reviews.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-zinc-500 font-serif">
                      No customer reviews submitted yet.
                    </td>
                  </tr>
                ) : (
                  reviews.map((rev) => (
                    <tr key={rev.id} className="hover:bg-zinc-900/80 transition-colors">
                      <td className="p-4 font-bold text-zinc-200">{rev.products?.title || 'General'}</td>
                      <td className="p-4 text-amber-300 font-semibold">{rev.author_name}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-1 text-amber-400 font-bold">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          <span>{rev.rating} / 5</span>
                        </div>
                      </td>
                      <td className="p-4 text-zinc-300 max-w-xs truncate">{rev.comment}</td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => setDeletingReviewId(rev.id)}
                          className="p-2 rounded-lg bg-zinc-800 hover:bg-rose-500/20 text-zinc-400 hover:text-rose-400 border border-zinc-700 transition-all"
                          title="Delete Review"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Delete Review Confirm Modal */}
      <ConfirmModal
        isOpen={Boolean(deletingReviewId)}
        title="Delete Customer Review"
        message="Are you sure you want to remove this review? It will be deleted permanently."
        confirmText="Yes, Delete"
        cancelText="Keep Review"
        onConfirm={handleConfirmDeleteReview}
        onCancel={() => setDeletingReviewId(null)}
      />
    </div>
  );
}