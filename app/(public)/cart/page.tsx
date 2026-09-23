'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Navbar } from '@/components/storefront/Navbar';
import { Button } from '@/components/ui/Button';
import { useAppStore } from '@/lib/store';
import { getProductById } from '@/services/products.service';
import { ShoppingBag, Trash2, AlertCircle } from 'lucide-react';

export default function CartPage() {
  const router = useRouter();
  const cart = useAppStore((state) => state.cart);
  const removeFromCart = useAppStore((state) => state.removeFromCart);
  const moveToWishlist = useAppStore((state) => state.moveToWishlist);

  const [isChecking, setIsChecking] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleCheckoutCheck = async () => {
    setIsChecking(true);
    setErrorMessage(null);

    try {
      for (const item of cart) {
        const dbProduct = await getProductById(item.product.id);
        const availableStock = dbProduct ? (dbProduct.stock_quantity ?? 0) : 0;
        const isOutOfStock = !dbProduct || !dbProduct.is_available || availableStock <= 0;

        if (isOutOfStock) {
          moveToWishlist(item.product.id);
          setErrorMessage(
            `The item "${item.product.title}" is currently out of stock and has been automatically moved to your Buy Later (Wishlist).`
          );
          setIsChecking(false);
          return;
        }
      }

      router.push('/checkout');
    } catch {
      setErrorMessage('An error occurred while verifying stock. Please try again.');
    } finally {
      setIsChecking(false);
    }
  };

  const totalAmount = cart.reduce((sum, item) => {
    const price = item.product.discount_price ?? item.product.price;
    return sum + price * item.quantity;
  }, 0);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col selection:bg-amber-500 selection:text-black">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 py-10 w-full">
        <h1 className="text-3xl font-serif font-bold text-amber-200 text-center mb-8">
          Shopping Bag
        </h1>

        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {cart.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-zinc-800 rounded-2xl space-y-4">
            <ShoppingBag className="w-12 h-12 text-zinc-600 mx-auto" />
            <p className="text-zinc-400 text-sm">Your Shopping Bag is empty.</p>
            <Link href="/">
              <Button className="bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs">
                Explore Collection
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item.product.id}
                  className="bg-zinc-900/60 border border-zinc-800 p-4 rounded-xl flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <Image
                      src={item.product.thumbnail_url}
                      alt={item.product.title}
                      width={64}
                      height={64}
                      className="w-16 h-16 object-cover rounded-lg border border-zinc-800"
                    />
                    <div>
                      <h3 className="font-semibold text-zinc-100 text-sm">{item.product.title}</h3>
                      <p className="text-xs text-amber-400 font-mono mt-1">
                        {item.product.discount_price ?? item.product.price} EGP × {item.quantity}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="p-2 text-zinc-400 hover:text-rose-400 transition-colors"
                    title="Remove Item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="bg-zinc-900/80 p-6 rounded-2xl border border-amber-500/30 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div>
                <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-mono">
                  Total Amount
                </span>
                <p className="text-2xl font-serif font-bold text-amber-300">{totalAmount} EGP</p>
              </div>

              <Button
                onClick={handleCheckoutCheck}
                disabled={isChecking}
                size="lg"
                className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs uppercase tracking-wider"
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
