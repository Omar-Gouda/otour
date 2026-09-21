'use client';

import { useState } from 'react';
import { Navbar } from '@/components/storefront/Navbar';
import { Button } from '@/components/ui/Button';
import { searchOrdersFlexible } from '@/services/orders.service';
import { Order } from '@/types';
import { Search, Package, CheckCircle2, Clock, Truck, XCircle } from 'lucide-react';
import Link from 'next/link';

export default function MyOrdersPage() {
  const [query, setQuery] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    const results = await searchOrdersFlexible(query);
    setOrders(results);
    setLoading(false);
    setSearched(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered':
        return <span className="inline-flex items-center gap-1 text-emerald-400 font-bold"><CheckCircle2 className="w-3.5 h-3.5" /> Delivered</span>;
      case 'shipped':
        return <span className="inline-flex items-center gap-1 text-blue-400 font-bold"><Truck className="w-3.5 h-3.5" /> Shipped</span>;
      case 'cancelled':
        return <span className="inline-flex items-center gap-1 text-rose-400 font-bold"><XCircle className="w-3.5 h-3.5" /> Cancelled</span>;
      default:
        return <span className="inline-flex items-center gap-1 text-amber-400 font-bold"><Clock className="w-3.5 h-3.5" /> Processing</span>;
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-mono">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto px-4 py-10 w-full space-y-8">
        <div className="text-center space-y-2">
          <h1 className="font-serif text-3xl font-bold text-amber-200 uppercase tracking-widest">
            Track My Orders
          </h1>
          <p className="text-xs text-zinc-400">Search by tracking code or phone number</p>
        </div>

        <form onSubmit={handleSearch} className="flex gap-2 max-w-xl mx-auto">
          <input
            type="text"
            required
            placeholder="Enter tracking code (e.g. LYL-XXXXXX) or Phone"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-amber-300 placeholder:text-zinc-600 focus:outline-none focus:border-amber-500 text-xs"
          />
          <Button type="submit" disabled={loading} className="bg-amber-500 text-black font-bold">
            <Search className="w-4 h-4 mr-1" /> Search
          </Button>
        </form>

        {loading && (
          <div className="flex justify-center py-10">
            <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {searched && !loading && orders.length === 0 && (
          <p className="text-center text-xs text-zinc-500 py-10">No matching orders found.</p>
        )}

        <div className="space-y-4">
          {orders.map((ord) => {
            const code = ord.tracking_code || (ord as any).order_code || 'N/A';
            return (
              <div key={ord.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-3">
                <div className="flex justify-between items-center border-b border-zinc-800 pb-3 text-xs">
                  <span className="text-amber-300 font-bold flex items-center gap-1.5">
                    <Package className="w-4 h-4 text-amber-400" /> {code}
                  </span>
                  {getStatusBadge(ord.status)}
                </div>

                <div className="flex justify-between items-center text-xs text-zinc-400 pt-1">
                  <span>Customer: {ord.customer_name} ({ord.customer_phone})</span>
                  <span className="text-amber-400 font-bold text-sm">{ord.total_amount} EGP</span>
                </div>

                <div className="pt-2 flex justify-end">
                  <Link
                    href={`/receipt/${code}`}
                    className="text-[10px] text-amber-400 hover:underline uppercase tracking-wider"
                  >
                    View Official Receipt →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}