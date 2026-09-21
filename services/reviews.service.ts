import { createClient } from '@/lib/supabase/client';
import { Review } from '@/types';

// Fetch reviews for a specific product
export const getProductReviews = async (productId: string): Promise<Review[]> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('product_id', productId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }

  return data as Review[];
};

// Add a new review for a product
export const addProductReview = async (reviewData: {
  product_id: string;
  author_name: string;
  rating: number;
  comment: string;
}): Promise<Review> => {
  const supabase = createClient();

  const payload = {
    product_id: reviewData.product_id,
    author_name: reviewData.author_name,
    customer_name: reviewData.author_name, // fallback column support
    rating: reviewData.rating,
    comment: reviewData.comment,
  };

  const { data, error } = await supabase
    .from('reviews')
    .insert([payload])
    .select()
    .single();

  if (error) {
    console.error('Supabase Review Insert Error Details:', JSON.stringify(error, null, 2));
    throw error;
  }

  return data as Review;
};

// Calculate average rating for a product
export const getProductAverageRating = async (productId: string) => {
  const reviews = await getProductReviews(productId);
  if (reviews.length === 0) return null;

  const sum = reviews.reduce((acc, curr) => acc + curr.rating, 0);
  const average = Number((sum / reviews.length).toFixed(1));

  return { average, count: reviews.length };
};

// Fetch all reviews with product details for the Admin Dashboard
export const getAllReviewsWithProduct = async () => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('reviews')
    .select('*, products(title)')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching all reviews:', error);
    return [];
  }

  return data;
};

// Delete a review by ID for Admin moderation
export const deleteReview = async (reviewId: string) => {
  const supabase = createClient();
  const { error } = await supabase
    .from('reviews')
    .delete()
    .eq('id', reviewId);

  if (error) {
    console.error('Error deleting review:', error);
    throw error;
  }
};