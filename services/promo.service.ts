import { createClient } from '@/lib/supabase/client';
import { PromoCode } from '@/types';

/**
 * Fetch all promo codes (for admin control center)
 */
export const getPromoCodes = async (): Promise<PromoCode[]> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('promo_codes')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching promo codes:', error);
    return [];
  }

  return data || [];
};

/**
 * Fetch and validate an active promo code by its code string
 */
export const getActivePromoCode = async (code: string): Promise<PromoCode | null> => {
  if (!code) return null;
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('promo_codes')
    .select('*')
    .ilike('code', code.trim())
    .eq('is_active', true)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return data as PromoCode;
};

/**
 * Create a new promo code
 */
export const createPromoCode = async (promoData: {
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_order_amount?: number;
  is_active?: boolean;
}): Promise<void> => {
  const supabase = createClient();
  const { error } = await supabase.from('promo_codes').insert([
    {
      code: promoData.code.toUpperCase().trim(),
      discount_type: promoData.discount_type,
      discount_value: promoData.discount_value,
      min_order_amount: promoData.min_order_amount || 0,
      is_active: promoData.is_active ?? true,
    },
  ]);

  if (error) {
    console.error('Error creating promo code:', error);
    throw error;
  }
};

/**
 * Delete a promo code by ID
 */
export const deletePromoCode = async (id: string): Promise<void> => {
  const supabase = createClient();
  const { error } = await supabase.from('promo_codes').delete().eq('id', id);

  if (error) {
    console.error('Error deleting promo code:', error);
    throw error;
  }
};