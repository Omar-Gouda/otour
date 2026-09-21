'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Order, OrderItem } from '@/types';
import { getOrderByCode } from '@/services/orders.service'; // <-- تعديل اسم الدالة المستوردة
import { CheckCircle2, MapPin, Phone, User, ArrowLeft } from 'lucide-react';
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
      const data = await getOrderByCode(code); // <-- استخدام getOrderByCode
      setOrder(data);
      setLoading(false);
    };
    fetchOrder();
  }, [code]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center">
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
      <div className="max-w-lg w-full bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative">
        <div className="text-center space-y-2 border-b border-zinc-800 pb-6">
          <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
          <h1 className="font-serif text-2xl font-bold text-amber-200">Order Confirmed</h1>
          <p className="text-zinc-400 text-[10px] uppercase tracking-widest">Tracking Code: {order.tracking_code}</p>
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
          <div className="flex justify-between text-zinc-400">
            <span className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-amber-400" /> Destination:</span>
            <span className="text-zinc-100">{order.address}, {order.city}</span>
          </div>
        </div>

        <div className="space-y-3">
          <span className="text-[10px] text-amber-400 uppercase tracking-wider block">Ordered Items</span>
          <div className="space-y-2">
            {order.items?.map((item: OrderItem, idx: number) => (
              <div key={idx} className="flex justify-between items-center bg-zinc-950 p-3 rounded-xl border border-zinc-800/80">
                <span className="text-zinc-200 font-bold">{item.product?.title || 'Luxury Fragrance'} (x{item.quantity})</span>
                <span className="text-amber-300 font-bold">{item.unit_price * item.quantity} EGP</span>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-zinc-800 flex justify-between items-center text-sm font-bold">
          <span className="text-zinc-400">Total Amount:</span>
          <span className="text-amber-400 text-lg">{order.total_amount} EGP</span>
        </div>

        <div className="pt-4 flex justify-center">
          <Link href="/" className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-amber-300 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}