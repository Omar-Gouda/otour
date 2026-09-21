'use client';

import { useState } from 'react';
import { Navbar } from '@/components/storefront/Navbar';
import { Button } from '@/components/ui/Button';
import { useAppStore } from '@/lib/store';
import { createOrder } from '@/services/orders.service';
import { Order } from '@/types';
import { MessageCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const router = useRouter();
  const cart = useAppStore((state) => state.cart);
  const clearCart = useAppStore((state) => state.clearCart);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalAmount = cart.reduce((sum, item) => {
    const price = item.product.discount_price ?? item.product.price;
    return sum + price * item.quantity;
  }, 0);

  const handleConfirmOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0 || !name.trim() || !phone.trim() || !address.trim()) return;

    setIsSubmitting(true);
    try {
      const orderItems = cart.map((item) => ({
        product_id: item.product.id,
        title: item.product.title,
        price: item.product.discount_price ?? item.product.price,
        quantity: item.quantity,
        thumbnail_url: item.product.thumbnail_url,
      }));

      const order = await createOrder({
        customer_name: name,
        customer_phone: phone,
        address,
        items: orderItems,
        total_amount: totalAmount,
      });

      // 1. تفريغ السلة فوراً
      clearCart();

      // 2. تجهيز ورسالة الواتساب وفتحها في New Tab
      const sellerPhoneNumber = '201000000000'; // 👈 رقم تليفونك بنفس الصيغة الدولية
      let itemsListText = '';
      orderItems.forEach((it, idx) => {
        itemsListText += `${idx + 1}. *${it.title}* (x${it.quantity}) - ${it.price * it.quantity} EGP\n`;
      });

      const messageText =
        `✨ *NEW AURA LUXE ORDER* ✨\n\n` +
        `📋 *Order Code:* ${order.order_code}\n` +
        `👤 *Customer Name:* ${order.customer_name}\n` +
        `📞 *Phone:* ${order.customer_phone}\n` +
        `📍 *Address:* ${order.address}\n\n` +
        `🛍️ *Ordered Fragrances:*\n${itemsListText}\n` +
        `💰 *Total Amount:* ${order.total_amount} EGP\n\n` +
        `Please confirm my order!`;

      const whatsappUrl = `https://api.whatsapp.com/send?phone=${sellerPhoneNumber}&text=${encodeURIComponent(messageText)}`;
      
      window.open(whatsappUrl, '_blank');

      // 3. التوجيه لصفحة الإيصال الدائمة بالـ Order Code
      router.push(`/receipt/${order.order_code}`);
    } catch (err) {
      console.error('Order creation failed:', err);
      alert('Failed to process order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col selection:bg-amber-500 selection:text-black">
      <Navbar />

      <main className="flex-1 max-w-3xl mx-auto px-4 py-12 w-full">
        <Link
          href="/cart"
          className="inline-flex items-center gap-2 text-xs text-amber-400 hover:text-amber-300 mb-6 print:hidden uppercase tracking-wider font-semibold"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Bag
        </Link>

        <div className="bg-zinc-900/50 border border-amber-500/20 rounded-2xl p-6 sm:p-8">
          <h1 className="text-2xl font-serif font-bold text-zinc-100 mb-6">Complete Your Order</h1>

          <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 mb-6 space-y-3">
            <h3 className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Order Summary</h3>
            {cart.map((item) => (
              <div key={item.product.id} className="flex justify-between items-center text-sm">
                <span className="text-zinc-200">{item.product.title} (x{item.quantity})</span>
                <span className="font-bold text-amber-300">
                  {(item.product.discount_price ?? item.product.price) * item.quantity} EGP
                </span>
              </div>
            ))}
            <div className="border-t border-zinc-800 pt-2 flex justify-between font-bold text-zinc-100 text-base">
              <span>Total:</span>
              <span className="text-amber-300">{totalAmount} EGP</span>
            </div>
          </div>

          <form onSubmit={handleConfirmOrder} className="space-y-4">
            <div>
              <label className="block text-xs text-zinc-400 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Omar Saeed"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs text-zinc-400 mb-1">WhatsApp Phone Number</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 01012345678"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs text-zinc-400 mb-1">Full Shipping Address</label>
              <textarea
                required
                rows={3}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="City, District, Building/Street details..."
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting || cart.length === 0}
              className="w-full gap-2 mt-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5"
            >
              <MessageCircle className="w-5 h-5 text-white" />
              {isSubmitting ? 'Confirming Order...' : 'Confirm Order via WhatsApp'}
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}