'use client';

import { useState, useEffect, use } from 'react';
import { Navbar } from '@/components/storefront/Navbar';
import { getOrderByCode } from '@/services/orders.service';
import { Order } from '@/types';
import { CheckCircle2, Printer, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ReceiptPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = use(params);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      const data = await getOrderByCode(code);
      setOrder(data);
      setLoading(false);
    };
    fetchOrder();
  }, [code]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4">
          <h2 className="text-2xl font-serif text-amber-200">Receipt Not Found</h2>
          <Link href="/">
            <span className="text-xs text-amber-400 hover:underline">Return to Boutique Home</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col selection:bg-amber-500 selection:text-black">
      <Navbar />

      <main className="flex-1 max-w-2xl mx-auto px-4 py-10 w-full space-y-6">
        <div className="flex justify-between items-center print:hidden">
          <Link href="/" className="inline-flex items-center gap-2 text-xs text-zinc-400 hover:text-amber-300">
            <ArrowLeft className="w-4 h-4" /> Home
          </Link>

          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 text-xs bg-zinc-900 border border-zinc-800 hover:border-amber-500/50 px-3 py-1.5 rounded-lg text-amber-300 transition-colors"
          >
            <Printer className="w-4 h-4" /> Print Receipt
          </button>
        </div>

        <div className="bg-zinc-900/90 border border-amber-500/30 p-8 rounded-2xl shadow-2xl space-y-6 print:border-none print:bg-white print:text-black">
          <div className="text-center space-y-2 border-b border-zinc-800 pb-6">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h1 className="text-2xl font-serif font-bold text-amber-300">Order Confirmed</h1>
            <p className="text-xs text-zinc-400 font-mono">Code: {order.order_code}</p>
            <p className="text-[10px] text-zinc-500 font-mono">
              Date: {new Date(order.created_at ?? Date.now()).toLocaleDateString()}
            </p>
          </div>

          <div className="space-y-2 text-xs border-b border-zinc-800 pb-6">
            <h3 className="font-bold text-amber-400 uppercase tracking-wider text-[10px]">Client Details</h3>
            <p><span className="text-zinc-500">Name:</span> {order.customer_name}</p>
            <p><span className="text-zinc-500">Phone:</span> {order.customer_phone}</p>
            <p><span className="text-zinc-500">Address:</span> {order.customer_address || order.address}</p>
          </div>

          <div className="space-y-3">
            <h3 className="font-bold text-amber-400 uppercase tracking-wider text-[10px]">Purchased Items</h3>
            <div className="divide-y divide-zinc-800/60">
              {order.items.map((item, idx) => {
                const title = item.title || item.product?.title || 'Fragrance';
                const price = item.price ?? item.product?.discount_price ?? item.product?.price ?? 0;
                return (
                  <div key={idx} className="py-2.5 flex justify-between items-center text-xs">
                    <div>
                      <p className="font-bold text-zinc-200">{title}</p>
                      <p className="text-[10px] text-zinc-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-serif text-amber-300 font-bold">{price * item.quantity} EGP</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="border-t border-amber-500/20 pt-4 flex justify-between items-center text-sm font-bold">
            <span>Total Paid</span>
            <span className="text-xl font-serif text-amber-300">{order.total_amount} EGP</span>
          </div>
        </div>
      </main>
    </div>
  );
}