'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/storefront/Navbar';
import { Button } from '@/components/ui/Button';
import { getOrdersByCodes, getOrderByCodeAndPhone } from '@/services/orders.service';
import { Order } from '@/types';
import { Search, Package, Clock, CheckCircle, Truck, XCircle, FileText } from 'lucide-react';
import Link from 'next/link';

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchCode, setSearchCode] = useState('');
  const [searchPhone, setSearchPhone] = useState('');
  const [searchResult, setSearchResult] = useState<Order | null>(null);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    const savedCodes = JSON.parse(localStorage.getItem('aura_luxe_orders') || '[]');
    if (savedCodes.length > 0) {
      getOrdersByCodes(savedCodes).then((data) => setOrders(data));
    }
  }, []);

  const handleManualSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
    const result = await getOrderByCodeAndPhone(searchCode, searchPhone);
    setSearchResult(result);
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4 text-amber-400" />;
      case 'shipped': return <Truck className="w-4 h-4 text-blue-400" />;
      case 'delivered': return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case 'cancelled': return <XCircle className="w-4 h-4 text-rose-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col selection:bg-amber-500 selection:text-black">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-10">
        <div className="text-center">
          <h1 className="text-3xl font-serif font-bold text-amber-200">Track Your Orders</h1>
          <p className="text-zinc-400 text-xs uppercase tracking-widest mt-1">Check order status and view printable receipts</p>
        </div>

        {/* Manual Lookup Form */}
        <div className="bg-zinc-900/60 border border-amber-500/20 p-6 rounded-2xl shadow-xl">
          <h2 className="text-xs uppercase font-bold text-amber-400 tracking-wider mb-4">Manual Order Lookup</h2>
          <form onSubmit={handleManualSearch} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              placeholder="Order Code (e.g. AURA-123456)"
              required
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              className="bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-amber-500"
            />
            <input
              type="tel"
              placeholder="WhatsApp Phone Number"
              required
              value={searchPhone}
              onChange={(e) => setSearchPhone(e.target.value)}
              className="bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-amber-500"
            />
            <Button type="submit" className="gap-2 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs">
              <Search className="w-3.5 h-3.5" /> Find Order
            </Button>
          </form>

          {searched && (
            <div className="mt-6 pt-6 border-t border-zinc-800">
              {searchResult ? (
                <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 flex justify-between items-center">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-amber-400">{searchResult.order_code}</span>
                      <span className="capitalize text-xs font-semibold px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300">
                        {searchResult.status}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 mt-1">{searchResult.total_amount} EGP</p>
                  </div>
                  <Link href={`/receipt/${searchResult.order_code}`}>
                    <Button variant="secondary" className="gap-1.5 text-xs">
                      <FileText className="w-3.5 h-3.5" /> View Receipt
                    </Button>
                  </Link>
                </div>
              ) : (
                <p className="text-xs text-rose-400 text-center">No order found matching these details.</p>
              )}
            </div>
          )}
        </div>

        {/* Local Orders History */}
        <div className="space-y-4">
          <h2 className="text-lg font-serif font-bold text-zinc-200">Recent Device Orders ({orders.length})</h2>

          {orders.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-zinc-800 rounded-2xl">
              <Package className="w-10 h-10 text-zinc-600 mx-auto mb-2" />
              <p className="text-zinc-500 text-xs">No order history saved on this device.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((ord) => (
                <div key={ord.id} className="bg-zinc-900/40 border border-zinc-800 p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-amber-400 text-sm">{ord.order_code}</span>
                      <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-zinc-950 border border-zinc-800 text-[11px] font-semibold uppercase">
                        {getStatusIcon(ord.status)}
                        <span>{ord.status}</span>
                      </div>
                    </div>
                    <p className="text-xs text-zinc-400 mt-2">
                      {ord.items.map((i) => `${i.title} (x${i.quantity})`).join(', ')}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 self-end sm:self-center">
                    <span className="text-base font-bold text-amber-300">{ord.total_amount} EGP</span>
                    <Link href={`/receipt/${ord.order_code}`}>
                      <Button variant="secondary" className="gap-1.5 text-xs">
                        <FileText className="w-3.5 h-3.5" /> Receipt
                      </Button>
                    </Link>
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