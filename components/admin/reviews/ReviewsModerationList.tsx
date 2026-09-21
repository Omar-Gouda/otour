'use client';

import { Review } from '@/types';
import { Layers, Trash2, User } from 'lucide-react';

interface ReviewsModerationListProps {
  reviews: any[];
  onRequestDelete: (reviewId: string) => void;
}

export function ReviewsModerationList({ reviews, onRequestDelete }: ReviewsModerationListProps) {
  return (
    <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-4 sm:p-6 space-y-5 shadow-xl">
      <h2 className="font-serif font-bold text-amber-200 text-sm sm:text-base uppercase tracking-wider flex items-center gap-2 border-b border-zinc-800 pb-4">
        <Layers className="w-4 h-4 text-amber-400" /> Customer Product Reviews ({reviews.length})
      </h2>

      {reviews.length === 0 ? (
        <p className="text-center py-8 text-xs text-zinc-500 font-mono">No customer reviews submitted yet.</p>
      ) : (
        <div className="space-y-3">
          {reviews.map((rev) => {
            // Safety resolution for Reviewer Name
            const reviewerName = rev.reviewer_name || rev.user_name || rev.author_name || rev.customer_name || 'Anonymous Customer';
            
            // Safety resolution for Product Title
            const productTitle = rev.product_title || rev.products?.title || rev.product?.title || 'General Product';

            return (
              <div key={rev.id} className="bg-zinc-950/60 border border-zinc-800/80 rounded-xl p-4 flex justify-between items-center gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-xs text-amber-300 flex items-center gap-1">
                      <User className="w-3 h-3 text-amber-400" /> {reviewerName}
                    </span>
                    <span className="text-[10px] text-zinc-400 font-mono bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                      Product: {productTitle}
                    </span>
                    <span className="text-xs text-amber-400 font-bold">★ {rev.rating}/5</span>
                  </div>
                  <p className="text-xs text-zinc-300 italic font-sans pl-1">&ldquo;{rev.comment}&rdquo;</p>
                </div>

                <button
                  onClick={() => onRequestDelete(rev.id)}
                  className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors shrink-0 flex items-center gap-1.5 text-xs font-bold"
                >
                  <Trash2 className="w-4 h-4" /> Remove
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}