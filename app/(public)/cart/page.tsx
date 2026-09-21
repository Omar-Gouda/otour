'use client';

import { useState } from 'react';
import { Navbar } from '@/components/storefront/Navbar';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Trash2, ShoppingBag, AlertCircle } from 'lucide-react';
import { getProductById } from '@/services/products.service';

export default function CartPage() {
  const router = useRouter();
  const cart = useAppStore((state) => state.cart);
  const removeFromCart = useAppStore((state) => state.removeFromCart);
  const toggleWishlist = useAppStore((state) => state.toggleWishlist);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const handleCheckoutCheck = async () => {
    setIsChecking(true);
    setErrorMessage(null);

    // 1. Live check against database for each cart item
    for (const item of cart) {
      const dbProduct = await getProductById(item.product.id);
      
      const isOut = !dbProduct || !dbProduct.is_available || dbProduct.stock_quantity <= 0;

      if (isOut) {
        // Move to Wishlist and remove from Cart
        toggleWishlist(item.product);
        removeFromCart(item.product.id);

        setErrorMessage(
          `"${item.product.title}" is currently out of stock. It has been moved to your Wishlist (Buy Later).`
        );
        setIsChecking(false);
        return;
      }
    }

    setIsChecking(false);
    if (cart.length > 0) {
      router.push('/checkout');
    }
  };

  const totalAmount = cart.reduce((sum, item) => {
    const price = item.product.discount_price ?? item.product.price;
    return sum + price * item.quantity;
  }, 0);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 py-10 w-full">
        <h1 className="text-3xl font-serif font-bold text-amber-200 text-center mb-8">Shopping Bag</h1>

        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {cart.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-zinc-800 rounded-2xl">
            <ShoppingBag className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
            <p className="text-zinc-400 text-sm mb-4">Your Shopping Bag is empty.</p>
            <Link href="/"><Button>Explore Collection</Button></Link>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.product.id} className="bg-zinc-900/60 border border-zinc-800 p-4 rounded-xl flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img src={item.product.thumbnail_url} alt={item.product.title} className="w-16 h-16 object-cover rounded-lg" />
                    <div>
                      <h3 className="font-semibold text-zinc-100">{item.product.title}</h3>
                      <p className="text-xs text-amber-400">
                        {item.product.discount_price ?? item.product.price} EGP x {item.quantity}
                      </p>
                    </div>
                  </div>
                  <button onClick={() => removeFromCart(item.product.id)} className="p-2 text-rose-400 hover:text-rose-300">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="bg-zinc-900 p-6 rounded-2xl border border-amber-500/30 flex justify-between items-center">
              <div>
                <span className="text-xs text-zinc-400 uppercase">Total Amount</span>
                <p className="text-2xl font-bold text-amber-300">{totalAmount} EGP</p>
              </div>

              <Button
                onClick={handleCheckoutCheck}
                disabled={isChecking}
                size="lg"
                className="bg-amber-500 hover:bg-amber-400 text-black font-bold"
              >
                {isChecking ? 'Verifying Stock...' : 'Proceed to Checkout'}
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}