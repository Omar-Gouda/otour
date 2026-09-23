'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Order, OrderItem } from '@/types';
import { getOrderByCode } from '@/services/orders.service';
import { CheckCircle2, MapPin, Phone, User, ArrowLeft, Printer } from 'lucide-react';
import Link from 'next/link';

export default function OrderReceiptPage() {
  const params = useParams();
  const code = params?.code as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!code) return;
    const fetchOrder = async () => {
      setLoading(true);
      const data = await getOrderByCode(code);
      setOrder(data);
      setLoading(false);
    };
    fetchOrder();
  }, [code]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center font-mono">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center p-4 space-y-4 font-mono">
        <p className="text-zinc-400 text-sm">Order not found.</p>
        <Link href="/" className="px-4 py-2 bg-amber-500 text-black font-bold rounded-xl text-xs uppercase tracking-wider">
          Return to Store
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center p-4 sm:p-6 font-mono text-xs">
      
      {/* Clean Invoice Print Styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-receipt, #printable-receipt * {
            visibility: visible;
          }
          #printable-receipt {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: #ffffff !important;
            color: #000000 !important;
            border: none !important;
            box-shadow: none !important;
            padding: 24px !important;
          }
        }
      `}</style>

      <div 
        id="printable-receipt"
        className="max-w-lg w-full bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative"
      >
        <div className="text-center space-y-2 border-b border-zinc-800 pb-6 relative">
          {/* Small Print Icon on the Top Right */}
          <button
            onClick={handlePrint}
            className="absolute top-0 right-0 p-2 bg-zinc-800 hover:bg-zinc-700 text-amber-300 rounded-xl border border-zinc-700 transition-colors cursor-pointer print:hidden"
            title="Print Receipt"
          >
            <Printer className="w-4 h-4" />
          </button>

          <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
          <h1 className="font-serif text-2xl font-bold text-amber-200">LAYAL PARFUMERIE</h1>
          <p className="text-zinc-400 text-[10px] uppercase tracking-widest">Order Code: {order.tracking_code || order.order_code}</p>
        </div>

        <div className="space-y-3 border-b border-zinc-800 pb-6">
          <div className="flex justify-between text-zinc-400">
            <span className="flex items-center gap-2"><User className="w-3.5 h-3.5 text-amber-400" /> Customer:</span>
            <span className="text-zinc-100 font-bold">{order.customer_name}</span>
          </div>
          <div className="flex justify-between text-zinc-400">
            <span className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-amber-400" /> Phone:</span>
            <span className="text-zinc-100">{order.customer_phone}</span>
          </div>
          <div className="flex justify-between text-zinc-400 items-start">
            <span className="flex items-center gap-2 mt-0.5"><MapPin className="w-3.5 h-3.5 text-amber-400" /> Address:</span>
            <span className="text-zinc-100 text-right max-w-[260px] leading-relaxed">{order.address}</span>
          </div>
        </div>

        <div className="space-y-3">
          <span className="text-[10px] text-amber-400 uppercase tracking-wider block font-bold">Ordered Items</span>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {order.items && order.items.length > 0 ? (
              order.items.map((item: any, idx: number) => {
                const title = item.product?.title || item.product_title || 'Luxury Fragrance';
                const qty = item.quantity || 1;
                const price = item.unit_price ?? item.price ?? 0;
                return (
                  <div key={idx} className="flex justify-between items-center bg-zinc-950 p-3 rounded-xl border border-zinc-800/80">
                    <span className="text-zinc-200 font-bold">{title} (x{qty})</span>
                    <span className="text-amber-300 font-bold">{price * qty} EGP</span>
                  </div>
                );
              })
            ) : (
              <p className="text-zinc-500 italic text-center py-2">No items found.</p>
            )}
          </div>
        </div>

        <div className="pt-4 border-t border-zinc-800 flex justify-between items-center text-sm font-bold">
          <span className="text-zinc-400">Total Amount:</span>
          <span className="text-amber-400 text-lg">{order.total_amount} EGP</span>
        </div>

        <div className="pt-4 border-t border-zinc-800 flex items-center justify-end">
          <Link href="/" className="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-amber-300 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Return to Store
          </Link>
        </div>
      </div>
    </div>
  );
}