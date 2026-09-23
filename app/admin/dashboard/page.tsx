'use client';

import { useApp } from '@/context/AppContext';
import { Navbar } from '@/components/storefront/Navbar';
import { ExecutiveStatsGrid } from '@/components/admin/stats/ExecutiveStatsGrid';
import { OrdersTable } from '@/components/admin/orders/OrdersTable';
import { ReviewsModerationList } from '@/components/admin/reviews/ReviewsModerationList';
import { Button } from '@/components/ui/Button';
import { SlidersHorizontal } from 'lucide-react';
import { updateOrderStatus } from '@/services/orders.service';
import { deleteReview } from '@/services/reviews.service';
import { OrderStatus } from '@/types';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const { orders, reviews, loading, refreshOrders, refreshReviews } = useApp();

  const handleRefresh = async () => {
    await Promise.all([refreshOrders(), refreshReviews()]);
  };

  const handleStatusUpdate = async (orderId: string, orderCode: string, newStatus: OrderStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      await refreshOrders(); // Smooth state update without full page refresh
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleDeleteReview = async (id: string) => {
    try {
      await deleteReview(id);
      await refreshReviews(); // Smooth state update without full page refresh
    } catch (err) {
      console.error('Failed to delete review:', err);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col selection:bg-amber-500 selection:text-black font-mono">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
        
        {/* Top Header Matching Control Center Style */}
        <div className="bg-gradient-to-r from-zinc-900 via-zinc-900/90 to-zinc-950 border border-zinc-800/80 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="text-[10px] text-amber-400 uppercase tracking-widest font-bold">
              LAYAL EXECUTIVE MANAGEMENT
            </span>
            <h1 className="font-serif text-3xl font-bold text-amber-100 tracking-wider">
              Executive Dashboard
            </h1>
          </div>

          <Link href="/admin/control-center">
            <Button
              variant="secondary"
              className="bg-zinc-900 border-amber-500/30 text-amber-300 hover:bg-amber-500/10 text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer"
            >
              <SlidersHorizontal className="w-4 h-4 text-amber-400" /> Products Control Center
            </Button>
          </Link>
        </div>

        {/* Executive Stats Grid */}
        <ExecutiveStatsGrid orders={orders} />

        {/* Orders Management Table */}
        <OrdersTable
          orders={orders}
          loading={loading}
          onRefresh={handleRefresh}
          onRequestStatusChange={(orderId: string, orderCode: string, newStatus: OrderStatus) => {
            handleStatusUpdate(orderId, orderCode, newStatus);
          }}
        />

        {/* Customer Reviews Moderation */}
        <ReviewsModerationList
          reviews={reviews}
          onRequestDelete={handleDeleteReview}
        />

      </main>
    </div>
  );
}