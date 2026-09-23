'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { createOrder } from '@/services/orders.service';
import { Navbar } from '@/components/storefront/Navbar';
import { Button } from '@/components/ui/Button';
import { PaymentMethod } from '@/types';
import { getActivePromoCode } from '@/services/promo.service';
import { Tag } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

const paymentMethodLabels: Record<PaymentMethod, string> = {
  cash_on_delivery: 'Cash on delivery',
  instapay: 'Instapay',
  vodafone_cash: 'Vodafone Cash',
  card_on_delivery: 'Card on delivery',
};

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart } = useAppStore();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    customer_name: '',
    customer_phone: '',
    customer_alt_phone: '',
    customer_email: '',
    city: 'Cairo',
    area: '',
    street_address: '',
    building_number: '',
    floor: '',
    apartment: '',
    landmark: '',
    delivery_notes: '',
    payment_method: 'cash_on_delivery' as PaymentMethod,
  });

  const [promoInput, setPromoInput] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [appliedPromoCode, setAppliedPromoCode] = useState<string | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const subtotal = cart.reduce((acc, item) => {
    const price = item.product.discount_price ?? item.product.price;
    return acc + price * item.quantity;
  }, 0);

  const finalTotal = Math.max(0, subtotal - discountAmount);

  const handleApplyPromo = async () => {
    setPromoError(null);
    if (!promoInput.trim()) return;

    try {
      const promo = await getActivePromoCode(promoInput.trim());
      if (!promo) {
        setPromoError('Invalid or expired promo code.');
        return;
      }

      if (promo.min_order_amount && subtotal < promo.min_order_amount) {
        setPromoError(`Minimum order amount is ${promo.min_order_amount} EGP.`);
        return;
      }

      let discount = 0;
      if (promo.discount_type === 'percentage') {
        discount = (subtotal * promo.discount_value) / 100;
      } else {
        discount = promo.discount_value;
      }

      setDiscountAmount(discount);
      setAppliedPromoCode(promo.code);
      setPromoInput('');
    } catch (err) {
      setPromoError('Failed to apply promo code.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setErrorMessage(null);

    // Stock Validation Check with Simplified Toast Warning
    for (const item of cart) {
      const availableStock = item.product.stock_quantity ?? 0;
      if (item.quantity > availableStock) {
        const warningMsg = `Only ${availableStock} left in Stock for "${item.product.title}"`;
        showToast(warningMsg, 'error');
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const res = await createOrder({
        customer_name: formData.customer_name,
        customer_phone: formData.customer_phone,
        customer_alt_phone: formData.customer_alt_phone,
        customer_email: formData.customer_email,
        city: formData.city,
        area: formData.area,
        street_address: formData.street_address,
        building_number: formData.building_number,
        floor: formData.floor,
        apartment: formData.apartment,
        landmark: formData.landmark,
        delivery_notes: formData.delivery_notes,
        payment_method: formData.payment_method,
        items: cart,
        total_amount: finalTotal,
      });

      clearCart();
      if (res.whatsappUrl) {
        window.open(res.whatsappUrl, '_blank', 'noopener,noreferrer');
      }
      router.push(`/receipt/${res.trackingCode}`);
    } catch (err: unknown) {
      console.error('Checkout error details:', err);
      const errText = err instanceof Error ? err.message : 'Failed to place order.';
      setErrorMessage(errText);
      showToast(errText, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-mono selection:bg-amber-500 selection:text-black">
      <Navbar />
      <main className="flex-1 max-w-3xl mx-auto px-4 py-10 w-full space-y-6">
        <h1 className="font-serif text-2xl text-amber-200 font-bold uppercase tracking-wider">
          Checkout & Shipping
        </h1>

        <form onSubmit={handleSubmit} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="space-y-1">
            <label className="text-xs text-zinc-400 uppercase">Full Name *</label>
            <input
              type="text"
              required
              value={formData.customer_name}
              onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-amber-300 focus:outline-none focus:border-amber-500 text-xs"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-zinc-400 uppercase">Phone Number *</label>
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
              <label className="text-xs text-zinc-400 uppercase">Alternate Phone</label>
              <input
                type="tel"
                value={formData.customer_alt_phone}
                onChange={(e) => setFormData({ ...formData, customer_alt_phone: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-amber-300 focus:outline-none focus:border-amber-500 text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-zinc-400 uppercase">Email</label>
              <input
                type="email"
                value={formData.customer_email}
                onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-amber-300 focus:outline-none focus:border-amber-500 text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-zinc-400 uppercase">City *</label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-amber-300 focus:outline-none focus:border-amber-500 text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-zinc-400 uppercase">Area *</label>
              <input
                type="text"
                required
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-amber-300 focus:outline-none focus:border-amber-500 text-xs"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs text-zinc-400 uppercase">Street Address *</label>
              <input
                type="text"
                required
                value={formData.street_address}
                onChange={(e) => setFormData({ ...formData, street_address: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-amber-300 focus:outline-none focus:border-amber-500 text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-zinc-400 uppercase">Building Number *</label>
              <input
                type="text"
                required
                value={formData.building_number}
                onChange={(e) => setFormData({ ...formData, building_number: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-amber-300 focus:outline-none focus:border-amber-500 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-zinc-400 uppercase">Floor</label>
                <input
                  type="text"
                  value={formData.floor}
                  onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-amber-300 focus:outline-none focus:border-amber-500 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-zinc-400 uppercase">Apartment</label>
                <input
                  type="text"
                  value={formData.apartment}
                  onChange={(e) => setFormData({ ...formData, apartment: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-amber-300 focus:outline-none focus:border-amber-500 text-xs"
                />
              </div>
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs text-zinc-400 uppercase">Nearby Landmark</label>
              <input
                type="text"
                value={formData.landmark}
                onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-amber-300 focus:outline-none focus:border-amber-500 text-xs"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-zinc-400 uppercase">Delivery Notes</label>
            <textarea
              rows={2}
              value={formData.delivery_notes}
              onChange={(e) => setFormData({ ...formData, delivery_notes: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-amber-300 focus:outline-none focus:border-amber-500 text-xs resize-none"
            />
          </div>

          {/* Promo Code Section */}
          <div className="space-y-2 pt-2 border-t border-zinc-800">
            <label className="text-xs text-zinc-400 uppercase flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-amber-400" /> Promo Code
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter promo code"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value)}
                className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-amber-300 text-xs uppercase"
              />
              <button
                type="button"
                onClick={handleApplyPromo}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-amber-300 font-bold rounded-xl text-xs uppercase cursor-pointer"
              >
                Apply
              </button>
            </div>
            {appliedPromoCode && (
              <p className="text-emerald-400 text-[11px]">Promo &quot;{appliedPromoCode}&quot; applied successfully!</p>
            )}
            {promoError && <p className="text-rose-400 text-[11px]">{promoError}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-xs text-zinc-400 uppercase">Payment Method</label>
            <select
              required
              value={formData.payment_method}
              onChange={(e) => setFormData({ ...formData, payment_method: e.target.value as PaymentMethod })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-amber-300 focus:outline-none focus:border-amber-500 text-xs cursor-pointer"
            >
              <option value="cash_on_delivery">Cash on delivery</option>
              <option value="instapay">Instapay</option>
              <option value="vodafone_cash">Vodafone Cash</option>
            </select>
          </div>

          <div className="pt-4 border-t border-zinc-800 space-y-2">
            {discountAmount > 0 && (
              <div className="flex justify-between text-xs text-zinc-400">
                <span>Subtotal:</span>
                <span>{subtotal} EGP</span>
              </div>
            )}
            {discountAmount > 0 && (
              <div className="flex justify-between text-xs text-emerald-400">
                <span>Discount:</span>
                <span>-{discountAmount} EGP</span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-amber-400 font-bold text-sm">Total: {finalTotal} EGP</span>
              <Button
                type="submit"
                disabled={isSubmitting || cart.length === 0}
                className="bg-amber-500 hover:bg-amber-400 text-black font-bold uppercase tracking-wider text-xs px-6 py-3 cursor-pointer"
              >
                {isSubmitting ? 'Processing...' : 'Place Order'}
              </Button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}