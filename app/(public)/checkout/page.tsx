'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/storefront/Navbar';
import { Button } from '@/components/ui/Button';
import { useAppStore } from '@/lib/store';
import { createOrder } from '@/services/orders.service';
import { ShoppingBag, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPage() {
  const router = useRouter();
  const cart = useAppStore((state) => state.cart);
  const clearCart = useAppStore((state) => state.clearCart);

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalAmount = cart.reduce((sum, item) => {
    const price = item.product.discount_price ?? item.product.price;
    return sum + price * item.quantity;
  }, 0);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !customerAddress || cart.length === 0) return;

    setIsSubmitting(true);
    try {
      const orderItems = cart.map((item) => ({
        product: item.product,
        quantity: item.quantity,
        product_id: item.product.id,
        title: item.product.title,
        price: item.product.discount_price ?? item.product.price,
        thumbnail_url: item.product.thumbnail_url,
      }));

      const newOrder = await createOrder({
        customer_name: customerName,
        customer_phone: customerPhone,
        customer_address: customerAddress,
        total_amount: totalAmount,
        items: orderItems,
      });

      // 1. Get Admin WhatsApp Number from .env
        const adminPhone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '201111902532';

        // 2. Prepare WhatsApp Text Message
        const message = `👑 *AURA LUXE - New Order!*%0A%0A` +
        `*Order Code:* ${newOrder.order_code}%0A` +
        `*Name:* ${customerName}%0A` +
        `*Phone:* ${customerPhone}%0A` +
        `*Address:* ${customerAddress}%0A` +
        `*Total Amount:* ${totalAmount} EGP%0A%0A` +
        `Please confirm my order. Thank you!`;

        // 3. Open WhatsApp Web / App directly to Admin Number
        window.open(`https://api.whatsapp.com/send?phone=${adminPhone}&text=${message}`, '_blank');

      clearCart();
      router.push(`/receipt/${newOrder.order_code}`);
    } catch (error) {
      console.error('Failed to process order:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4">
          <ShoppingBag className="w-12 h-12 text-zinc-600" />
          <h2 className="text-xl font-serif text-amber-200">Your Shopping Bag is Empty</h2>
          <Link href="/">
            <Button className="bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs">
              Explore Catalog
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col selection:bg-amber-500 selection:text-black">
      <Navbar />

      <main className="flex-1 max-w-3xl mx-auto px-4 py-10 w-full space-y-8">
        <Link href="/cart" className="inline-flex items-center gap-2 text-xs text-zinc-400 hover:text-amber-300">
          <ArrowLeft className="w-4 h-4" /> Back to Bag
        </Link>

        <h1 className="text-3xl font-serif font-bold text-amber-200">Boutique Checkout</h1>

        <form onSubmit={handleSubmitOrder} className="space-y-6">
          <div className="bg-zinc-900/60 border border-zinc-800 p-6 rounded-2xl space-y-4">
            <h2 className="font-serif font-bold text-amber-300 text-sm">Delivery Details</h2>

            <div className="space-y-1">
              <label className="text-[10px] text-zinc-400 uppercase tracking-wider">Full Name</label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-100 focus:border-amber-500 focus:outline-none"
                placeholder="e.g. Omar Gouda"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-zinc-400 uppercase tracking-wider">Phone Number</label>
              <input
                type="tel"
                required
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-100 focus:border-amber-500 focus:outline-none"
                placeholder="e.g. 0100000000"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-zinc-400 uppercase tracking-wider">Shipping Address</label>
              <textarea
                required
                rows={3}
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-100 focus:border-amber-500 focus:outline-none resize-none"
                placeholder="Detailed street, building, city..."
              />
            </div>
          </div>

          <div className="bg-zinc-900/80 p-6 rounded-2xl border border-amber-500/30 flex justify-between items-center">
            <div>
              <span className="text-[10px] text-zinc-400 uppercase font-mono">Total Order Amount</span>
              <p className="text-2xl font-serif font-bold text-amber-300">{totalAmount} EGP</p>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-black font-bold py-3 px-8 text-xs uppercase"
            >
              {isSubmitting ? 'Confirming...' : 'Place Order Now'}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}