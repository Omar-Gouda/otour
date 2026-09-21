import { createClient } from '@/lib/supabase/client';
import { Product, FragranceCategory } from '@/types';

const supabase = createClient();

export const getProducts = async (filters?: {
  category?: FragranceCategory;
  isBestSeller?: boolean;
  isDiscount?: boolean;
}) => {
  try {
    let query = supabase.from('products').select('*');

    if (filters?.category) {
      query = query.eq('category', filters.category);
    }
    if (filters?.isBestSeller) {
      query = query.eq('is_best_seller', true);
    }
    if (filters?.isDiscount) {
      query = query.not('discount_price', 'is', null);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) return [];
    return (data as Product[]) || [];
  } catch {
    return [];
  }
};

export const getProductById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error || !data) return null;
    return data as Product;
  } catch {
    return null;
  }
};

export const createProduct = async (product: Omit<Product, 'id'>) => {
  const { data, error } = await supabase
    .from('products')
    .insert([product])
    .select()
    .single();

  if (error) throw error;
  return data as Product;
};

export const updateProduct = async (id: string, updates: Partial<Product>) => {
  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Product;
};

export const deleteProduct = async (id: string) => {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
};