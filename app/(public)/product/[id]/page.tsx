'use client';

import { useState, useEffect, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Navbar } from '@/components/storefront/Navbar';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ReviewSection } from '@/components/storefront/ReviewSection';
import { useAppStore } from '@/lib/store';
import { getProductById } from '@/services/products.service';
import { getProductReviews, getProductAverageRating } from '@/services/reviews.service';
import { Product, Review } from '@/types';
import { ShoppingBag, Star, Heart, ArrowLeft, ShieldCheck, Truck, RefreshCw, MessageCircle } from 'lucide-react';

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [ratingData, setRatingData] = useState<{ average: number; count: number } | null>(null);
  const [loading, setLoading] = useState(true);

  const addToCart = useAppStore((state) => state.addToCart);
  const toggleWishlist = useAppStore((state) => state.toggleWishlist);
  const isInWishlist = useAppStore((state) => state.isInWishlist(id));

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '201017009415';

  useEffect(() => {
    const loadProductData = async () => {
      setLoading(true);
      const dbProduct = await getProductById(id);
      if (dbProduct) {
        setProduct(dbProduct);
      }

      const revs = await getProductReviews(id);
      setReviews(revs);

      const avg = await getProductAverageRating(id);
      setRatingData(avg);

      setLoading(false);
    };

    loadProductData();
  }, [id]);

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
          <h2 className="text-2xl font-serif text-amber-200">Perfume Not Found</h2>
          <Link href="/">
            <Button variant="secondary" className="gap-2 text-xs">
              <ArrowLeft className="w-4 h-4" /> Back to Boutique
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const isOutOfStock = !product.is_available || (product.stock_quantity !== undefined && product.stock_quantity <= 0);
  const hasDiscount = Boolean(
    product.discount_price !== null &&
    product.discount_price !== undefined &&
    product.discount_price < product.price
  );

  const whatsappMsg = encodeURIComponent(
    `Hello! I would like to order "${product.title}" (${hasDiscount ? product.discount_price : product.price} EGP) directly via WhatsApp.`
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col selection:bg-amber-500 selection:text-black">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-16">
        
        {/* Navigation Link */}
        <Link href="/" className="inline-flex items-center gap-2 text-xs text-zinc-400 hover:text-amber-300 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Catalog
        </Link>

        {/* Main Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-start">
          
          {/* Left: Product Image */}
          <div className="relative aspect-square w-full bg-gradient-to-b from-zinc-900 via-zinc-950 to-zinc-950 border border-amber-500/20 rounded-2xl overflow-hidden p-8 flex items-center justify-center shadow-2xl">
            <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
              {isOutOfStock ? (
                <Badge variant="outOfStock">Out of Stock</Badge>
              ) : (
                <>
                  {product.is_best_seller && <Badge variant="bestseller">Best Seller</Badge>}
                  {hasDiscount && <Badge variant="discount">Sale</Badge>}
                  {product.is_hot && <Badge variant="hot">Hot 🔥</Badge>}
                </>
              )}
            </div>

            <Image
              src={product.thumbnail_url}
              alt={product.title}
              fill
              className="object-contain p-6 drop-shadow-[0_20px_25px_rgba(0,0,0,0.9)]"
              priority
            />
          </div>

          {/* Right: Info & Actions */}
          <div className="space-y-6">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-amber-400/80">
                {product.category.replace('_', ' ')}
              </span>
              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-zinc-100 tracking-wide mt-1 uppercase">
                {product.title}
              </h1>

              {/* Real Average Rating */}
              <div className="flex items-center gap-2 mt-3 text-amber-400 text-xs font-semibold">
                {ratingData ? (
                  <>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-amber-400" />
                      <span>{ratingData.average} / 5</span>
                    </div>
                    <span className="text-zinc-500 font-normal">({ratingData.count} reviews)</span>
                  </>
                ) : (
                  <span className="text-xs text-zinc-500 font-normal italic">No reviews submitted yet</span>
                )}
              </div>
            </div>

            {/* Pricing */}
            <div className="flex items-baseline gap-3 border-y border-zinc-900 py-4">
              {hasDiscount ? (
                <>
                  <span className="text-3xl font-serif font-bold text-amber-300">{product.discount_price} EGP</span>
                  <span className="text-base text-zinc-500 line-through">{product.price} EGP</span>
                </>
              ) : (
                <span className="text-3xl font-serif font-bold text-amber-300">{product.price} EGP</span>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h3 className="text-[11px] font-mono uppercase tracking-widest text-amber-400">Olfactory Notes & Description</h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-sans">{product.description}</p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <div className="flex gap-3">
                {isOutOfStock ? (
                  <Button disabled className="flex-1 bg-zinc-800 text-zinc-500 cursor-not-allowed">
                    Currently Out of Stock
                  </Button>
                ) : (
                  <Button
                    onClick={() => addToCart(product)}
                    className="flex-1 bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-black font-bold py-3 text-xs uppercase tracking-wider gap-2 shadow-lg"
                  >
                    <ShoppingBag className="w-4 h-4" /> Add to Shopping Bag
                  </Button>
                )}

                <button
                  onClick={() => toggleWishlist(product)}
                  className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-amber-400 transition-colors"
                  title="Wishlist"
                >
                  <Heart className={`w-5 h-5 ${isInWishlist ? 'fill-amber-400 text-amber-400' : ''}`} />
                </button>
              </div>

              {/* WhatsApp Direct Buy Button (With Margin Bottom for spacing) */}
              <a
                href={`https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${whatsappMsg}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-3 px-4 rounded-xl text-xs uppercase tracking-wider shadow-lg transition-all mb-8"
              >
                <MessageCircle className="w-4 h-4" /> Buy Now & Order via WhatsApp
              </a>
            </div>

            {/* Boutique Perks */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-zinc-900 text-center">
              <div className="p-3 rounded-xl bg-zinc-900/50 border border-zinc-800/80 space-y-1">
                <ShieldCheck className="w-4 h-4 text-amber-400 mx-auto" />
                <p className="text-[10px] font-bold text-zinc-300">100% Authentic</p>
              </div>
              <div className="p-3 rounded-xl bg-zinc-900/50 border border-zinc-800/80 space-y-1">
                <Truck className="w-4 h-4 text-amber-400 mx-auto" />
                <p className="text-[10px] font-bold text-zinc-300">Fast Shipping</p>
              </div>
              <div className="p-3 rounded-xl bg-zinc-900/50 border border-zinc-800/80 space-y-1">
                <RefreshCw className="w-4 h-4 text-amber-400 mx-auto" />
                <p className="text-[10px] font-bold text-zinc-300">Luxury Packaging</p>
              </div>
            </div>

          </div>
        </div>

        {/* Reviews Section with proper spacing */}
        <section className="border-t border-zinc-900 pt-10">
          <ReviewSection productId={id} initialReviews={reviews} />
        </section>

      </main>
    </div>
  );
}