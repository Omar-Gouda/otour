'use client';

import React, { useState } from 'react';
import { Review } from '@/types';
import { addProductReview } from '@/services/reviews.service';
import { Button } from '@/components/ui/Button';
import { Star } from 'lucide-react';

interface ReviewSectionProps {
  productId: string;
  initialReviews?: Review[];
}

export const ReviewSection: React.FC<ReviewSectionProps> = ({
  productId,
  initialReviews = [],
}) => {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [authorName, setAuthorName] = useState('');
  const [commentText, setCommentText] = useState('');
  const [ratingValue, setRatingValue] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !commentText.trim()) return;

    setIsSubmitting(true);
    try {
      const newReview = await addProductReview({
        product_id: productId,
        author_name: authorName,
        rating: ratingValue,
        comment: commentText,
      });

      setReviews([newReview, ...reviews]);
      setAuthorName('');
      setCommentText('');
      setRatingValue(5);
    } catch (err) {
      console.error('Failed to submit review:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {reviews.length === 0 ? (
            <div className="p-8 rounded-2xl bg-zinc-900/40 border border-zinc-800 text-center text-xs text-zinc-500 font-serif">
              No reviews yet. Be the first to review this fragrance.
            </div>
          ) : (
            reviews.map((rev) => (
              <div key={rev.id} className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2">
                <div className="flex justify-between items-center">
                  <p className="font-bold text-xs text-amber-300">{rev.author_name || rev.customer_name}</p>
                  <div className="flex items-center gap-1 text-amber-400 text-xs">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{rev.rating} / 5</span>
                  </div>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">{rev.comment}</p>
                <p className="text-[10px] text-zinc-500">
                  {new Date(rev.created_at ?? Date.now()).toLocaleDateString()}
                </p>
              </div>
            ))
          )}
        </div>

        <form onSubmit={handleSubmit} className="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-4">
          <h3 className="font-serif font-bold text-amber-300 text-sm">Leave a Review</h3>

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
              value={ratingValue}
              onChange={(e) => setRatingValue(Number(e.target.value))}
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
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-100 focus:border-amber-500 focus:outline-none resize-none"
              placeholder="Share your thoughts..."
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold py-2.5 text-xs"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </Button>
        </form>
      </div>
    </div>
  );
};