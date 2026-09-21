import { createClient } from '@/lib/supabase/client';
import { PromoCode } from '@/types';

// Validation for checkout
export const validatePromoCode = async (code: string): Promise<PromoCode | null> => {
  const supabase = createClient();
  const cleanCode = code.trim().toUpperCase();

  const { data, error } = await supabase
    .from('promo_codes')
    .select('*')
    .eq('code', cleanCode)
    .eq('is_active', true)
    .maybeSingle();

  if (error || !data) return null;

  // Check usage limit
  if (data.max_uses !== null && data.times_used >= data.max_uses) {
    return null;
  }

  return data as PromoCode;
};

// Increment usage count after successful order
export const incrementPromoUsage = async (codeId: string, currentUses: number) => {
  const supabase = createClient();
  await supabase
    .from('promo_codes')
    .update({ times_used: currentUses + 1 })
    .eq('id', codeId);
};

// Admin: Generate new promo code
export const createPromoCode = async (promoData: Partial<PromoCode>) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('promo_codes')
    .insert([
      {
        ...promoData,
        code: promoData.code?.toUpperCase().trim(),
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data as PromoCode;
};

// Admin: Fetch all promo codes
export const getAllPromoCodes = async (): Promise<PromoCode[]> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('promo_codes')
    .select('*')
    .order('created_at', { ascending: false });

  if (error || !data) return [];
  return data as PromoCode[];
};