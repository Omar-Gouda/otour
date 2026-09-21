'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/storefront/Navbar';
import { ProductCard } from '@/components/ui/ProductCard';
import { useAppStore } from '@/lib/store';
import { getOrdersByCodes } from '@/services/orders.service';
import { Order } from '@/types';
import { Heart, ShoppingBag, Package } from 'lucide-react';

export default function WishlistPage() {
  const wishlist = useAppStore((state) => state.wishlist);
  const [pastOrders, setPastOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<'buylater' | 'purchased'>('buylater');

  useEffect(() => {
    const savedCodes = JSON.parse(localStorage.getItem('aura_luxe_orders') || '[]');
    if (savedCodes.length > 0) {
      getOrdersByCodes(savedCodes).then((data) => setPastOrders(data));
    }
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col selection:bg-amber-500 selection:text-black">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <h1 className="text-3xl font-serif font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-yellow-400 mb-2">
          Your Saved Collection
        </h1>
        <p className="text-zinc-400 text-xs text-center uppercase tracking-widest mb-8">
          Personalized wishlist and past purchase history
        </p>

        {/* Section Tabs */}
        <div className="flex justify-center gap-4 mb-10 border-b border-zinc-800 pb-4">
          <button
            onClick={() => setActiveTab('buylater')}
            className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeTab === 'buylater'
                ? 'bg-amber-500 text-black shadow-lg shadow-amber-950/40'
                : 'bg-zinc-900 text-zinc-400 border border-zinc-800'
            }`}
          >
            <Heart className="w-4 h-4" /> Buy Later ({wishlist.length})
          </button>

          <button
            onClick={() => setActiveTab('purchased')}
            className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeTab === 'purchased'
                ? 'bg-amber-500 text-black shadow-lg shadow-amber-950/40'
                : 'bg-zinc-900 text-zinc-400 border border-zinc-800'
            }`}
          >
            <Package className="w-4 h-4" /> Previously Purchased ({pastOrders.length})
          </button>
        </div>

        {/* Buy Later Tab */}
        {activeTab === 'buylater' && (
          wishlist.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-zinc-800 rounded-2xl">
              <Heart className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
              <p className="text-zinc-400 text-sm">Your Buy Later list is empty.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {wishlist.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          )
        )}

        {/* Previously Purchased Tab */}
        {activeTab === 'purchased' && (
          pastOrders.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-zinc-800 rounded-2xl">
              <Package className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
              <p className="text-zinc-400 text-sm">No previous purchases recorded.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pastOrders.map((ord) => (
                <div key={ord.id} className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl flex flex-col sm:flex-row justify-between gap-4">
                  <div>
                    <span className="text-xs font-mono font-bold text-amber-400">{ord.order_code}</span>
                    <p className="text-xs text-zinc-400 mt-1">Purchased on {new Date(ord.created_at).toLocaleDateString()}</p>
                    <div className="mt-3 space-y-1">
                      {ord.items.map((it, idx) => (
                        <p key={idx} className="text-sm font-semibold text-zinc-200">• {it.title} - {it.price} EGP</p>
                      ))}
                    </div>
                  </div>
                  <div className="text-right sm:self-center">
                    <span className="text-lg font-bold text-amber-300">{ord.total_amount} EGP</span>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </main>
    </div>
  );
}