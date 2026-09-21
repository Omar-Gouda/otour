'use client';

import { useState, useEffect, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Navbar } from '@/components/storefront/Navbar';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useAppStore } from '@/lib/store';
import { getProductById } from '@/services/products.service';
import { getProductReviews, addProductReview, getProductAverageRating } from '@/services/reviews.service';
import { Product, Review } from '@/types';
import { ShoppingBag, Star, Heart, ArrowLeft, ShieldCheck, Truck, RefreshCw } from 'lucide-react';

const FALLBACK_PRODUCTS: Record<string, Product> = {
  '1': {
    id: '1',
    title: 'Only Desire Diesel',
    description: 'A deeply sensual fragrance featuring oriental accords, warm spices, and rich amber undertones.',
    price: 4500,
    category: 'for_her',
    is_best_seller: false,
    is_hot: false,
    is_available: true,
    stock_quantity: 10,
    thumbnail_url: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800',
    images_urls: ['https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800'],
  },
  '2': {
    id: '2',
    title: 'Suvage Dior',
    description: 'A radically fresh composition, raw and noble all at once with radiant top notes of Calabrian Bergamot.',
    price: 2000,
    category: 'unisex',
    is_best_seller: true,
    is_hot: false,
    is_available: true,
    stock_quantity: 10,
    thumbnail_url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800',
    images_urls: ['https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800'],
  },
  '3': {
    id: '3',
    title: 'Aura Noir Extreme',
    description: 'An intense woody fragrance with dark vanilla notes and smoky incense.',
    price: 5200,
    category: 'unisex',
    is_best_seller: false,
    is_hot: true,
    is_available: true,
    stock_quantity: 10,
    thumbnail_url: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=800',
    images_urls: [],
  },
  '4': {
    id: '4',
    title: 'Royal Creed Aventus',
    description: 'A legendary fruity-chypre fragrance celebrating strength, power, and success.',
    price: 8500,
    discount_price: 7200,
    category: 'for_him',
    is_best_seller: false,
    is_hot: false,
    is_available: true,
    stock_quantity: 10,
    thumbnail_url: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=800',
    images_urls: [],
  },
};

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [ratingData, setRatingData] = useState<{ average: number; count: number } | null>(null);
  const [loading, setLoading] = useState(true);

  // Review form state
  const [authorName, setAuthorName] = useState('');
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);

  const addToCart = useAppStore((state) => state.addToCart);
  const toggleWishlist = useAppStore((state) => state.toggleWishlist);
  const isInWishlist = useAppStore((state) => state.isInWishlist(id));

  useEffect(() => {
    const loadProductData = async () => {
      setLoading(true);
      const dbProduct = await getProductById(id);
      
      if (dbProduct) {
        setProduct(dbProduct);
      } else if (FALLBACK_PRODUCTS[id]) {
        setProduct(FALLBACK_PRODUCTS[id]);
      }

      const revs = await getProductReviews(id);
      setReviews(revs);

      const avg = await getProductAverageRating(id);
      setRatingData(avg);

      setLoading(false);
    };

    loadProductData();
  }, [id]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !comment.trim()) return;

    setSubmitting(true);
    try {
      await addProductReview({
        product_id: id,
        author_name: authorName,
        comment,
        rating,
      });

      setAuthorName('');
      setComment('');
      setRating(5);

      const revs = await getProductReviews(id);
      setReviews(revs);

      const avg = await getProductAverageRating(id);
      setRatingData(avg);
    } catch (error) {
      console.error('Failed to submit review:', error);
    } finally {
      setSubmitting(false);
    }
  };

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
          <p className="text-xs text-zinc-500">The requested fragrance could not be located in our catalog.</p>

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

            <p className="text-xs text-zinc-400 leading-relaxed font-sans">{product.description}</p>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-2">
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

            {/* Boutique Perks */}
            <div className="grid grid-cols-3 gap-3 pt-6 border-t border-zinc-900 text-center">
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

        {/* Reviews Section */}
        <section className="border-t border-zinc-900 pt-12 space-y-8">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-serif font-bold text-amber-200">Customer Feedback ({reviews.length})</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Reviews List */}
            <div className="lg:col-span-2 space-y-4">
              {reviews.length === 0 ? (
                <div className="p-8 rounded-2xl bg-zinc-900/40 border border-zinc-800 text-center text-xs text-zinc-500 font-serif">
                  Be the first to leave a review for this luxury fragrance.
                </div>
              ) : (
                reviews.map((rev) => (
                  <div key={rev.id} className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2">
                    <div className="flex justify-between items-center">
                      <p className="font-bold text-xs text-amber-300">{rev.author_name}</p>
                      <div className="flex items-center gap-1 text-amber-400 text-xs">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{rev.rating} / 5</span>
                      </div>
                    </div>
                    <p className="text-xs text-zinc-300 leading-relaxed">{rev.comment}</p>
                  </div>
                ))
              )}
            </div>

            {/* Submit Review Form */}
            <form onSubmit={handleReviewSubmit} className="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-4">
              <h3 className="font-serif font-bold text-amber-300 text-sm">Write a Review</h3>

              <div className="space-y-1">
                <label className="text-[10px] text-zinc-400 uppercase tracking-wider">Your Name</label>
                <input
                  type="text"
                  required
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-100 focus:border-amber-500 focus:outline-none"
                  placeholder="e.g. Omar Gouda"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-zinc-400 uppercase tracking-wider">Rating</label>
                <select
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-100 focus:border-amber-500 focus:outline-none"
                >
                  <option value={5}>5 Stars - Exceptional</option>
                  <option value={4}>4 Stars - Great</option>
                  <option value={3}>3 Stars - Average</option>
                  <option value={2}>2 Stars - Below Expectations</option>
                  <option value={1}>1 Star - Poor</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-zinc-400 uppercase tracking-wider">Comment</label>
                <textarea
                  required
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-100 focus:border-amber-500 focus:outline-none resize-none"
                  placeholder="Share your experience with this fragrance..."
                />
              </div>

              <Button
                type="submit"
                disabled={submitting}
                className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold py-2.5 text-xs"
              >
                {submitting ? 'Submitting...' : 'Submit Review'}
              </Button>
            </form>

          </div>
        </section>

      </main>
    </div>
  );
}