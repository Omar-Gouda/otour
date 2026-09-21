'use client';

import { useEffect, useState, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Navbar } from '@/components/storefront/Navbar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ReviewSection } from '@/components/storefront/ReviewSection';
import { getProductById } from '@/services/products.service';
import { getProductReviews } from '@/services/reviews.service';
import { Product, Review } from '@/types';
import { ShoppingBag, ArrowLeft, Star } from 'lucide-react';

// Fallback Mock Data for previewing
const MOCK_PRODUCTS: Product[] = [
  {
    id: 'f3a21b4a-8743-4e8a-b0a9-1a2b3c4d5e6f',
    title: 'NOIR ÉLÉGANCE',
    description: 'High quality fragrance with velvet notes and mysterious amber. Crafted for evening elegance and lasting sophistication.',
    price: 245,
    category: 'for_her',
    is_best_seller: false,
    is_hot: false,
    is_available: true,
    thumbnail_url: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600',
    images_urls: [
      'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=600',
      'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600',
    ],
  },
  {
    id: 'c56a4180-65aa-42ec-a945-5fd21dec0538',
    title: 'VELVET OUD',
    description: 'Premium intense fragrance from boutique tradition. Blended with rare Cambodian Oud and velvety vanilla.',
    price: 310,
    category: 'unisex',
    is_best_seller: true,
    is_hot: false,
    is_available: true,
    thumbnail_url: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600',
    images_urls: [
      'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600',
    ],
  },
  {
    id: 'd89b12e3-45f6-78a9-bc01-234567890abc',
    title: 'SOLARIS',
    description: 'High quality oriental notes with exquisite saffron, bergamot, and golden amber accords.',
    price: 190,
    category: 'unisex',
    is_best_seller: false,
    is_hot: true,
    is_available: true,
    thumbnail_url: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=600',
    images_urls: [],
  },
  {
    id: 'e90c23f4-56a7-89b0-cd12-345678901bcd',
    title: 'MIDNIGHT AMBER',
    description: 'Rich dark amber blended with rare French rose and smoky sandalwood notes.',
    price: 320,
    discount_price: 275,
    category: 'for_him',
    is_best_seller: false,
    is_hot: false,
    is_available: true,
    thumbnail_url: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600',
    images_urls: [],
  },
];

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // Try Database first
      let prod = await getProductById(resolvedParams.id);

      // Fallback to Mock Data if DB is empty
      if (!prod) {
        prod = MOCK_PRODUCTS.find((p) => p.id === resolvedParams.id) || null;
      }

      if (prod) {
        setProduct(prod);
        setSelectedImage(prod.thumbnail_url);
        const revs = await getProductReviews(prod.id);
        setReviews(revs);
      }
      setLoading(false);
    };

    fetchData();
  }, [resolvedParams.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center text-zinc-500 animate-pulse font-serif">
          Revealing fragrance details...
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <p className="text-zinc-400 mb-4 font-serif">Fragrance not found.</p>
          <Link href="/">
            <Button variant="outline">Back to Catalog</Button>
          </Link>
        </div>
      </div>
    );
  }

  const gallery = [product.thumbnail_url, ...(product.images_urls || [])];
  const hasDiscount = Boolean(product.discount_price && product.discount_price < product.price);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col selection:bg-amber-500 selection:text-black">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs text-amber-400/80 hover:text-amber-300 mb-8 transition-colors uppercase tracking-widest font-semibold"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Collection
        </Link>

        {/* Product Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          {/* Left: Gallery & Main Image */}
          <div className="flex flex-col gap-4">
            <div className="relative aspect-square w-full bg-gradient-to-b from-zinc-900 via-zinc-950 to-black rounded-2xl overflow-hidden border border-amber-500/20 p-8 flex items-center justify-center shadow-2xl">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent opacity-80" />
              <div className="relative w-full h-full">
                <Image
                  src={selectedImage || product.thumbnail_url}
                  alt={product.title}
                  fill
                  className="object-contain drop-shadow-[0_15px_25px_rgba(0,0,0,0.9)]"
                />
              </div>
            </div>

            {/* Gallery Thumbnails */}
            {gallery.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {gallery.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`relative w-20 aspect-square rounded-lg overflow-hidden border transition-all p-1 bg-zinc-900 ${
                      selectedImage === img
                        ? 'border-amber-400 scale-95 shadow-[0_0_10px_rgba(245,158,11,0.3)]'
                        : 'border-zinc-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <Image src={img} alt="Gallery" fill className="object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Info & Checkout */}
          <div className="flex flex-col justify-between h-full space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="category">{product.category.replace('_', ' ')}</Badge>
                {product.is_best_seller && <Badge variant="bestseller">Best Seller</Badge>}
                {product.is_hot && <Badge variant="hot">Hot 🔥</Badge>}
              </div>

              <h1 className="text-3xl sm:text-5xl font-serif font-bold text-zinc-100 tracking-wider mb-2">
                {product.title}
              </h1>

              <div className="flex items-center gap-1 text-amber-400 text-xs font-semibold mb-6">
                <Star className="w-4 h-4 fill-amber-400" />
                <Star className="w-4 h-4 fill-amber-400" />
                <Star className="w-4 h-4 fill-amber-400" />
                <Star className="w-4 h-4 fill-amber-400" />
                <Star className="w-4 h-4 fill-amber-400" />
                <span className="text-zinc-400 ml-2">(4.8 / 5 Rating)</span>
              </div>

              <div className="flex items-baseline gap-4 mb-6">
                {hasDiscount ? (
                  <>
                    <span className="text-3xl font-bold text-amber-300">
                      ${product.discount_price}
                    </span>
                    <span className="text-xl text-zinc-500 line-through">
                      ${product.price}
                    </span>
                  </>
                ) : (
                  <span className="text-3xl font-bold text-amber-300">${product.price}</span>
                )}
              </div>

              <div className="border-t border-b border-zinc-900 py-6 my-6">
                <h3 className="text-xs uppercase tracking-widest text-amber-400 font-semibold mb-3">
                  Olfactory Notes & Description
                </h3>
                <p className="text-zinc-300 text-sm leading-relaxed whitespace-pre-line font-sans">
                  {product.description}
                </p>
              </div>
            </div>

            {/* Proceed to Checkout Action */}
            <div className="flex flex-col gap-3 pt-4">
              <Link href={`/checkout?product=${product.id}`}>
                <Button size="lg" className="w-full gap-2 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-sm uppercase tracking-wider shadow-lg shadow-amber-950/40">
                  <ShoppingBag className="w-5 h-5 text-black" /> Buy Now & Order via WhatsApp
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <ReviewSection productId={product.id} initialReviews={reviews} />
      </main>
    </div>
  );
}