import { createClient } from '@/lib/supabase/client';
import { Review } from '@/types';

const supabase = createClient();

export const getProductReviews = async (productId: string) => {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('product_id', productId)
      .order('created_at', { ascending: false });

    if (error) return [];
    return data as Review[];
  } catch {
    return [];
  }
};

export const addProductReview = async (review: Omit<Review, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('reviews')
    .insert([review])
    .select()
    .single();

  if (error) throw error;
  return data as Review;
};

export const getProductAverageRating = async (productId: string) => {
  const reviews = await getProductReviews(productId);
  if (!reviews || reviews.length === 0) return null;

  const total = reviews.reduce((sum, r) => sum + r.rating, 0);
  const average = total / reviews.length;

  return {
    average: parseFloat(average.toFixed(1)),
    count: reviews.length,
  };
};

export const getAllReviewsWithProduct = async () => {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('*, products(title)')
      .order('created_at', { ascending: false });

    if (error) return [];
    return data;
  } catch {
    return [];
  }
};

export const deleteReview = async (reviewId: string) => {
  const { error } = await supabase
    .from('reviews')
    .delete()
    .eq('id', reviewId);

  if (error) throw error;
  return true;
};