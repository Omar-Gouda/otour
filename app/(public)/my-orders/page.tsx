'use client';

import { useState } from 'react';
import { Navbar } from '@/components/storefront/Navbar';
import { Button } from '@/components/ui/Button';
import { getOrderByCodeAndPhone } from '@/services/orders.service';
import { Order } from '@/types';
import { Search, Package, Clock, CheckCircle, Truck, XCircle, FileText } from 'lucide-react';
import Link from 'next/link';

export default function MyOrdersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchedOrders, setSearchedOrders] = useState<Order[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setLoading(true);
    setHasSearched(true);

    try {
      // Pass the single search string (Order code OR Phone number)
      const results = await getOrderByCodeAndPhone(searchTerm.trim());
      setSearchedOrders(results);
    } catch (err) {
      console.error('Failed to search order:', err);
      setSearchedOrders(null);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Clock className="w-3.5 h-3.5" /> Pending
          </span>
        );
      case 'shipped':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Truck className="w-3.5 h-3.5" /> Shipped
          </span>
        );
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle className="w-3.5 h-3.5" /> Delivered
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <XCircle className="w-3.5 h-3.5" /> Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col selection:bg-amber-500 selection:text-black">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 py-10 w-full space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-serif font-bold text-amber-200">Track Your Orders</h1>
          <p className="text-xs text-zinc-400 font-sans">
            Enter your Order Code (e.g. LYL-XXXXXX) or Phone Number to view status details.
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex gap-2 max-w-xl mx-auto">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Order Code or Phone Number..."
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-xs text-zinc-100 focus:border-amber-500 focus:outline-none"
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="bg-amber-500 hover:bg-amber-400 text-black font-bold px-6 text-xs uppercase tracking-wider"
          >
            {loading ? 'Searching...' : 'Track'}
          </Button>
        </form>

        {/* Search Results */}
        {hasSearched && (
          <div className="space-y-4 pt-4">
            {!searchedOrders || searchedOrders.length === 0 ? (
              <div className="text-center py-12 bg-zinc-900/40 border border-zinc-800 rounded-2xl space-y-2">
                <Package className="w-10 h-10 text-zinc-600 mx-auto" />
                <p className="text-sm text-zinc-400">No orders found matching your search.</p>
              </div>
            ) : (
              searchedOrders.map((ord) => (
                <div
                  key={ord.id}
                  className="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-4 shadow-xl"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800/80 pb-4">
                    <div>
                      <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                        Order Reference
                      </span>
                      <p className="text-base font-serif font-bold text-amber-300">{ord.order_code}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusBadge(ord.status)}
                      <Link href={`/receipt/${ord.order_code}`}>
                        <Button
                          variant="secondary"
                          size="sm"
                          className="text-xs gap-1.5 border-zinc-800 hover:border-amber-500/40"
                        >
                          <FileText className="w-3.5 h-3.5" /> Receipt
                        </Button>
                      </Link>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                    <div>
                      <span className="text-zinc-500 text-[10px] uppercase">Client</span>
                      <p className="font-semibold text-zinc-200 mt-0.5">{ord.customer_name}</p>
                    </div>
                    <div>
                      <span className="text-zinc-500 text-[10px] uppercase">Phone</span>
                      <p className="font-semibold text-zinc-200 mt-0.5">{ord.customer_phone}</p>
                    </div>
                    <div>
                      <span className="text-zinc-500 text-[10px] uppercase">Total</span>
                      <p className="font-serif font-bold text-amber-300 mt-0.5">{ord.total_amount} EGP</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}