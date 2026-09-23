import { createClient } from '@/lib/supabase/client';
import { Product } from '@/types';

export const getProducts = async (): Promise<Product[]> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }

  return data as Product[];
};

export const getProductById = async (id: string): Promise<Product | null> => {
  if (!id) return null;
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('Error fetching product by ID:', error.message || error);
    return null;
  }

  return data as Product | null;
};

export const createProduct = async (
  productPayload: Omit<Product, 'id' | 'created_at'>
): Promise<Product> => {
  const supabase = createClient();
  const cleanPayload = { ...productPayload };
  delete cleanPayload.image_urls;
  delete cleanPayload.is_featured;

  const { data, error } = await supabase
    .from('products')
    .insert([cleanPayload])
    .select()
    .single();

  if (error) {
    console.error('Supabase Create Product Error Details:', error.message, error.details, error.hint);
    throw new Error(error.message || 'Failed to create product');
  }

  return data as Product;
};

export const updateProduct = async (
  id: string,
  productPayload: Partial<Product>
): Promise<Product> => {
  const supabase = createClient();
  const cleanPayload = { ...productPayload };
  delete cleanPayload.image_urls;
  delete cleanPayload.is_featured;

  const { data, error } = await supabase
    .from('products')
    .update(cleanPayload)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Supabase Update Product Error Details:', error.message, error.details, error.hint);
    throw new Error(error.message || 'Failed to update product');
  }

  return data as Product;
};

export const deleteProduct = async (id: string): Promise<void> => {
  const supabase = createClient();
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};
