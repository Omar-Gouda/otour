'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Navbar } from '@/components/storefront/Navbar';
import { Button } from '@/components/ui/Button';
import { ReviewSection } from '@/components/storefront/ReviewSection';
import { AccordsBar } from '@/components/storefront/AccordsBar';
import { getProductById } from '@/services/products.service';
import { getProductReviews, getProductAverageRating } from '@/services/reviews.service';
import { useAppStore } from '@/lib/store';
import { Product, Review } from '@/types';
import { ArrowLeft, ShoppingBag, Heart, MessageCircle, Star, ShieldCheck, Truck, Sparkles, Plus, Minus } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

export default function ProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const productId = resolvedParams.id;

  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [ratingInfo, setRatingInfo] = useState<{ average: number; count: number } | null>(null);
  const [loading, setLoading] = useState(true);

  const cart = useAppStore((state) => state.cart);
  const addToCart = useAppStore((state) => state.addToCart);
  const updateQuantity = useAppStore((state) => state.updateQuantity);
  const toggleWishlist = useAppStore((state) => state.toggleWishlist);
  const wishlist = useAppStore((state) => state.wishlist);

  const { showToast } = useToast();

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [prod, revs, rating] = await Promise.all([
          getProductById(productId),
          getProductReviews(productId),
          getProductAverageRating(productId),
        ]);
        setProduct(prod);
        setReviews(revs);
        setRatingInfo(rating);
      } catch (error) {
        console.error('Error loading product details:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [productId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4">
          <h2 className="text-xl font-serif text-amber-200">Perfume Not Found</h2>
          <Link href="/">
            <Button className="bg-amber-500 text-black font-bold text-xs">Back to Catalog</Button>
          </Link>
        </div>
      </div>
    );
  }

  const isInWishlist = wishlist.some((item) => item.id === product.id);
  const isOutOfStock = !product.is_available || (product.stock_quantity !== undefined && product.stock_quantity <= 0);

  const cartItem = cart.find((item) => item.product.id === product.id);
  const quantityInCart = cartItem ? cartItem.quantity : 0;

  const adminPhone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '201017009415';
  const whatsappMsg = `Hello LAYAL,%0AI am interested in ordering: *${product.title}* (${product.discount_price ?? product.price} EGP).`;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col selection:bg-amber-500 selection:text-black">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-12">
        
        {/* Navigation Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs text-zinc-400 hover:text-amber-300 transition-colors font-sans"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Catalog
        </Link>

        {/* Product Details Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          
          {/* Product Image */}
          <div className="relative aspect-square bg-gradient-to-b from-zinc-900 via-zinc-950 to-zinc-900 border border-zinc-800 rounded-3xl p-8 overflow-hidden shadow-2xl flex items-center justify-center">
            <Image
              src={product.thumbnail_url}
              alt={product.title}
              fill
              className="object-contain p-6 drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
              priority
            />

            {/* Status Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {isOutOfStock && (
                <span className="px-3 py-1 bg-zinc-900/90 text-rose-400 border border-rose-500/30 rounded-full text-[10px] font-mono uppercase tracking-wider font-bold">
                  Out of Stock
                </span>
              )}
              {product.is_best_seller && (
                <span className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full text-[10px] font-mono uppercase tracking-wider font-bold">
                  Best Seller
                </span>
              )}
            </div>
          </div>

          {/* Product Information */}
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-amber-400">
                  {product.category.replace('_', ' ')}
                </span>
                
                {product.volume_ml && (
                  <span className="px-3 py-1 bg-zinc-900 border border-zinc-800 text-amber-300 text-xs font-mono font-bold rounded-lg tracking-wider">
                    {product.volume_ml} ML
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-4xl font-serif font-bold text-amber-100 uppercase tracking-wide leading-tight">
                {product.title}
              </h1>

              {ratingInfo && (
                <div className="flex items-center gap-2 pt-1">
                  <div className="flex items-center gap-1 text-amber-400">
                    <Star className="w-4 h-4 fill-amber-400" />
                    <span className="text-xs font-bold font-mono">{ratingInfo.average}</span>
                  </div>
                  <span className="text-[10px] text-zinc-500 font-sans">({ratingInfo.count} reviews)</span>
                </div>
              )}
            </div>

            {/* Price Display */}
            <div className="flex items-baseline gap-3 border-y border-zinc-800/80 py-4">
              <span className="text-2xl sm:text-3xl font-serif font-bold text-amber-300">
                {product.discount_price ?? product.price} EGP
              </span>
              {product.discount_price && (
                <span className="text-sm font-sans text-zinc-500 line-through">
                  {product.price} EGP
                </span>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400">
                Olfactory Notes & Description
              </span>
              <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                {product.description || 'Experience the exquisite blend of rare ingredients crafted for pure luxury.'}
              </p>
            </div>

            {/* Main Accords Component */}
            <AccordsBar accords={product.accords} />

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              {isOutOfStock ? (
                <div className="space-y-3">
                  <Button disabled className="w-full bg-zinc-800/80 text-zinc-500 cursor-not-allowed py-3 text-xs uppercase font-bold border border-zinc-800">
                    Currently Out of Stock
                  </Button>
                </div>
              ) : (
                <>
                  <div className="flex gap-3 items-center">
                    {quantityInCart > 0 ? (
                      <div className="flex-1 flex items-center justify-between bg-zinc-900 border border-amber-500/40 rounded-xl p-2.5 font-mono">
                        <button
                          onClick={() => updateQuantity(product.id, quantityInCart - 1)}
                          className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-amber-300 transition-colors cursor-pointer"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="text-amber-300 font-bold text-sm">
                          {quantityInCart} in Bag
                        </span>
                        <button
                          onClick={() => updateQuantity(product.id, quantityInCart + 1)}
                          className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-amber-300 transition-colors cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <Button
                        onClick={() => addToCart(product, showToast)}
                        className="flex-1 bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-black font-bold py-3 text-xs uppercase tracking-wider gap-2 shadow-lg cursor-pointer"
                      >
                        <ShoppingBag className="w-4 h-4" /> Add to Shopping Bag
                      </Button>
                    )}

                    <button
                      onClick={() => toggleWishlist(product, showToast)}
                      className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-amber-400 transition-colors cursor-pointer"
                      title="Wishlist"
                    >
                      <Heart className={`w-5 h-5 ${isInWishlist ? 'fill-amber-400 text-amber-400' : ''}`} />
                    </button>
                  </div>

                  <a
                    href={`https://api.whatsapp.com/send?phone=${adminPhone}&text=${whatsappMsg}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-3 px-4 rounded-xl text-xs uppercase tracking-wider shadow-lg transition-all"
                  >
                    <MessageCircle className="w-4 h-4" /> Buy Now & Order via WhatsApp
                  </a>
                </>
              )}
            </div>

            {/* Brand Guarantees */}
            <div className="grid grid-cols-3 gap-2 pt-4 border-t border-zinc-800/80 text-center text-[10px] text-zinc-400 font-mono">
              <div className="p-2 rounded-xl bg-zinc-900/40 border border-zinc-800/60 flex flex-col items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>100% Authentic</span>
              </div>
              <div className="p-2 rounded-xl bg-zinc-900/40 border border-zinc-800/60 flex flex-col items-center gap-1">
                <Truck className="w-4 h-4 text-amber-400" />
                <span>Fast Shipping</span>
              </div>
              <div className="p-2 rounded-xl bg-zinc-900/40 border border-zinc-800/60 flex flex-col items-center gap-1">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Luxury Packaging</span>
              </div>
            </div>

          </div>
        </div>

        {/* Customer Reviews Section */}
        <div className="pt-10 border-t border-zinc-800/80">
          <ReviewSection productId={productId} initialReviews={reviews} />
        </div>

      </main>
    </div>
  );
}