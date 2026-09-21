import { createClient } from '@/lib/supabase/client';
import { PromoCode } from '@/types';

export const getPromoCodes = async (): Promise<PromoCode[]> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('promo_codes')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching promo codes:', error.message || error);
    return [];
  }

  return data as PromoCode[];
};

export const validatePromoCode = async (code: string): Promise<PromoCode | null> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('promo_codes')
    .select('*')
    .ilike('code', code.trim())
    .eq('is_active', true)
    .single();

  if (error || !data) {
    return null;
  }

  return data as PromoCode;
};

export const createPromoCode = async (
  promoPayload: Omit<PromoCode, 'id' | 'created_at'>
): Promise<PromoCode> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('promo_codes')
    .insert([promoPayload])
    .select()
    .single();

  if (error) {
    console.error('Error creating promo code:', error.message || JSON.stringify(error));
    throw new Error(error.message || 'Failed to insert promo code');
  }

  return data as PromoCode;
};

export const deletePromoCode = async (id: string): Promise<void> => {
  const supabase = createClient();
  const { error } = await supabase
    .from('promo_codes')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting promo code:', error.message || error);
    throw error;
  }
};