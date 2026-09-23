'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Navbar } from '@/components/storefront/Navbar';
import { Button } from '@/components/ui/Button';
import { useAppStore } from '@/lib/store';
import { ShoppingBag, ArrowLeft, Trash2, Plus, Minus } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, clearCart } = useAppStore();
  const { showToast } = useToast();

  const subtotal = cart.reduce((acc, item) => {
    const price = item.product.discount_price ?? item.product.price;
    return acc + price * item.quantity;
  }, 0);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-mono selection:bg-amber-500 selection:text-black">
        <Navbar />
        <main className="flex-1 max-w-4xl mx-auto px-4 py-20 w-full flex flex-col items-center justify-center text-center space-y-6">
          <div className="w-20 h-20 bg-zinc-900 border border-zinc-800 rounded-full flex items-center justify-center text-amber-400 shadow-xl">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h1 className="font-serif text-2xl font-bold text-amber-200">Your Shopping Bag is Empty</h1>
            <p className="text-xs text-zinc-400">Discover our exquisite collection of rare luxury fragrances.</p>
          </div>
          <Link href="/">
            <Button className="bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs uppercase tracking-wider px-6 py-3 cursor-pointer">
              Explore Catalog
            </Button>
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-mono selection:bg-amber-500 selection:text-black">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
        
        <div className="flex items-center justify-between border-b border-zinc-800 pb-6">
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-amber-200 uppercase tracking-wide">
              Shopping Bag
            </h1>
            <p className="text-xs text-zinc-400 mt-1">Review your selected luxury items before checkout.</p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs text-zinc-400 hover:text-amber-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Continue Shopping
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => {
              const price = item.product.discount_price ?? item.product.price;
              return (
                <div
                  key={item.product.id}
                  className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-4 shadow-xl"
                >
                  <div className="relative w-20 h-20 bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden shrink-0">
                    <Image
                      src={item.product.thumbnail_url}
                      alt={item.product.title}
                      fill
                      className="object-contain p-2"
                    />
                  </div>

                  <div className="flex-1 text-center sm:text-left space-y-1 w-full">
                    <Link href={`/product/${item.product.id}`}>
                      <h3 className="font-serif font-bold text-sm text-zinc-100 hover:text-amber-300 transition-colors uppercase">
                        {item.product.title}
                      </h3>
                    </Link>
                    {item.product.volume_ml && (
                      <span className="inline-block px-2 py-0.5 bg-zinc-950 border border-zinc-800 text-amber-300 text-[10px] font-bold rounded">
                        {item.product.volume_ml} ML
                      </span>
                    )}
                    <p className="text-amber-400 font-bold text-xs pt-1">{price} EGP</p>
                  </div>

                  <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                    {/* Quantity Controller */}
                    <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 rounded-xl p-1">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-amber-300 transition-colors cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-6 text-center text-xs font-bold text-zinc-100">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-amber-300 transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Remove Item */}
                    <button
                      onClick={() => removeFromCart(item.product.id, showToast)}
                      className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 transition-colors cursor-pointer"
                      title="Remove Item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}

            <div className="flex justify-between items-center pt-2">
              <button
                onClick={() => clearCart()}
                className="text-xs text-zinc-500 hover:text-rose-400 transition-colors underline cursor-pointer"
              >
                Clear Shopping Bag
              </button>
            </div>
          </div>

          {/* Cart Summary Card */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-6 shadow-2xl sticky top-6">
            <h2 className="font-serif text-lg font-bold text-amber-200 border-b border-zinc-800 pb-4">
              Order Summary
            </h2>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-zinc-400">
                <span>Subtotal</span>
                <span className="text-zinc-100 font-bold">{subtotal} EGP</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Shipping</span>
                <span className="text-emerald-400 font-bold">Calculated at Checkout</span>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-800 flex justify-between items-center">
              <span className="text-sm font-bold text-zinc-300">Total</span>
              <span className="text-amber-400 text-lg font-bold">{subtotal} EGP</span>
            </div>

            <Link href="/checkout" className="block">
              <Button className="w-full bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-black font-bold py-3.5 text-xs uppercase tracking-wider shadow-lg cursor-pointer">
                Proceed to Checkout
              </Button>
            </Link>
          </div>

        </div>

      </main>
    </div>
  );
}