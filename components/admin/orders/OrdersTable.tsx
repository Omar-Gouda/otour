'use client';

import { useState, useRef, useEffect } from 'react';
import { Order } from '@/types';
import { Package, Trash2, ChevronDown, CheckCircle2, Clock, Truck, XCircle } from 'lucide-react';
import { updateOrderStatus, deleteOrder } from '@/services/orders.service';
import { ConfirmModal } from '@/components/ui/ConfirmModal';

interface OrdersTableProps {
  orders: Order[];
  loading?: boolean;
  onRefresh?: () => void;
  onRequestStatusChange?: (orderId: string, orderCode: string, newStatus: string) => void;
}

export function OrdersTable({ orders, loading, onRefresh, onRequestStatusChange }: OrdersTableProps) {
  const [deletingOrderId, setDeletingOrderId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleStatusChange = async (orderId: string, orderCode: string, status: string) => {
    setOpenDropdownId(null);
    if (onRequestStatusChange) {
      onRequestStatusChange(orderId, orderCode, status);
      return;
    }

    try {
      await updateOrderStatus(orderId, status as any);
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error('Failed to update order status:', err);
    }
  };

  const confirmDeleteOrder = async () => {
    if (!deletingOrderId) return;
    setIsDeleting(true);
    try {
      await deleteOrder(deletingOrderId);
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error('Failed to delete order:', err);
    } finally {
      setIsDeleting(false);
      setDeletingOrderId(null);
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'delivered':
        return { label: 'Delivered', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' };
      case 'shipped':
        return { label: 'Shipped', color: 'text-blue-400 bg-blue-500/10 border-blue-500/30' };
      case 'cancelled':
        return { label: 'Cancelled', color: 'text-rose-400 bg-rose-500/10 border-rose-500/30' };
      default:
        return { label: 'Pending', color: 'text-amber-200 bg-amber-500/10 border-amber-500/30' };
    }
  };

  if (loading) {
    return (
      <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-8 flex justify-center">
        <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-4 sm:p-6 space-y-4 font-mono text-xs shadow-xl">
        <h2 className="font-serif font-bold text-amber-200 text-sm sm:text-base uppercase tracking-wider flex items-center gap-2 border-b border-zinc-800 pb-3">
          <Package className="w-4 h-4 text-amber-400" /> Customer Orders ({orders.length})
        </h2>

        {orders.length === 0 ? (
          <p className="text-center py-8 text-zinc-500 text-xs">No orders registered in the system.</p>
        ) : (
          <div className="overflow-x-visible">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-500 text-[10px] uppercase">
                  <th className="py-2.5 px-3">Tracking Code</th>
                  <th className="py-2.5 px-3">Customer</th>
                  <th className="py-2.5 px-3">Total</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {orders.map((ord) => {
                  const code = ord.tracking_code || (ord as any).order_code || 'N/A';
                  const currentStatus = getStatusConfig(ord.status);
                  const isMenuOpen = openDropdownId === ord.id;

                  return (
                    <tr key={ord.id} className="hover:bg-zinc-950/40 transition-colors relative">
                      <td className="py-3 px-3 text-amber-300 font-bold">{code}</td>
                      <td className="py-3 px-3">
                        <span className="block font-bold text-zinc-200">{ord.customer_name}</span>
                        <span className="text-[10px] text-zinc-500">{ord.customer_phone}</span>
                      </td>
                      <td className="py-3 px-3 font-bold text-amber-400">{ord.total_amount} EGP</td>
                      <td className="py-3 px-3 relative">
                        {/* Custom Luxury Dropdown */}
                        <div className="relative inline-block" ref={isMenuOpen ? dropdownRef : null}>
                          <button
                            type="button"
                            onClick={() => setOpenDropdownId(isMenuOpen ? null : ord.id)}
                            className={`flex items-center justify-between gap-3 px-3 py-1.5 rounded-xl border text-[11px] font-bold uppercase transition-all cursor-pointer min-w-[130px] ${currentStatus.color} hover:border-amber-500/60 shadow-md`}
                          >
                            <span>{currentStatus.label}</span>
                            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''}`} />
                          </button>

                          {isMenuOpen && (
                            <div className="absolute left-0 mt-2 w-40 bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl z-50 overflow-hidden py-1.5 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150">
                              {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((st) => {
                                const cfg = getStatusConfig(st);
                                return (
                                  <button
                                    key={st}
                                    type="button"
                                    onClick={() => handleStatusChange(ord.id, code, st)}
                                    className={`w-full text-left px-3.5 py-2 text-[11px] uppercase font-bold transition-colors flex items-center justify-between hover:bg-amber-500/10 hover:text-amber-300 ${
                                      ord.status === st ? 'text-amber-400 bg-amber-500/5' : 'text-zinc-300'
                                    }`}
                                  >
                                    <span>{cfg.label}</span>
                                    {ord.status === st && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]" />}
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => setDeletingOrderId(ord.id)}
                          className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                          title="Delete order"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={!!deletingOrderId}
        title="Delete Order Record"
        message="Are you sure you want to delete this customer order? This action cannot be undone."
        confirmText={isDeleting ? 'Deleting...' : 'Delete Order'}
        onConfirm={confirmDeleteOrder}
        onCancel={() => setDeletingOrderId(null)}
      />
    </>
  );
}