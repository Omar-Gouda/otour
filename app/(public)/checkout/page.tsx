'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { createOrder } from '@/services/orders.service';
import { Navbar } from '@/components/storefront/Navbar';
import { Button } from '@/components/ui/Button';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart } = useAppStore();
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_phone: '',
    address: '',
    city: 'Cairo',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = cart.reduce((acc, item) => {
    const price = item.product.discount_price ?? item.product.price;
    return acc + price * item.quantity;
  }, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setIsSubmitting(true);
    try {
      const res = await createOrder({
        customer_name: formData.customer_name,
        customer_phone: formData.customer_phone,
        address: formData.address,
        city: formData.city,
        items: cart,
        total_amount: subtotal,
      });

      const trackingCode = res.trackingCode;
      clearCart();
      router.push(`/receipt/${trackingCode}`);
    } catch (err) {
      console.error('Checkout error:', err);
      alert('Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-mono">
      <Navbar />
      <main className="flex-1 max-w-3xl mx-auto px-4 py-10 w-full space-y-6">
        <h1 className="font-serif text-2xl text-amber-200 font-bold uppercase tracking-wider">
          Checkout & Shipping
        </h1>

        <form onSubmit={handleSubmit} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
          <div className="space-y-1">
            <label className="text-xs text-zinc-400 uppercase">Full Name</label>
            <input
              type="text"
              required
              value={formData.customer_name}
              onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-amber-300 focus:outline-none focus:border-amber-500 text-xs"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-zinc-400 uppercase">Phone Number</label>
            <input
              type="tel"
              required
              value={formData.customer_phone}
              onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-amber-300 focus:outline-none focus:border-amber-500 text-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs text-zinc-400 uppercase">City</label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-amber-300 focus:outline-none focus:border-amber-500 text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-zinc-400 uppercase">Street Address</label>
              <input
                type="text"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-amber-300 focus:outline-none focus:border-amber-500 text-xs"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
            <span className="text-amber-400 font-bold text-sm">Total: {subtotal} EGP</span>
            <Button
              type="submit"
              disabled={isSubmitting || cart.length === 0}
              className="bg-amber-500 hover:bg-amber-400 text-black font-bold uppercase tracking-wider"
            >
              {isSubmitting ? 'Processing...' : 'Place Order'}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}