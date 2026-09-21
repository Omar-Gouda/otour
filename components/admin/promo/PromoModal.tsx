'use client';

import { useState } from 'react';
import { createPromoCode } from '@/services/promo.service';
import { X, Tag } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface PromoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function PromoModal({ isOpen, onClose, onSuccess }: PromoModalProps) {
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState<number>(10);
  const [minOrderAmount, setMinOrderAmount] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    setIsSubmitting(true);
    try {
      await createPromoCode({
        code: code.trim().toUpperCase(),
        discount_type: discountType,
        discount_value: Number(discountValue),
        min_order_amount: Number(minOrderAmount),
        is_active: true,
      });

      setCode('');
      setDiscountValue(10);
      setMinOrderAmount(0);
      
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Failed to create promo code:', err);
      alert('Failed to create promo code. Make sure code is unique.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl relative">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-2">
            <Tag className="w-5 h-5 text-amber-400" />
            <h2 className="font-serif font-bold text-amber-200 text-base uppercase tracking-wider">
              Create New Promo Code
            </h2>
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-200 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
          
          <div className="space-y-1">
            <label className="text-[10px] text-zinc-400 uppercase">Promo Code (e.g. LAYAL20)</label>
            <input
              type="text"
              required
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="LAYAL10"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-amber-300 font-bold tracking-wider focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] text-zinc-400 uppercase">Discount Type</label>
              <select
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value as 'percentage' | 'fixed')}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-amber-300 focus:border-amber-500 focus:outline-none"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount (EGP)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-zinc-400 uppercase">Discount Value</label>
              <input
                type="number"
                required
                min={1}
                value={discountValue}
                onChange={(e) => setDiscountValue(Number(e.target.value))}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-amber-300 focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-zinc-400 uppercase">Minimum Order Amount (EGP)</label>
            <input
              type="number"
              min={0}
              value={minOrderAmount}
              onChange={(e) => setMinOrderAmount(Number(e.target.value))}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-amber-300 focus:border-amber-500 focus:outline-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-zinc-800 flex justify-end gap-3">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black font-bold uppercase tracking-wider"
            >
              {isSubmitting ? 'Creating...' : 'Create Promo Code'}
            </Button>
          </div>

        </form>

      </div>
    </div>
  );
}