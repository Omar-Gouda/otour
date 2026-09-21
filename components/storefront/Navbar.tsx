'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';
import { ShoppingBag, Heart, Package, Search } from 'lucide-react';

export const Navbar: React.FC = () => {
  const cart = useAppStore((state) => state.cart);
  const wishlist = useAppStore((state) => state.wishlist);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const wishlistCount = wishlist.length;

  return (
    <header className="sticky top-0 z-50 w-full bg-zinc-950/90 backdrop-blur-md border-b border-amber-500/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
          
          {/* Logo */}
          <Link href="/" className="flex flex-col shrink-0">
            <span className="font-serif font-bold text-base sm:text-2xl tracking-[0.15em] sm:tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-400 uppercase">
              AURA LUXE
            </span>
            <span className="text-[8px] sm:text-[10px] font-mono tracking-[0.2em] text-zinc-500 uppercase -mt-0.5 hidden xs:block">
              Parfums Haute Parfumerie
            </span>
          </Link>

          {/* Search Bar (Hidden on tiny mobile, visible on sm and up) */}
          <div className="hidden sm:flex flex-1 max-w-xs md:max-w-md mx-4">
            <div className="relative w-full">
              <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search fragrances..."
                className="w-full bg-zinc-900/80 border border-zinc-800/80 rounded-full pl-9 pr-4 py-1.5 text-xs text-zinc-200 placeholder:text-zinc-600 focus:border-amber-500/50 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Quick Nav Icons */}
          <div className="flex items-center gap-1 sm:gap-3 shrink-0">
            {/* Orders */}
            <Link
              href="/my-orders"
              className="p-2 text-zinc-400 hover:text-amber-300 transition-colors rounded-lg hover:bg-zinc-900/50"
              title="Track Orders"
            >
              <Package className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="relative p-2 text-zinc-400 hover:text-amber-300 transition-colors rounded-lg hover:bg-zinc-900/50"
              title="Wishlist"
            >
              <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-amber-500 text-black font-bold text-[9px] rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative p-2 text-zinc-400 hover:text-amber-300 transition-colors rounded-lg hover:bg-zinc-900/50"
              title="Shopping Bag"
            >
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-amber-500 text-black font-bold text-[9px] rounded-full flex items-center justify-center shadow-lg shadow-amber-500/50">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

        </div>

        {/* Mobile Search Bar Row (Under header on mobile) */}
        <div className="sm:hidden pb-3">
          <div className="relative w-full">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search fragrances..."
              className="w-full bg-zinc-900/80 border border-zinc-800/80 rounded-full pl-9 pr-4 py-1.5 text-xs text-zinc-200 placeholder:text-zinc-600 focus:border-amber-500/50 focus:outline-none"
            />
          </div>
        </div>

      </div>
    </header>
  );
};