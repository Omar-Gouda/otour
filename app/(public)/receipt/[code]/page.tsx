'use client';

import { useState, useEffect, use } from 'react';
import { Navbar } from '@/components/storefront/Navbar';
import { Button } from '@/components/ui/Button';
import { getOrderByCode } from '@/services/orders.service';
import { Order } from '@/types';
import { Printer, CheckCircle2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ReceiptPage({ params }: { params: Promise<{ code: string }> }) {
  const resolvedParams = use(params);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrderByCode(resolvedParams.code).then((data) => {
      setOrder(data);
      setLoading(false);
    });
  }, [resolvedParams.code]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
        <Navbar />
        <div className="max-w-xl mx-auto py-20 text-center text-zinc-500 animate-pulse font-serif">
          Fetching official receipt...
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
        <Navbar />
        <div className="max-w-xl mx-auto py-20 text-center">
          <p className="text-zinc-400 mb-4">Receipt not found.</p>
          <Link href="/"><Button>Back to Boutique</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col selection:bg-amber-500 selection:text-black">
      <Navbar />

      <main className="flex-1 max-w-2xl mx-auto px-4 py-12 w-full">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs text-amber-400 hover:text-amber-300 mb-6 print:hidden uppercase tracking-wider font-semibold"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Boutique
        </Link>

        <div className="bg-zinc-900 border border-amber-500/40 rounded-2xl p-6 sm:p-10 shadow-2xl">
          <div className="text-center pb-6 border-b border-zinc-800">
            <CheckCircle2 className="w-12 h-12 text-amber-400 mx-auto mb-2 print:hidden" />
            <h1 className="text-2xl font-serif font-bold text-amber-300">AURA LUXE RECEIPT</h1>
            <p className="text-xs text-zinc-400 mt-1">
              Order Code: <span className="text-amber-300 font-mono font-bold">{order.order_code}</span>
            </p>
            <p className="text-[10px] text-zinc-500">{new Date(order.created_at).toLocaleString()}</p>
          </div>

          <div className="py-6 border-b border-zinc-800 space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-zinc-400">Customer Name:</span> <span className="font-semibold text-zinc-200">{order.customer_name}</span></div>
            <div className="flex justify-between"><span className="text-zinc-400">Phone:</span> <span className="font-mono text-zinc-200">{order.customer_phone}</span></div>
            <div className="flex justify-between"><span className="text-zinc-400">Address:</span> <span className="text-zinc-200 text-right">{order.address}</span></div>
            <div className="flex justify-between"><span className="text-zinc-400">Status:</span> <span className="font-bold text-amber-400 uppercase text-xs">{order.status}</span></div>
          </div>

          <div className="py-6 border-b border-zinc-800">
            <h3 className="text-xs uppercase text-amber-400 font-semibold mb-3">Ordered Fragrances</h3>
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center text-sm py-1">
                <span className="text-zinc-200">{item.title} (x{item.quantity})</span>
                <span className="font-bold text-amber-300">{item.price * item.quantity} EGP</span>
              </div>
            ))}
          </div>

          <div className="pt-6 flex justify-between items-center text-lg font-bold">
            <span>Total Amount:</span>
            <span className="text-amber-300">{order.total_amount} EGP</span>
          </div>

          <div className="mt-8 flex gap-4 print:hidden">
            <Button onClick={() => window.print()} variant="secondary" className="flex-1 gap-2">
              <Printer className="w-4 h-4" /> Save / Print Receipt
            </Button>
            <Link href="/my-orders" className="flex-1">
              <Button className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold">Track My Orders</Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}