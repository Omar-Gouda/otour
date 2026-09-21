'use client';

import { Navbar } from '@/components/storefront/Navbar';
import { Button } from '@/components/ui/Button';
import { useAppStore } from '@/lib/store';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function WishlistPage() {
  const wishlist = useAppStore((state) => state.wishlist);
  const toggleWishlist = useAppStore((state) => state.toggleWishlist);
  const addToCart = useAppStore((state) => state.addToCart);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col selection:bg-amber-500 selection:text-black">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 py-10 w-full">
        <h1 className="text-3xl font-serif font-bold text-amber-200 text-center mb-8">
          Wishlist (Buy Later)
        </h1>

        {wishlist.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-zinc-800 rounded-2xl space-y-4">
            <Heart className="w-12 h-12 text-zinc-600 mx-auto" />
            <p className="text-zinc-400 text-sm">Your Wishlist is currently empty.</p>
            <Link href="/">
              <Button className="bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs">
                Browse Fragrances
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {wishlist.map((item) => (
              <div
                key={item.id}
                className="bg-zinc-900/60 border border-zinc-800 p-4 rounded-xl flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.thumbnail_url}
                    alt={item.title}
                    className="w-16 h-16 object-cover rounded-lg border border-zinc-800"
                  />
                  <div>
                    <h3 className="font-semibold text-zinc-100 text-sm">{item.title}</h3>
                    <p className="text-xs text-amber-400 font-mono mt-1">
                      {item.discount_price ?? item.price} EGP
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => {
                      addToCart(item);
                      toggleWishlist(item);
                    }}
                    size="sm"
                    className="bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs gap-1.5"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" /> Move to Bag
                  </Button>

                  <button
                    onClick={() => toggleWishlist(item)}
                    className="p-2 text-zinc-400 hover:text-rose-400 transition-colors"
                    title="Remove"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}