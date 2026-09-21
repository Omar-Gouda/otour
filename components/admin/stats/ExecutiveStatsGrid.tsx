'use client';

import { Order } from '@/types';
import { DollarSign, Clock, CheckCircle2, Package } from 'lucide-react';

interface ExecutiveStatsGridProps {
  orders: Order[];
}

export function ExecutiveStatsGrid({ orders }: ExecutiveStatsGridProps) {
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === 'pending').length;
  const deliveredOrders = orders.filter((o) => o.status === 'delivered').length;
  const shippedOrders = orders.filter((o) => o.status === 'shipped').length;
  const totalRevenue = orders
    .filter((o) => o.status === 'delivered')
    .reduce((acc, o) => acc + o.total_amount, 0);

  const deliveryRate = totalOrders > 0 ? Math.round((deliveredOrders / totalOrders) * 100) : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      
      {/* Delivered Revenue */}
      <div className="bg-zinc-900/90 border border-zinc-800 p-6 rounded-2xl space-y-3 shadow-xl">
        <div className="flex items-center justify-between text-amber-400">
          <span className="text-[10px] font-mono uppercase text-zinc-400">Delivered Revenue</span>
          <div className="p-2 bg-amber-500/10 rounded-xl">
            <DollarSign className="w-4 h-4 text-amber-400" />
          </div>
        </div>
        <p className="text-2xl sm:text-3xl font-serif font-bold text-amber-300">{totalRevenue} EGP</p>
        <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
          <div className="bg-amber-400 h-full rounded-full transition-all duration-500" style={{ width: `${deliveryRate}%` }} />
        </div>
        <span className="text-[10px] text-zinc-500 font-mono">{deliveryRate}% fulfillment rate</span>
      </div>

      {/* Pending Orders */}
      <div className="bg-zinc-900/90 border border-zinc-800 p-6 rounded-2xl space-y-3 shadow-xl">
        <div className="flex items-center justify-between text-amber-400">
          <span className="text-[10px] font-mono uppercase text-zinc-400">Pending Orders</span>
          <div className="p-2 bg-amber-500/10 rounded-xl">
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
        </div>
        <p className="text-2xl sm:text-3xl font-serif font-bold text-amber-400">{pendingOrders}</p>
        <span className="text-[10px] text-zinc-500 font-mono">Requires dispatching</span>
      </div>

      {/* Delivered Orders */}
      <div className="bg-zinc-900/90 border border-zinc-800 p-6 rounded-2xl space-y-3 shadow-xl">
        <div className="flex items-center justify-between text-emerald-400">
          <span className="text-[10px] font-mono uppercase text-zinc-400">Delivered Orders</span>
          <div className="p-2 bg-emerald-500/10 rounded-xl">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
        </div>
        <p className="text-2xl sm:text-3xl font-serif font-bold text-emerald-400">{deliveredOrders}</p>
        <span className="text-[10px] text-zinc-500 font-mono">{shippedOrders} currently in transit</span>
      </div>

      {/* Lifetime Orders */}
      <div className="bg-zinc-900/90 border border-zinc-800 p-6 rounded-2xl space-y-3 shadow-xl">
        <div className="flex items-center justify-between text-zinc-400">
          <span className="text-[10px] font-mono uppercase text-zinc-400">Total Lifetime Orders</span>
          <div className="p-2 bg-zinc-800 rounded-xl">
            <Package className="w-4 h-4" />
          </div>
        </div>
        <p className="text-2xl sm:text-3xl font-serif font-bold text-zinc-200">{totalOrders}</p>
        <span className="text-[10px] text-zinc-500 font-mono">Recorded in database</span>
      </div>

    </div>
  );
}