'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, Search, Heart, Package } from 'lucide-react';
import { useAppStore } from '@/lib/store';

export const Navbar: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const cart = useAppStore((state) => state.cart);
  const wishlist = useAppStore((state) => state.wishlist);

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 z-50 bg-zinc-950/90 backdrop-blur-md border-b border-amber-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-6">
        
        {/* Brand Logo (Left) */}
        <Link href="/" className="flex flex-col shrink-0">
          <span className="text-xl sm:text-2xl font-serif font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-400">
            AURA LUXE
          </span>
          <span className="text-[9px] tracking-[0.3em] text-zinc-400 uppercase font-sans">
            PARFUMS HAUTE PARFUMERIE
          </span>
        </Link>

        {/* Right Actions: Clean Search Bar & Action Icons */}
        <div className="flex items-center justify-end gap-3 sm:gap-5 flex-1">
          {/* Search Bar */}
          <div className="relative w-full max-w-[220px] sm:max-w-[300px]">
            <input
              type="text"
              placeholder="Search fragrances..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900/90 border border-zinc-800 focus:border-amber-500/50 rounded-full pl-9 pr-4 py-2 text-xs text-zinc-200 focus:outline-none transition-all placeholder:text-zinc-500"
            />
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          {/* Track Orders */}
          <Link
            href="/my-orders"
            className="hover:text-amber-300 text-zinc-300 transition-colors p-1.5"
            title="Track Orders"
          >
            <Package className="w-4 h-4" />
          </Link>

          {/* Wishlist */}
          <Link
            href="/wishlist"
            className="relative hover:text-amber-300 text-zinc-300 transition-colors p-1.5"
            title="Wishlist"
          >
            <Heart className="w-4 h-4" />
            {mounted && wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-black text-[9px] font-bold flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </Link>

          {/* Cart Bag */}
          <Link
            href="/cart"
            className="relative p-2 rounded-full bg-zinc-900 border border-amber-500/30 text-amber-300 hover:border-amber-400/80 transition-all"
            title="Shopping Bag"
          >
            <ShoppingBag className="w-4 h-4" />
            {mounted && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-black text-[10px] font-bold flex items-center justify-center">
                {totalCartItems}
              </span>
            )}
          </Link>
        </div>

      </div>
    </header>
  );
};