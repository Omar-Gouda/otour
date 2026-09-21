'use client';

import React, { useState } from 'react';
import { Review } from '@/types';
import { addProductReview } from '@/services/reviews.service';
import { Button } from '../ui/Button';
import { Star } from 'lucide-react';

interface ReviewSectionProps {
  productId: string;
  initialReviews: Review[];
}

export const ReviewSection: React.FC<ReviewSectionProps> = ({ productId, initialReviews }) => {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) return;

    setIsSubmitting(true);
    try {
      const newReview = await addProductReview({
        product_id: productId,
        customer_name: name,
        rating,
        comment,
      });

      setReviews([newReview, ...reviews]);
      setName('');
      setComment('');
      setRating(5);
    } catch (err) {
      console.error('Failed to submit review:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
      : '0.0';

  return (
    <section className="mt-16 border-t border-zinc-900 pt-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h2 className="text-2xl font-serif font-bold text-zinc-100">Customer Reviews</h2>
          <p className="text-zinc-400 text-sm mt-1">
            Overall Rating: <span className="text-amber-400 font-bold">{avgRating}</span> / 5.0 ({reviews.length} reviews)
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Form: Write a Review */}
        <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-6 h-fit">
          <h3 className="text-lg font-semibold text-purple-300 mb-4">Leave a Review</h3>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs text-zinc-400 mb-1">Your Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sarah M."
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs text-zinc-400 mb-1">Rating</label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`w-5 h-5 ${
                        star <= rating
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-zinc-600'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs text-zinc-400 mb-1">Comment</label>
              <textarea
                required
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your thought on this scent..."
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-purple-500"
              />
            </div>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Posting...' : 'Submit Review'}
            </Button>
          </form>
        </div>

        {/* Reviews List */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {reviews.length === 0 ? (
            <p className="text-zinc-500 italic text-sm">No reviews yet. Be the first to review this fragrance!</p>
          ) : (
            reviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-zinc-950/60 border border-zinc-900 rounded-xl p-5 flex flex-col gap-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-zinc-200 text-sm">{rev.customer_name}</span>
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < rev.rating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-zinc-700'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-zinc-300 text-sm leading-relaxed">{rev.comment}</p>
                <span className="text-[10px] text-zinc-600">
                  {new Date(rev.created_at).toLocaleDateString()}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};