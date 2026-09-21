'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { X } from 'lucide-react';

interface PromoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (code: string, type: 'percentage' | 'fixed', val: number, maxUses: string) => Promise<void>;
}

export const PromoModal: React.FC<PromoModalProps> = ({ isOpen, onClose, onSave }) => {
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState<number>(10);
  const [maxUses, setMaxUses] = useState<string>('1');
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || discountValue <= 0) return;

    setIsSaving(true);
    try {
      await onSave(code, discountType, discountValue, maxUses);
      setCode('');
      setDiscountValue(10);
      setMaxUses('1');
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-zinc-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-lg font-serif font-bold text-amber-300">Generate Promo Code</h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1">
            <label className="text-[10px] text-zinc-400 uppercase tracking-wider">Code Name</label>
            <input
              type="text"
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="e.g. LAYAL10"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-amber-300 font-mono uppercase focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] text-zinc-400 uppercase tracking-wider">Type</label>
              <select
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value as 'percentage' | 'fixed')}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-100 focus:border-amber-500 focus:outline-none"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed (EGP)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-zinc-400 uppercase tracking-wider">Value</label>
              <input
                type="number"
                required
                min={1}
                value={discountValue}
                onChange={(e) => setDiscountValue(Number(e.target.value))}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-100 focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-zinc-400 uppercase tracking-wider">Max Uses</label>
            <input
              type="number"
              min={1}
              value={maxUses}
              onChange={(e) => setMaxUses(e.target.value)}
              placeholder="1 for single user code"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-100 focus:border-amber-500 focus:outline-none"
            />
          </div>

          <Button
            type="submit"
            disabled={isSaving}
            className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold py-2.5 text-xs uppercase mt-2"
          >
            {isSaving ? 'Generating...' : 'Save Promo Code'}
          </Button>
        </form>
      </div>
    </div>
  );
};