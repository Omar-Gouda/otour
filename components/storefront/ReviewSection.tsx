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
  const [hoverValue, setHoverValue] = useState<number | null>(null);
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
      setHoverValue(null);
    } catch (err) {
      console.error('Failed to submit review:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Reviews List */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-serif font-bold text-amber-200 text-lg">Client Reviews</h3>
          {reviews.length === 0 ? (
            <div className="p-8 rounded-2xl bg-zinc-900/40 border border-zinc-800 text-center text-xs text-zinc-500 font-serif">
              No reviews yet. Be the first to review this fragrance.
            </div>
          ) : (
            reviews.map((rev) => (
              <div key={rev.id} className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2">
                <div className="flex justify-between items-center">
                  <p className="font-bold text-xs text-amber-300">{rev.author_name || rev.customer_name}</p>
                  
                  {/* Static Stars Display */}
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-3.5 h-3.5 ${
                          star <= rev.rating
                            ? 'fill-amber-400 text-amber-400'
                            : 'fill-zinc-800 text-zinc-700'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">{rev.comment}</p>
                <p className="text-[10px] text-zinc-500">
                  {rev.created_at ? new Date(rev.created_at).toLocaleDateString() : 'Date unavailable'}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Leave a Review Form */}
        <form onSubmit={handleSubmit} className="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-5">
          <h3 className="font-serif font-bold text-amber-300 text-sm">Leave a Review</h3>

          <div className="space-y-1">
            <label className="text-[10px] text-zinc-400 uppercase tracking-wider">Your Name</label>
            <input
              type="text"
              required
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-100 focus:border-amber-500 focus:outline-none"
              placeholder="Your display name"
            />
          </div>

          {/* Interactive Star Selection */}
          <div className="space-y-1.5">
            <label className="text-[10px] text-zinc-400 uppercase tracking-wider block">Rating</label>
            <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 rounded-lg p-3">
              {[1, 2, 3, 4, 5].map((star) => {
                const isFilled = (hoverValue ?? ratingValue) >= star;
                return (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRatingValue(star)}
                    onMouseEnter={() => setHoverValue(star)}
                    onMouseLeave={() => setHoverValue(null)}
                    className="p-1 text-amber-400 hover:scale-125 transition-transform duration-150 focus:outline-none"
                    title={`${star} Star${star > 1 ? 's' : ''}`}
                  >
                    <Star
                      className={`w-6 h-6 ${
                        isFilled
                          ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]'
                          : 'fill-zinc-800 text-zinc-700'
                      }`}
                    />
                  </button>
                );
              })}
              <span className="text-xs font-mono font-bold text-amber-300 ml-auto">
                {hoverValue ?? ratingValue} / 5
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-zinc-400 uppercase tracking-wider">Comment</label>
            <textarea
              required
              rows={3}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-100 focus:border-amber-500 focus:outline-none resize-none"
              placeholder="Share your experience with this fragrance..."
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-3 text-xs uppercase tracking-wider shadow-lg"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </Button>
        </form>

      </div>
    </div>
  );
};
