'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';
import { Badge } from './Badge';
import { ShoppingBag, Star, Heart } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { getProductAverageRating } from '@/services/reviews.service';

export const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const addToCart = useAppStore((state) => state.addToCart);
  const toggleWishlist = useAppStore((state) => state.toggleWishlist);
  const isInWishlist = useAppStore((state) => state.isInWishlist(product.id));

  const [ratingData, setRatingData] = useState<{ average: number; count: number } | null>(null);

  useEffect(() => {
    let isMounted = true;
    getProductAverageRating(product.id).then((data) => {
      if (isMounted) setRatingData(data);
    });
    return () => {
      isMounted = false;
    };
  }, [product.id]);

  const isOutOfStock = !product.is_available || (product.stock_quantity !== undefined && product.stock_quantity <= 0);
  const hasDiscount = Boolean(
    product.discount_price !== null &&
    product.discount_price !== undefined &&
    product.discount_price < product.price
  );

  return (
    <div
      className={`group relative bg-zinc-900/70 border border-amber-500/20 rounded-xl overflow-hidden hover:border-amber-400/60 transition-all duration-500 flex flex-col justify-between ${
        isOutOfStock ? 'opacity-50 grayscale-[0.5]' : ''
      }`}
    >
      <div>
        {/* Bottle Display Area */}
        <div className="relative aspect-square w-full bg-gradient-to-b from-zinc-800/80 via-zinc-900 to-zinc-950 flex items-center justify-center overflow-hidden p-6">
          <Link href={`/product/${product.id}`} className="relative w-full h-full">
            <Image
              src={product.thumbnail_url}
              alt={product.title}
              fill
              className="object-contain transition-transform duration-700 group-hover:scale-110 drop-shadow-[0_10px_15px_rgba(0,0,0,0.8)]"
            />
          </Link>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
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

          {/* Volume Badge (ML) */}
          {product.volume_ml && (
            <div className="absolute bottom-3 left-3 z-10">
              <span className="px-2 py-0.5 bg-zinc-950/80 border border-zinc-800 text-amber-300 text-[10px] font-mono font-bold rounded-md uppercase tracking-wider">
                {product.volume_ml} ML
              </span>
            </div>
          )}

          {/* Wishlist Button */}
          <button
            onClick={() => toggleWishlist(product)}
            className="absolute top-3 right-3 p-2 rounded-full bg-zinc-950/80 border border-zinc-800 text-zinc-300 hover:text-amber-400 transition-colors z-10"
            title="Wishlist"
          >
            <Heart className={`w-4 h-4 ${isInWishlist ? 'fill-amber-400 text-amber-400' : ''}`} />
          </button>
        </div>

        {/* Title & Info */}
        <div className="p-4 text-center">
          <Link href={`/product/${product.id}`}>
            <h3 className="font-serif font-bold text-base tracking-wide text-zinc-100 group-hover:text-amber-200 transition-colors uppercase">
              {product.title}
            </h3>
          </Link>

          {/* Dynamic Real Ratings */}
          <div className="flex items-center justify-center gap-1 mt-2 text-amber-400 text-xs font-semibold h-4">
            {ratingData ? (
              <>
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span>{ratingData.average} / 5</span>
                <span className="text-[10px] text-zinc-500 font-normal">({ratingData.count})</span>
              </>
            ) : (
              <span className="text-[10px] text-zinc-600 font-normal italic">No reviews yet</span>
            )}
          </div>
        </div>
      </div>

      {/* Pricing & Add Button */}
      <div className="p-4 pt-0 flex flex-col gap-3">
        <div className="flex items-center justify-center gap-2">
          {hasDiscount ? (
            <>
              <span className="text-lg font-bold text-amber-300">{product.discount_price} EGP</span>
              <span className="text-xs text-zinc-500 line-through">{product.price} EGP</span>
            </>
          ) : (
            <span className="text-lg font-bold text-amber-300">{product.price} EGP</span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Link href={`/product/${product.id}`}>
            <button className="w-full py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 font-semibold text-[11px] uppercase tracking-wider transition-all">
              View
            </button>
          </Link>

          {isOutOfStock ? (
            <button
              disabled
              className="w-full py-2 rounded-lg bg-zinc-900 text-zinc-600 border border-zinc-800 font-bold text-[10px] uppercase tracking-wider cursor-not-allowed"
            >
              Unavailable
            </button>
          ) : (
            <button
              onClick={() => addToCart(product)}
              className="w-full py-2 rounded-lg bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-black font-bold text-[11px] uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-1"
            >
              <ShoppingBag className="w-3.5 h-3.5" /> Add
            </button>
          )}
        </div>
      </div>
    </div>
  );
};