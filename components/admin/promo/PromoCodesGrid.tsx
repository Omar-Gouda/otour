'use client';

import { PromoCode } from '@/types';
import { Trash2 } from 'lucide-react';

interface PromoCodesGridProps {
  promoCodes: PromoCode[];
  onDeleteRequest: (id: string, code: string) => void;
}

export function PromoCodesGrid({ promoCodes, onDeleteRequest }: PromoCodesGridProps) {
  if (promoCodes.length === 0) {
    return <p className="text-center py-6 text-xs text-zinc-500 font-mono">No active promo codes created yet.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {promoCodes.map((promo) => (
        <div key={promo.id} className="bg-zinc-950/80 border border-zinc-800 p-4 rounded-xl flex items-center justify-between shadow-lg">
          <div>
            <span className="font-mono font-bold text-amber-300 text-sm uppercase block">{promo.code}</span>
            <p className="text-xs text-zinc-400 font-mono">
              Discount: {promo.discount_value}{promo.discount_type === 'percentage' ? '%' : ' EGP'}
            </p>
          </div>
          <button
            onClick={() => onDeleteRequest(promo.id, promo.code)}
            className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}